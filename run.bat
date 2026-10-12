@echo off
chcp 65001 >nul
title Apophasis - Lucy (Dev Server)

echo ============================================================
echo               LUCY - APOPHASIS DEV RUNNER
echo ============================================================
echo.

cd /d "%~dp0"

:: Check if bun is installed
where bun >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] No se encontro 'bun' en el PATH.
    echo Por favor instala Bun desde https://bun.sh o asegurate de tenerlo en el PATH.
    echo.
    pause
    exit /b 1
)

:: Check .env
if not exist ".env" (
    if exist ".env.example" (
        echo [INFO] Creando archivo .env a partir de .env.example...
        copy ".env.example" ".env" >nul
        echo [AVISO] Recuerda agregar tu VITE_GEMINI_API_KEY en .env
    )
)

echo [1/2] Verificando dependencias...
call bun install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Fallo la instalacion de paquetes de Bun.
    pause
    exit /b 1
)

echo.
echo [2/2] Iniciando Backend (:8787) y Frontend (:5758)...
echo.
echo ------------------------------------------------------------
echo  Aplicacion: http://localhost:5758
echo  Backend:    http://localhost:8787
echo ------------------------------------------------------------
echo.
echo Abriendo navegador en http://localhost:5758 en unos segundos...
start "" http://localhost:5758

:: Iniciar ambos servicios
call bun run dev:all

pause
