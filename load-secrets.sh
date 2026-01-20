#!/bin/bash
# load-secrets.sh
# Maps Codespaces-friendly secret names to GITHUB_* env vars
# (GitHub Codespaces reserves GITHUB_* prefix for its own use)

# GitHub OAuth - map from Codespaces secrets
if [ -n "$CLIENT_ID" ]; then
  export GITHUB_CLIENT_ID="$CLIENT_ID"
  echo "✓ GITHUB_CLIENT_ID loaded from CLIENT_ID"
fi

if [ -n "$CLIENT_SECRET" ]; then
  export GITHUB_CLIENT_SECRET="$CLIENT_SECRET"
  echo "✓ GITHUB_CLIENT_SECRET loaded from CLIENT_SECRET"
fi

# Google OAuth - map if using similar pattern
if [ -n "$GOOGLE_ID" ]; then
  export GOOGLE_CLIENT_ID="$GOOGLE_ID"
  echo "✓ GOOGLE_CLIENT_ID loaded from GOOGLE_ID"
fi

if [ -n "$GOOGLE_SECRET" ]; then
  export GOOGLE_CLIENT_SECRET="$GOOGLE_SECRET"
  echo "✓ GOOGLE_CLIENT_SECRET loaded from GOOGLE_SECRET"
fi

# Other common secrets
if [ -n "$API_TOKEN" ]; then
  export ADMIN_API_TOKEN="$API_TOKEN"
  echo "✓ ADMIN_API_TOKEN loaded from API_TOKEN"
fi

if [ -n "$SESSION_SECRET" ]; then
  export ADMIN_SESSION_SECRET="$SESSION_SECRET"
  echo "✓ ADMIN_SESSION_SECRET loaded from SESSION_SECRET"
fi

if [ -n "$ENC_KEY" ]; then
  export ENCRYPTION_KEY="$ENC_KEY"
  echo "✓ ENCRYPTION_KEY loaded from ENC_KEY"
fi

# Run the command passed as arguments, or default to npm run server
if [ $# -eq 0 ]; then
  echo ""
  echo "Starting server..."
  exec npm run server
else
  exec "$@"
fi
