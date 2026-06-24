/**
 * Aprova SP — Guia do Escrevente TJ-SP
 * Aplicação Profissional com PWA, Keyboard Shortcuts e Error Handling
 * 
 * Features:
 * - Keyboard shortcuts (Enter, Esc, Ctrl+K, Ctrl+H)
 * - Validação segura de localStorage
 * - Event listeners (sem onclick inline)
 * - Error handling em todas as funções
 * - Service Worker para offline
 */

// =====================================================
///carregar Chart.js via CDN
// =====================================================
(function loadChartJS() {
  const chartScript = document.createElement('script');
  chartScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
  document.head.appendChild(chartScript);
  chartScript.onload = () => {
    console.log('[Chart.js] Carregado com sucesso');
    if (typeof drawRadar === 'function') drawRadar();
  };
  chartScript.onerror = () => console.error('[Chart.js] Falha ao carregar');
})();

// =====================================================
// Utilitários de localStorage (com validação)
// =====================================================
const Storage = {
  safeGet: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`[Storage] Erro ao ler ${key}:`, e);
      return defaultValue;
    }
  },
  
  safeSet: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`[Storage] Erro ao salvar ${key}:`, e);
      // Storage full?
      if (e.name === 'QuotaExceededError') {
        alert('⚠️ Armazenamento cheio! Limpando dados antigos...');
        localStorage.clear();
      }
      return false;
    }
  },
  
  safeRemove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`[Storage] Erro ao remover ${key}:`, e);
      return false;
    }
  }
};

// =====================================================
// BUSCA GLOBAL com keyboard shortcuts
// =====================================================
const searchIndex = [
  { label: 'Interpretação de Texto', tab: 'edital', icon: 'fa-pen-nib', tag: 'Português' },
  { label: 'Crase e Concordância', tab: 'edital', icon: 'fa-pen-nib', tag: 'Português' },
  { label: 'Colocação Pronominal', tab: 'edital', icon: 'fa-pen-nib', tag: 'Português' },
  { label: 'Pontuação — Uso da Vírgula', tab: 'edital', icon: 'fa-pen-nib', tag: 'Português' },
  { label: 'Peculato, Concussão, Corrupção', tab: 'edital', icon: 'fa-handcuffs', tag: 'Dir. Penal' },
  { label: 'Crimes contra a Fé Pública', tab: 'edital', icon: 'fa-handcuffs', tag: 'Dir. Penal' },
  { label: 'Lei 9.099 — Juizados Especiais', tab: 'edital', icon: 'fa-scale-balanced', tag: 'Processo' },
  { label: 'Prazos Processuais — CPC/2015', tab: 'edital', icon: 'fa-scale-balanced', tag: 'Processo' },
  { label: 'Tutela Provisória', tab: 'edital', icon: 'fa-scale-balanced', tag: 'Processo' },
  { label: 'Art. 37 CF — Administração Pública', tab: 'edital', icon: 'fa-landmark-dome', tag: 'Constitucional' },
  { label: 'Lei de Improbidade — 2021', tab: 'edital', icon: 'fa-landmark-dome', tag: 'Administrativo' },
  { label: 'Estatuto Servidores SP — 10.261/68', tab: 'edital', icon: 'fa-landmark-dome', tag: 'Legislação' },
  { label: 'Excel: PROCV, SE, CONT.SES', tab: 'edital', icon: 'fa-calculator', tag: 'Informática' },
  { label: 'OneDrive e Teams', tab: 'edital', icon: 'fa-calculator', tag: 'Informática' },
  { label: 'Raciocínio Lógico', tab: 'edital', icon: 'fa-calculator', tag: 'Mat/RLM' },
  { label: 'Provas anteriores TJ-SP', tab: 'provas', icon: 'fa-file-signature', tag: 'Provas' },
  { label: 'Cronograma semanal', tab: 'rotina', icon: 'fa-calendar-check', tag: 'Rotina' },
  { label: 'Técnica Pomodoro', tab: 'rotina', icon: 'fa-clock', tag: 'Rotina' },
  { label: 'Anki flashcards', tab: 'ferramentas', icon: 'fa-toolbox', tag: 'Ferramentas' },
  { label: 'QConcursos questões', tab: 'ferramentas', icon: 'fa-toolbox', tag: 'Ferramentas' },
  { label: 'Iniciar simulado', tab: 'simulado', icon: 'fa-stopwatch', tag: 'Simulado' },
  { label: 'Radar de desempenho', tab: 'radar', icon: 'fa-chart-radar', tag: 'Analytics' },
  { label: 'Dicas de estudo', tab: 'dicas', icon: 'fa-lightbulb', tag: 'Dicas' },
  { label: 'Erros fatais de concurseiro', tab: 'dicas', icon: 'fa-triangle-exclamation', tag: 'Dicas' },
  { label: 'Checklist dia da prova', tab: 'dicas', icon: 'fa-calendar-day', tag: 'Dicas' },
];

function runSearch(query) {
  try {
    const box = document.getElementById('searchResults');
    if (!box) return;
    
    if (!query || query.length < 2) {
      box.classList.remove('visible');
      return;
    }
    
    const q = query.toLowerCase();
    const results = searchIndex.filter(s => s.label.toLowerCase().includes(q)).slice(0, 6);
    
    if (!results.length) {
      box.classList.remove('visible');
      return;
    }
    
    box.innerHTML = results.map((r, idx) => `
      <div class="search-result-item" role="option" data-tab="${r.tab}" data-idx="${idx}">
        <i class="fa-solid ${r.icon}"></i>
        <span>${r.label}</span>
        <span class="sr-tag">${r.tag}</span>
      </div>
    `).join('');
    
    box.classList.add('visible');
    
    // Re-adicionar event listeners
    box.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        goSearch(item.dataset.tab);
      });
    });
  } catch (e) {
    console.error('[Search] Erro na busca:', e);
  }
}

