/*
 * Componente: CommentList
 * Lista de comentários com filtros
 */

function renderCommentList(comments, selectedQuestion, questions) {
  if (!selectedQuestion) {
    return renderEmptyState('Selecione uma pergunta para ver os comentários', 'helpCircle');
  }
  
  if (!comments || comments.length === 0) {
    return renderEmptyState('Nenhum comentário para esta pergunta', 'messageSquare');
  }
  
  const question = questions.find(q => q.id === selectedQuestion);
  
  return `
    <div class="comments-list">
      <div class="comments-header">
        <h4>${question?.text || `Questão ${selectedQuestion}`}</h4>
        <span class="comments-count">${comments.length} comentário${comments.length > 1 ? 's' : ''}</span>
      </div>
      <div class="comments-scroll">
        ${comments
          .sort((a, b) => a.score - b.score)
          .map(comment => renderCommentItem(comment))
          .join('')}
      </div>
    </div>
  `;
}

// Tornar globais
window.renderCommentList = renderCommentList;
window.renderCommentItem = renderCommentItem;
window.renderEmptyState = renderEmptyState;

function renderCommentItem(comment) {
  const isNegative = comment.score <= 2;
  const scoreLabels = ['Discordo Muito', 'Discordo', 'Concordo', 'Concordo Muito'];
  const scoreEmojis = ['😡', '😟', '😐', '🤩'];
  
  return `
    <div class="comment-item ${isNegative ? 'negative' : 'positive'}">
      <div class="comment-header">
        <span class="comment-unit">${comment.unit || 'Geral'}</span>
        <span class="comment-score">
          ${scoreEmojis[comment.score - 1]} ${scoreLabels[comment.score - 1]}
        </span>
      </div>
      <p class="comment-text">"${comment.comment}"</p>
    </div>
  `;
}

function renderEmptyState(message, icon = 'messageSquare') {
  return `
    <div class="empty-state">
      ${icons[icon]}
      <p>${message}</p>
    </div>
  `;
}
