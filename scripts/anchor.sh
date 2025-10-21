#!/usr/bin/env bash
set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="coralxyz/anchor:0.29.0"
if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required to run this script" >&2
  exit 1
fi
mkdir -p "$HOME/.config/solana" "$HOME/.cache/anchor"
docker run \
  --rm \
  -v "$PROJECT_ROOT":/work \
  -w /work \
  -v "$HOME/.config/solana":/root/.config/solana \
  -v "$HOME/.cache/anchor":/root/.cache/anchor \
  "$IMAGE" \
  anchor "$@"

