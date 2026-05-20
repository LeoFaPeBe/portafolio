@echo off
echo.
echo ========================================
echo   DEPLOY PORTAFOLIO - Leonardo Perez
echo ========================================
echo.

:: Verificar que hay cambios
git status

echo.
set /p mensaje="Describe los cambios (Enter para mensaje automatico): "

if "%mensaje%"=="" (
  set mensaje=Actualizacion automatica %date% %time%
)

echo.
echo [1/3] Agregando archivos...
git add .

echo [2/3] Guardando cambios: %mensaje%
git commit -m "%mensaje%"

echo [3/3] Subiendo a GitHub...
git push

echo.
echo ========================================
echo   LISTO! Sitio actualizado en:
echo   https://leofapebe.github.io/portafolio
echo ========================================
echo.
pause