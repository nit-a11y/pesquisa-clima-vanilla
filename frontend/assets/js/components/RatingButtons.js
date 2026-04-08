/*
 * Componente: RatingButtons
 * Botões de avaliação com emojis e labels
 */

function renderRatingButtons(questionId, selectedScore, isNegative, onRate) {
  // Mesmo padrão visual para todas as perguntas (normal e invertidas)
  // A inversão de score é tratada apenas no backend
  const labels = RATING_LABELS;
  const emojis = RATING_EMOJIS.map((emoji, i) => `${emoji} ${RATING_LABELS[i]}`);
  
  return `
    <div class="rating-buttons ${isNegative ? 'is-negative' : ''}">
      ${[1, 2, 3, 4].map((score, index) => {
        const isSelected = selectedScore === score;
        const label = labels[index];
        const emoji = emojis[index].split(' ')[0];
        const displayText = emojis[index].split(' ').slice(1).join(' ');
        
        return `
          <button 
            type="button"
            class="rating-btn ${isSelected ? 'selected' : ''} score-${score}"
            onclick="${onRate}(${questionId}, ${score})"
            title="${label}"
          >
            <span class="rating-emoji">${emoji}</span>
            <span class="rating-label">${displayText}</span>
            <span class="rating-score">${score}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;
}

window.renderRatingButtons = renderRatingButtons;
