/*
 * View: AdminView
 * Dashboard administrativo completo
 */

function renderAdminView({ 
  stats, 
  responses, 
  selectedQuestion, 
  isExporting, 
  isClearing,
  selectedUnit,
  selectedPillar,
  questionSortOrder,
  questionSortBy,
  questionFilterComments,
  onSelectQuestion, 
  onClearDatabase, 
  onExport,
  onFilterUnit,
  onClearPillarFilter,
  onSortQuestions,
  onFilterComments,
  onBack
}) {
  if (!stats) {
    return `
      <div class="admin-loading">
        <div class="spinner"></div>
        <p>Carregando painel administrativo...</p>
      </div>
    `;
  }
  
  const avgPillar = stats.pillarStats?.reduce((a, b) => a + b.average, 0) / (stats.pillarStats?.length || 1) || 0;
  const questionWithMostComments = stats.questionStats?.reduce((prev, current) => 
    (prev?.comment_count > current?.comment_count) ? prev : current, stats.questionStats[0]);
  
  const selectedQuestionComments = responses.filter(r => 
    r.question_id === selectedQuestion && r.comment
  );
  
  return `
    <div class="admin-page">
      <header class="admin-header">
        <div class="admin-header-left">
          ${renderLogo(onBack)}
          <div class="admin-title-group">
            <h1>Painel Administrativo NIT</h1>
            <span class="admin-subtitle">Pesquisa de Clima Organizacional</span>
          </div>
        </div>
        
        <div class="admin-header-right">
          <select 
            class="admin-filter"
            onchange="${onFilterUnit}(this.value)"
          >
            <option value="all" ${selectedUnit === 'all' ? 'selected' : ''}>Todas as Unidades</option>
            ${UNITS.map(u => `
              <option value="${u}" ${selectedUnit === u ? 'selected' : ''}>${u}</option>
            `).join('')}
          </select>
          
          <button onclick="${onBack}()" class="btn btn-outline btn-sm">
            ${icons.arrowLeft}
            Voltar
          </button>
          
          <button 
            onclick="${onExport}()" 
            class="btn btn-primary btn-sm"
            ${isExporting ? 'disabled' : ''}
          >
            ${isExporting 
              ? `<span class="spinner-sm"></span> Exportando...` 
              : `${icons.download} Exportar CSV`}
          </button>
          
                  </div>
      </header>
      
      ${selectedPillar ? `
        <div class="pillar-filter-banner">
          <div class="pillar-filter-content">
            ${icons.filter}
            <span>Filtrando por: <strong>${selectedPillar}</strong> · Gráficos e questões filtrados · Clique novamente no pilar para desfiltrar</span>
            <button onclick="${onClearPillarFilter}()" class="btn-clear-filter">
              ${icons.x} Limpar filtro
            </button>
          </div>
        </div>
      ` : ''}
      
      <main class="admin-main">
        <!-- Cards de estatísticas -->
        <div class="stats-grid">
          ${renderStatsCard({
            label: 'Total de Respostas',
            value: stats.totalResponses || 0,
            icon: 'users',
            color: 'blue',
            delay: 0
          })}
          ${renderStatsCard({
            label: 'Média de Satisfação',
            value: `${avgPillar.toFixed(1)} (${((avgPillar - 1) / 3 * 100).toFixed(1)}%)`,
            icon: 'trendingUp',
            color: 'yellow',
            delay: 0.1
          })}
          ${renderStatsCard({
            label: 'Taxa de Favorabilidade',
            value: `${stats.globalFavorability?.toFixed(1) || 0}%`,
            icon: 'thumbsUp',
            color: 'green',
            sub: '% Concordo + Concordo muito',
            delay: 0.15
          })}
                    ${renderStatsCard({
            label: 'Questão + Comentada',
            value: `Q${questionWithMostComments?.question_id || '-'}`,
            icon: 'messageSquare',
            color: 'red',
            sub: `${questionWithMostComments?.comment_count || 0} comentários`,
            delay: 0.3
          })}
        </div>
        
        <!-- Heatmap por Pilar -->
        <div class="heatmap-section">
          <div class="card">
            <h3 class="card-title">
              ${icons.barChart}
              Heatmap de Desempenho por Pilar
            </h3>
            <div class="heatmap-container">
              ${renderHeatmap(stats.pillarStats || [])}
            </div>
          </div>
        </div>
        
        <!-- Gráficos -->
        <div class="charts-grid">
          ${renderChartContainer({
            title: 'Distribuição das Respostas (Escala Likert)',
            icon: 'barChart',
            chartId: 'trendChart',
            size: 'large'
          })}
          
          ${renderChartContainer({
            title: 'Satisfação por Unidade',
            icon: 'shieldCheck',
            chartId: 'unitChart'
          })}
          
          ${renderChartContainer({
            title: 'Favorabilidade por Pilar',
            icon: 'barChart',
            chartId: 'pillarChart'
          })}
          
          <div class="card alerts-card">
            <h3 class="card-title">
              ${icons.alertCircle}
              Alertas Críticos
            </h3>
            ${renderAlertList(stats.criticalAlerts, questions)}
          </div>
        </div>
        
        <!-- Rankings de Perguntas -->
        <div class="rankings-section">
          <div class="card worst-questions-card">
            <h3 class="card-title">
              ${icons.frown}
              Top Piores Perguntas
            </h3>
            ${renderWorstQuestions(stats.questionStats || [], questions)}
          </div>
          
          <div class="card best-questions-card">
            <h3 class="card-title">
              ${icons.smile}
              Top Melhores Perguntas
            </h3>
            ${renderBestQuestions(stats.questionStats || [], questions)}
          </div>
        </div>
        
        <!-- Gargalos e Lista de Questões -->
        <div class="admin-bottom-grid">
          <div class="card bottlenecks-card">
            <h3 class="card-title">
              ${icons.frown}
              Top 3 Gargalos
            </h3>
            ${renderBottlenecks(stats.bottlenecks, questions)}
          </div>
          
          <div class="card questions-card">
            <div class="questions-header">
              <h3 class="card-title">
                ${icons.barChart}
                ${selectedPillar ? `Questões: ${selectedPillar}` : 'Todas as Questões'}
              </h3>
              <span class="questions-hint">Clique para ver comentários</span>
            </div>
            
            <!-- Filtros e Ordenação -->
            <div class="questions-filters">
              <div class="filter-group">
                <label class="filter-label">Ordenar por:</label>
                <div class="filter-buttons">
                  <button 
                    onclick="${onSortQuestions}('id')" 
                    class="btn btn-outline btn-xs ${questionSortBy === 'id' ? 'active' : ''}"
                    title="Ordenar por número da questão"
                  >
                    ${icons.hash} Número 
                    ${questionSortBy === 'id' ? (questionSortOrder === 'asc' ? '↑' : '↓') : ''}
                  </button>
                  <button 
                    onclick="${onSortQuestions}('comments')" 
                    class="btn btn-outline btn-xs ${questionSortBy === 'comments' ? 'active' : ''}"
                    title="Ordenar por número de comentários"
                  >
                    ${icons.messageSquare} Comentários 
                    ${questionSortBy === 'comments' ? (questionSortOrder === 'asc' ? '↑' : '↓') : ''}
                  </button>
                  <button 
                    onclick="${onSortQuestions}('average')" 
                    class="btn btn-outline btn-xs ${questionSortBy === 'average' ? 'active' : ''}"
                    title="Ordenar por média de avaliação"
                  >
                    ${icons.trendingUp} Média 
                    ${questionSortBy === 'average' ? (questionSortOrder === 'asc' ? '↑' : '↓') : ''}
                  </button>
                </div>
              </div>
              
              <div class="filter-group">
                <label class="filter-label">Filtrar comentários:</label>
                <div class="filter-buttons">
                  <button 
                    onclick="${onFilterComments}('all')" 
                    class="btn btn-outline btn-xs ${questionFilterComments === 'all' ? 'active' : ''}"
                  >
                    Todas
                  </button>
                  <button 
                    onclick="${onFilterComments}('most')" 
                    class="btn btn-outline btn-xs ${questionFilterComments === 'most' ? 'active' : ''}"
                  >
                    Mais Comentadas
                  </button>
                  <button 
                    onclick="${onFilterComments}('least')" 
                    class="btn btn-outline btn-xs ${questionFilterComments === 'least' ? 'active' : ''}"
                  >
                    Menos Comentadas
                  </button>
                </div>
              </div>
            </div>
            
            <div class="questions-legend">
              <span class="legend-item inverted-legend" title="Perguntas onde Concordo = negativo e Discordo = positivo">
                <span class="legend-marker yellow"></span>
                Perguntas invertidas (↔️ Concordo/Discordo invertidos)
              </span>
            </div>
            
            <div class="questions-list">
              ${[...questions]
                .filter(q => !selectedPillar || q.pillar === selectedPillar)
                .filter(q => {
                  // Filtro de comentários
                  if (questionFilterComments === 'most') {
                    const qStat = stats.questionStats?.find(s => s.question_id === q.id);
                    return (qStat?.comment_count || 0) > 0;
                  } else if (questionFilterComments === 'least') {
                    const qStat = stats.questionStats?.find(s => s.question_id === q.id);
                    return (qStat?.comment_count || 0) === 0;
                  }
                  return true; // 'all' - mostra todas
                })
                .sort((a, b) => {
                  const aStat = stats.questionStats?.find(s => s.question_id === a.id);
                  const bStat = stats.questionStats?.find(s => s.question_id === b.id);
                  
                  // Ordenação baseada no tipo selecionado
                  if (questionSortBy === 'id') {
                    const order = questionSortOrder === 'asc' ? 1 : -1;
                    return (a.id - b.id) * order;
                  } else if (questionSortBy === 'comments') {
                    const order = questionSortOrder === 'asc' ? 1 : -1;
                    return ((aStat?.comment_count || 0) - (bStat?.comment_count || 0)) * order;
                  } else if (questionSortBy === 'average') {
                    const order = questionSortOrder === 'asc' ? 1 : -1;
                    return ((aStat?.average || 0) - (bStat?.average || 0)) * order;
                  }
                  
                  // Default: ordenar por comentários (mantido para compatibilidade)
                  return (bStat?.comment_count || 0) - (aStat?.comment_count || 0);
                }).map(q => {
                  const qStat = stats.questionStats?.find(s => s.question_id === q.id);
                  const isSelected = selectedQuestion === q.id;
                  const isInverted = q.isNegative;
                  return `
                    <button
                      onclick="${onSelectQuestion}(${q.id})"
                      class="question-list-item ${isSelected ? 'selected' : ''} ${isInverted ? 'inverted' : ''}"
                    >
                      <div class="question-info">
                        <span class="q-number">${q.id}</span>
                        <p class="q-text">${q.text}</p>
                        ${isInverted ? `<span class="q-inverted-badge" title="Pergunta invertida: Concordo = negativo, Discordo = positivo">↔️ Invertida</span>` : ''}
                      </div>
                      <div class="question-meta">
                        ${qStat?.average ? `
                          <span class="q-average" style="color: ${getScoreColor(qStat.average)}">
                            ${qStat.average.toFixed(1)}
                          </span>
                        ` : ''}
                        ${qStat?.comment_count > 0 ? `
                          <span class="q-comments">
                            ${icons.messageSquare}
                            ${qStat.comment_count}
                          </span>
                        ` : ''}
                      </div>
                    </button>
                  `;
                }).join('')}
            </div>
          </div>
          
          <div class="card comments-card">
            <h3 class="card-title">
              ${icons.messageSquare}
              Comentários
            </h3>
            ${renderCommentList(selectedQuestionComments, selectedQuestion, questions)}
          </div>
        </div>
      </main>
    </div>
    
    <!-- Botão Flutuante Nitai -->
    <div id="nitaiFloatButton" class="nitai-float-button" onclick="window.toggleNitaiChat()" title="Abrir chat com Nitai">
      <span class="button-text">💬 Nitai</span>
      <span class="minimize-icon">${icons.minus}</span>
    </div>
    
    <!-- Widget de Chat Flutuante -->
    <div id="nitaiChatWidget" class="chat-widget-container hidden">
      <!-- Indicador de resize canto superior esquerdo -->
      <div id="widgetResizeHandleTopLeft" class="widget-resize-handle-top-left" title="Arraste para redimensionar">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L4 8M2 8L4 6M2 8L6 8" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <!-- Indicador de resize canto inferior esquerdo -->
      <div id="widgetResizeHandleBottomLeft" class="widget-resize-handle-bottom-left" title="Arraste para redimensionar">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2L4 4M2 4L4 6M2 4L6 4" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <!-- Indicador de resize meio superior -->
      <div id="widgetResizeHandleTop" class="widget-resize-handle-top" title="Arraste para mover para cima/baixo">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2L4 4M6 2L8 4M6 2V10" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <div class="widget-header">
        <div class="widget-title">
          ${icons.messageSquare}
          <span class="nitai-badge">Nitai - Assistente de Clima</span>
        </div>
        <div class="widget-controls">
          <button onclick="window.toggleNitaiChat()" class="btn btn-outline btn-xs">
            ${icons.x}
          </button>
        </div>
      </div>
      
      <div class="widget-body">
        <div class="widget-actions">
          <button onclick="window.gerarRelatorioCompleto(this)" class="btn btn-purple btn-xs" title="Gerar relatório completo com IA">
            ${icons.fileText} Gerar Relatório Completo
          </button>
        </div>
        
        <div class="chat-messages" id="widgetChatMessages">
          <div class="welcome-message">
            🌟 <strong>Olá! Sou a Nitai, sua assistente de Clima Organizacional!</strong><br><br>
            Estou aqui para ajudá-lo a entender melhor os resultados da pesquisa de clima da Nordeste Locações.
          </div>
        </div>
        
        <div class="widget-input">
          <textarea 
            id="widgetChatInput" 
            placeholder="💬 Converse com a Nitai sobre liderança, cultura, benefícios..."
            onkeypress="window.handleWidgetChatKeyPress(event)"
            class="widget-input-textarea"
            rows="2"
          ></textarea>
          <button onclick="window.enviarWidgetMessage()" class="btn btn-primary">
            ${icons.send}
          </button>
        </div>
      </div>
      
      <!-- Indicador de resize -->
      <div id="widgetResizeHandle" class="widget-resize-handle" title="Arraste para redimensionar">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M10 10L8 8M8 10L6 8M8 8L10 6" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  `;
}

