/*
 * App Principal
 * Orquestra todas as views, componentes e lógica da aplicação
 */

// Estado global da aplicação
const state = {
  currentView: 'landing',
  currentStep: -1,
  answers: {},
  selectedUnit: '',
  isSubmitting: false,
  stats: null,
  responses: [],
  selectedQuestionId: null,
  isExporting: false,
  isClearing: false,
  adminFilterUnit: 'all',
  adminFilterPillar: null, // Filtro de pilar para o gráfico de tendência
  isLoadingRelatorio: false,
  relatorioData: null,
  questionSortOrder: 'asc', // 'asc' ou 'desc' para ordenação das questões
  questionSortBy: 'id', // 'id', 'comments', 'satisfaction' para tipo de ordenação
  questionFilterComments: 'all', // 'all', 'most', 'least' para filtro de comentários
  // Estado PCO
  pcoStats: null,
  pcoQuestionStats: null,
  pcoPillarStats: null,
  pcoComments: null,
  selectedPcoQuestionId: null,
  isExportingPco: false,
  pcoQuestionSortOrder: 'asc',
  pcoQuestionSortBy: 'id',
  pcoQuestionFilterComments: 'all'
};

// Histórico do chat
let chatHistory = [];

const app = document.getElementById('app');

// Renderização principal
function render() {
  switch (state.currentView) {
    case 'landing':
      app.innerHTML = renderLandingView(
        'startSurvey',
        'goToAdmin'
      );
      break;
      
    case 'survey':
      const questionsByPillar = getQuestionsByPillar();
      const currentPillar = state.currentStep >= 0 ? pillars[state.currentStep] : null;
      const pillarQuestions = currentPillar ? questionsByPillar[currentPillar] : [];
      
      app.innerHTML = renderSurveyView({
        currentStep: state.currentStep,
        currentPillar,
        pillarQuestions,
        selectedUnit: state.selectedUnit,
        answers: state.answers,
        onSelectUnit: 'selectUnit',
        onRate: 'handleRate',
        onComment: 'handleComment',
        onNext: 'nextQuestion',
        onPrev: 'prevQuestion',
        onSubmit: 'submitSurvey'
      });
      break;
      
    case 'success':
      app.innerHTML = renderSuccessView('goToLanding');
      break;
      
    case 'admin':
      app.innerHTML = renderAdminView({
        stats: state.stats,
        responses: state.responses,
        selectedQuestion: state.selectedQuestionId,
        questions: questions,
        isExporting: state.isExporting,
        isClearing: state.isClearing,
        selectedUnit: state.adminFilterUnit,
        selectedPillar: state.adminFilterPillar,
        questionSortOrder: state.questionSortOrder,
        questionSortBy: state.questionSortBy,
        questionFilterComments: state.questionFilterComments,
        onSelectQuestion: 'selectQuestion',
        onClearDatabase: 'clearDatabase',
        onExport: 'exportData',
        onFilterUnit: 'filterByUnit',
        onClearPillarFilter: 'clearPillarFilter',
        onSortQuestions: 'sortQuestions',
        onFilterComments: 'filterComments',
        onBack: 'goToLanding'
      });
      // Reinicializar gráficos após renderizar
      setTimeout(initCharts, 50);
      break;
    case 'pco-admin':
      app.innerHTML = renderPcoAdminView({
        stats: state.pcoStats,
        questionStats: state.pcoQuestionStats,
        pillarStats: state.pcoPillarStats,
        comments: state.pcoComments,
        selectedQuestion: state.selectedPcoQuestionId,
        isExporting: state.isExportingPco,
        questionSortOrder: state.pcoQuestionSortOrder,
        questionSortBy: state.pcoQuestionSortBy,
        questionFilterComments: state.pcoQuestionFilterComments,
        onSelectQuestion: 'selectPcoQuestion',
        onExport: 'exportPcoData',
        onSortQuestions: 'sortPcoQuestions',
        onFilterComments: 'filterPcoComments',
        onBack: 'goToLanding'
      });
      break;
    case 'relatorio-fullscreen':
      app.innerHTML = renderRelatorioFullscreen({
        relatorioData: state.relatorioData,
        isLoading: state.isLoadingRelatorio,
        onBackToAdmin: 'goToAdmin',
        onGenerateReport: 'gerarRelatorioCompleto'
      });
      break;
  }
}

// Navegação entre views
function setView(view) {
  state.currentView = view;
  render();
}

// Ações da Landing
function startSurvey() {
  state.currentStep = -1;
  state.answers = {};
  setView('survey');
}

function goToAdmin() {
  const password = prompt('Digite a senha de administrador:');
  if (password === 'nit2026') {
    loadAdminData().then(() => {
      setView('admin');
    });
  } else {
    alert('Senha incorreta!');
  }
}

function goToLanding() {
  setView('landing');
}

// Ações do Survey
function selectUnit(unit) {
  state.selectedUnit = unit;
  render();
}

function handleRate(questionId, score) {
  state.answers[questionId] = {
    ...state.answers[questionId],
    score,
    questionId
  };
  render();
}

function handleComment(comment, questionId) {
  state.answers[questionId] = {
    ...state.answers[questionId],
    comment,
    questionId
  };
}

