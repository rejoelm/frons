use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use anchor_spl::token::TokenAccount;

declare_id!("95eTYR6AW9u7RExdHmZwr7LuLbgZM83aqAUkEFV5me89");

const SESSION_SEED: &[u8] = b"session";
const USER_PROFILE_SEED: &[u8] = b"user_profile";
const FOCUS_REWARD: i64 = 100;
const REST_REWARD: i64 = 15;
const CANCEL_PENALTY: i64 = -60;
const STREAK_BONUS_INTERVAL: u64 = 4;
const STREAK_BONUS: i64 = 40;
const FRON_SOL_MULTIPLIER_BPS: i64 = 150; // 1.5x when holding fronSOL
const BASE_MULTIPLIER_BPS: i64 = 100; // 1.0x default multiplier
const MAX_PLANNED_DURATION_SECONDS: i64 = 60 * 60 * 3; // 3 hours safety cap
const MAX_RECORDED_DURATION_SECONDS: i64 = 60 * 60 * 6; // 6 hours safety cap

// Placeholder mint until the real fronSOL mint address is available.
const FRON_SOL_MINT_BYTES: [u8; 32] = [0u8; 32];

#[program]
mod frons {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let authority = ctx.accounts.authority.key();
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.authority = authority;
        user_profile.bump = *ctx.bumps.get("user_profile").ok_or(FronsError::MissingBump)?;
        user_profile.total_points = 0;
        user_profile.focus_sessions = 0;
        user_profile.rest_sessions = 0;
        user_profile.cancelled_sessions = 0;
        user_profile.focus_streak = 0;
        user_profile.longest_focus_streak = 0;
        user_profile.session_count = 0;
        user_profile.last_session_timestamp = 0;
        user_profile.total_rest_duration = 0;
        user_profile.total_focus_duration = 0;
        Ok(())
    }

    #[allow(clippy::too_many_arguments)]
    pub fn record_session(
        ctx: Context<RecordSession>,
        kind: SessionKind,
        start_ts: i64,
        end_ts: Option<i64>,
        planned_duration_seconds: i64,
    ) -> Result<()> {
        let clock = Clock::get()?;
        let now_ts = clock.unix_timestamp;
        require!(start_ts <= now_ts + 60, FronsError::SessionStartInFuture);
        require!(planned_duration_seconds > 0, FronsError::InvalidPlannedDuration);
        require!(planned_duration_seconds <= MAX_PLANNED_DURATION_SECONDS, FronsError::InvalidPlannedDuration);

        if let Some(end) = end_ts {
            require!(end >= start_ts, FronsError::InvalidEndTime);
            require!(end - start_ts <= MAX_RECORDED_DURATION_SECONDS, FronsError::InvalidEndTime);
        }

        let user_profile = &mut ctx.accounts.user_profile;
        let session_index = user_profile.session_count;

        let mut base_points = match kind {
            SessionKind::Focus => FOCUS_REWARD,
            SessionKind::Rest => REST_REWARD,
            SessionKind::Cancelled => CANCEL_PENALTY,
        };

        match kind {
            SessionKind::Focus => {
                user_profile.focus_sessions = user_profile.focus_sessions.checked_add(1).ok_or(FronsError::MathOverflow)?;
                user_profile.focus_streak = user_profile.focus_streak.checked_add(1).ok_or(FronsError::MathOverflow)?;
                if user_profile.focus_streak % STREAK_BONUS_INTERVAL == 0 {
                    base_points = base_points.checked_add(STREAK_BONUS).ok_or(FronsError::MathOverflow)?;
                }
                user_profile.longest_focus_streak = user_profile
                    .longest_focus_streak
                    .max(user_profile.focus_streak);
                if let Some(end) = end_ts {
                    let actual = end - start_ts;
                    user_profile.total_focus_duration = user_profile
                        .total_focus_duration
                        .checked_add(actual)
                        .ok_or(FronsError::MathOverflow)?;
                }
            }
            SessionKind::Rest => {
                user_profile.rest_sessions = user_profile.rest_sessions.checked_add(1).ok_or(FronsError::MathOverflow)?;
                user_profile.focus_streak = 0;
                if let Some(end) = end_ts {
                    let actual = end - start_ts;
                    user_profile.total_rest_duration = user_profile
                        .total_rest_duration
                        .checked_add(actual)
                        .ok_or(FronsError::MathOverflow)?;
                }
            }
            SessionKind::Cancelled => {
                user_profile.cancelled_sessions = user_profile
                    .cancelled_sessions
                    .checked_add(1)
                    .ok_or(FronsError::MathOverflow)?;
                user_profile.focus_streak = 0;
            }
        }

        let multiplier_bps = resolve_multiplier_bps(&ctx)?;
        let mut points_delta = base_points
            .checked_mul(multiplier_bps)
            .ok_or(FronsError::MathOverflow)?
            .checked_div(100)
            .ok_or(FronsError::MathOverflow)?;

        if kind == SessionKind::Cancelled {
            points_delta = points_delta.min(-1);
        }

        user_profile.total_points = user_profile
            .total_points
            .checked_add(points_delta)
            .ok_or(FronsError::MathOverflow)?;
        user_profile.session_count = user_profile
            .session_count
            .checked_add(1)
            .ok_or(FronsError::MathOverflow)?;
        user_profile.last_session_timestamp = now_ts;

        let actual_duration_seconds = end_ts.map(|end| end - start_ts);

        let session = &mut ctx.accounts.session;
        session.user = ctx.accounts.authority.key();
        session.index = session_index;
        session.kind = kind;
        session.start_ts = start_ts;
        session.end_ts = end_ts;
        session.planned_duration_seconds = planned_duration_seconds;
        session.actual_duration_seconds = actual_duration_seconds;
        session.points_delta = points_delta;
        session.multiplier_applied_bps = multiplier_bps as i64;
        session.bump = *ctx.bumps.get("session").ok_or(FronsError::MissingBump)?;
        session.recorded_at = now_ts;

        Ok(())
    }
}

