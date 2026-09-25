#!/usr/bin/env bash
# Serve static live-demo on 0.0.0.0:8765 (relative paths; hostable anywhere)
cd "$(dirname "$0")"
PORT="${1:-8765}"
echo "Thames Assurance live demo"
echo "  Local:   http://localhost:${PORT}/"
echo "  Network: http://0.0.0.0:${PORT}/  (or your Tailscale / LAN IP)"
echo "  Ctrl+C to stop"
exec python3 -m http.server "$PORT" --bind 0.0.0.0
