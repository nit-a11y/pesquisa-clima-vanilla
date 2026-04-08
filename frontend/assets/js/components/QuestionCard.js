/*
 * Componente: QuestionCard
 * Card de questão com animação e estilos
 */

function renderQuestionCard(question, currentAnswer, onRate, onComment) {
  const isNegative = question.isNegative;
  const hasAnswer = currentAnswer && currentAnswer.score > 0;
  
  return `
    <div class="question-card ${isNegative ? 'negative' : ''} ${hasAnswer ? 'answered' : ''}" 
         id="question-card-${question.id}">
      <div class="question-header">
        <span class="question-number">Q${question.id}</span>
        <span class="question-pillar">${question.pillar}</span>
        ${isNegative ? '<span class="question-badge negative">⚠️ Invertida</span>' : ''}
      </div>
      
      <h2 class="question-text">${question.text}</h2>
      
      ${isNegative ? `
        <div class="question-warning">
          ${icons.alertCircle}
          <span>Esta é uma questão invertida. "Concordo" ou "Concordo Muito" indica um problema.</span>
        </div>
      ` : ''}
      
      <div class="rating-container">
        ${renderRatingButtons(question.id, currentAnswer?.score, isNegative, onRate)}
      </div>
      
      <div class="comment-section ${isNegative ? (currentAnswer?.score >= 3 ? 'visible' : '') : (currentAnswer?.score <= 2 ? 'visible' : '')}" 
           id="comment-section-${question.id}">
        <label class="comment-label">
          ${icons.messageSquare}
          <span>Quer compartilhar mais sobre sua resposta? (opcional)</span>
        </label>
        <textarea 
          class="comment-input"
          placeholder="Deixe seu comentário aqui..."
          oninput="${onComment}(this.value, ${question.id})"
          rows="3"
        >${currentAnswer?.comment || ''}</textarea>
      </div>
    </div>
  `;
}

window.renderQuestionCard = renderQuestionCard;