fn resolve_multiplier_bps(ctx: &Context<RecordSession>) -> Result<i64> {
    let mut multiplier_bps = BASE_MULTIPLIER_BPS;
    if let Some(account_info) = ctx.remaining_accounts.first() {
        let token_account = Account::<TokenAccount>::try_from(account_info)
            .map_err(|_| error!(FronsError::InvalidFronSolAccount))?;
        let expected_mint = Pubkey::new_from_array(FRON_SOL_MINT_BYTES);
        if expected_mint != Pubkey::default() {
            require!(token_account.mint == expected_mint, FronsError::InvalidFronSolAccount);
        }
        require!(token_account.amount > 0, FronsError::EmptyFronSolAccount);
        multiplier_bps = FRON_SOL_MULTIPLIER_BPS;
    }
    Ok(multiplier_bps)
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = UserProfile::SPACE,
        seeds = [USER_PROFILE_SEED, authority.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RecordSession<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [USER_PROFILE_SEED, authority.key().as_ref()],
        bump = user_profile.bump,
        has_one = authority
    )]
    pub user_profile: Account<'info, UserProfile>,
    #[account(
        init,
        payer = authority,
        space = SessionRecord::SPACE,
        seeds = [SESSION_SEED, authority.key().as_ref(), &user_profile.session_count.to_le_bytes()],
        bump
    )]
    pub session: Account<'info, SessionRecord>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct UserProfile {
    pub authority: Pubkey,
    pub bump: u8,
    pub total_points: i64,
    pub focus_sessions: u64,
    pub rest_sessions: u64,
    pub cancelled_sessions: u64,
    pub focus_streak: u64,
    pub longest_focus_streak: u64,
    pub session_count: u64,
    pub last_session_timestamp: i64,
    pub total_focus_duration: i64,
    pub total_rest_duration: i64,
}

impl UserProfile {
    pub const SPACE: usize = 8 + 32 + 1 + (8 * 8) + 32;
}

#[account]
pub struct SessionRecord {
    pub user: Pubkey,
    pub index: u64,
    pub kind: SessionKind,
    pub start_ts: i64,
    pub end_ts: Option<i64>,
    pub planned_duration_seconds: i64,
    pub actual_duration_seconds: Option<i64>,
    pub points_delta: i64,
    pub multiplier_applied_bps: i64,
    pub bump: u8,
    pub recorded_at: i64,
}

impl SessionRecord {
    pub const SPACE: usize = 8 + 32 + 8 + 1 + 8 + 9 + 8 + 9 + 8 + 8 + 1 + 8 + 32;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum SessionKind {
    Focus,
    Rest,
    Cancelled,
}

#[error_code]
pub enum FronsError {
    #[msg("Unable to read PDA bump")] 
    MissingBump,
    #[msg("Session start time cannot be too far in the future")]
    SessionStartInFuture,
    #[msg("Invalid planned duration provided")]
    InvalidPlannedDuration,
    #[msg("Invalid end time provided")]
    InvalidEndTime,
    #[msg("Overflow while updating productivity stats")]
    MathOverflow,
    #[msg("Provided fronSOL token account is invalid")]
    InvalidFronSolAccount,
    #[msg("Provided fronSOL token account has no balance")]
    EmptyFronSolAccount,
}
