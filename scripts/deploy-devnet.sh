#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROGRAM_ID=${1:-""}
ANCHOR_TOML="$PROJECT_ROOT/Anchor.toml"
LIB_RS="$PROJECT_ROOT/programs/frons/src/lib.rs"
if [[ -n "$PROGRAM_ID" ]]; then
  sed -i.bak "s/^frons = \".*\"/frons = \"$PROGRAM_ID\"/" "$ANCHOR_TOML"
  sed -i.bak "s/^declare_id!(\".*\");/declare_id!(\"$PROGRAM_ID\");/" "$LIB_RS"
fi
"$SCRIPT_DIR/anchor.sh" build
"$SCRIPT_DIR/anchor.sh" deploy --provider.cluster devnet
if [[ -n "$PROGRAM_ID" ]]; then
  mv "$ANCHOR_TOML.bak" "$ANCHOR_TOML"
  mv "$LIB_RS.bak" "$LIB_RS"
fi

