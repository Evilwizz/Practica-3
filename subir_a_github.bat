@echo off
title Subir Proyecto a GitHub - Practica 3
echo ========================================================
echo   SUBIENDO PROYECTO TURBO RACER 2D A GITHUB
echo   Repositorio: https://github.com/Evilwizz/Practica-3.git
echo   Estudiante: Aldair Jose Lozano Santiago
echo ========================================================
echo.

cd /d "%~dp0"
set "GIT_EXE=C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe"

"%GIT_EXE%" status
echo.
echo Realizando push a la rama main...
"%GIT_EXE%" push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   [EXITO] Proyecto subido correctamente a tu GitHub!
    echo   Ver en: https://github.com/Evilwizz/Practica-3
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   Nota: Si te solicita credenciales, inicia sesion en la
    echo   ventana emergente del navegador con tu cuenta Evilwizz
    echo ========================================================
)
echo.
pause
