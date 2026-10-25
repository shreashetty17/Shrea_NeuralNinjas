@echo off
title KaamSetu - Local Help. Real People. Fair Prices.
cd /d "%~dp0"

echo ===============================================================
echo     KAAMSETU - Local Help. Real People. Fair Prices.
echo     Starting application for presentation on any computer...
echo ===============================================================

REM Try launching using npm.cmd or npm
where npm.cmd >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js npm.cmd detected. Launching server on 0.0.0.0:5173...
    start http://localhost:5173/
    npm.cmd run dev -- --host 0.0.0.0 --port 5173
    goto end
)

where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js npm detected. Launching server on 0.0.0.0:5173...
    start http://localhost:5173/
    npm run dev -- --host 0.0.0.0 --port 5173
    goto end
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python detected. Serving production dist folder on port 5173...
    start http://localhost:5173/
    python -m http.server 5173 --directory dist
    goto end
)

echo [OK] Opening standalone production build directly in default browser...
start "" "%~dp0dist\index.html"

:end
