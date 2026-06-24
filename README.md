# Aprova SP - Guia do Escrevente TJ-SP 🎯

**Versão Profissional PWA** com funcionalidades offline, keyboard shortcuts e design moderno.

## 📁 Estrutura do Projeto

```
GUIA_ESCREVENTE_PRO/
├── index.html          # Página principal
├── manifest.json       # PWA Manifest (instalar como app)
├── sw.js              # Service Worker (offline)
├── css/
│   └── style.css      # Estilos completos
├── js/
│   └── app.js         # Aplicação JavaScript
└── assets/
    └── (ícones do app)
```

## 🚀 Funcionalidades Profissionais

### ✅ Keyboard Shortcuts
- **Ctrl+K** ou **Cmd+K** → Focar busca
- **Esc** → Fechar busca / Sair do modo foco
- **Enter** → Navegar para primeiro resultado da busca
- **Ctrl+H** ou **Cmd+H** → Voltar para home (dashboard)

### ✅ Progresso Automático
- **Streak de estudos** → Conta dias seguidos automaticamente
- **Tópicos do edital** → Salva o que você já estudou
- **Tarefas** → Marca/desmarca tarefas
- **Simulados** → Histórico de simulados realizados

### ✅ Temas
- **Dark mode** (padrão)
- **Light mode** (alternar com botão 🌙/☀️)

### ✅ Modo Foco
- Remove sidebar para máxima concentração
- Banner informativo no topo
- Ativar/desativar com botão ou **Esc**

### ✅ PWA (Progressive Web App)
- **Instalar como app** no desktop ou celular
- **Funciona offline** (cache de assets)
- **Tela cheia** sem barra de navegador

## 📥 Como Usar

### Opção 1: Abrir Localmente (Simples)
1. Navegue até a pasta `GUIA_ESCREVENTE_PRO`
2. Abra `index.html` no seu navegador
3. Pronto! ✅

### Opção 2: Servidor Local (Recomendado para PWA)
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# Ou use o Live Server do VSCode
```

Depois acesse: `http://localhost:8000`

### Opção 3: GitHub Pages (Deploy Grátis)
1. Suba para um repositório GitHub
2. Vá em Settings → Pages
3. Ative GitHub Pages na branch main
4. Acesse: `https://seu-usuario.github.io/repo/`

## 🎨 Personalizar

### Mudar Data da Prova
Edite no `js/app.js`:
```javascript
const provaDate = new Date('2026-08-01'); // Sua data
```

### Mudar Frases Motivacionais
Edite o array `frases` no `js/app.js`

### Adicionar Tópicos no Edital
Edite o HTML, dentro de `<ul class="topic-list" data-group="...">`

## 🔧 Service Worker (Offline)

O Service Worker cacheia:
- ✅ Página principal
- ✅ CSS
- ✅ JavaScript
- ✅ Fonts (Google Fonts, Font Awesome)

**Nota:** Para o SW funcionar, precisa de HTTPS ou localhost.

## 📊 Stats

- **CSS:** ~33KB
- **JS:** ~30KB
- **HTML:** ~110KB
- **Total:** ~173KB

## ⚠️ Backup

O arquivo original está salvo como:
`GUIA_ESCREVENTE_PRO/backup-original.html`

## 🛠️ Melhorias da Versão Profissional

| Feature | Original | Profissional |
|---------|----------|--------------|
| Keyboard Shortcuts | ❌ | ✅ |
| Validação localStorage | ❌ | ✅ |
| Event Listeners | ❌ (onclick inline) | ✅ |
| Error Handling | ❌ | ✅ |
| Service Worker | ❌ | ✅ |
| PWA Manifest | ❌ | ✅ |
| Código Modular | ❌ | ✅ |

---

**Feito com ❤️ para concurseiros TJ-SP**

*Estude com inteligência, não apenas com força.* 📚🔥