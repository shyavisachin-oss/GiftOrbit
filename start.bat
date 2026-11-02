@echo off
echo ========================================================
echo               GiftOrbit - Starting Server
echo ========================================================
echo.
echo Launching your browser at http://localhost:8000 ...
echo Press Ctrl+C in this window anytime to stop the server.
echo.
start http://localhost:8000
python -m http.server 8000
