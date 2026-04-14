/*
 * App Principal - VERSÃO DEMONSTRATIVA
 * Simula todas as operações sem salvar no banco de dados
 * Os dados são armazenados apenas em memória (voláteis)
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
  adminFilterPillar: null
};

const app = document.getElementById('app');

// Dados simulados para o modo demo (apenas em memória)
let demoResponses = [];

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
        isExporting: state.isExporting,
        isClearing: state.isClearing,
        selectedUnit: state.adminFilterUnit,
        selectedPillar: state.adminFilterPillar,
        onSelectQuestion: 'selectQuestion',
        onClearDatabase: 'clearDatabase',
        onExport: 'exportData',
        onFilterUnit: 'filterByUnit',
        onClearPillarFilter: 'clearPillarFilter',
        onBack: 'goToLanding'
      });
      setTimeout(initCharts, 50);
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

// SIMULAÇÃO: Submit sem salvar no banco
async function submitSurvey() {
  if (state.isSubmitting) return;
  
  const answeredCount = Object.keys(state.answers).length;
  if (answeredCount < questions.length) {
    if (!confirm(`Você respondeu ${answeredCount} de ${questions.length} questões. Deseja enviar assim mesmo?`)) {
      return;
    }
  }
  
  state.isSubmitting = true;
  
  const answersArray = Object.values(state.answers).filter(a => a.score > 0);
  
  // SIMULAÇÃO: Apenas adiciona à memória local, não envia para API
  setTimeout(() => {
    const newResponse = {
      id: Date.now(),
      unit: state.selectedUnit,
      answers: answersArray,
      submitted_at: new Date().toISOString()
    };
    
    demoResponses.push(newResponse);
    
    console.log('[DEMO] Resposta simulada:', newResponse);
    console.log('[DEMO] Total de respostas em memória:', demoResponses.length);
    
    state.isSubmitting = false;
    setView('success');
  }, 500); // Simula delay de rede
}

// SIMULAÇÃO: Carrega dados fictícios para o admin
async function loadAdminData() {
  // Dados fictícios para demonstração
  const mockStats = {
    totalResponses: demoResponses.length || 5,
    averageScore: 3.2,
    unitStats: UNITS.map(unit => ({
      unit,
      average: 2.5 + Math.random() * 1.5,
      count: Math.floor(Math.random() * 10) + 1
    })),
    pillarStats: pillars.map(pillar => ({
      pillar,
      average: 2.0 + Math.random() * 2.0,
      count: questions.filter(q => q.pillar === pillar).length
    })),
    questionStats: questions.map(q => ({
      question_id: q.id,
      average: 1.5 + Math.random() * 2.5,
      count: Math.floor(Math.random() * 20) + 5
    }))
  };
  
  // Se temos respostas demo, calcula estatísticas reais
  if (demoResponses.length > 0) {
    mockStats.totalResponses = demoResponses.length;
    // Aqui poderíamos calcular médias reais das respostas demo
  }
  
  state.stats = mockStats;
  state.responses = demoResponses.length > 0 ? demoResponses : generateMockResponses();
  
  setTimeout(initCharts, 100);
}

// Gera respostas mock para o demo quando não há dados
function generateMockResponses() {
  const mockData = [];
  const names = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Paula', 'Carlos Lima'];
  
  for (let i = 0; i < 5; i++) {
    const answers = questions.map(q => ({
      questionId: q.id,
      score: Math.floor(Math.random() * 4) + 1,
      comment: Math.random() > 0.7 ? 'Comentário de exemplo para demonstração' : ''
    }));
    
    mockData.push({
      id: i + 1,
      unit: UNITS[Math.floor(Math.random() * UNITS.length)],
      respondent_name: names[i],
      answers: answers,
      submitted_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
    });
  }
  
  return mockData;
}

function selectQuestion(questionId) {
  state.selectedQuestionId = questionId;
  render();
}

function filterByUnit(unit) {
  state.adminFilterUnit = unit;
  loadAdminData().then(() => render());
}

function filterByPillar(pillarName) {
  if (state.adminFilterPillar === pillarName) {
    state.adminFilterPillar = null;
  } else {
    state.adminFilterPillar = pillarName;
  }
  render();
}

function clearPillarFilter() {
  state.adminFilterPillar = null;
  render();
}

// SIMULAÇÃO: Limpa apenas os dados em memória
async function clearDatabase() {
  if (!confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODAS as respostas do MODO DEMONSTRATIVO.\n\nDeseja continuar?')) {
    return;
  }
  
  state.isClearing = true;
  render();
  
  // Apenas limpa a memória local
  setTimeout(() => {
    demoResponses = [];
    state.stats = null;
    state.responses = [];
    
    alert('✅ Dados de demonstração limpos!');
    
    state.isClearing = false;
    loadAdminData().then(() => render());
  }, 800);
}

function exportData() {
  if (!state.responses || !state.responses.length) {
    alert('Não há dados para exportar');
    return;
  }
  
  state.isExporting = true;
  render();
  
  setTimeout(() => {
    exportToCSV(state.responses, `pesquisa-clima-demo-${new Date().toISOString().split('T')[0]}.csv`);
    state.isExporting = false;
    render();
  }, 1000);
}

// Gráficos (mesma implementação do app.js)
function initCharts() {
  if (!state.stats) return;
  
  initTrendChart();
  initUnitChart();
  initPillarChart();
}

function initTrendChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;
  
  let questionStats = state.stats.questionStats || [];
  if (state.adminFilterPillar) {
    const pillarQuestions = questions.filter(q => q.pillar === state.adminFilterPillar).map(q => q.id);
    questionStats = questionStats.filter(s => pillarQuestions.includes(s.question_id));
  }
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: questionStats.map(s => `Q${s.question_id}`) || [],
      datasets: [{
        label: 'Média',
        data: questionStats.map(s => s.average) || [],
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#dc2626',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
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
          grid: { display: false },
          ticks: { font: { weight: '600' }, color: '#6b7280' }
        },
        y: {
          min: 1,
          max: 4,
          grid: { color: '#e5e7eb' },
          ticks: { font: { weight: '600' }, color: '#6b7280' }
        }
      },
      plugins: {
        legend: { display: false },
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
          displayColors: false
        }
      }
    }
  });
}

function initUnitChart() {
  const ctx = document.getElementById('unitChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: state.stats.unitStats?.map(s => s.unit) || [],
      datasets: [{
        label: 'Média',
        data: state.stats.unitStats?.map(s => s.average) || [],
        backgroundColor: '#dc2626',
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
          max: 4,
          grid: { color: '#e5e7eb' },
          ticks: { font: { weight: '600' }, color: '#6b7280' }
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
          borderWidth: 1
        }
      }
    }
  });
}

function initPillarChart() {
  const ctx = document.getElementById('pillarChart');
  if (!ctx) return;
  
  const labels = state.stats.pillarStats?.map(s => s.pillar) || [];
  
  const backgroundColors = labels.map(label => {
    if (!state.adminFilterPillar) {
      return '#dc2626';
    }
    return label === state.adminFilterPillar ? '#b91c1c' : '#fca5a5';
  });
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Média',
        data: state.stats.pillarStats?.map(s => s.average) || [],
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
          max: 4,
          grid: { color: '#e5e7eb' },
          ticks: { font: { weight: '600' }, color: '#6b7280' }
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
          borderWidth: 1
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const label = event.chart.data.labels[index];
          filterByPillar(label);
        }
      },
      onHover: (event, elements) => {
        event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
      }
    }
  });
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
window.render = render;
