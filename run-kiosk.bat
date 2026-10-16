@echo off
title Tynor - Kiosco EXPOMEDICAL 2026
echo ===================================================
echo   TYNOR - CATALOGO MEDICO TACTIL (EXPOMEDICAL 2026)
echo   Modo: 100%% Offline PWA / Kiosco Táctil
echo ===================================================
echo Iniciando servidor estático local...

start /B "" npx vite preview --port 3005

timeout /t 2 /nobreak > nul

echo Abriendo en Modo Kiosco de Pantalla Completa...
start msedge --app=http://localhost:3005 --kiosk --edge-kiosk-type=fullscreen --no-first-run

echo.
echo Kiosco en ejecucion en http://localhost:3005
echo Para salir del modo kiosco presione ALT + F4
pause
