# fronSOL Pods

A Work-from-Coffee inspired Solana dApp that rewards disciplined Pomodoro sessions. Focus, rest, and cancelled sessions are recorded on-chain so that productive contributors accumulate points while procrastination results in penalties.

## Overview

- **On-chain program** – Anchor program `frons` manages user productivity profiles, session records, and point multipliers for fronSOL token holders.
- **Web app** – Next.js + Solana wallet adapter UI to start focus or rest pods, cancel early, and review on-chain stats in real time.
- **Reward mechanics** – Completed focus and rest sessions add points. Cancelled pods reduce points and reset streaks. Holding fronSOL (token mint placeholder) enables a configurable multiplier via remaining accounts.

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or pnpm (recommended) or npm
- Rust toolchain + Anchor CLI (v0.29) for building the on-chain program
- Solana CLI configured for Devnet or Localnet testing

### Install dependencies

```bash
cd web
npm install
```

### Run the web experience

```bash
npm run dev
```

The app boots on [http://localhost:3000](http://localhost:3000). Connect a Solana wallet (Devnet) to initialize your on-chain profile and start tracking sessions.

### Build the Anchor program

```bash
anchor build
```

This produces the IDL under `target/idl/frons.json`. The repository includes a checked-in copy for the web client under `web/idl/frons.json`.

### Deploying the program

Update the `declare_id!` and `Anchor.toml` entries with your deployed program ID, then run:

```bash
anchor deploy --provider.cluster devnet
```

## How points work

| Session type | Base points | Notes |
| ------------ | ----------- | ----- |
| Focus        | +100        | Every fourth consecutive focus pod adds a +40 streak bonus. |
| Rest         | +15         | Encourages disciplined breaks. |
| Cancelled    | −60         | Resets focus streak and applies penalty. |

If a fronSOL token account (mint to be announced) with a non-zero balance is passed as a remaining account, the session earns a 1.5× multiplier.

## Folder structure

```
.
├── Anchor.toml
├── programs/
│   └── frons/              # Anchor program source
├── idl/frons.json          # Anchor IDL for clients
├── web/                    # Next.js Work-from-Coffee style front-end
└── README.md
```

## Future improvements

- Wire real fronSOL mint once available and surface multiplier eligibility in the UI.
- Add governance-controlled configuration for reward rates and penalties.
- Integrate push notifications or calendar sync for distributed coffee shop crews.
