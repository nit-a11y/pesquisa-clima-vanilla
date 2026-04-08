/*
 * Componente: ProgressBar
 * Barra de progresso animada para o formulário
 */

function renderProgressBar(currentStep, totalQuestions) {
  const progress = ((currentStep + 1) / totalQuestions) * 100;
  
  return `
    <div class="progress-container">
      <div class="progress-info">
        <span class="progress-step">Questão ${currentStep + 1} de ${totalQuestions}</span>
        <span class="progress-percentage">${Math.round(progress)}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
      <div class="progress-pillars">
        ${renderPillarIndicators(currentStep)}
      </div>
    </div>
  `;
}

function renderPillarIndicators(currentStep) {
  const currentQuestion = questions[currentStep];
  const currentPillar = currentQuestion ? currentQuestion.pillar : '';
  
  return pillars.map(pillar => {
    const isActive = pillar === currentPillar;
    const isCompleted = questions.findIndex(q => q.pillar === pillar) < currentStep;
    const pillarQuestions = questions.filter(q => q.pillar === pillar);
    const totalInPillar = pillarQuestions.length;
    
    return `
      <div class="pillar-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
           title="${pillar} (${totalInPillar} questões)">
        <div class="pillar-dot"></div>
        <span class="pillar-name">${pillar}</span>
      </div>
    `;
  }).join('');
}

window.renderProgressBar = renderProgressBar;
window.renderPillarIndicators = renderPillarIndicators;