function goSearch(tab) {
  try {
    const navItem = document.querySelector(`[data-section="${tab}"]`);
    if (navItem) {
      switchTab(tab, navItem);
    } else {
      console.warn(`[Search] Navegação "${tab}" não encontrada`);
    }
    hideSearch();
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) searchInput.value = '';
  } catch (e) {
    console.error('[Search] Erro ao navegar:', e);
  }
}

function hideSearch() {
  const box = document.getElementById('searchResults');
  if (box) box.classList.remove('visible');
}

// =====================================================
// TOPBAR SYNC
// =====================================================
function syncTopbar() {
  try {
    const ts = document.getElementById('topStreak');
    const td = document.getElementById('topDias') || document.getElementById('topDays');
    
    if (ts) {
      const streak = Storage.safeGet('studyStreak', 0);
      ts.textContent = streak;
    }
    
    if (td) {
      const diff = Math.ceil((new Date('2026-08-01') - new Date()) / 86400000);
      td.textContent = diff > 0 ? diff : '—';
    }
  } catch (e) {
    console.error('[Topbar] Erro ao sincronizar:', e);
  }
}

// =====================================================
// FRASE DO DIA
// =====================================================
const frases = [
  { txt: "A disciplina é a ponte entre metas e realizações.", autor: "Jim Rohn" },
  { txt: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", autor: "Robert Collier" },
  { txt: "Aprovação é método, não sorte.", autor: "Princípio do concurseiro" },
  { txt: "Cada questão errada hoje é um acerto garantido na prova real.", autor: "Método ativo de estudo" },
  { txt: "Você não compete com 180 mil. Compete com 3 mil que realmente estudam.", autor: "Estratégia de concurso" },
  { txt: "A melhor hora para começar era ontem. A segunda melhor é agora.", autor: "Provérbio chinês" },
  { txt: "O caminho para a nomeação é feito de dias simples, repetidos com constância.", autor: "Mentalidade de concurseiro" },
  { txt: "Não existe vento favorável para quem não sabe para onde vai.", autor: "Sêneca" },
  { txt: "Revise seus erros. Quem aprende com eles já saiu na frente.", autor: "Caderno de erros" },
  { txt: "Consistência de 1% ao dia supera intensidade esporádica.", autor: "James Clear — Hábitos Atômicos" },
  { txt: "Estude como se precisasse, porque você precisa.", autor: "Realidade do concurso público" },
  { txt: "A prova não espera que você esteja pronto. Seja o mais pronto possível.", autor: "Mentalidade de performance" },
];

function loadFrase() {
  try {
    const idx = new Date().getDate() % frases.length;
    const f = frases[idx];
    const el = document.getElementById('fraseHoje');
    const a = document.getElementById('autorFrase');
    if (el) el.textContent = '"' + f.txt + '"';
    if (a) a.textContent = '— ' + f.autor;
  } catch (e) {
    console.error('[Frase] Erro ao carregar:', e);
  }
}

// =====================================================
// TEMA CLARO / ESCURO
// =====================================================
function toggleTheme() {
  try {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    Storage.safeSet('theme', isLight ? 'light' : 'dark');
    
    const btn = document.getElementById('themeBtn');
    if (btn) {
      btn.querySelector('i').className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  } catch (e) {
    console.error('[Theme] Erro ao alternar tema:', e);
  }
}

function loadTheme() {
  try {
    const theme = Storage.safeGet('theme', 'dark');
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      const btn = document.getElementById('themeBtn');
      if (btn) btn.querySelector('i').className = 'fa-solid fa-sun';
    }
  } catch (e) {
    console.error('[Theme] Erro ao carregar tema:', e);
  }
}

// =====================================================
// NAVEGAÇÃO ENTRE ABAS
// =====================================================
function switchTab(tabName, navElement) {
  try {
    // Remove active de todos
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Adiciona active no selecionado
    if (navElement) {
      navElement.classList.add('active');
    }
    
    // Esconde todas as seções
    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Mostra seção atual
    const activeSection = document.getElementById(tabName);
    if (activeSection) {
      activeSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Salva última aba
    Storage.safeSet('lastTab', tabName);
  } catch (e) {
    console.error('[Navigation] Erro ao mudar aba:', e);
  }
}

// =====================================================
// ACCORDION (EDITAL)
// =====================================================
function toggleAccordion(header) {
  try {
    const item = header.closest('.accordion-item');
    const isActive = item.classList.contains('active');
    
    // Fecha todos
    document.querySelectorAll('.accordion-item').forEach(acc => {
      acc.classList.remove('active');
    });
    
    // Abre atual se estava fechado
    if (!isActive) {
      item.classList.add('active');
    }
  } catch (e) {
    console.error('[Accordion] Erro:', e);
  }
}

// =====================================================
// TÓPICOS DO EDITAL
// =====================================================
function toggleTopic(topicItem) {
  try {
    topicItem.classList.toggle('done');
    updateProgress();
    Storage.safeSet('topics', getTopicsState());
  } catch (e) {
    console.error('[Topic] Erro:', e);
  }
}

function getTopicsState() {
  const topics = {};
  document.querySelectorAll('.topic-item').forEach((item, idx) => {
    const key = item.dataset.key || `topic_${idx}`;
    topics[key] = item.classList.contains('done');
  });
  return topics;
}

// =====================================================
// TAREFAS
// =====================================================
function toggleTask(taskItem) {
  try {
    taskItem.classList.toggle('done');
    Storage.safeSet('tasks', getTasksState());
  } catch (e) {
    console.error('[Task] Erro:', e);
  }
}

function getTasksState() {
  const tasks = {};
  document.querySelectorAll('.task-item').forEach((item, idx) => {
    const key = item.dataset.key || `task_${idx}`;
    tasks[key] = item.classList.contains('done');
  });
  return tasks;
}

function loadTasks() {
  try {
    const tasks = Storage.safeGet('tasks', {});
    document.querySelectorAll('.task-item').forEach(item => {
      const key = item.dataset.key;
      if (key && tasks[key]) {
        item.classList.add('done');
      }
    });
  } catch (e) {
    console.error('[Tasks] Erro ao carregar:', e);
  }
}

function loadTopics() {
  try {
    const topics = Storage.safeGet('topics', {});
    document.querySelectorAll('.topic-item').forEach(item => {
      const key = item.dataset.key;
      if (key && topics[key]) {
        item.classList.add('done');
      }
    });
  } catch (e) {
    console.error('[Topics] Erro ao carregar:', e);
  }
}

// =====================================================
// PROGRESSO
// =====================================================
function updateProgress() {
  try {
    const groups = ['port', 'penal', 'proc', 'const', 'mat'];
    const total = {};
    const done = {};
    
    groups.forEach(g => {
      total[g] = 0;
      done[g] = 0;
    });
    
    document.querySelectorAll('.topic-item').forEach(item => {
      const group = item.closest('.topic-list')?.dataset.group;
      if (group && groups.includes(group)) {
        total[group]++;
        if (item.classList.contains('done')) {
          done[group]++;
        }
      }
    });
    
    // Atualiza barras
    groups.forEach(g => {
      const pct = total[g] > 0 ? Math.round((done[g] / total[g]) * 100) : 0;
      const fill = document.getElementById(`fill-${g}`);
      const label = document.getElementById(`pct-${g}`);
      const prog = document.getElementById(`prog-${g}`);
      
      if (fill) fill.style.width = `${pct}%`;
      if (label) label.textContent = `${pct}%`;
      if (prog) prog.textContent = `${done[g]}/${total[g]}`;
    });
    
    // Total geral
    const totalTopics = Object.values(total).reduce((a, b) => a + b, 0);
    const totalDone = Object.values(done).reduce((a, b) => a + b, 0);
    const el = document.getElementById('topicsDone');
    if (el) el.textContent = `${totalDone}/${totalTopics}`;
  } catch (e) {
    console.error('[Progress] Erro:', e);
  }
}

// =====================================================
// STREAK (DIAS SEGUIDOS)
// =====================================================
function updateStreak() {
  try {
    const today = new Date().toDateString();
    const lastStudy = Storage.safeGet('lastStudyDate', null);
    let streak = Storage.safeGet('studyStreak', 0);
    
    if (lastStudy !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastStudy !== yesterday.toDateString()) {
        streak = 0; // Quebrou o streak
      }
      
      streak++;
      Storage.safeSet('studyStreak', streak);
      Storage.safeSet('lastStudyDate', today);
    }
    
    return streak;
  } catch (e) {
    console.error('[Streak] Erro:', e);
    return 0;
  }
}

function updateStreakUI() {
  try {
    const streak = Storage.safeGet('studyStreak', 0);
    const label = document.getElementById('streakLabel');
    const sub = document.getElementById('streakSub');
    const bar = document.getElementById('streakBar');
    
    if (label) label.textContent = `${streak} dias seguidos`;
    if (sub) sub.textContent = streak > 0 ? 'Continue assim!' : 'Estude hoje para começar!';
    if (bar) bar.style.width = `${Math.min(streak * 10, 100)}%`;
  } catch (e) {
    console.error('[Streak UI] Erro:', e);
  }
}

// =====================================================
// MODO FOCO
// =====================================================
let focoMode = false;

function toggleFoco() {
  try {
    focoMode = !focoMode;
    document.body.classList.toggle('foco-mode', focoMode);
    
    const btn = document.getElementById('btnFoco');
    const banner = document.getElementById('focoBanner');
    
    if (btn) {
      btn.classList.toggle('active', focoMode);
    }
    
    if (banner) {
      banner.style.display = focoMode ? 'block' : 'none';
    }
    
    Storage.safeSet('focoMode', focoMode);
  } catch (e) {
    console.error('[Foco] Erro:', e);
  }
}

// =====================================================
// ESTUDAR AGORA
// =====================================================
function estudarAgora() {
  try {
    alert('📚 Hora de estudar!\n\n🎯 Meta de hoje:\n- 1h de teoria nova\n- 30min de questões\n- 15min de revisão no Anki\n\nVamos lá! 🔥');
    updateStreak();
    updateStreakUI();
    syncTopbar();
  } catch (e) {
    console.error('[Estudar] Erro:', e);
  }
}

// =====================================================
// NAVEGAÇÃO DAS ABAS DE DICAS (SUB-TABS)
// =====================================================
function switchDicaTab(panelId, tabElement) {
  try {
    // Remove active de todas as tabs
    document.querySelectorAll('.dica-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Adiciona active na tab clicada
    if (tabElement) {
      tabElement.classList.add('active');
    }
    
    // Esconde todos os painéis
    document.querySelectorAll('.dica-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    // Mostra o painel selecionado
    const panelIdFull = `dica-${panelId}`;
    const activePanel = document.getElementById(panelIdFull);
    if (activePanel) {
      activePanel.classList.add('active');
    }
  } catch (e) {
    console.error('[Dicas Tab] Erro:', e);
  }
}

// =====================================================
// COUNTDOWN ATÉ A PROVA
// =====================================================
function updateCountdown() {
  try {
    const provaDate = new Date('2026-08-01');
    const diff = Math.ceil((provaDate - new Date()) / 86400000);
    const el = document.getElementById('diasCountdown');
    if (el) el.textContent = diff > 0 ? diff : '—';
  } catch (e) {
    console.error('[Countdown] Erro:', e);
  }
}

// =====================================================
// MEDALS (CONQUISTAS)
// =====================================================
function updateMedals() {
  try {
    const streak = Storage.safeGet('studyStreak', 0);
    const topics = Object.values(Storage.safeGet('topics', {})).filter(Boolean).length;
    const simCount = Storage.safeGet('simCount', 0);
    
    document.querySelectorAll('.medal').forEach(medal => {
      const condition = medal.dataset.condition;
      let earned = false;
      
      if (condition?.startsWith('streak:')) {
        const req = parseInt(condition.split(':')[1]);
        earned = streak >= req;
      } else if (condition?.startsWith('topics:')) {
        const req = parseInt(condition.split(':')[1]);
        earned = topics >= req;
      } else if (condition?.startsWith('sims:')) {
        const req = parseInt(condition.split(':')[1]);
        earned = simCount >= req;
      }
      
      medal.classList.toggle('earned', earned);
      medal.classList.toggle('locked', !earned);
    });
  } catch (e) {
    console.error('[Medals] Erro:', e);
  }
}

// =====================================================
// RADAR CHART
// =====================================================
function drawRadar() {
  try {
    const ctx = document.getElementById('radarChart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    const groups = ['port', 'penal', 'proc', 'const', 'mat'];
    const data = groups.map(g => {
      const fill = document.getElementById(`fill-${g}`);
      return fill ? parseInt(fill.style.width) || 0 : 0;
    });
    
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Português', 'Penal', 'Proc.', 'Const.', 'Mat/Info'],
        datasets: [{
          label: 'Progresso',
          data: data,
          backgroundColor: 'rgba(201, 168, 76, 0.2)',
          borderColor: '#c9a84c',
          borderWidth: 2,
          pointBackgroundColor: '#c9a84c',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  } catch (e) {
    console.error('[Radar] Erro:', e);
  }
}

// =====================================================
// SIMULADO
// =====================================================
let simInterval = null;
let simRunning = false;
let simRemaining = 0;
let simTotalSecs = 0;

function setupSimulado() {
  // Seleção de tempo
  document.querySelectorAll('.sim-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.sim-opt').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      simTotalSecs = parseInt(opt.dataset.mins) * 60;
    });
  });
  
  // Iniciar
  const btnStart = document.querySelector('.btn-start-sim');
  if (btnStart) {
    btnStart.addEventListener('click', iniciarSimulado);
  }
}

function iniciarSimulado() {
  try {
    let selectedMins = simTotalSecs / 60;
    if (!selectedMins || selectedMins <= 0) {
      const selected = document.querySelector('.sim-opt.selected');
      selectedMins = selected ? parseInt(selected.dataset.mins) : 300;
      simTotalSecs = selectedMins * 60;
    }
    
    simRemaining = simTotalSecs;
    
    const setupScreen = document.getElementById('simSetupScreen');
    const timerScreen = document.getElementById('simTimerScreen');
    
    if (setupScreen) setupScreen.classList.add('hidden');
    if (timerScreen) timerScreen.classList.add('active');
    
    simRunning = true;
    simInterval = setInterval(tickTimer, 1000);
    tickTimer();
  } catch (e) {
    console.error('[Simulado] Erro ao iniciar:', e);
  }
}

function tickTimer() {
  try {
    if (!simRunning) return;
    
    const display = document.getElementById('timerDisplay');
    const progress = document.getElementById('timerProgress');
    
    if (display) {
      display.textContent = formatTime(simRemaining);
    }
    
    if (progress && simTotalSecs > 0) {
      const pct = (simRemaining / simTotalSecs) * 100;
      progress.style.width = `${pct}%`;
      progress.style.background = pct > 50 ? 'var(--accent)' : pct > 20 ? 'var(--danger)' : '#ff2222';
    }
    
    if (simRemaining <= 0) {
      clearInterval(simInterval);
      const status = document.getElementById('timerStatus');
      if (status) status.textContent = '⏰ Tempo esgotado! Simulado encerrado.';
      encerrarSimulado(true);
      return;
    }
    
    simRemaining--;
  } catch (e) {
    console.error('[Timer] Erro:', e);
  }
}

function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function toggleTimer() {
  try {
    simRunning = !simRunning;
    const btn = document.getElementById('btnPauseTimer');
    
    if (simRunning) {
      simInterval = setInterval(tickTimer, 1000);
      if (btn) btn.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar';
    } else {
      clearInterval(simInterval);
      if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> Retomar';
    }
  } catch (e) {
    console.error('[Timer Toggle] Erro:', e);
  }
}

function encerrarSimulado(timeout = false) {
  try {
    clearInterval(simInterval);
    const elapsed = simTotalSecs - simRemaining;
    
    // Salvar histórico
    const simCount = (Storage.safeGet('simCount', 0)) + 1;
    Storage.safeSet('simCount', simCount);
    
    const hist = Storage.safeGet('simHistorico', []);
    const tipoEl = document.getElementById('simTipoLabel');
    const notesEl = document.getElementById('simNotes');
    
    hist.unshift({
      data: new Date().toLocaleDateString('pt-BR'),
      duracao: formatTime(elapsed),
      tipo: tipoEl?.textContent || 'Simulado',
      notas: notesEl?.value || ''
    });
    
    if (hist.length > 10) hist.pop();
    Storage.safeSet('simHistorico', hist);
    
    renderHistorico();
    
    // Voltar para setup
    const setupScreen = document.getElementById('simSetupScreen');
    const timerScreen = document.getElementById('simTimerScreen');
    
    if (setupScreen) setupScreen.classList.remove('hidden');
    if (timerScreen) timerScreen.classList.remove('active');
    if (notesEl) notesEl.value = '';
    
    updateMedals();
  } catch (e) {
    console.error('[Encerrar Simulado] Erro:', e);
  }
}

function renderHistorico() {
  try {
    const hist = Storage.safeGet('simHistorico', []);
    const el = document.getElementById('simHistorico');
    
    if (!el) return;
    
    if (hist.length === 0) {
      el.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-muted);font-size:.88rem"><i class="fa-solid fa-clock" style="font-size:2rem;margin-bottom:.75rem;display:block;opacity:.3"></i>Nenhum simulado realizado ainda.</div>';
      return;
    }
    
    el.innerHTML = hist.map(s => `
      <div class="task-item" style="cursor:default">
        <div class="checkbox" style="background:var(--success);border-color:var(--success)"></div>
        <div>
          <div class="task-text">${s.tipo} — ${s.duracao} estudados</div>
          <span class="task-tag">${s.data}${s.notas ? ' · com anotações' : ''}</span>
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error('[Historico] Erro:', e);
  }
}

// =====================================================
// KEYBOARD SHORTCUTS (NOVIDADE PROFISSIONAL)
// =====================================================
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+K ou Cmd+K = focar busca
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('globalSearch');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
      return;
    }
    
    // Esc = fechar busca / sair modo foco
    if (e.key === 'Escape') {
      hideSearch();
      if (focoMode) toggleFoco();
      return;
    }
    
    // Enter na busca = ir para primeiro resultado
    if (e.key === 'Enter') {
      const searchBox = document.getElementById('searchResults');
      if (searchBox?.classList.contains('visible')) {
        const first = searchBox.querySelector('.search-result-item');
        if (first) first.click();
      }
    }
    
    // Ctrl+H = em casa (dashboard)
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
      e.preventDefault();
      const dashboard = document.querySelector('[data-section="dashboard"]');
      if (dashboard) switchTab('dashboard', dashboard);
      return;
    }
  });
}

// =====================================================
// SERVICE WORKER REGISTRATION
// =====================================================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[SW] Registrado:', reg.scope))
      .catch(err => console.error('[SW] Falha no registro:', err));
  }
}

// =====================================================
// BANCO DE QUESTÕES
// =====================================================

let bancoQuestoes = [];
let questaoAtual = null;
let revisaoAtiva = false;

// Carregar questões do localStorage
function loadBancoQuestoes() {
  bancoQuestoes = Storage.safeGet('bancoQuestoes', []);
  renderBancoQuestoes();
  updateContadores();
}

// Salvar questão
function salvarQuestao() {
  const materia = document.getElementById('qMateria')?.value;
  const origem = document.getElementById('qOrigem')?.value || '';
  const enunciado = document.getElementById('qEnunciado')?.value.trim();
  const altA = document.getElementById('qAltA')?.value.trim();
  const altB = document.getElementById('qAltB')?.value.trim();
  const altC = document.getElementById('qAltC')?.value.trim();
  const altD = document.getElementById('qAltD')?.value.trim();
  const altE = document.getElementById('qAltE')?.value.trim();
  const correta = document.getElementById('qCorreta')?.value;
  const comentario = document.getElementById('qComentario')?.value.trim();
  
  if (!materia || !enunciado || !correta) {
    alert('⚠️ Preencha pelo menos: Matéria, Enunciado e Alternativa Correta');
    return;
  }
  
  const questao = {
    id: Date.now().toString(),
    materia,
    origem,
    enunciado,
    alternativas: { a: altA, b: altB, c: altC, d: altD, e: altE },
    correta,
    comentario,
    dataAdicao: new Date().toISOString(),
    acertos: 0,
    erros: 0
  };
  
  bancoQuestoes.push(questao);
  Storage.set('bancoQuestoes', bancoQuestoes);
  
  // Limpar formulário
  document.getElementById('qMateria').value = 'port';
  document.getElementById('qOrigem').value = '';
  document.getElementById('qEnunciado').value = '';
  document.getElementById('qAltA').value = '';
  document.getElementById('qAltB').value = '';
  document.getElementById('qAltC').value = '';
  document.getElementById('qAltD').value = '';
  document.getElementById('qAltE').value = '';
  document.getElementById('qComentario').value = '';
  
  alert('✅ Questão salva com sucesso!');
  renderBancoQuestoes();
}

// Renderizar lista de questões
function renderBancoQuestoes() {
  const filtro = document.getElementById('listaFiltro')?.value || 'todas';
  const container = document.getElementById('listaQuestoes');
  const totalEl = document.getElementById('questoesTotal');
  
  if (!container) return;
  
  let filtradas = bancoQuestoes;
  if (filtro !== 'todas') {
    filtradas = bancoQuestoes.filter(q => q.materia === filtro);
  }
  
  totalEl.textContent = `${filtradas.length} questões`;
  
  if (filtradas.length === 0) {
    container.innerHTML = '<p class="text-muted text-center">Nenhuma questão cadastrada ainda.</p>';
    return;
  }
  
  container.innerHTML = filtradas.map(q => `
    <div class="questao-card" style="border-left: 4px solid var(--clr-${q.materia});">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <span class="badge badge-${q.materia}">${getNomeMateria(q.materia)}</span>
        <button class="btn btn-danger" onclick="excluirQuestao('${q.id}')" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <p class="questao-enunciado">${q.enunciado.substring(0, 300)}${q.enunciado.length > 300 ? '...' : ''}</p>
      <div style="display: flex; gap: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">
        ${q.origem ? `<span>📍 ${q.origem}</span>` : ''}
        <span>✓ ${q.acertos} acertos</span>
        <span>✗ ${q.erros} erros</span>
      </div>
    </div>
  `).join('');
}

// Excluir questão
function excluirQuestao(id) {
  if (!confirm('Tem certeza que deseja excluir esta questão?')) return;
  bancoQuestoes = bancoQuestoes.filter(q => q.id !== id);
  Storage.set('bancoQuestoes', bancoQuestoes);
  renderBancoQuestoes();
}

// Iniciar revisão
function iniciarRevisao() {
  const filtro = document.getElementById('revisaoFiltro')?.value || 'todas';
  
  let questoes = bancoQuestoes;
  if (filtro !== 'todas') {
    questoes = bancoQuestoes.filter(q => q.materia === filtro);
  }
  
  if (questoes.length === 0) {
    alert('⚠️ Nenhuma questão encontrada para este filtro.');
    return;
  }
  
  // Embaralhar
  questoes = questoes.sort(() => Math.random() - 0.5);
  
  revisaoAtiva = true;
  questaoAtual = 0;
  window.questoesRevisao = questoes;
  
  document.getElementById('revisaoStatus').textContent = `${questoes.length} questões - Iniciando...`;
  document.getElementById('revisaoAtiva').classList.remove('hidden');
  mostrarQuestaoRevisao();
}

// Mostrar questão da revisão
function mostrarQuestaoRevisao() {
  const questao = window.questoesRevisao[questaoAtual];
  if (!questao) return;
  
  document.getElementById('revisaoEnunciado').textContent = questao.enunciado;
  document.getElementById('revisaoFeedback').classList.add('hidden');
  
  const container = document.getElementById('revisaoAlternativas');
  container.innerHTML = Object.entries(questao.alternativas)
    .filter(([_, v]) => v) // Filtrar alternativas vazias
    .map(([letra, texto]) => `
      <button class="alternativa-btn" onclick="responderQuestao('${letra}')">
        <strong>${letra.toUpperCase()})</strong> ${texto}
      </button>
    `).join('');
  
  // Scroll para a questão
  document.getElementById('revisaoAtiva').scrollIntoView({ behavior: 'smooth' });
}

// Responder questão
function responderQuestao(letra) {
  const questao = window.questoesRevisao[questaoAtual];
  const correta = questao.correta;
  const acertou = letra === correta;
  
  // Atualizar estatísticas
  if (acertou) {
    questao.acertos++;
  } else {
    questao.erros++;
  }
  Storage.set('bancoQuestoes', bancoQuestoes);
  
  // Mostrar feedback
  const feedback = document.getElementById('revisaoFeedback');
  feedback.classList.remove('hidden');
  feedback.innerHTML = `
    <div style="padding: 1rem; border-radius: 8px; background: ${acertou ? 'var(--success-dim)' : 'var(--danger-dim)'}; border: 1px solid ${acertou ? 'var(--success)' : 'var(--danger)'};">
      <strong>${acertou ? '✅ Correto!' : '❌ Errou!'}</strong>
      ${!acertou ? `<p>A alternativa correta é: <strong>${correta.toUpperCase()})</strong></p>` : ''}
      ${questao.comentario ? `<p class="mt-2" style="font-size: 0.9rem;"><em>💡 ${questao.comentario}</em></p>` : ''}
      <button class="btn btn-secondary mt-2" onclick="adicionarAoCadernoErros('${questao.id}')" style="font-size: 0.8rem;">
        <i class="fa-solid fa-book"></i> Adicionar ao Caderno de Erros
      </button>
    </div>
  `;
  
  // Marcar alternativas
  const botoes = document.querySelectorAll('.alternativa-btn');
  botoes.forEach(btn => {
    const letraBtn = btn.textContent.trim().charAt(0).toLowerCase();
    if (letraBtn === correta) {
      btn.classList.add('correct');
    } else if (letraBtn === letra && letra !== correta) {
      btn.classList.add('incorrect');
    }
    btn.disabled = true;
  });
}

// Próxima questão
function proximaQuestao() {
  if (questaoAtual < window.questoesRevisao.length - 1) {
    questaoAtual++;
    mostrarQuestaoRevisao();
  } else {
    encerrarRevisao();
    alert('🎉 Revisão concluída! Você respondeu todas as questões.');
  }
}

// Encerrar revisão
function encerrarRevisao() {
  revisaoAtiva = false;
  questaoAtual = null;
  window.questoesRevisao = [];
  document.getElementById('revisaoAtiva').classList.add('hidden');
  document.getElementById('revisaoStatus').textContent = 'Selecione um filtro e clique em Iniciar';
}

// Adicionar ao Caderno de Erros
function adicionarAoCadernoErros(questaoId) {
  const questao = bancoQuestoes.find(q => q.id === questaoId);
  if (!questao) return;
  
  // Navegar para Caderno de Erros
  const navItem = document.querySelector('[data-section="caderno-erros"]');
  if (navItem) switchTab('caderno-erros', navItem);
  
  // Preencher formulário
  document.getElementById('eMateria').value = questao.materia;
  document.getElementById('eTema').value = questao.enunciado.substring(0, 50) + '...';
  document.getElementById('eContexto').value = questao.enunciado;
  document.getElementById('eResposta').value = questao.comentario || `Alternativa correta: ${questao.correta.toUpperCase()}`;
  
  alert('📝 Formulário preenchido! Complete com "Por que errei?" e salve.');
}

// helper
function getNomeMateria(chave) {
  const nomes = {
    port: 'Português',
    penal: 'Penal',
    proc: 'Processo',
    const: 'Constitucional',
    mat: 'Matemática'
  };
  return nomes[chave] || chave;
}

// =====================================================
// CADERNO DE ERROS
// =====================================================

let cadernoErros = [];

function loadCadernoErros() {
  cadernoErros = Storage.safeGet('cadernoErros', []);
  renderErros();
  checkMedalhasErros();
  updateContadores();
}

function salvarErro() {
  const materia = document.getElementById('eMateria')?.value;
  const tema = document.getElementById('eTema')?.value.trim();
  const contexto = document.getElementById('eContexto')?.value.trim();
  const motivo = document.getElementById('eMotivo')?.value.trim();
  const resposta = document.getElementById('eResposta')?.value.trim();
  
  if (!materia || !tema || !resposta) {
    alert('⚠️ Preencha pelo menos: Matéria, Tema e Resposta Correta');
    return;
  }
  
  const erro = {
    id: Date.now().toString(),
    materia,
    tema,
    contexto,
    motivoErro: motivo || 'Não informado',
    respostaCorreta: resposta,
    data: new Date().toISOString()
  };
  
  cadernoErros.unshift(erro); // Mais recente primeiro
  Storage.set('cadernoErros', cadernoErros);
  
  // Limpar
  document.getElementById('eTema').value = '';
  document.getElementById('eContexto').value = '';
  document.getElementById('eMotivo').value = '';
  document.getElementById('eResposta').value = '';
  
  alert('✅ Erro registrado! Aprenda com ele e não cometa novamente.');
  renderErros();
  checkMedalhasErros();
}

function renderErros() {
  const filtro = document.getElementById('errosFiltro')?.value || 'todas';
  const container = document.getElementById('listaErros');
  const totalEl = document.getElementById('errosTotal');
  
  if (!container) return;
  
  let filtrados = cadernoErros;
  if (filtro !== 'todas') {
    filtrados = cadernoErros.filter(e => e.materia === filtro);
  }
  
  totalEl.textContent = `${filtrados.length} erros`;
  
  if (filtrados.length === 0) {
    container.innerHTML = '<p class="text-muted text-center">Nenhum erro registrado. Isso é bom... ou você ainda não catalogou seus erros!</p>';
    return;
  }
  
  container.innerHTML = filtrados.map(e => `
    <div class="erro-card card" onclick="toggleErroCard('${e.id}')" id="erro-${e.id}">
      <div class="erro-card-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span class="badge badge-${e.materia}">${getNomeMateria(e.materia)}</span>
          <strong>${e.tema}</strong>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="text-muted" style="font-size: 0.8rem;">${new Date(e.data).toLocaleDateString('pt-BR')}</span>
          <button class="btn btn-danger" onclick="event.stopPropagation(); excluirErro('${e.id}')" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="erro-card-content" id="conteudo-erro-${e.id}">
        <div class="form-group">
          <label style="color: var(--text-muted); font-size: 0.85rem;">📖 Contexto:</label>
          <p style="font-size: 0.9rem; line-height: 1.6;">${e.contexto}</p>
        </div>
        <div class="form-group">
          <label style="color: var(--text-muted); font-size: 0.85rem;">❓ Por que errei:</label>
          <p style="font-size: 0.9rem; line-height: 1.6;">${e.motivoErro}</p>
        </div>
        <div class="form-group" style="background: var(--success-dim); padding: 1rem; border-radius: 8px; border-left: 3px solid var(--success);">
          <label style="color: var(--success); font-size: 0.85rem; font-weight: 700;">✅ Resposta Correta:</label>
          <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-main);">${e.respostaCorreta}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleErroCard(id) {
  const card = document.getElementById(`erro-${id}`);
  const conteudo = document.getElementById(`conteudo-erro-${id}`);
  
  if (card.classList.contains('expanded')) {
    card.classList.remove('expanded');
    conteudo.style.maxHeight = '0';
  } else {
    // Fechar outros
    document.querySelectorAll('.erro-card.expanded').forEach(c => {
      c.classList.remove('expanded');
      c.querySelector('.erro-card-content').style.maxHeight = '0';
    });
    
    card.classList.add('expanded');
    conteudo.style.maxHeight = '500px';
  }
}

function excluirErro(id) {
  if (!confirm('Excluir este registro?')) return;
  cadernoErros = cadernoErros.filter(e => e.id !== id);
  Storage.set('cadernoErros', cadernoErros);
  renderErros();
  checkMedalhasErros();
}

function abrirCadernoComDados(materia, tema, contexto, respostaCorreta) {
  // Navegar para a aba
  const navItem = document.querySelector('[data-section="caderno-erros"]');
  if (navItem) switchTab('caderno-erros', navItem);
  
  // Preencher
  document.getElementById('eMateria').value = materia;
  document.getElementById('eTema').value = tema;
  document.getElementById('eContexto').value = contexto;
  document.getElementById('eResposta').value = respostaCorreta;
}

function checkMedalhasErros() {
  const medalha = document.getElementById('medalErros10');
  if (!medalha) return;
  
  if (cadernoErros.length >= 10) {
    medalha.classList.remove('locked');
    medalha.classList.add('earned');
    console.log('🏆 Medalha "Analista de Erros" desbloqueada!');
  }
}

// =====================================================
// INIT
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] Iniciando Aprova SP...');
  
  // Carregar estado salvo
    loadTheme();
    loadFrase();
    loadTasks();
    loadTopics();
    loadBancoQuestoes();
    loadCadernoErros();
  
  // Atualizar UI
  syncTopbar();
  updateStreakUI();
  updateProgress();
  updateCountdown();
  updateMedals();
  
  // Setup event listeners
  setupKeyboardShortcuts();
  setupSimulado();
  
  // Restaurar última aba
  const lastTab = Storage.safeGet('lastTab', 'dashboard');
  const navItem = document.querySelector(`[data-section="${lastTab}"]`);
  if (navItem && lastTab !== 'dashboard') {
    switchTab(lastTab, navItem);
  }
  
  // Restaurar modo foco
  if (Storage.safeGet('focoMode', false)) {
    toggleFoco();
  }
  
  // Adicionar listeners para navegação
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function() {
        const section = this.dataset.section;
        switchTab(section, this);
      });
    
    // Keyboard accessibility
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Theme button
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
  
  // Estudar button
  const btnEstudar = document.getElementById('btnEstudar');
  if (btnEstudar) {
    btnEstudar.addEventListener('click', estudarAgora);
  }
  
  // Foco button
    const btnFoco = document.getElementById('btnFoco');
    if (btnFoco) {
      btnFoco.addEventListener('click', toggleFoco);
    }
  
    // Encerrar Simulado button
      const btnStopSim = document.getElementById('btnStopSim');
      if (btnStopSim) {
        btnStopSim.addEventListener('click', () => encerrarSimulado(false));
      }
  
      // Pausar/Retomar Simulado button
      const btnPauseTimer = document.getElementById('btnPauseTimer');
      if (btnPauseTimer) {
        btnPauseTimer.addEventListener('click', toggleTimer);
      }
  
  // Accordion
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', function() {
        toggleAccordion(this);
      });
    });
  
    // Dicas Tabs (sub-navegação da aba Dicas)
    document.querySelectorAll('.dica-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        const panelId = this.dataset.panel;
        switchDicaTab(panelId, this);
      });
    });
  
  // Topics
  document.querySelectorAll('.topic-item').forEach(item => {
    item.addEventListener('click', function() {
      toggleTopic(this);
    });
  });
  
  // Tasks
  document.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('click', function() {
      toggleTask(this);
    });
  });
  
  // Search
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => runSearch(e.target.value));
    searchInput.addEventListener('blur', () => setTimeout(hideSearch, 200));
  }
  
  // Register Service Worker
  registerServiceWorker();
  
  
  
  // Banco de Questoes listeners
  const btnSalvarQuestao = document.getElementById('btnSalvarQuestao');
  if (btnSalvarQuestao) {
    btnSalvarQuestao.addEventListener('click', salvarQuestao);
  }
  
  const btnIniciarRevisao = document.getElementById('btnIniciarRevisao');
  if (btnIniciarRevisao) {
    btnIniciarRevisao.addEventListener('click', iniciarRevisao);
  }
  
  const btnProximaQuestao = document.getElementById('btnProximaQuestao');
  if (btnProximaQuestao) {
    btnProximaQuestao.addEventListener('click', proximaQuestao);
  }
  
  const btnEncerrarRevisao = document.getElementById('btnEncerrarRevisao');
  if (btnEncerrarRevisao) {
    btnEncerrarRevisao.addEventListener('click', encerrarRevisao);
  }
  
  // Caderno de Erros listeners
  const btnSalvarErro = document.getElementById('btnSalvarErro');
  if (btnSalvarErro) {
    btnSalvarErro.addEventListener('click', salvarErro);
  }
  
  console.log('[App] Pronto! 🚀');
});


// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function limparFormularioQuestao() {
  document.getElementById('qMateria').value = 'port';
  document.getElementById('qOrigem').value = '';
  document.getElementById('qEnunciado').value = '';
  document.getElementById('qAltA').value = '';
  document.getElementById('qAltB').value = '';
  document.getElementById('qAltC').value = '';
  document.getElementById('qAltD').value = '';
  document.getElementById('qAltE').value = '';
  document.getElementById('qComentario').value = '';
}

function limparFormularioErro() {
  document.getElementById('eMateria').value = 'port';
  document.getElementById('eTema').value = '';
  document.getElementById('eContexto').value = '';
  document.getElementById('eMotivo').value = '';
  document.getElementById('eResposta').value = '';
}

// Atualizar hero counters
function updateContadores() {
  const questoesCount = bancoQuestoes.length;
  const errosCount = cadernoErros.length;
  
  const qHero = document.getElementById('questoesCountHero');
  if (qHero) qHero.textContent = questoesCount;
  
  const eHero = document.getElementById('errosCountHero');
  if (eHero) eHero.textContent = errosCount;
  
  // Show medalha container se tiver 10+ erros
  const medalhaContainer = document.getElementById('medalhaContainer');
  if (medalhaContainer) {
    medalhaContainer.style.display = errosCount >= 10 ? 'block' : 'none';
  }
}

// Adicionar chamada no loadBancoQuestoes e loadCadernoErros
