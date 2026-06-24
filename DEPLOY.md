# 🚀 Deploy Automático para GitHub Pages

## Pré-requisitos
1. Ter uma conta no GitHub: https://github.com
2. Git instalado na máquina

## Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `guia-escrevente`
3. Descrição: "Guia do Escrevente TJ-SP - Aprova SP"
4. Deixe como **Público**
5. **NÃO** marque "Initialize this repository with a README"
6. Clique em **Create repository**

## Passo 2: Executar este Script

### Se você já tem Git instalado:

```bash
# Navegue até a pasta do projeto
cd C:/Users/Felipe/Desktop/GUIA_ESCREVENTE_PRO

# Inicialize o repositório Git
git init

# Adicione todos os arquivos
git add .

# Faça o primeiro commit
git commit -m "Initial commit: Aprova SP completo"

# Renomeie a branch para main
git branch -M main

# ADICIONE AQUI A URL DO SEU REPOSITÓRIO
# Substitua SEU_USUARIO pelo seu usuário do GitHub
git remote add origin https://github.com/SEU_USUARIO/guia-escrevente.git

# Envie para o GitHub
git push -u origin main
```

### Se você NÃO tem Git instalado:

**Opção A: Instalar Git**
1. Baixe em: https://git-scm.com/download/win
2. Instale com opções padrão
3. Abra o Terminal e rode os comandos acima

**Opção B: Upload Manual pelo Site**
1. No GitHub, após criar o repositório
2. Clique em "uploading an existing file"
3. Arraste TODOS os arquivos da pasta `GUIA_ESCREVENTE_PRO`
4. Aguarde o upload
5. Commit: "Initial commit"

## Passo 3: Ativar GitHub Pages

1. No seu repositório no GitHub:
   - Vá em **Settings** (engrenagem)
   - Menu lateral: **Pages**
2. Em **Source**:
   - Branch: selecione **main**
   - Folder: deixe **/ (root)**
3. Clique em **Save**

## Passo 4: Aguardar Deploy

- O GitHub vai levar 1-3 minutos para publicar
- Você verá uma barra de progresso em **Actions**
- Quando ficar verde, o site está no ar!

## URL do Seu Site

Após o deploy, seu site estará em:

```
https://SEU_USUARIO.github.io/guia-escrevente/
```

Exemplo: https://felipe-maranesi.github.io/guia-escrevente/

## Passo 5: Atualizações Futuras

Sempre que fizer modificações:

```bash
# Edite os arquivos
# Depois:
git add .
git commit -m "Descrição das mudanças"
git push
```

O GitHub Pages atualiza automaticamente em 1-2 minutos!

## 📱 Teste no Celular

Acesse a URL do seu site no celular - ele vai estar 100% responsivo!

---

## Dúvidas?

- **Erro no push?** Verifique se a URL do remote está correta
- **Site não aparece?** Aguarde 5 minutos e cheque em Settings > Pages
- **Erro 404?** Pode levar até 10 minutos para a primeira publicação

## 🎯 Próximos Passos (Opcional)

1. **Domínio Personalizado:**
   - Compre um domínio (ex: `aprovasp.com.br`)
   - Em Settings > Pages > Custom domain
   - Siga as instruções de DNS

2. **Analytics:**
   - Adicione Google Analytics no index.html
   - Acompanhe acessos

3. **PWA:**
   - O arquivo `manifest.json` já está configurado
   - Usuários podem instalar como app no celular

---

**Feito com ❤️ para o Aprova SP**