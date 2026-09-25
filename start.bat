@echo off
REM Serve static live-demo on 0.0.0.0:8765
cd /d "%~dp0"
set PORT=8765
if not "%~1"=="" set PORT=%~1
echo Thames Assurance live demo
echo   Local:   http://localhost:%PORT%/
echo   Network: http://0.0.0.0:%PORT%/  (or your Tailscale / LAN IP)
echo   Ctrl+C to stop
python -m http.server %PORT% --bind 0.0.0.0