function getScoreColor(score) {
  if (score >= 3.5) return 'var(--green-500)';
  if (score >= 2.5) return 'var(--yellow-500)';
  return 'var(--red-500)';
}

function renderHeatmap(pillarStats) {
  if (!pillarStats || pillarStats.length === 0) {
    return '<p class="no-data">Sem dados disponíveis</p>';
  }
  
  const getColorClass = (favorability) => {
    const value = parseFloat(favorability) || 0;
    if (value >= 75) return 'heatmap-green';
    if (value >= 50) return 'heatmap-yellow';
    return 'heatmap-red';
  };
  
  const getEmoji = (favorability) => {
    const value = parseFloat(favorability) || 0;
    if (value >= 75) return '🟢';
    if (value >= 50) return '🟡';
    return '🔴';
  };
  
  return `
    <div class="heatmap-table">
      <div class="heatmap-row heatmap-header">
        <div class="heatmap-cell">Pilar</div>
        <div class="heatmap-cell">Favorabilidade</div>
        <div class="heatmap-cell">Status</div>
      </div>
      ${pillarStats.map(pillar => `
        <div class="heatmap-row">
          <div class="heatmap-cell pillar-name">
            ${pillar.pillar === 'Comprometimento Organizacional' ? 'Comprom. Org.' : 
              pillar.pillar === 'Gestão do Capital Humano' ? 'Gestão de Pessoas' : 
              pillar.pillar}
          </div>
          <div class="heatmap-cell ${getColorClass(pillar.favorabilidade)}">
            ${parseFloat(pillar.favorabilidade || 0).toFixed(1)}%
          </div>
          <div class="heatmap-cell">
            ${getEmoji(pillar.favorabilidade)} ${parseFloat(pillar.favorabilidade || 0) >= 75 ? 'Ótimo' : 
              parseFloat(pillar.favorabilidade || 0) >= 50 ? 'Atenção' : 'Crítico'}
          </div>
        </div>
      `).join('')}
    </div>
    <div class="heatmap-legend">
      <div class="legend-item">
        <span class="legend-color heatmap-green"></span>
        <span>≥ 75% (Ótimo)</span>
      </div>
      <div class="legend-item">
        <span class="legend-color heatmap-yellow"></span>
        <span>50-74% (Atenção)</span>
      </div>
      <div class="legend-item">
        <span class="legend-color heatmap-red"></span>
        <span>&lt; 50% (Crítico)</span>
      </div>
    </div>
  `;
}

