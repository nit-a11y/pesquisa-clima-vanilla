/*
 * View: SurveyView
 * Formulário de pesquisa com navegação por blocos de pilar (estilo Google Forms)
 */

function renderSurveyView({ 
  currentStep, 
  currentPillar,
  pillarQuestions,
  selectedUnit, 
  answers, 
  onSelectUnit, 
  onRate, 
  onComment, 
  onNext, 
  onPrev, 
  onSubmit 
}) {
  const isUnitStep = currentStep === -1;
  const totalPillars = pillars.length;
  
  if (isUnitStep) {
    return renderUnitStep({ selectedUnit, onSelectUnit, onNext });
  }
  
  // Calcular progresso do pilar atual
  const answeredInPillar = pillarQuestions.filter(q => answers[q.id]?.score > 0).length;
  const totalInPillar = pillarQuestions.length;
  const pillarProgress = (answeredInPillar / totalInPillar) * 100;
  const isLastPillar = currentStep === totalPillars - 1;
  
  return `
    <div class="survey-page">
      <header class="survey-header">
        ${renderLogo("setView('landing')")}
        <button onclick="setView('landing')" class="btn btn-ghost btn-sm">
          ${icons.x}
          Sair
        </button>
      </header>
      
      <main class="survey-main pillar-step">
        <!-- Progresso por pilar -->
        <div class="pillar-progress-card">
          <div class="pillar-info">
            <span class="pillar-number">Pilar ${currentStep + 1} de ${totalPillars}</span>
            <h2 class="pillar-name">${currentPillar}</h2>
          </div>
          <div class="pillar-progress-bar">
            <div class="pillar-progress-fill" style="width: ${pillarProgress}%"></div>
          </div>
          <span class="pillar-progress-text">${answeredInPillar} de ${totalInPillar} perguntas respondidas</span>
        </div>
        
        <!-- Bloco de perguntas do pilar -->
        <div class="questions-block">
          ${pillarQuestions.map((question, index) => renderQuestionInBlock(question, answers[question.id] || { score: 0, comment: '' }, onRate, onComment, index + 1)).join('')}
        </div>
        
        <!-- Navegação -->
        <div class="survey-navigation">
          <button 
            onclick="${onPrev}()" 
            class="btn btn-outline btn-lg"
            ${currentStep === 0 ? 'disabled' : ''}
          >
            ${icons.chevronLeft}
            Anterior
          </button>
          
          ${isLastPillar ? `
            <button 
              onclick="${onSubmit}()" 
              class="btn btn-primary btn-lg"
              ${answeredInPillar < totalInPillar ? 'disabled' : ''}
            >
              Finalizar Pesquisa
              ${icons.send}
            </button>
          ` : `
            <button 
              onclick="${onNext}()" 
              class="btn btn-primary btn-lg"
              ${answeredInPillar < totalInPillar ? 'disabled' : ''}
            >
              Próximo
              ${icons.chevronRight}
            </button>
          `}
        </div>
      </main>
    </div>
  `;
}

function renderUnitStep({ selectedUnit, onSelectUnit, onNext }) {
  return `
    <div class="survey-page">
      <header class="survey-header">
        ${renderLogo()}
      </header>
      
      <main class="survey-main unit-step">
        <div class="unit-selector">
          <h3 class="unit-title">Selecione sua unidade</h3>
          <p class="unit-subtitle">Esta informação é usada apenas para análise estatística</p>
          
          <div class="unit-grid">
            ${UNITS.map(unit => `
              <button 
                type="button"
                class="unit-btn ${selectedUnit === unit ? 'selected' : ''}"
                onclick="${onSelectUnit}('${unit}')"
              >
                <span class="unit-name">${unit}</span>
                ${selectedUnit === unit ? `<span class="unit-check">${icons.checkCircle}</span>` : ''}
              </button>
            `).join('')}
          </div>
          
          <div class="unit-actions">
            <button 
              onclick="${onNext}()" 
              class="btn btn-primary btn-xl"
            >
              Iniciar Pesquisa
              ${icons.arrowRight}
            </button>
          </div>
        </div>
      </main>
    </div>
  `;
}

// Renderizar uma pergunta dentro do bloco de pilar
function renderQuestionInBlock(question, currentAnswer, onRate, onComment, questionNumber) {
  const isNegative = NEGATIVE_QUESTIONS.includes(question.id);
  
  return `
    <div class="question-block-item ${isNegative ? 'is-negative' : ''}">
      <div class="question-block-header">
        <span class="question-block-number">${questionNumber}</span>
        <div class="question-block-info">
          <span class="question-block-id">Q${question.id}</span>
          ${isNegative ? `<span class="question-block-badge">${icons.alertCircle} Invertida</span>` : ''}
        </div>
      </div>
      
      <h3 class="question-block-text">${question.text}</h3>
      
      ${isNegative ? `
        <div class="question-block-warning">
          ${icons.alertCircle}
          <span>Esta é uma questão invertida. "Concordo" ou "Concordo Muito" indica um problema.</span>
        </div>
      ` : ''}
      
      <div class="rating-block-container">
        ${renderRatingButtons(question.id, currentAnswer?.score, isNegative, onRate)}
      </div>
      
      <div class="comment-block-section visible" 
           id="comment-section-${question.id}">
        <div class="comment-block-wrapper">
          <label class="comment-block-label">
            ${icons.messageSquare}
            Quer compartilhar mais sobre sua resposta? (opcional)
          </label>
          <textarea
            class="comment-block-input"
            placeholder="Digite seu comentário aqui..."
            onblur="${onComment}(this.value, ${question.id})"
          >${currentAnswer?.comment || ''}</textarea>
        </div>
      </div>
    </div>
  `;
}