function nextQuestion() {
  const totalPillars = pillars.length;
  if (state.currentStep < totalPillars - 1) {
    state.currentStep++;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevQuestion() {
  if (state.currentStep > -1) {
    state.currentStep--;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function submitSurvey() {
  if (state.isSubmitting) return;
  
  // Verificar se todas as questões foram respondidas
  const answeredCount = Object.keys(state.answers).length;
  if (answeredCount < questions.length) {
    if (!confirm(`Você respondeu ${answeredCount} de ${questions.length} questões. Deseja enviar assim mesmo?`)) {
      return;
    }
  }
  
  state.isSubmitting = true;
  
  // Preparar dados
  const answersArray = Object.values(state.answers).filter(a => a.score > 0);
  
  try {
    const response = await fetch(`${API_BASE}/api/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unit: state.selectedUnit,
        answers: answersArray
      })
    });
    
    if (!response.ok) throw new Error('Erro ao enviar');
    
    setView('success');
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao enviar resposta. Tente novamente.');
  } finally {
    state.isSubmitting = false;
  }
}

// Ações do Admin
async function loadAdminData() {
  try {
    const unitParam = state.adminFilterUnit !== 'all' ? `?unit=${encodeURIComponent(state.adminFilterUnit)}` : '';
    
    const [statsData, responsesData] = await Promise.all([
      fetch(`${API_BASE}/api/admin/stats${unitParam}`).then(r => r.json()),
      fetch(`${API_BASE}/api/admin/responses${unitParam}`).then(r => r.json())
    ]);
    
    state.stats = statsData;
    state.responses = responsesData;
    
    // Inicializar gráficos após renderização
    setTimeout(initCharts, 100);
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  }
}

function selectQuestion(questionId) {
  state.selectedQuestionId = questionId;
  render();
  
  // Fazer scroll automático até a questão selecionada após renderização
  setTimeout(() => {
    const selectedQuestionElement = document.querySelector(`.question-list-item.selected`);
    if (selectedQuestionElement) {
      // Usar scrollIntoView com comportamento suave
      selectedQuestionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Centraliza o elemento na tela
        inline: 'nearest'
      });
    }
  }, 100); // Pequeno delay para garantir que o DOM foi atualizado
}

function filterByUnit(unit) {
  state.adminFilterUnit = unit;
  loadAdminData().then(() => render());
}

function filterByPillar(pillarName) {
  // Toggle: se clicar no mesmo pilar, desfiltra; se clicar em outro, troca o filtro
  if (state.adminFilterPillar === pillarName) {
    state.adminFilterPillar = null; // Desfiltrar
  } else {
    state.adminFilterPillar = pillarName; // Filtrar pelo novo pilar
  }
  render();
}

function clearPillarFilter() {
  state.adminFilterPillar = null;
  render();
}

async function clearDatabase() {
  if (!confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODAS as respostas.\n\nDeseja continuar?')) {
    return;
  }
  
  if (!confirm('🚨 CONFIRMAÇÃO FINAL: Isso apagará permanentemente todos os dados.\n\nTem ABSOLUTA certeza?')) {
    return;
  }
  
  state.isClearing = true;
  render();
  
  try {
    const response = await fetch(`${API_BASE}/api/responses`, { method: 'DELETE' });
    
    if (response.ok) {
      alert('✅ Banco de dados limpo com sucesso!');
      state.stats = null;
      state.responses = [];
      await loadAdminData();
      render();
    } else {
      throw new Error('Falha ao limpar');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('❌ Erro ao limpar banco de dados.');
  } finally {
    state.isClearing = false;
  }
}

function exportData() {
  if (!state.responses || !state.responses.length) {
    alert('Não há dados para exportar');
    return;
  }
  
  state.isExporting = true;
  render();
  
  // Simular processamento
  setTimeout(() => {
    exportToCSV(state.responses, `pesquisa-clima-${new Date().toISOString().split('T')[0]}.csv`);
    state.isExporting = false;
    render();
  }, 1000);
}

// Funções de ordenação e filtro de questões
function sortQuestions(sortBy) {
  if (state.questionSortBy === sortBy) {
    // Se clicar no mesmo tipo, inverte a ordem
    state.questionSortOrder = state.questionSortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    state.questionSortBy = sortBy;
    state.questionSortOrder = 'asc'; // Reset para crescente ao mudar tipo
  }
  render();
}

function filterComments(filterType) {
  state.questionFilterComments = filterType;
  render();
}

// Gráficos
function initCharts() {
  if (!state.stats) return;
  
  // Destruir gráficos anteriores antes de recriar
  destroyChart('trendChart');
  destroyChart('unitChart');
  destroyChart('pillarChart');
  
  initTrendChart();
  initUnitChart();
  initPillarChart();
}

function destroyChart(chartId) {
  const chart = Chart.getChart(chartId);
  if (chart) {
    chart.destroy();
  }
}

function initTrendChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;
  
  // Filtrar dados por pilar se houver filtro selecionado
  let questionStats = state.stats.questionStats || [];
  if (state.adminFilterPillar) {
    const pillarQuestions = questions.filter(q => q.pillar === state.adminFilterPillar).map(q => q.id);
    questionStats = questionStats.filter(s => pillarQuestions.includes(s.question_id));
  }
  
  // Preparar dados para barras empilhadas (distribuição)
  const labels = questionStats.map(s => `Q${s.question_id}`);
  const discordoMuito = questionStats.map(s => parseFloat(s.distribuicao?.['1'] || 0));
  const discordo = questionStats.map(s => parseFloat(s.distribuicao?.['2'] || 0));
  const concordo = questionStats.map(s => parseFloat(s.distribuicao?.['3'] || 0));
  const concordoMuito = questionStats.map(s => parseFloat(s.distribuicao?.['4'] || 0));
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Discordo muito',
          data: discordoMuito,
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          borderWidth: 1
        },
        {
          label: 'Discordo',
          data: discordo,
          backgroundColor: '#f87171',
          borderColor: '#ef4444',
          borderWidth: 1
        },
        {
          label: 'Concordo',
          data: concordo,
          backgroundColor: '#fbbf24',
          borderColor: '#f59e0b',
          borderWidth: 1
        },
        {
          label: 'Concordo muito',
          data: concordoMuito,
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { font: { weight: '600' }, color: '#6b7280', maxRotation: 45 }
        },
        y: {
          stacked: true,
          min: 0,
          max: 100,
          grid: { color: '#e5e7eb' },
          ticks: { 
            font: { weight: '600' }, 
            color: '#6b7280',
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        legend: { 
          position: 'top',
          labels: {
            font: { weight: '600' },
            color: '#374151',
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'white',
          titleColor: '#111827',
          bodyColor: '#374151',
          titleFont: { weight: '700', size: 13 },
          bodyFont: { weight: '500', size: 12 },
          padding: 12,
          cornerRadius: 8,
          borderColor: '#e5e7eb',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
            }
          }
        }
      }
    }
  });
}

function initUnitChart() {
  const ctx = document.getElementById('unitChart');
  if (!ctx) return;
  
  // Verificar se há dados de unidades
  if (!state.stats.unitStats || state.stats.unitStats.length === 0) {
    ctx.parentElement.innerHTML = '<div class="no-data">Sem dados de unidade disponíveis</div>';
    return;
  }
  
  // Cores dinâmicas baseadas na satisfação
  const unitColors = state.stats.unitStats?.map(s => {
    const satisfaction = s.satisfaction || 0;
    if (satisfaction >= 75) return '#10b981'; // verde
    if (satisfaction >= 50) return '#f59e0b'; // amarelo
    return '#ef4444'; // vermelho
  }) || [];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: state.stats.unitStats?.map(s => s.unit) || [],
      datasets: [{
        label: 'Satisfação',
        data: state.stats.unitStats?.map(s => s.satisfaction || 0) || [],
        backgroundColor: unitColors,
        borderRadius: 8
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 0,
          max: 100,
          grid: { color: '#e5e7eb' },
          ticks: { 
            font: { weight: '600' }, 
            color: '#6b7280',
            callback: function(value) {
              return value + '%';
            }
          }
        },
        y: {
          grid: { display: false },
          ticks: { font: { weight: '700' }, color: '#374151' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'white',
          titleColor: '#111827',
          bodyColor: '#374151',
          titleFont: { weight: '700' },
          bodyFont: { weight: '500' },
          padding: 12,
          cornerRadius: 8,
          borderColor: '#e5e7eb',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return `Satisfação: ${context.parsed.x.toFixed(1)}%`;
            }
          }
        }
      }
    }
  });
}

function initPillarChart() {
  const ctx = document.getElementById('pillarChart');
  if (!ctx) return;
  
  // Verificar se há dados de pilares
  if (!state.stats.pillarStats || state.stats.pillarStats.length === 0) {
    ctx.parentElement.innerHTML = '<div class="no-data">Sem dados de pilar disponíveis</div>';
    return;
  }
  
  // Mapeamento reverso de labels abreviados para nomes completos
  const pillarNameMap = {
    'Comprom. Org.': 'Comprometimento Organizacional',
    'Gestão de Pessoas': 'Gestão do Capital Humano'
  };
  
  // Verificar qual pilar está filtrado para destacar visualmente
  const labels = state.stats.pillarStats?.map(s => {
    const name = s.pillar;
    if (name === 'Comprometimento Organizacional') return 'Comprom. Org.';
    if (name === 'Gestão do Capital Humano') return 'Gestão de Pessoas';
    return name;
  }) || [];
  
  const backgroundColors = labels.map((label, index) => {
    const fullName = pillarNameMap[label] || label;
    const satisfaction = parseFloat(state.stats.pillarStats?.[index]?.satisfaction) || 0;
    
    // Cores baseadas na satisfação
    if (satisfaction >= 75) return '#10b981'; // verde
    if (satisfaction >= 50) return '#f59e0b'; // amarelo
    return '#ef4444'; // vermelho
  });
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Satisfação',
        data: state.stats.pillarStats?.map(s => parseFloat(s.satisfaction) || 0) || [],
        backgroundColor: backgroundColors,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { 
            font: { weight: '600', size: 11 }, 
            color: '#6b7280',
            maxRotation: 45
          }
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: '#e5e7eb' },
          ticks: { 
            font: { weight: '600' }, 
            color: '#6b7280',
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'white',
          titleColor: '#111827',
          bodyColor: '#374151',
          titleFont: { weight: '700' },
          bodyFont: { weight: '500' },
          padding: 12,
          cornerRadius: 8,
          borderColor: '#e5e7eb',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return `Satisfação: ${context.parsed.y.toFixed(1)}%`;
            }
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const label = event.chart.data.labels[index];
          // Converter label abreviado de volta para nome completo
          const pillarName = pillarNameMap[label] || label;
          filterByPillar(pillarName);
        }
      },
      onHover: (event, elements) => {
        event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
      }
    }
  });
}

// Sistema Unificado de IA com Contexto e SVG

/**
 * Inicia nova sessão de chat unificado
 */
async function iniciarChatUnificado() {
  try {
    const response = await fetch('/api/chat/iniciar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ unidade: state.adminFilterUnit || 'all' })
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      chatSession = data.session;
      currentContext = data.dados;
      state.ultimaAnalise = null;
      
      // Mostrar modal com chat em segundo plano
      showAnalysisModal();
      updateAnalysisModal({ 
        isLoading: false, 
        analysis: null 
      });
      
      // Iniciar chat automaticamente com análise completa
      setTimeout(() => {
        toggleChat();
        // Gerar análise automática com SVG
        enviarMensagemUnificadaAnalise();
      }, 100);
      
      return { success: true, session: data.session, dados: data.dados };
    } else {
      throw new Error(data.erro || 'Erro ao iniciar chat');
    }
    
  } catch (error) {
    console.error('Erro ao iniciar chat:', error);
    throw error;
  }
}

/**
 * Envia mensagem para análise automática com SVG
 */
async function enviarMensagemUnificadaAnalise() {
  try {
    addMessageToChat('user', 'Por favor, faça uma análise completa da pesquisa de clima organizacional com gráficos visuais.');
    
    const dadosParaAPI = {
      mensagem: 'Faça uma análise completa da pesquisa de clima organizacional. Inclua: resumo executivo, diagnóstico geral, pontos fortes, pontos de atenção, análise por dimensão, leitura estratégica e recomendação de ações. Gere também um gráfico SVG可视化 de barras mostrando a favorabilidade por pilar.',
      gerarSVG: true,
      tipoAnalise: 'completa',
      incluirContexto: true
    };
    
    const response = await fetch('/api/chat/enviar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosParaAPI)
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      addMessageToChat('assistant', data.resposta);
      
      if (data.temSVG && data.codigoSVG) {
        addSVGMensagem(data.codigoSVG);
      }
      
    } else {
      throw new Error(data.erro || 'Erro desconhecido');
    }
    
  } catch (error) {
    console.error('Erro ao gerar análise:', error);
    addMessageToChat('system', `❌ Erro: ${error.message}`);
  }
}

/**
 * Envia mensagem para chat unificado
 */
async function enviarMensagemUnificada() {
  const input = document.getElementById('chatInput');
  const pergunta = input?.value?.trim();
  
  if (!pergunta) return;
  
  try {
    // Adicionar mensagem do usuário ao chat
    addMessageToChat('user', pergunta);
    input.value = '';
    
    // Preparar dados para API
    const dadosParaAPI = {
      mensagem: pergunta,
      gerarSVG: false,
      tipoAnalise: 'completa',
      incluirContexto: true
    };
    
    // Chamar API
    const response = await fetch('/api/chat/enviar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosParaAPI)
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      // Adicionar resposta ao chat
      addMessageToChat('assistant', data.resposta);
      
      // Se tiver SVG, exibir
      if (data.temSVG && data.codigoSVG) {
        addMessageToChat('system', `📊 Análise visual gerada com sucesso!`);
      }
      
    } else {
      throw new Error(data.erro || 'Erro desconhecido');
    }
    
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    addMessageToChat('system', `❌ Erro: ${error.message}`);
  }
}

/**
 * Gera análise visual em SVG
 */
async function gerarAnaliseVisualUnificada() {
  try {
    addMessageToChat('system', '🔄 Gerando análise visual em SVG...');
    
    const response = await fetch('/api/chat/analise-visual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        unidade: state.adminFilterUnit || 'all',
        tipo: 'completa'
      })
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      // Adicionar análise ao chat
      addMessageToChat('assistant', data.analise);
      
      // Se tiver SVG, exibir
      if (data.analiseProcessada?.hasSVG && data.analiseProcessada?.svgCode) {
        const svgContainer = document.createElement('div');
        svgContainer.className = 'message-svg';
        svgContainer.innerHTML = `
          <div class="svg-container">
            ${data.analiseProcessada.svgCode}
          </div>
          <div class="message-actions">
            <button onclick="window.baixarSVG('${encodeURIComponent(data.analiseProcessada.svgCode)}')" class="btn btn-outline btn-xs">
              ${icons.download} Baixar SVG
            </button>
            <button onclick="window.copiarSVG('${encodeURIComponent(data.analiseProcessada.svgCode)}')" class="btn btn-outline btn-xs">
              ${icons.clipboard} Copiar SVG
            </button>
          </div>
        `;
        
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
          messagesContainer.appendChild(svgContainer);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }
      
    } else {
      throw new Error(data.erro || 'Erro ao gerar análise visual');
    }
    
  } catch (error) {
    console.error('Erro ao gerar análise visual:', error);
    addMessageToChat('system', `❌ Erro: ${error.message}`);
  }
}

/**
 * Limpa contexto do chat
 */
async function limparContextoUnificado() {
  try {
    const response = await fetch('/api/chat/contexto', {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      chatSession = null;
      currentContext = null;
      
      addMessageToChat('system', '🔄 Contexto limpo com sucesso.');
      
    } else {
      throw new Error(data.erro || 'Erro ao limpar contexto');
    }
    
  } catch (error) {
    console.error('Erro ao limpar contexto:', error);
    addMessageToChat('system', `❌ Erro: ${error.message}`);
  }
}

/**
 * Gera relatório completo em background com experiência natural de chat e animações do robô
 */
async function gerarRelatorioCompleto(buttonElement) {
  try {
    // Evitar cliques múltiplos - desabilitar botão temporariamente
    if (buttonElement) {
      buttonElement.disabled = true;
      buttonElement.textContent = 'Gerando...';
      buttonElement.style.opacity = '0.6';
    }
    
    // Abrir widget se estiver fechado
    const widget = document.getElementById('nitaiChatWidget');
    const floatButton = document.getElementById('nitaiFloatButton');
    
    if (widget && widget.classList.contains('hidden')) {
      widget.classList.remove('hidden');
      widget.classList.add('visible');
      floatButton.classList.add('active');
      
      // Focar no input
      const input = document.getElementById('widgetChatInput');
      if (input) {
        setTimeout(() => input.focus(), 300);
      }
    }
    
    // Adicionar mensagem natural como se fosse uma conversa
    addMessageToChat('user', 'Por favor, gere um relatório completo da pesquisa de clima organizacional.');
    
    // Adicionar resposta da Nitai com robô pensando
    const loadingMessageId = 'loading-relatorio-' + Date.now();
    const progressId = 'progress-' + Date.now();
    
    addMessageToChat('assistant', `
      <div id="${loadingMessageId}" class="chat-loading-message">
        <div class="robot-container">
          <div class="robot-thinking">
            <div class="robot-head">
              <div class="robot-eyes">
                <div class="robot-eye"></div>
                <div class="robot-eye"></div>
              </div>
              <div class="robot-mouth"></div>
            </div>
            <div class="thought-bubble"></div>
          </div>
        </div>
        <div class="loading-header">
          <h4>Estou pensando... analisando a pesquisa de clima completa! </h4>
        </div>
        <div class="progress-container">
          <div class="progress-bar">
            <div id="${progressId}" class="progress-fill" style="width: 0%"></div>
          </div>
          <div class="progress-text">
            <span id="${progressId}-percent">0%</span> - <span id="${progressId}-status">Reunindo informações...</span>
          </div>
        </div>
        <p class="loading-subtitle">Deixe eu processar tudo com cuidado para te dar o melhor relatório! </p>
      </div>
    `);
    
    // Simular progresso animado
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 12; // Incremento mais suave
      
      if (progress >= 90) {
        progress = 90; // Fica em 90% até terminar
        clearInterval(progressInterval);
      }
      
      const progressElement = document.getElementById(progressId);
      const percentElement = document.getElementById(progressId + '-percent');
      const statusElement = document.getElementById(progressId + '-status');
      
      if (progressElement) progressElement.style.width = progress + '%';
      if (percentElement) percentElement.textContent = Math.round(progress) + '%';
      
      // Status dinâmico baseado no progresso
      if (statusElement) {
        if (progress < 20) {
          statusElement.textContent = 'Coletando todas as respostas...';
        } else if (progress < 40) {
          statusElement.textContent = 'Analisando comentários e sentimentos...';
        } else if (progress < 60) {
          statusElement.textContent = 'Gerando insights com minha IA especializada...';
        } else if (progress < 80) {
          statusElement.textContent = 'Estruturando o relatório estratégico...';
        } else {
          statusElement.textContent = 'Finalizando os detalhes finais...';
        }
      }
    }, 600); // Intervalo mais natural
    
    const response = await fetch('/api/clima/relatorio/landing-page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unidade: state.adminFilterUnit || 'all' })
    });
    
    const data = await response.json();
    
    // Completar progresso para 100%
    clearInterval(progressInterval);
    
    const progressElement = document.getElementById(progressId);
    const percentElement = document.getElementById(progressId + '-percent');
    const statusElement = document.getElementById(progressId + '-status');
    
    if (progressElement) progressElement.style.width = '100%';
    if (percentElement) percentElement.textContent = '100%';
    if (statusElement) statusElement.textContent = 'Finalizando os últimos detalhes...';
    
    // Pequena pausa para mostrar 100%
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mostrar robô feliz antes de entregar o resultado
    const loadingElement = document.getElementById(loadingMessageId);
    if (loadingElement) {
      loadingElement.innerHTML = `
        <div class="robot-container">
          <div class="robot-happy">
            <div class="robot-head">
              <div class="robot-eyes">
                <div class="robot-eye"></div>
                <div class="robot-eye"></div>
              </div>
              <div class="robot-mouth"></div>
              <div class="sparkle"></div>
              <div class="sparkle"></div>
              <div class="sparkle"></div>
            </div>
          </div>
        </div>
        <div class="loading-header">
          <h4>Prontinho! Consegui gerar seu relatório completo! </h4>
        </div>
        <p class="loading-subtitle">Aqui está tudo que você precisa saber sobre o clima da sua empresa! </p>
      `;
      
      // Pequena pausa para mostrar robô feliz
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Remover mensagem de loading
    if (loadingElement) {
      loadingElement.remove();
    }
    
    if (data.sucesso) {
      // Salvar dados do relatório para download
      state.relatorioData = data.dados;
      state.relatorioId = data.relatorio_id;
      state.relatorioUrl = data.url_acesso;
      
      // Adicionar resposta final da Nitai com card compacto e link para landing page
      addMessageToChat('assistant', `
        <div class="relatorio-card-compact">
          <div class="relatorio-card-compact-header">
            <div class="relatorio-card-compact-title">
              ${icons.fileText}
              <span>Relatório Completo de Clima Organizacional</span>
            </div>
            <div class="relatorio-card-compact-status">
              ${icons.checkCircle} Relatório gerado com sucesso!
            </div>
          </div>
          <div class="relatorio-card-compact-description">
            Seu relatório interativo está pronto! Experimente nossa nova landing page com visualizações impressionantes e navegação fluida.
          </div>
          <div class="relatorio-card-compact-actions">
            <button onclick="window.abrirRelatorioLanding()" class="btn btn-purple btn-sm">
              ${icons.maxus} Abrir Relatório Interativo
            </button>
            <button onclick="window.baixarRelatorio()" class="btn btn-success btn-sm">
              ${icons.download} Baixar agora
            </button>
          </div>
        </div>
      `);
      
    } else {
      addMessageToChat('system', `Ops! Encontrei um erro ao gerar o relatório: ${data.erro || 'Erro desconhecido'}`);
    }
    
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    addMessageToChat('system', `Ops! Ocorreu um erro inesperado: ${error.message}`);
  } finally {
    // Restaurar botão independentemente do resultado
    if (buttonElement) {
      buttonElement.disabled = false;
      buttonElement.textContent = 'Gerar Relatório Completo';
      buttonElement.style.opacity = '1';
    }
  }
}

/**
 * Inicia análise com analista de RH especializado
 */
async function iniciarAnaliseComAnalista() {
  try {
    showAnalysisModal();
    updateAnalysisModal({ isLoading: true });
    await iniciarChatUnificado();
  } catch (error) {
    console.error('Erro ao iniciar análise com analista:', error);
    updateAnalysisModal({ 
      isLoading: false,
      analysis: `<div class="error-message">
        <h3>❌ Erro ao iniciar análise</h3>
        <p>${error.message}</p>
        <p>Tente novamente em alguns instantes.</p>
      </div>`
    });
  }
}

/**
 * Gera análise tradicional (mantida para compatibilidade)
 */
async function gerarAnaliseInteligente(tipo = 'completa') {
  try {
    // Mostrar modal com loading
    showAnalysisModal();
    updateAnalysisModal({ isLoading: true });
    
    // Preparar dados para enviar
    const dadosParaAPI = {
      tipo,
      unidade: state.adminFilterUnit || 'all'
    };
    
    // Chamar API
    const response = await fetch('/api/clima/analise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosParaAPI)
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      updateAnalysisModal({ 
        isLoading: false, 
        analysis: data.analise 
      });
      state.ultimaAnalise = data.analise;
    } else {
      throw new Error(data.erro || 'Erro desconhecido');
    }
    
  } catch (error) {
    console.error('Erro ao gerar análise:', error);
    updateAnalysisModal({ 
      isLoading: false,
      analysis: `<div class="error-message">
        <h3>❌ Erro ao gerar análise</h3>
        <p>${error.message}</p>
        <p>Verifique as configurações da API e tente novamente.</p>
      </div>`
    });
  }
}

async function iniciarChatClima() {
  const chatSection = document.getElementById('chatSection');
  if (chatSection) {
    chatSection.style.display = chatSection.style.display === 'none' ? 'block' : 'none';
    
    if (chatSection.style.display === 'block') {
      document.getElementById('chatInput')?.focus();
    }
  }
}

function fecharChat() {
  const chatSection = document.getElementById('chatSection');
  if (chatSection) {
    chatSection.style.display = 'none';
  }
}

async function enviarMensagemChat() {
  const input = document.getElementById('chatInput');
  const pergunta = input?.value?.trim();
  
  if (!pergunta) return;
  
  try {
    // Adicionar mensagem do usuário ao chat
    adicionarMensagemChat('user', pergunta);
    input.value = '';
    
    // Preparar dados para API
    const dadosParaAPI = {
      mensagem: pergunta,
      incluirContexto: true,
      gerarSVG: false
    };
    
    // Chamar API
    const response = await fetch('/api/chat/enviar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosParaAPI)
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      // Adicionar resposta ao histórico e ao chat
      chatHistory.push({ role: 'user', content: pergunta });
      chatHistory.push({ role: 'assistant', content: data.resposta });
      
      adicionarMensagemChat('assistant', data.resposta);
      
    } else {
      throw new Error(data.erro || 'Erro desconhecido');
    }
    
  } catch (error) {
    console.error('Erro no chat:', error);
    adicionarMensagemChat('system', `❌ Erro: ${error.message}`);
  }
}

function adicionarMensagemChat(tipo, mensagem) {
  const messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${tipo}`;
  
  const roleText = tipo === 'user' ? 'Você' : 
                    tipo === 'assistant' ? 'Analista IA' : 'Sistema';
  
  messageDiv.innerHTML = `<strong>${roleText}:</strong> ${mensagem}`;
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleChatKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    enviarMensagemChat();
  }
}

function copiarAnalise() {
  if (state.ultimaAnalise) {
    navigator.clipboard.writeText(state.ultimaAnalise).then(() => {
      // Mostrar feedback visual
      const btn = event.target;
      const originalText = btn.innerHTML;
      btn.innerHTML = `${icons.check} Copiado!`;
      btn.classList.add('btn-success');
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('btn-success');
      }, 2000);
    }).catch(err => {
      console.error('Erro ao copiar:', err);
    });
  }
}

function baixarAnalisePDF() {
  if (!state.ultimaAnalise) return;
  
  // Criar conteúdo HTML para PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Análise de Clima Organizacional</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        h2 { color: #374151; margin-top: 30px; }
        h3 { color: #4b5563; margin-top: 25px; }
        ul, ol { margin: 15px 0; }
        li { margin: 8px 0; }
        strong { color: #1f2937; }
        .header { text-align: center; margin-bottom: 40px; }
        .footer { margin-top: 50px; text-align: center; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Análise de Clima Organizacional</h1>
        <h2>Nordeste Locações</h2>
        <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
      </div>
      
      <div class="content">
        ${state.ultimaAnalise.replace(/\n/g, '<br>')}
      </div>
      
      <div class="footer">
        <p>Relatório gerado automaticamente pelo Sistema de Análise de Clima</p>
      </div>
    </body>
    </html>
  `;
  
  // Criar blob e baixar
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analise-clima-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toggleChat() {
  const chatSection = document.getElementById('chatSection');
  if (chatSection) {
    chatSection.style.display = chatSection.style.display === 'none' ? 'block' : 'none';
    
    if (chatSection.style.display === 'block') {
      document.getElementById('chatInput')?.focus();
    }
  }
}

function fecharModalAnalise(event) {
  if (!event || event.target === event.currentTarget) {
    hideAnalysisModal();
  }
}

function incluirContexto() {
  const input = document.getElementById('chatInput');
  if (!input || !currentContext) return;
  
  const contextText = `
Contexto da Pesquisa:
- Total de Respostas: ${currentContext.dados_gerais?.total_respostas || 0}
- Favorabilidade Global: ${currentContext.dados_gerais?.favorabilidade_global || 0}%
- Data: ${currentContext.dados_gerais?.data_analise || 'N/A'}

Dimensões:
${currentContext.dimensoes?.map(d => `- ${d.nome}: ${d.favorabilidade}%`).join('\n') || ''}

Top Piores:
${currentContext.piores_perguntas?.slice(0, 3).map(p => `- Q${p.pergunta_id}: ${p.favorabilidade}%`).join('\n') || ''}

Top Melhores:
${currentContext.melhores_perguntas?.slice(0, 3).map(p => `- Q${p.pergunta_id}: ${p.favorabilidade}%`).join('\n') || ''}
`;
  
  input.value = contextText;
  input.focus();
}

function gerarSVGResposta() {
  const input = document.getElementById('chatInput');
  const analysisType = document.getElementById('analysisType')?.value || 'completa';
  
  if (!input || !input.value.trim()) {
    alert('Digite uma mensagem antes de gerar SVG.');
    return;
  }
  
  enviarMensagemUnificada();
}

function gerarAnaliseVisual() {
  gerarAnaliseVisualUnificada();
}

function limparContexto() {
  limparContextoUnificado();
}

/**
 * Toggle para abrir/fechar chat flutuante Nitai
 */
function toggleNitaiChat() {
  const widget = document.getElementById('nitaiChatWidget');
  const floatButton = document.getElementById('nitaiFloatButton');
  
  if (!widget || !floatButton) return;
  
  if (widget.classList.contains('hidden')) {
    widget.classList.remove('hidden');
    widget.classList.add('visible');
    floatButton.classList.add('active');
    
    // Inicializar contexto e resize na primeira abertura
    setTimeout(async () => {
      try {
        // Inicializar contexto completo com dados da pesquisa
        await inicializarContextoChat();
        
        // Inicializar resize
        initWidgetResize();
        
        // Focar no input
        const input = document.getElementById('widgetChatInput');
        if (input) {
          input.focus();
        }
      } catch (error) {
        console.error('Erro ao inicializar chat:', error);
        // Mesmo com erro, inicializar resize e focar
        initWidgetResize();
        const input = document.getElementById('widgetChatInput');
        if (input) {
          input.focus();
        }
      }
    }, 300);
  } else {
    widget.classList.remove('visible');
    widget.classList.add('hidden');
    floatButton.classList.remove('active');
  }
}

/**
 * Inicializa contexto do chat com dados completos da pesquisa
 */
async function inicializarContextoChat() {
  try {
    const response = await fetch('/api/chat/inicializar-contexto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      console.log('Contexto do chat inicializado:', data.contexto);
      
      // Adicionar mensagem de boas-vindas informando que o contexto está carregado
      const messagesContainer = document.getElementById('widgetChatMessages');
      if (messagesContainer && !messagesContainer.querySelector('.context-loaded-message')) {
        const dashboard = data.contexto?.dashboardCompleto;
        const contextMessage = document.createElement('div');
        contextMessage.className = 'chat-message assistant context-loaded-message';
        contextMessage.innerHTML = `
          <div class="message-header">
            <strong>Nitai</strong>
            <span class="message-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div class="message-content">
            <div class="context-indicator">
              <span class="indicator-box indicator-high">Dashboard Completo</span>
              <span class="indicator-box indicator-medium">${dashboard?.estatisticas_gerais?.total_respostas || 0} Respostas</span>
              <span class="indicator-box indicator-medium">${dashboard?.estatisticas_gerais?.taxa_favorabilidade?.toFixed(1) || 0}% Favorabilidade</span>
              <span class="indicator-box indicator-medium">${dashboard?.estatisticas_gerais?.total_dimensoes || 0} Dimensões</span>
            </div>
            
            <div class="dashboard-summary">
              <h4>ANÁLISE COMPLETA DISPONÍVEL</h4>
              <div class="summary-grid">
                <div class="summary-item">
                  <strong>Favorabilidade Global:</strong> ${dashboard?.estatisticas_gerais?.taxa_favorabilidade?.toFixed(1) || 0}%
                </div>
                <div class="summary-item">
                  <strong>Média Satisfação:</strong> ${dashboard?.estatisticas_gerais?.media_satisfacao || 0}/4.0
                </div>
                <div class="summary-item">
                  <strong>Alertas Críticos:</strong> ${dashboard?.alertas_criticos?.total_alertas || 0}
                </div>
                <div class="summary-item">
                  <strong>Comentários:</strong> ${dashboard?.comentarios_qualitativos?.length || 0}
                </div>
              </div>
              
              <h5>HEATMAP POR PILAR</h5>
              <div class="pillar-heatmap">
                ${dashboard?.heatmap_pilares?.map(p => `
                  <div class="pillar-item ${p.status === 'Ótimo' ? 'optimal' : p.status === 'Atenção' ? 'warning' : 'critical'}">
                    <span class="pillar-name">${p.pilar}</span>
                    <span class="pillar-value">${p.favorabilidade.toFixed(1)}%</span>
                    <span class="pillar-status">${p.status}</span>
                  </div>
                `).join('') || ''}
              </div>
              
              <h5>TOP 5 MELHORES</h5>
              <div class="ranking-list">
                ${dashboard?.rankings?.top_melhores_perguntas?.map((p, i) => `
                  <div class="ranking-item">
                    <span class="ranking-position">${i+1}.</span>
                    <span class="ranking-value">${p.favorabilidade.toFixed(1)}%</span>
                    <span class="ranking-pillar">${p.pilar}</span>
                  </div>
                `).join('') || ''}
              </div>
              
              <h5>TOP 5 PIORES</h5>
              <div class="ranking-list">
                ${dashboard?.rankings?.top_piores_perguntas?.map((p, i) => `
                  <div class="ranking-item">
                    <span class="ranking-position">${i+1}.</span>
                    <span class="ranking-value">${p.favorabilidade.toFixed(1)}%</span>
                    <span class="ranking-pillar">${p.pilar}</span>
                  </div>
                `).join('') || ''}
              </div>
            </div>
            
            <p>Olá! Sou a Nitai, sua assistente de Clima Organizacional. Tenho acesso completo a TODOS os dados do dashboard incluindo estatísticas, heatmaps, rankings e comentários qualitativos.</p>
            <p>Posso analisar qualquer aspecto do clima organizacional, gerar insights estratégicos, recomendações acionáveis e relatórios completos baseados nos dados completos.</p>
            <p><strong>Dados carregados e prontos para análise completa. Como posso ajudar você hoje?</strong></p>
          </div>
        `;
        
        // Inserir antes da mensagem de boas-vindas
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
          messagesContainer.insertBefore(contextMessage, welcomeMessage);
        } else {
          messagesContainer.appendChild(contextMessage);
        }
      }
      
      return true;
    } else {
      console.error('Erro ao inicializar contexto:', data.erro);
      return false;
    }
  } catch (error) {
    console.error('Erro ao inicializar contexto do chat:', error);
    return false;
  }
}

/**
 * Envia mensagem do widget flutuante
 */
async function enviarWidgetMessage() {
  const input = document.getElementById('widgetChatInput');
  const pergunta = input?.value?.trim();
  
  if (!pergunta) return;
  
  try {
    // Adicionar mensagem do usuário ao chat
    addMessageToChat('user', pergunta);
    input.value = '';
    
    // Adicionar mensagem de loading com progresso rápido
    const loadingMessageId = 'loading-chat-' + Date.now();
    const progressId = 'progress-chat-' + Date.now();
    
    addMessageToChat('assistant', `
      <div id="${loadingMessageId}" class="chat-loading-message">
        <div class="loading-header">
          <div class="loading-spinner"></div>
          <h4>Nitai está pensando...</h4>
        </div>
        <div class="progress-container">
          <div class="progress-bar">
            <div id="${progressId}" class="progress-fill" style="width: 0%"></div>
          </div>
          <div class="progress-text">
            <span id="${progressId}-percent">0%</span> - <span id="${progressId}-status">Analisando sua pergunta...</span>
          </div>
        </div>
      </div>
    `);
    
    // Simular progresso rápido para conversas
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 25; // Progresso mais rápido para conversas
      
      if (progress >= 85) {
        progress = 85; // Fica em 85% até terminar
        clearInterval(progressInterval);
      }
      
      const progressElement = document.getElementById(progressId);
      const percentElement = document.getElementById(progressId + '-percent');
      const statusElement = document.getElementById(progressId + '-status');
      
      if (progressElement) progressElement.style.width = progress + '%';
      if (percentElement) percentElement.textContent = Math.round(progress) + '%';
      
      // Status dinâmico para conversas
      if (statusElement) {
        if (progress < 30) {
          statusElement.textContent = 'Analisando sua pergunta...';
        } else if (progress < 60) {
          statusElement.textContent = 'Consultando dados da pesquisa...';
        } else {
          statusElement.textContent = 'Gerando resposta...';
        }
      }
    }, 300); // Intervalo mais rápido para conversas
    
    // Preparar dados para API
    const dadosParaAPI = {
      mensagem: pergunta,
      incluirContexto: true,
      gerarSVG: false
    };
    
    // Chamar API
    const response = await fetch('/api/chat/enviar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosParaAPI)
    });
    
    const data = await response.json();
    
    // Completar progresso para 100%
    clearInterval(progressInterval);
    
    const progressElement = document.getElementById(progressId);
    const percentElement = document.getElementById(progressId + '-percent');
    const statusElement = document.getElementById(progressId + '-status');
    
    if (progressElement) progressElement.style.width = '100%';
    if (percentElement) percentElement.textContent = '100%';
    if (statusElement) statusElement.textContent = 'Pronto!';
    
    // Pequena pausa para mostrar 100%
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Remover mensagem de loading
    const loadingElement = document.getElementById(loadingMessageId);
    if (loadingElement) {
      loadingElement.remove();
    }
    
    if (data.sucesso) {
      addMessageToChat('assistant', data.resposta);
      
      if (data.temSVG && data.codigoSVG) {
        addSVGMensagem(data.codigoSVG);
      }
      
    } else {
      throw new Error(data.erro || 'Erro desconhecido');
    }
    
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    addMessageToChat('system', `❌ Erro: ${error.message}`);
  }
}

/**
 * Adiciona mensagem ao chat do widget flutuante
 * @param {string} role - 'user' | 'assistant' | 'system'
 * @param {string} content - Conteúdo da mensagem
 */
function addMessageToChat(role, content) {
  const messagesContainer = document.getElementById('widgetChatMessages');
  if (!messagesContainer) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${role}`;
  messageDiv.innerHTML = `
    <div class="message-header">
      <strong>${role === 'user' ? 'Você' : role === 'assistant' ? 'Nitai' : 'Sistema'}</strong>
      <span class="message-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div class="message-content">
      ${content}
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Handle keypress no widget
 */
function handleWidgetChatKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    enviarWidgetMessage();
  }
}

/**
 * Inicializa funcionalidade de redimensionamento do widget em todos os cantos e movimento vertical
 */
function initWidgetResize() {
  const widget = document.getElementById('nitaiChatWidget');
  const resizeHandleBottomRight = document.getElementById('widgetResizeHandle');
  const resizeHandleTopLeft = document.getElementById('widgetResizeHandleTopLeft');
  const resizeHandleBottomLeft = document.getElementById('widgetResizeHandleBottomLeft');
  const resizeHandleTop = document.getElementById('widgetResizeHandleTop');
  
  if (!widget) return;
  
  // Fixar posição inicial do widget
  widget.style.top = '180px';
  widget.style.bottom = '120px';
  widget.style.right = '20px';
  
  let isResizing = false;
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;
  let startLeft = 0;
  let startTop = 0;
  let resizeType = '';
  
  // Função para iniciar redimensionamento
  function startResize(e, type) {
    isResizing = true;
    resizeType = type;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(window.getComputedStyle(widget).width, 10);
    startHeight = parseInt(window.getComputedStyle(widget).height, 10);
    startLeft = widget.offsetLeft;
    startTop = widget.offsetTop;
    
    widget.classList.add('resizing');
    
    // Definir cursor baseado no tipo de resize
    let cursor = 'nwse-resize';
    switch(type) {
      case 'bottom-right':
        cursor = 'nwse-resize';
        break;
      case 'top-left':
        cursor = 'nwse-resize';
        break;
      case 'bottom-left':
        cursor = 'nesw-resize';
        break;
      case 'top':
        cursor = 'ns-resize';
        break;
    }
    
    document.body.style.cursor = cursor;
    document.body.style.userSelect = 'none';
    
    e.preventDefault();
  }
  
  // Event listeners para cada handle
  if (resizeHandleBottomRight) {
    resizeHandleBottomRight.addEventListener('mousedown', (e) => startResize(e, 'bottom-right'));
  }
  
  if (resizeHandleTopLeft) {
    resizeHandleTopLeft.addEventListener('mousedown', (e) => startResize(e, 'top-left'));
  }
  
  if (resizeHandleBottomLeft) {
    resizeHandleBottomLeft.addEventListener('mousedown', (e) => startResize(e, 'bottom-left'));
  }
  
  if (resizeHandleTop) {
    resizeHandleTop.addEventListener('mousedown', (e) => startResize(e, 'top'));
  }
  
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    // Limites mínimos e máximos
    const minWidth = 350;
    const minHeight = 400;
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;
    
    switch(resizeType) {
      case 'bottom-right':
        newWidth = startWidth + deltaX;
        newHeight = startHeight + deltaY;
        break;
      case 'top-left':
        newWidth = startWidth - deltaX;
        newHeight = startHeight - deltaY;
        newLeft = startLeft + deltaX;
        newTop = startTop + deltaY;
        break;
      case 'bottom-left':
        newWidth = startWidth - deltaX;
        newHeight = startHeight + deltaY;
        newLeft = startLeft + deltaX;
        break;
      case 'top':
        // Apenas movimento vertical, mantém largura e posição horizontal
        newHeight = startHeight - deltaY;
        newTop = startTop + deltaY;
        break;
    }
    
    // Aplicar limites
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      widget.style.width = newWidth + 'px';
    }
    
    if (newHeight >= minHeight && newHeight <= maxHeight) {
      widget.style.height = newHeight + 'px';
    }
    
    // Ajustar posição para resize do lado esquerdo
    if (resizeType === 'top-left' || resizeType === 'bottom-left') {
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        widget.style.left = newLeft + 'px';
      }
    }
    
    // Ajustar posição para resize do topo
    if (resizeType === 'top-left' || resizeType === 'top') {
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        widget.style.top = newTop + 'px';
      }
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      resizeType = '';
      widget.classList.remove('resizing');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Salvar tamanho preferido no localStorage
      const widgetWidth = widget.style.width;
      const widgetHeight = widget.style.height;
      const widgetLeft = widget.style.left;
      const widgetTop = widget.style.top;
      
      localStorage.setItem('widgetSize', JSON.stringify({ 
        width: widgetWidth, 
        height: widgetHeight,
        left: widgetLeft,
        top: widgetTop
      }));
    }
  });
  
  // Restaurar tamanho salvo (mas manter posicionamento fixo)
  const savedSize = localStorage.getItem('widgetSize');
  if (savedSize) {
    try {
      const { width, height } = JSON.parse(savedSize);
      if (width) widget.style.width = width;
      if (height) widget.style.height = height;
      
      // Manter posicionamento fixo correto
      widget.style.top = '180px';
      widget.style.bottom = '120px';
      widget.style.right = '20px';
      widget.style.left = 'auto';
    } catch (e) {
      console.error('Erro ao restaurar tamanho do widget:', e);
    }
  }
}

/**
 * Expande relatório em tela cheia separada
 */
function expandirRelatorio() {
  if (state.relatorioData) {
    // Criar elemento de tela cheia
    const fullscreenDiv = document.createElement('div');
    fullscreenDiv.className = 'relatorio-fullscreen';
    fullscreenDiv.innerHTML = `
      <div class="relatorio-fullscreen-header">
        <div class="relatorio-fullscreen-title">
          ${icons.fileText}
          <span>Relatório Completo de Clima Organizacional</span>
        </div>
        <div class="relatorio-fullscreen-actions">
          <button onclick="window.baixarRelatorio()" class="btn btn-success">
            ${icons.download} Baixar
          </button>
          <button onclick="window.fecharRelatorio()" class="relatorio-fullscreen-close">
            ${icons.x} Fechar
          </button>
        </div>
      </div>
      <div class="relatorio-fullscreen-content">
        <div class="relatorio-card-content">
          ${state.relatorioData}
        </div>
      </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(fullscreenDiv);
    
    // Adicionar animação de entrada
    setTimeout(() => {
      fullscreenDiv.style.opacity = '1';
    }, 10);
  }
}

/**
 * Fecha a tela cheia do relatório
 */
function fecharRelatorio() {
  const fullscreenDiv = document.querySelector('.relatorio-fullscreen');
  if (fullscreenDiv) {
    fullscreenDiv.style.opacity = '0';
    setTimeout(() => {
      fullscreenDiv.remove();
    }, 300);
  }
}

/**
 * Formata o conteúdo do relatório com estilos aprimorados
 */
function formatarConteudoRelatorio(conteudo) {
  if (!conteudo) return conteudo;
  
  let formatado = conteudo;
  
  // Adicionar classes para seções especiais baseadas nos títulos
  formatado = formatado.replace(
    /##\s+.*RESUMO.*EXECUTIVO/gi, 
    '<div class="resumo-executivo secao-destaque">\n## RESUMO EXECUTIVO'
  );
  
  formatado = formatado.replace(
    /##\s+.*DIAGNÓSTICO.*GERAL/gi, 
    '<div class="diagnostico-geral secao-destaque">\n## DIAGNÓSTICO GERAL'
  );
  
  formatado = formatado.replace(
    /##\s+.*PROBLEMAS.*CRÍTICOS/gi, 
    '<div class="problemas-criticos secao-critica">\n## TOP 3 PROBLEMAS CRÍTICOS'
  );
  
  formatado = formatado.replace(
    /##\s+.*PONTOS.*FORTES/gi, 
    '<div class="pontos-fortes secao-positiva">\n## TOP 3 PONTOS FORTES'
  );
  
  formatado = formatado.replace(
    /##\s+.*RISCOS.*ORGANIZACIONAIS/gi, 
    '<div class="riscos secao-aviso">\n## RISCOS ORGANIZACIONAIS'
  );
  
  formatado = formatado.replace(
    /##\s+.*PLANO.*AÇÃO.*RECOMENDADO/gi, 
    '<div class="plano-acao secao-acao">\n## PLANO DE AÇÃO RECOMENDADO'
  );

  // Seções adicionais
  formatado = formatado.replace(
    /##\s+.*INSIGHTS.*ADICIONAIS/gi, 
    '<div class="insights-adicionais secao-info">\n## 💡 INSIGHTS ADICIONAIS'
  );

  formatado = formatado.replace(
    /##\s+.*CONCLUSÃO.*|##\s+.*VISÃO.*FUTURO/gi, 
    '<div class="conclusao-visao secao-destaque">\n## 📈 CONCLUSÃO & VISÃO DE FUTURO'
  );

  formatado = formatado.replace(
    /##\s+.*REFERÊNCIAS|##\s+.*PESQUISAS.*ACADÊMICAS/gi, 
    '<div class="referencias secao-info">\n## 📚 PESQUISAS E REFERÊNCIAS ACADÊMICAS'
  );
  
  // Melhorar tabelas com classes
  formatado = formatado.replace(
    /<table>/gi, 
    '<table class="tabela-relatorio tabela-estilizada">'
  );

  // wrap tabular cells in special styling
  formatado = formatado.replace(
    /<th>/gi,
    '<th class="th-estilizado">'
  );

  formatado = formatado.replace(
    /<td>/gi,
    '<td class="td-estilizado">'
  );
  
  // Adicionar badges para métricas importantes
  formatado = formatado.replace(
    /(\d+%)\s*(de\s*favorabilidade)/gi, 
    '<span class="badge badge-success">$1</span> $2'
  );

  formatado = formatado.replace(
    /Favorabilidade.*?(\d+%)/gi,
    '<span class="metric-destaque">$1</span>'
  );
  
  formatado = formatado.replace(
    /(\d+,\d+)\s*(média)/gi, 
    '<span class="metrica positiva">$1</span> $2'
  );
  
  formatado = formatado.replace(
    /(\d+)\s*(respost?as?)/gi, 
    '<span class="badge badge-info">$1</span> $2'
  );

  // Adicionar badges para problemas (números)
  formatado = formatado.replace(
    /\|\s*1\s*\|/g,
    '| <span class="numero-destaque numero-1">1</span> |'
  );

  formatado = formatado.replace(
    /\|\s*2\s*\|/g,
    '| <span class="numero-destaque numero-2">2</span> |'
  );

  formatado = formatado.replace(
    /\|\s*3\s*\|/g,
    '| <span class="numero-destaque numero-3">3</span> |'
  );

  // Melhorar listas com ícones
  formatado = formatado.replace(
    /<ul>/gi, 
    '<ul class="lista-acao lista-melhorada">'
  );

  // Adicionar classes aos itens de lista
  formatado = formatado.replace(
    /<li>/gi,
    '<li class="item-acao">'
  );

  // Wrap linhas de tabela em classes
  formatado = formatado.replace(
    /<tr>/gi,
    '<tr class="linha-tabela">'
  );
  
  // Adicionar separadores visuais antes de seções principais
  formatado = formatado.replace(
    /---\n/gi, 
    '</div>\n<div class="separador-forte"></div>\n'
  );

  // Adicionar separador entre seções
  formatado = formatado.replace(
    /##\s+#\s+/gi,
    '</div>\n<div class="separador-secao"></div>\n<div class="secao-adicional">\n## '
  );
  
  // Fechar divs que foram abertas
  const secoes = ['resumo-executivo', 'diagnostico-geral', 'problemas-criticos', 'pontos-fortes', 'riscos', 'plano-acao', 'insights-adicionais', 'conclusao-visao', 'referencias'];
  secoes.forEach(secao => {
    const regex = new RegExp(`(##\\s+(?!.*${secao}).*|<div class="separador-forte">|<div class="separador-secao">|$)`, 'gi');
    formatado = formatado.replace(regex, (match) => {
      if (match.includes('##') || match.includes('separador-forte') || match.includes('separador-secao') || match === '') {
        return `</div>\n${match}`;
      }
      return match;
    });
  });
  
  // Adicionar div final para fechar última seção
  if (!formatado.endsWith('</div>')) {
    formatado += '</div>';
  }
  
  return formatado;
}

/**
 * Abre relatório em landing page interativa
 */
function abrirRelatorioLanding() {
  if (state.relatorioUrl) {
    // Abrir em nova aba
    window.open(state.relatorioUrl, '_blank');
  } else if (state.relatorioId) {
    // Fallback: construir URL manualmente
    const url = `/relatorio/${state.relatorioId}`;
    window.open(url, '_blank');
  }
}

/**
 * Baixa relatório como HTML com estilos e opção de PDF
 */
function baixarRelatorio() {
  if (state.relatorioData) {
    // Criar HTML completo com estilos
    const htmlContent = gerarHTMLRelatorio(state.relatorioData);
    
    // Criar blob HTML
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    // Criar link de download
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-clima-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Tentar abrir em nova janela para impressão/PDF
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Aguardar carregamento e mostrar diálogo de impressão
        printWindow.onload = function() {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      }
    }, 1000);
  }
}

/**
 * Gera HTML completo do relatório com estilos profissionais
 */
function gerarHTMLRelatorio(conteudo) {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Completo de Clima Organizacional</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #374151;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #991b1b 100%);
            color: white;
            padding: 3rem;
            border-radius: 1rem;
            margin-bottom: 2rem;
            box-shadow: 0 20px 40px rgba(220, 38, 38, 0.2);
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            letter-spacing: -0.025em;
        }
        
        .header .meta {
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .content {
            background: white;
            border-radius: 1rem;
            padding: 3rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
        }
        
        h1 {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1.5rem;
            text-align: center;
            border-bottom: 3px solid #dc2626;
            padding-bottom: 0.5rem;
        }
        
        h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
            margin: 2.5rem 0 1.5rem 0;
            padding: 1rem;
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border-left: 4px solid #f59e0b;
            border-radius: 0.5rem;
        }
        
        h3 {
            font-size: 1.3rem;
            font-weight: 600;
            color: #374151;
            margin: 2rem 0 1rem 0;
            padding-left: 1rem;
            border-left: 3px solid #3b82f6;
        }
        
        h4 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #4b5563;
            margin: 1.5rem 0 0.5rem 0;
        }
        
        p {
            margin-bottom: 1rem;
            text-align: justify;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
            background: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        th {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        td {
            padding: 0.8rem 1rem;
            border-bottom: 1px solid #f1f5f9;
            font-size: 0.9rem;
        }
        
        tr:hover td {
            background-color: #f8fafc;
        }
        
        tr:last-child td {
            border-bottom: none;
        }
        
        ul, ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }
        
        li {
            margin-bottom: 0.5rem;
        }
        
        strong {
            color: #1e293b;
            font-weight: 600;
        }
        
        .secao-especial {
            margin: 2rem 0;
            padding: 1.5rem;
            border-radius: 0.5rem;
            border-left: 4px solid;
        }
        
        .resumo-executivo {
            background: linear-gradient(135deg, #fef3c7, #fef9c3);
            border-color: #fbbf24;
        }
        
        .diagnostico-geral {
            background: linear-gradient(135deg, #dbeafe, #eff6ff);
            border-color: #3b82f6;
        }
        
        .problemas-criticos {
            background: linear-gradient(135deg, #fee2e2, #fef2f2);
            border-color: #ef4444;
        }
        
        .pontos-fortes {
            background: linear-gradient(135deg, #dcfce7, #f0fdf4);
            border-color: #10b981;
        }
        
        .riscos {
            background: linear-gradient(135deg, #fed7aa, #ffedd5);
            border-color: #f59e0b;
        }
        
        .plano-acao {
            background: linear-gradient(135deg, #e9d5ff, #f3e8ff);
            border-color: #a855f7;
        }
        
        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.8rem;
            font-weight: 500;
            margin: 0.25rem;
        }
        
        .badge-success {
            background: #10b981;
            color: white;
        }
        
        .badge-warning {
            background: #f59e0b;
            color: white;
        }
        
        .badge-danger {
            background: #ef4444;
            color: white;
        }
        
        .badge-info {
            background: #3b82f6;
            color: white;
        }

        .secao-destaque, .secao-critica, .secao-positiva, .secao-aviso, .secao-acao, .secao-info {
            margin: 2rem 0;
            padding: 2rem;
            border-radius: 1rem;
            position: relative;
        }

        .secao-destaque {
            background: linear-gradient(135deg, #fef3c7, #fef9c3);
            border: 2px solid #fbbf24;
        }

        .secao-critica {
            background: linear-gradient(135deg, #fef2f2, #fee2e2);
            border: 2px solid #ef4444;
        }

        .secao-positiva {
            background: linear-gradient(135deg, #dcfce7, #bbf7d0);
            border: 2px solid #22c55e;
        }

        .secao-aviso {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border: 2px solid #f59e0b;
        }

        .secao-acao {
            background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
            border: 2px solid #6366f1;
        }

        .secao-info {
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            border: 2px solid #0ea5e9;
        }

        .metric-destaque {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 4px 10px;
            border-radius: 20px;
            font-weight: 700;
        }

        .numero-destaque {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            font-weight: 700;
            color: white;
        }

        .numero-1 { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .numero-2 { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .numero-3 { background: linear-gradient(135deg, #3b82f6, #2563eb); }

        .tabela-estilizada {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 1.5rem 0;
            background: white;
            border-radius: 0.75rem;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .tabela-estilizada th {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.8rem;
        }

        .tabela-estilizada td {
            padding: 0.875rem 1rem;
            border-bottom: 1px solid #e5e7eb;
        }

        .lista-melhorada {
            list-style: none;
            padding: 0;
        }

        .item-acao {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            margin-bottom: 0.5rem;
            background: white;
            border-radius: 0.5rem;
            border-left: 3px solid #6366f1;
        }

        .separador-secao {
            height: 2px;
            background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
            margin: 2rem 0;
        }
        
        .footer {
            text-align: center;
            padding: 2rem;
            color: #6b7280;
            font-size: 0.9rem;
        }
        
        @media print {
            body {
                background: white;
            }
            
            .container {
                max-width: none;
                padding: 1rem;
            }
            
            .header {
                background: #dc2626 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .secao-especial {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            th {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Relatório Completo de Clima Organizacional</h1>
            <div class="meta">Gerado em ${dataAtual}</div>
        </div>
        
        <div class="content">
            ${conteudo}
        </div>
        
        <div class="footer">
            <p>Relatório gerado por Nitai - Assistente de Clima Organizacional</p>
            <p>© ${new Date().getFullYear()} Nordeste Locações - Todos os direitos reservados</p>
        </div>
    </div>
</body>
</html>`;
}

// Tornar funções globais
window.gerarAnaliseInteligente = gerarAnaliseInteligente;
window.iniciarChatUnificado = iniciarChatUnificado;
window.enviarMensagemUnificada = enviarMensagemUnificada;
window.gerarAnaliseVisualUnificada = gerarAnaliseVisualUnificada;
window.limparContextoUnificado = limparContextoUnificado;
window.gerarRelatorioCompleto = gerarRelatorioCompleto;
window.iniciarAnaliseComAnalista = iniciarAnaliseComAnalista;
window.toggleChat = toggleChat;
window.fecharModalAnalise = fecharModalAnalise;
window.incluirContexto = incluirContexto;
window.gerarSVGResposta = gerarSVGResposta;
window.gerarAnaliseVisual = gerarAnaliseVisual;
window.limparContexto = limparContexto;
window.addMessageToChat = addMessageToChat;
window.minimizarModal = minimizarModal;
window.restaurarModal = restaurarModal;
window.toggleNitaiChat = toggleNitaiChat;
window.inicializarContextoChat = inicializarContextoChat;
window.enviarWidgetMessage = enviarWidgetMessage;
window.handleWidgetChatKeyPress = handleWidgetChatKeyPress;
window.initWidgetResize = initWidgetResize;
window.expandirRelatorio = expandirRelatorio;
window.baixarRelatorio = baixarRelatorio;
window.fecharRelatorio = fecharRelatorio;
window.abrirRelatorioLanding = abrirRelatorioLanding;
window.formatarConteudoRelatorio = formatarConteudoRelatorio;
window.copiarAnalise = copiarAnalise;
window.baixarAnalisePDF = baixarAnalisePDF;
window.baixarSVG = baixarSVG;
window.copiarSVG = copiarSVG;

/**
 * Renderiza relatório em tela cheia
 */
function renderRelatorioFullscreen({ relatorioData, isLoading, onBackToAdmin, onGenerateReport }) {
  return `
    <div class="relatorio-fullscreen-container">
      <div class="relatorio-header">
        <div class="relatorio-title">
          ${icons.fileText}
          <span>Relatório Completo de Clima Organizacional</span>
        </div>
        <div class="relatorio-controls">
          <button onclick="${onBackToAdmin}()" class="btn btn-outline btn-sm">
            ${icons.arrowLeft} Voltar ao Painel
          </button>
          <button onclick="${onGenerateReport}()" class="btn btn-purple btn-sm" ${isLoading ? 'disabled' : ''}>
            ${isLoading ? '<span class="spinner-sm"></span> Gerando...' : `${icons.refresh} Gerar Novo Relatório`}
          </button>
        </div>
      </div>
      
      <div class="relatorio-content">
        ${isLoading ? `
          <div class="relatorio-loading">
            <div class="loading-spinner"></div>
            <h3>🔄 Gerando relatório completo...</h3>
            <p>Isso pode levar até 30 segundos. A Nitai está analisando todos os dados da pesquisa.</p>
          </div>
        ` : `
          <div class="relatorio-data">
            ${relatorioData || '<p>Nenhum relatório disponível</p>'}
          </div>
        `}
      </div>
    </div>
  `;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  render();
});

// Tornar funções globais para eventos inline
window.setView = setView;
window.startSurvey = startSurvey;
window.goToAdmin = goToAdmin;
window.goToLanding = goToLanding;
window.selectUnit = selectUnit;
window.handleRate = handleRate;
window.handleComment = handleComment;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;
window.submitSurvey = submitSurvey;
window.selectQuestion = selectQuestion;
window.filterByUnit = filterByUnit;
window.filterByPillar = filterByPillar;
window.clearPillarFilter = clearPillarFilter;
window.clearDatabase = clearDatabase;
window.exportData = exportData;
window.sortQuestions = sortQuestions;
window.filterComments = filterComments;
window.render = render;

// ========================================
// PAINEL FLUTUANTE - DICIONÁRIO DE MÉTRICAS
// ========================================

class DictionaryPanel {
  constructor() {
    this.isOpen = false;
    this.currentSection = null;
    this.init();
  }

  init() {
    this.createPanel();
    this.addEventListeners();
  }

  createPanel() {
    const panelHTML = `
      <div id="dictionaryPanel" class="dictionary-panel">
        <div class="dictionary-backdrop"></div>
        <div class="dictionary-container">
          <div class="dictionary-header">
            <h2 class="dictionary-title">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              Dicionário de Métricas
            </h2>
            <button class="dictionary-close" aria-label="Fechar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div class="dictionary-nav">
            <button class="nav-btn active" data-section="overview">Visão Geral</button>
            <button class="nav-btn" data-section="satisfaction">Satisfação</button>
            <button class="nav-btn" data-section="charts">Gráficos</button>
            <button class="nav-btn" data-section="rankings">Rankings</button>
            <button class="nav-btn" data-section="alerts">Alertas</button>
          </div>
          
          <div class="dictionary-content">
            <div class="dictionary-section active" id="overview">
              <h3>📊 Visão Geral da Pesquisa</h3>
              <div class="metric-card">
                <h4>🎯 O que é a Pesquisa de Clima?</h4>
                <p>A Pesquisa de Clima Organizacional mede a percepção dos colaboradores sobre o ambiente de trabalho, identificando pontos fortes e áreas de melhoria.</p>
              </div>
              
              <div class="metric-card">
                <h4>📈 Como funciona?</h4>
                <ul>
                  <li><strong>Escala Likert:</strong> 4 pontos (Concordo Sempre, Concordo, Discordo, Discordo Sempre)</li>
                  <li><strong>Pontuação:</strong> Concordo = 1 ponto | Discordo = 0 pontos</li>
                  <li><strong>Cálculo:</strong> Satisfação = (Concordo + Concordo Sempre) ÷ Total × 100%</li>
                </ul>
              </div>
              
              <div class="metric-card">
                <h4>🏗️ Estrutura da Análise</h4>
                <ul>
                  <li><strong>7 Pilares:</strong> Ambiente, Comprometimento, Comunicação, Gestão, Liderança, Trabalho em Equipe, Capital Humano</li>
                  <li><strong>50 Questões:</strong> Distribuídas entre os pilares</li>
                  <li><strong>Análise Individual:</strong> Cada questão tem sua própria métrica</li>
                </ul>
              </div>
            </div>
            
            <div class="dictionary-section" id="satisfaction">
              <h3>🎯 Métricas de Satisfação</h3>
              
              <div class="metric-card">
                <h4>📊 Satisfação Geral</h4>
                <p><strong>Definição:</strong> Percentual médio de satisfação de todas as questões.</p>
                <div class="formula">
                  <strong>Fórmula:</strong><br>
                  Satisfação = (Σ Concordo + Concordo Sempre) ÷ (Σ Total Respostas) × 100%
                </div>
                <div class="example">
                  <strong>Exemplo:</strong><br>
                  Se 25 pessoas concordam e 56 concordam sempre de 92 respondentes:<br>
                  Satisfação = (25 + 56) ÷ 92 × 100% = 88,04%
                </div>
              </div>
              
              <div class="metric-card">
                <h4>🏢 Satisfação por Unidade</h4>
                <p><strong>Definição:</strong> Satisfação calculada separadamente para cada unidade/setor.</p>
                <div class="formula">
                  <strong>Fórmula:</strong><br>
                  Satisfação Unidade = (Concordo + Concordo Sempre da Unidade) ÷ (Total da Unidade) × 100%
                </div>
                <p><strong>Utilidade:</strong> Identifica quais unidades precisam de atenção especial.</p>
              </div>
              
              <div class="metric-card">
                <h4>🎯 Satisfação por Pilar</h4>
                <p><strong>Definição:</strong> Média de satisfação de todas as questões pertencentes a cada pilar.</p>
                <div class="formula">
                  <strong>Fórmula:</strong><br>
                  Satisfação Pilar = Média das satisfações das questões do pilar
                </div>
                <p><strong>Utilidade:</strong> Mostra quais áreas organizacionais estão mais fortes ou fracas.</p>
              </div>
              
              <div class="metric-card">
                <h4>📋 Interpretação dos Resultados</h4>
                <div class="scale-interpretation">
                  <div class="scale-item excellent">
                    <span class="scale-color">🟢</span>
                    <strong>≥ 75% (Ótimo):</strong> Clima organizacional excelente
                  </div>
                  <div class="scale-item attention">
                    <span class="scale-color">🟡</span>
                    <strong>50-74% (Atenção):</strong> Clima organizacional moderado
                  </div>
                  <div class="scale-item critical">
                    <span class="scale-color">🔴</span>
                    <strong>&lt; 50% (Crítico):</strong> Clima organizacional problemático
                  </div>
                </div>
              </div>
            </div>
            
            <div class="dictionary-section" id="charts">
              <h3>📊 Gráficos e Visualizações</h3>
              
              <div class="metric-card">
                <h4>📈 Distribuição das Respostas</h4>
                <p><strong>O que mostra:</strong> Como as respostas estão distribuídas na escala Likert.</p>
                <div class="chart-explanation">
                  <ul>
                    <li><strong>Eixo X:</strong> Opções da escala (Discordo Sempre, Discordo, Concordo, Concordo Sempre)</li>
                    <li><strong>Eixo Y:</strong> Percentual de respostas em cada categoria</li>
                    <li><strong>Interpretação:</strong> Barras mais altas à direita indicam maior satisfação</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Concentração de respostas positivas (direita) é bom; concentração negativa (esquerda) indica problemas.</p>
              </div>
              
              <div class="metric-card">
                <h4>🏢 Gráfico de Satisfação por Unidade</h4>
                <p><strong>O que mostra:</strong> Comparação da satisfação entre diferentes unidades/setores.</p>
                <div class="chart-explanation">
                  <ul>
                    <li><strong>Eixo X:</strong> Percentual de satisfação (0-100%)</li>
                    <li><strong>Barras:</strong> Cada unidade com sua cor baseada no desempenho</li>
                    <li><strong>Cores:</strong> Verde (≥75%), Amarelo (50-74%), Vermelho (&lt;50%)</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Identifica unidades com melhor e pior desempenho para ações direcionadas.</p>
              </div>
              
              <div class="metric-card">
                <h4>🎯 Gráfico de Satisfação por Pilar</h4>
                <p><strong>O que mostra:</strong> Desempenho de cada pilar organizacional.</p>
                <div class="chart-explanation">
                  <ul>
                    <li><strong>Eixo X:</strong> Percentual de satisfação (0-100%)</li>
                    <li><strong>Barras:</strong> Cada pilar com cor baseada no desempenho</li>
                    <li><strong>Ordenação:</strong> Geralmente do maior para o menor percentual</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Revela quais áreas organizacionais precisam de intervenção prioritária.</p>
              </div>
            </div>
            
            <div class="dictionary-section" id="rankings">
              <h3>🏆 Rankings de Questões</h3>
              
              <div class="metric-card">
                <h4>⚠️ Top Piores Perguntas</h4>
                <p><strong>O que mostra:</strong> Questões com menor percentual de satisfação.</p>
                <div class="ranking-explanation">
                  <ul>
                    <li><strong>Ordenação:</strong> Menor satisfação para maior</li>
                    <li><strong>Informações:</strong> Número da questão, texto resumido, percentual e pilar</li>
                    <li><strong>Foco:</strong> Questões críticas que precisam de atenção imediata</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Questões com &lt;50% são críticas; 50-74% precisam de melhoria; &gt;75% são satisfatórias.</p>
              </div>
              
              <div class="metric-card">
                <h4>🌟 Top Melhores Perguntas</h4>
                <p><strong>O que mostra:</strong> Questões com maior percentual de satisfação.</p>
                <div class="ranking-explanation">
                  <ul>
                    <li><strong>Ordenação:</strong> Maior satisfação para menor</li>
                    <li><strong>Informações:</strong> Número da questão, texto resumido, percentual e pilar</li>
                    <li><strong>Foco:</strong> Pontos fortes que podem ser expandidos</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Identifica práticas positivas que podem ser replicadas em outras áreas.</p>
              </div>
              
              <div class="metric-card">
                <h4>🔥 Top 3 Gargalos</h4>
                <p><strong>O que mostra:</strong> Questões específicas com maior concentração de respostas negativas.</p>
                <div class="ranking-explanation">
                  <ul>
                    <li><strong>Cálculo:</strong> Baseado na intensidade das respostas negativas</li>
                    <li><strong>Prioridade:</strong> Questões com mais "Discordo Sempre"</li>
                    <li><strong>Ação:</strong> Foco em intervenções específicas</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Questões com escore mais alto precisam de ação imediata e específica.</p>
              </div>
            </div>
            
            <div class="dictionary-section" id="alerts">
              <h3>⚠️ Sistema de Alertas</h3>
              
              <div class="metric-card">
                <h4>🚨 Alertas Críticos</h4>
                <p><strong>O que são:</strong> Questões que ultrapassam limiares de insatisfação preocupantes.</p>
                <div class="alert-explanation">
                  <ul>
                    <li><strong>Limiar Crítico:</strong> ≥ 33% de respostas "Discordo Muito"</li>
                    <li><strong>Identificação:</strong> Questão, percentual e pilar afetado</li>
                    <li><strong>Ação:</strong> Investigação imediata necessária</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Cada alerta crítico representa um problema grave que precisa ser investigado e resolvido.</p>
              </div>
              
              <div class="metric-card">
                <h4>🎯 Heatmap de Desempenho</h4>
                <p><strong>O que mostra:</strong> Visão consolidada do desempenho por pilar.</p>
                <div class="heatmap-explanation">
                  <ul>
                    <li><strong>Linhas:</strong> Cada pilar organizacional</li>
                    <li><strong>Colunas:</strong> Percentual de satisfação</li>
                    <li><strong>Cores:</strong> Verde (≥75%), Amarelo (50-74%), Vermelho (&lt;50%)</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Permite identificação rápida de áreas críticas e pontos fortes da organização.</p>
              </div>
              
              <div class="metric-card">
                <h4>📋 Sugestões Estratégicas</h4>
                <p><strong>O que são:</strong> Recomendações baseadas nos dados da pesquisa.</p>
                <div class="suggestions-explanation">
                  <ul>
                    <li><strong>Base:</strong> Análise dos pilares e questões críticas</li>
                    <li><strong>Foco:</strong> Ações práticas e específicas</li>
                    <li><strong>Alinhamento:</strong> Com os objetivos organizacionais</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Use as sugestões como ponto de partida para planos de ação detalhados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', panelHTML);
  }

  addEventListeners() {
    // Botão fechar
    document.querySelector('.dictionary-close').addEventListener('click', () => this.close());
    
    // Backdrop
    document.querySelector('.dictionary-backdrop').addEventListener('click', () => this.close());
    
    // Navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
    });
    
    // Tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  open() {
    this.isOpen = true;
    document.getElementById('dictionaryPanel').classList.add('open');
    // Removido bloqueio de scroll para permitir navegação na página
  }

  close() {
    this.isOpen = false;
    document.getElementById('dictionaryPanel').classList.remove('open');
    // Não precisa restaurar scroll pois nunca foi bloqueado
  }

  switchSection(sectionId) {
    // Remover classe active de todos os botões e seções
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.dictionary-section').forEach(section => section.classList.remove('active'));
    
    // Adicionar classe active ao botão e seção selecionados
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    document.getElementById(sectionId).classList.add('active');
    
    this.currentSection = sectionId;
  }
}

// Inicializar o painel quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Adicionar evento ao botão de dicionário
  const dictionaryBtn = document.getElementById('dictionaryHelpBtn');
  if (dictionaryBtn) {
    dictionaryBtn.addEventListener('click', () => {
      if (!window.dictionaryPanel) {
        window.dictionaryPanel = new DictionaryPanel();
      }
      window.dictionaryPanel.open();
    });
  }
});


// Funções para dados PCO
async function loadPcoData() {
  try {
    const response = await fetch('/api/pco/dashboard');
    if (!response.ok) throw new Error('Erro ao carregar dados PCO');
    
    const data = await response.json();
    state.pcoStats = data.generalStats;
    state.pcoQuestionStats = data.questionStats;
    state.pcoPillarStats = data.pillarStats;
    state.pcoComments = data.comments;
  } catch (error) {
    console.error('Erro ao carregar dados PCO:', error);
    alert('Erro ao carregar dados da pesquisa PCO. Tente novamente.');
    throw error;
  }
}

window.goToPcoAdmin = async () => {
  try {
    await loadPcoData();
    state.selectedPcoQuestionId = null;
    setView('pco-admin');
  } catch (error) {
    console.error('Erro ao acessar Painel PCO:', error);
    alert('Erro ao carregar dados do Painel PCO. Tente novamente.');
  }
};

window.selectPcoQuestion = (questionId) => {
  state.selectedPcoQuestionId = questionId;
  render();
  
  // Scroll suave até a questão selecionada
  setTimeout(() => {
    const selectedCard = document.querySelector('.question-card.selected');
    if (selectedCard) {
      selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
};

window.sortPcoQuestions = (sortBy, order = null) => {
  if (sortBy === 'id') {
    state.pcoQuestionSortOrder = order || (state.pcoQuestionSortOrder === 'asc' ? 'desc' : 'asc');
  } else {
    state.pcoQuestionSortBy = sortBy;
    state.pcoQuestionSortOrder = order || 'desc';
  }
  render();
};

window.filterPcoComments = (filter) => {
  state.pcoQuestionFilterComments = filter;
  render();
};

window.exportPcoData = async () => {
  if (state.isExportingPco) return;
  
  state.isExportingPco = true;
  render();
  
  try {
    const response = await fetch('/api/pco/export/csv');
    if (!response.ok) throw new Error('Erro ao exportar dados');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pco-pesquisa-clima-2025.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log('Dados PCO exportados com sucesso');
  } catch (error) {
    console.error('Erro ao exportar dados PCO:', error);
    alert('Erro ao exportar dados. Tente novamente.');
  } finally {
    state.isExportingPco = false;
    render();
  }
};

// Função global para abrir o painel de dicionário
function openDictionaryPanel() {
  if (!window.dictionaryPanel) {
    window.dictionaryPanel = new DictionaryPanel();
  }
  window.dictionaryPanel.open();
}


window.DictionaryPanel = DictionaryPanel;
window.openDictionaryPanel = openDictionaryPanel;
