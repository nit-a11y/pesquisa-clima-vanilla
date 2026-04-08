/*
 * Componente: AlertCard
 * Card de alerta crítico com sugestões
 */

function renderAlertCard(alert, questions) {
  const question = questions.find(q => q.id === alert.question_id);
  const isNegative = NEGATIVE_QUESTIONS.includes(alert.question_id);
  
  const suggestions = {
    negative: [
      'Investigar causas raiz dos problemas identificados',
      'Implementar melhorias nos processos de liderança',
      'Revisar políticas de gestão de pessoas',
      'Promover treinamentos de conscientização'
    ],
    positive: [
      'Promover dinâmicas de integração entre equipes',
      'Revisar processos internos para reduzir atritos',
      'Fortalecer canais de comunicação',
      'Estabelecer reuniões periódicas de alinhamento'
    ]
  };
  
  const suggestionList = isNegative ? suggestions.negative : suggestions.positive;
  
  return `
    <div class="alert-card">
      <div class="alert-header">
        <div class="alert-badge">
          ${icons.alertCircle}
          <span>Crítico: Q${alert.question_id}</span>
        </div>
        <span class="alert-percentage ${isNegative ? 'negative' : ''}">
          ${isNegative 
            ? `${alert.percentage_critical.toFixed(0)}% Concordam Muito (problema)` 
            : `${alert.percentage_critical.toFixed(0)}% Discordam Muito`}
        </span>
      </div>
      
      <p class="alert-text">${question?.text || 'Questão não encontrada'}</p>
      <span class="alert-pillar">${question?.pillar || ''}</span>
      
      <div class="suggestion-box">
        <p class="suggestion-label">
          ${icons.lightbulb}
          <span>Sugestões Estratégicas</span>
        </p>
        <ul class="suggestion-list">
          ${suggestionList.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function renderAlertList(alerts, questions) {
  if (!alerts || alerts.length === 0) {
    return `
      <div class="alerts-empty">
        ${icons.checkCircle}
        <h4>Nenhum alerta crítico detectado</h4>
        <p>A pesquisa não identificou questões com alto índice de insatisfação.</p>
      </div>
    `;
  }
  
  return `
    <div class="alerts-list">
      ${alerts.map(alert => renderAlertCard(alert, questions)).join('')}
    </div>
  `;
}

function renderBottlenecks(bottlenecks, questions) {
  if (!bottlenecks || bottlenecks.length === 0) {
    return '';
  }
  
  return `
    <div class="bottlenecks-list">
      ${bottlenecks.map(b => {
        const q = questions.find(qu => qu.id === b.question_id);
        return `
          <div class="bottleneck-item">
            <div class="bottleneck-header">
              <span class="bottleneck-number">Q${b.question_id}</span>
              <span class="bottleneck-pillar">${q?.pillar}</span>
            </div>
            <p class="bottleneck-text">${q?.text}</p>
            <div class="bottleneck-score">
              <span class="score-value">${b.average.toFixed(1)}</span>
              <span class="score-bar" style="width: ${(b.average / 4) * 100}%"></span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Tornar globais
window.renderAlertCard = renderAlertCard;
window.renderAlertList = renderAlertList;
window.renderBottlenecks = renderBottlenecks;
