# Deployment Guide

## Web Application

**Status**: ✅ Deployed and Running  
**URL**: https://3000-iu8drmgkqpb81utkukc9m-c0ab9993.manus-asia.computer

The Next.js web application is live and configured for Solana devnet.

## Solana Program

**Program ID**: `95eTYR6AW9u7RExdHmZwr7LuLbgZM83aqAUkEFV5me89`  
**Status**: ⏳ Ready to deploy (awaiting devnet SOL)

### To Deploy the Program

1. **Get Devnet SOL**:
   ```bash
   # Try web faucet: https://faucet.solana.com
   # Or use CLI (may be rate-limited):
   solana airdrop 2
   ```

2. **Build and Deploy**:
   ```bash
   cd /home/ubuntu/frons
   source ~/.cargo/env
   anchor build
   anchor deploy --provider.cluster devnet
   ```

3. **Verify Deployment**:
   ```bash
   solana program show 95eTYR6AW9u7RExdHmZwr7LuLbgZM83aqAUkEFV5me89
   ```

## Local Development

To run the web app locally:

```bash
cd /home/ubuntu/frons/web
npm run dev
```

Access at: http://localhost:3000

## Configuration Files Updated

- ✅ `Anchor.toml` - Program ID configured
- ✅ `programs/frons/src/lib.rs` - declare_id! updated
- ✅ `web/idl/frons.json` - Metadata address updated
- ✅ `web/app/providers.tsx` - Wallet adapters fixed
- ✅ `Cargo.toml` - Overflow checks enabled

## Keypairs

- **Deployment Wallet**: `/home/ubuntu/.config/solana/id.json`
  - Public Key: `4n2mJaomcE5XD5pcnSmpwN7zN2DUjCzUFdmKQcVEcdw6`
  
- **Program Keypair**: `/home/ubuntu/frons/target/deploy/frons-keypair.json`
  - Public Key: `95eTYR6AW9u7RExdHmZwr7LuLbgZM83aqAUkEFV5me89`

## Tools Installed

- Rust 1.90.0
- Anchor CLI 0.32.1
- Solana CLI 3.0.7
- solana-keygen 3.0.7
- Node.js 22.13.0

## Next Steps

1. Acquire devnet SOL for deployment wallet
2. Deploy Anchor program to devnet
3. Test full on-chain functionality
4. Share app URL with users for testing

