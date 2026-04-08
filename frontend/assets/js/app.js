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
  adminFilterUnit: 'all'
};

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
        isExporting: state.isExporting,
        isClearing: state.isClearing,
        selectedUnit: state.adminFilterUnit,
        onSelectQuestion: 'selectQuestion',
        onClearDatabase: 'clearDatabase',
        onExport: 'exportData',
        onFilterUnit: 'filterByUnit',
        onBack: 'goToLanding'
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
    const [statsData, responsesData] = await Promise.all([
      fetch(`${API_BASE}/api/admin/stats`).then(r => r.json()),
      fetch(`${API_BASE}/api/admin/responses`).then(r => r.json())
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
}

function filterByUnit(unit) {
  state.adminFilterUnit = unit;
  loadAdminData().then(() => render());
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

// Gráficos
function initCharts() {
  if (!state.stats) return;
  
  initTrendChart();
  initUnitChart();
  initPillarChart();
}

function initTrendChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: state.stats.questionStats?.map(s => `Q${s.question_id}`) || [],
      datasets: [{
        label: 'Média',
        data: state.stats.questionStats?.map(s => s.average) || [],
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
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: state.stats.pillarStats?.map(s => {
        // Abreviar nomes longos
        const name = s.pillar;
        if (name === 'Comprometimento Organizacional') return 'Comprom. Org.';
        if (name === 'Gestão do Capital Humano') return 'Gestão de Pessoas';
        return name;
      }) || [],
      datasets: [{
        label: 'Média',
        data: state.stats.pillarStats?.map(s => s.average) || [],
        backgroundColor: '#dc2626',
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
window.clearDatabase = clearDatabase;
window.exportData = exportData;
window.render = render;
