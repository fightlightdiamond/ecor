#!/bin/bash
# =============================================================================
# One-time SSH key setup for deploy.sh — run this on a FRESH machine.
# =============================================================================
# 1. Generates an ed25519 key if this machine has none yet.
# 2. Installs the public key on the server — asks the password ONCE.
# 3. Verifies that passwordless (key) login works.
#
# Idempotent: safe to re-run any time; if key auth already works it exits
# immediately. deploy.sh also calls this automatically when key auth fails.
#
# Usage (defaults match deploy.sh):
#   ./setup-ssh.sh [user@server-ip]
#
# Options (env vars):
#   DEPLOY_SERVER=user@ip   override the default server
#   DEPLOY_SSH_PORT=22      SSH port
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")"

DEPLOY_SERVER="${DEPLOY_SERVER:-d@192.168.1.22}"
SERVER="${1:-$DEPLOY_SERVER}"
SSH_PORT="${DEPLOY_SSH_PORT:-22}"

KEY="$HOME/.ssh/id_ed25519"

# --- 1. generate a key if this machine has none -------------------------------
if [ ! -f "$KEY" ]; then
  echo "==> No SSH key on this machine — generating $KEY ..."
  mkdir -p "$HOME/.ssh"
  chmod 700 "$HOME/.ssh"
  # -N "": no passphrase, so deploy.sh can run fully unattended.
  ssh-keygen -t ed25519 -f "$KEY" -N "" -C "$(whoami)@$(hostname)-deploy"
else
  echo "==> Using existing key: $KEY"
fi

# --- 2. already working? nothing to do ----------------------------------------
if ssh -p "$SSH_PORT" -i "$KEY" -o BatchMode=yes -o ConnectTimeout=5 "$SERVER" true 2>/dev/null; then
  echo "==> Key auth to $SERVER already works — nothing to do."
  exit 0
fi

# --- 3. install the public key on the server (password asked ONCE) ------------
echo "==> Installing the key on $SERVER — enter the password one last time..."
if command -v ssh-copy-id >/dev/null; then
  ssh-copy-id -i "$KEY.pub" -p "$SSH_PORT" "$SERVER"
else
  # Fallback without ssh-copy-id. grep -qxF makes it idempotent: the key is
  # appended only if that exact line is not already in authorized_keys.
  PUB="$(cat "$KEY.pub")"
  ssh -p "$SSH_PORT" "$SERVER" "mkdir -p ~/.ssh && chmod 700 ~/.ssh &&
    touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys &&
    grep -qxF '$PUB' ~/.ssh/authorized_keys || echo '$PUB' >> ~/.ssh/authorized_keys"
fi

# --- 4. verify -----------------------------------------------------------------
if ssh -p "$SSH_PORT" -i "$KEY" -o BatchMode=yes -o ConnectTimeout=5 "$SERVER" true 2>/dev/null; then
  echo "==> OK: passwordless SSH to $SERVER is working. ./deploy.sh will not ask again."
else
  echo "ERROR: key installed but key auth still fails." >&2
  echo "Check on the server (/etc/ssh/sshd_config): PubkeyAuthentication yes," >&2
  echo "and permissions: ~/.ssh = 700, ~/.ssh/authorized_keys = 600." >&2
  exit 1
fi
