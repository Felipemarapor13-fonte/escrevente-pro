@echo off
REM =====================================================
REM Script de Deploy Automático - GitHub Pages
REM Aprova SP - Guia do Escrevente
REM =====================================================

echo.
echo ================================================
echo   DEPLOY AUTOMATICO - GITHUB PAGES
echo   Aprova SP - Guia do Escrevente TJ-SP
echo ================================================
echo.

REM Verificar se Git está instalado
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Git nao encontrado!
    echo.
    echo Por favor, instale o Git em:
    echo https://git-scm.com/download/win
    echo.
    echo Depois execute este script novamente.
    echo.
    pause
    exit /b 1
)

echo [OK] Git encontrado!
echo.

REM Pedir nome de usuário do GitHub
set /p GITHUB_USER="Digite seu usuario do GitHub: "
if "%GITHUB_USER%"=="" (
    echo [ERRO] Nome de usuario nao pode estar vazio!
    pause
    exit /b 1
)

echo.
echo Usuario do GitHub: %GITHUB_USER%
echo.

REM Inicializar repositório
echo [1/5] Inicializando repositorio Git...
if exist .git (
    echo [INFO] Repositorio ja inicializado
) else (
    git init
)
echo.

REM Adicionar todos os arquivos
echo [2/5] Adicionando arquivos...
git add .
echo.

REM Fazer commit
echo [3/5] Criando commit...
git commit -m "Deploy: Aprova SP completo"
echo.
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Nenhum arquivo para commit ou ja commitado
)

REM Renomear branch
echo [4/5] Configurando branch main...
git branch -M main
echo.

REM Configurar remote
echo [5/5] Configurando remote...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/guia-escrevente.git
echo.

echo ================================================
echo   QUASE LA!
echo ================================================
echo.
echo Agora faca o seguinte:
echo.
echo 1. Abra o navegador e va em:
echo    https://github.com/new
echo.
echo 2. Crie um repositorio chamado:
echo    guia-escrevente
echo.
echo 3. Deixe como PUBLICO
echo   NAO marque "Initialize with README"
echo.
echo 4. Clique em "Create repository"
echo.
echo 5. Volte aqui e pressione qualquer tecla
echo    para continuar com o push...
echo.
pause>nul

REM Fazer push
echo.
echo Enviando para o GitHub...
echo.
git push -u origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ================================================
    echo   SUCCESSO!
    echo ================================================
    echo.
    echo Seu site esta sendo publicado!
    echo.
    echo URL: https://%GITHUB_USER%.github.io/guia-escrevente/
    echo.
    echo Aguarde 2-5 minutos para a primeira publicacao.
    echo.
    echo Passos finais:
    echo 1. Va em: https://github.com/%GITHUB_USER%/guia-escrevente/settings/pages
    echo 2. Em Source, selecione: main
    echo 3. Clique em Save
    echo 4. Aguarde ficar verde
    echo.
    echo Depois e so acessar a URL acima!
    echo.
) else (
    echo ================================================
    echo   ERRO NO PUSH
    echo ================================================
    echo.
    echo Verifique:
    echo 1. Voce criou o repositorio "guia-escrevente" no GitHub?
    echo 2. O repositorio esta PUBLICO?
    echo 3. Voce esta logado no GitHub?
    echo.
    echo Para autenticação, crie um token em:
    echo https://github.com/settings/tokens
    echo.
    echo Use: git remote set-url origin https://TOKEN@github.com/%GITHUB_USER%/guia-escrevente.git
    echo.
)

echo ================================================
pause