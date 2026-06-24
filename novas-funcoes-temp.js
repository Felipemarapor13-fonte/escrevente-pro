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