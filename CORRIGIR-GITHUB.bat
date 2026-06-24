@echo off
REM =====================================================
REM CORRIGE GITHUB PAGES - NUCLEAR OPTION
 ============================================================== 

echo.
echo ================================================
echo   CORRECAO NUCLEAR - GITHUB PAGES
echo ================================================
echo.

REM Ir para a pasta
cd /d "C:\Users\Felipe\Desktop\GUIA_ESCREVENTE_PRO"

echo [1/7] Verificando Git...
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Instale o Git primeiro!
    echo https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [OK] Git instalado

echo.
echo [2/7] Pedindo seu usuario do GitHub...
set /p GITHUB_USER="Usuario do GitHub: "
if "%GITHUB_USER%"=="" (
    echo [ERRO] Usuario vazio!
    pause
    exit /b 1
)

echo.
echo [3/7] Removendo remote antigo...
git remote remove origin 2>nul

echo.
echo [4/7] Forcando branch main...
git branch -M main 2>nul
git checkout main 2>nul
if %ERRORLEVEL% NEQ 0 (
    git checkout -b main
)

echo.
echo [5/7] Adicionando todos os arquivos...
git add .
git commit -m "Deploy forcase: Aprova SP funcional"

echo.
echo [6/7] Configurando remote...
git remote add origin https://github.com/%GITHUB_USER%/guia-escrevente.git

echo.
echo ================================================
echo   ATENCAO: Voce precisa criar o repo primeiro!
echo ================================================
echo.
echo 1. Abra: https://github.com/new
echo 2. Nome: guia-escrevente
echo 3. Publico
echo 4. NAO inicializar com README
echo 5. Clique em "Create repository"
echo.
echo 6. Volte aqui e pressione ENTER
echo.
pause>nul

echo.
echo [7/7] Enviando codigo...
git push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    echo ================================================
    echo   ENVIADO COM SUCESSO!
    echo ================================================
    echo.
    echo AGORA FACHO O SEGUNINTE:
    echo.
    echo 1. Va em: https://github.com/%GITHUB_USER%/guia-escrevente/settings/pages
    echo 2. Source: Deploy from a branch
    echo 3. Branch: main
    echo 4. Folder: / (root)
    echo 5. Clique em Save
    echo 6. Aguarde 3-5 minutos
    echo.
    echo URL: https://%GITHUB_USER%.github.io/guia-escrevente/
    echo.
    echo Se der 404 ainda, espere 10 minutos!
    echo.
) else (
    echo ================================================
    echo   ERRO NO PUSH
    echo ================================================
    echo.
    echo voce precisa de um token do GitHub.
    echo.
    echo 1. Va em: https://github.com/settings/tokens
    echo 2. Generate new token (classic)
    echo 3. Marca: repo (tudo)
    echo 4. Generate
    echo 5. Copie o token
    echo.
    echo 6. Rode:
    echo    git remote set-url origin https://TOKEN@github.com/%GITHUB_USER%/guia-escrevente.git
    echo.
    echo 7. Tente: git push -u origin main --force
    echo.
)

pause