function renderWorstQuestions(questionStats, allQuestions) {
  const worstQuestions = [...questionStats]
    .sort((a, b) => (a.favorabilidade || 0) - (b.favorabilidade || 0))
    .slice(0, 5);
  
  if (worstQuestions.length === 0) {
    return '<p class="no-data">Sem dados disponíveis</p>';
  }
  
  return `
    <div class="ranking-table">
      <div class="ranking-header">
        <div>Pergunta</div>
        <div>Favorabilidade</div>
      </div>
      ${worstQuestions.map((q, index) => {
        const question = allQuestions.find(qq => qq.id === q.question_id);
        const questionText = question ? question.text.substring(0, 80) + '...' : 'Pergunta não encontrada';
        const favorability = q.favorabilidade || 0;
        const colorClass = favorability >= 75 ? 'ranking-green' : favorability >= 50 ? 'ranking-yellow' : 'ranking-red';
        
        return `
          <div class="ranking-row">
            <div class="ranking-question">
              <span class="ranking-position">${index + 1}.</span>
              <div>
                <strong>Q${q.question_id}:</strong> ${questionText}
                <div class="ranking-pillar">${question?.pillar || ''}</div>
              </div>
            </div>
            <div class="ranking-value ${colorClass}">
              ${favorability.toFixed(1)}%
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderBestQuestions(questionStats, allQuestions) {
  const bestQuestions = [...questionStats]
    .sort((a, b) => (b.favorabilidade || 0) - (a.favorabilidade || 0))
    .slice(0, 5);
  
  if (bestQuestions.length === 0) {
    return '<p class="no-data">Sem dados disponíveis</p>';
  }
  
  return `
    <div class="ranking-table">
      <div class="ranking-header">
        <div>Pergunta</div>
        <div>Favorabilidade</div>
      </div>
      ${bestQuestions.map((q, index) => {
        const question = allQuestions.find(qq => qq.id === q.question_id);
        const questionText = question ? question.text.substring(0, 80) + '...' : 'Pergunta não encontrada';
        const favorability = q.favorabilidade || 0;
        const colorClass = favorability >= 75 ? 'ranking-green' : favorability >= 50 ? 'ranking-yellow' : 'ranking-red';
        
        return `
          <div class="ranking-row">
            <div class="ranking-question">
              <span class="ranking-position">${index + 1}.</span>
              <div>
                <strong>Q${q.question_id}:</strong> ${questionText}
                <div class="ranking-pillar">${question?.pillar || ''}</div>
              </div>
            </div>
            <div class="ranking-value ${colorClass}">
              ${favorability.toFixed(1)}%
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

window.renderAdminView = renderAdminView;
window.getScoreColor = getScoreColor;
window.renderHeatmap = renderHeatmap;
window.renderWorstQuestions = renderWorstQuestions;
window.renderBestQuestions = renderBestQuestions;
