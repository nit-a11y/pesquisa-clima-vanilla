/*
 * View: PcoAdminView
 * Dashboard administrativo PCO - Pesquisa de Clima Organizacional 2025
 * Replicação exata do AdminView para dados da PCO
 */

function renderPcoAdminView({ 
  stats, 
  questionStats, 
  pillarStats, 
  comments, 
  selectedQuestion, 
  isExporting,
  questionSortOrder,
  questionSortBy,
  questionFilterComments,
  onSelectQuestion, 
  onExport,
  onSortQuestions,
  onFilterComments,
  onBack
}) {
    
  if (!stats || !questionStats) {
    return `
      <div class="admin-loading">
        <div class="spinner"></div>
        <p>Carregando painel PCO...</p>
      </div>
    `;
  }
  
  const avgSatisfaction = parseFloat(stats.satisfacaoGeral) || 0;
  const questionWithMostComments = questionStats.reduce((prev, current) => 
    (prev?.totalComentarios > current?.totalComentarios) ? prev : current, questionStats[0]);
  
  const selectedQuestionComments = comments.filter(c => 
    c.perguntaId === selectedQuestion
  );

  
  // Função para determinar status do pilar
  function getPillarStatus(satisfaction) {
    const sat = parseFloat(satisfaction);
    if (sat >= 75) return { text: 'Ótimo', class: 'status-good' };
    if (sat >= 50) return { text: 'Atenção', class: 'status-warning' };
    return { text: 'Crítico', class: 'status-critical' };
  }

  // Função para determinar status da questão
  function getQuestionStatus(satisfaction) {
    const sat = parseFloat(satisfaction);
    if (sat >= 75) return { text: 'Ótimo', class: 'status-good' };
    if (sat >= 50) return { text: 'Atenção', class: 'status-warning' };
    return { text: 'Crítico', class: 'status-critical' };
  }

  // Filtrar e ordenar perguntas
  let filteredQuestions = [...questionStats];
  
  // Aplicar filtro de comentários
  if (questionFilterComments === 'most') {
    filteredQuestions = filteredQuestions.filter(q => q.totalComentarios > 0);
  } else if (questionFilterComments === 'least') {
    filteredQuestions = filteredQuestions.filter(q => q.totalComentarios > 0).reverse();
  }
  
  // Aplicar ordenação
  filteredQuestions.sort((a, b) => {
    let aValue, bValue;
    
    switch (questionSortBy) {
      case 'id':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'comments':
        aValue = a.totalComentarios;
        bValue = b.totalComentarios;
        break;
      case 'satisfaction':
        aValue = parseFloat(a.percentualSatisfacao);
        bValue = parseFloat(b.percentualSatisfacao);
        break;
      default:
        aValue = a.id;
        bValue = b.id;
    }
    
    if (questionSortOrder === 'desc') {
      return bValue - aValue;
    }
    return aValue - bValue;
  });

  return `
    <div class="admin-page">
      <header class="admin-header">
        <div class="admin-header-left">
          ${renderLogo(onBack)}
          <div class="admin-title-group">
            <h1>Painel Administrativo PCO</h1>
            <span class="admin-subtitle">Pesquisa de Clima Organizacional 2025</span>
          </div>
        </div>
        
        <div class="admin-header-right">
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
          
          <button 
            id="dictionaryHelpBtn"
            class="btn btn-outline btn-sm"
            title="Abrir Dicionário de Métricas"
            onclick="openDictionaryPanel()"
          >
            ${icons.helpCircle}
            Dicionário
          </button>
        </div>
      </header>

      <main class="admin-main">
        <!-- Cards Principais -->
        <section class="admin-cards">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">${icons.users}</div>
              <div class="stat-content">
                <h3>Total de Respostas</h3>
                <p class="stat-number">${stats.totalRespondentes}</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">${icons.trendingUp}</div>
              <div class="stat-content">
                <h3>Satisfação Geral</h3>
                <p class="stat-number">${avgSatisfaction.toFixed(1)}%</p>
                <span class="stat-subtitle">% Concordo + Concordo Sempre</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">${icons.messageSquare}</div>
              <div class="stat-content">
                <h3>Questão + Comentada</h3>
                <p class="stat-number">Q${questionWithMostComments?.id || 'N/A'}</p>
                <span class="stat-subtitle">${questionWithMostComments?.totalComentarios || 0} comentários</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Heatmap de Desempenho por Pilar -->
        <section class="admin-section">
          <h2>Heatmap de Desempenho por Pilar</h2>
          <div class="heatmap-container">
            <div class="heatmap-grid">
              ${pillarStats.map(pillar => {
                const status = getPillarStatus(pillar.percentualSatisfacao);
                return `
                  <div class="heatmap-item">
                    <div class="heatmap-pilar">${pillar.pilar}</div>
                    <div class="heatmap-satisfaction">${pillar.percentualSatisfacao}%</div>
                    <div class="heatmap-status ${status.class}">${status.text}</div>
                  </div>
                `;
              }).join('')}
            </div>
            <div class="heatmap-legend">
              <div class="legend-item">
                <span class="legend-color status-good"></span>
                <span>≥ 75% (Ótimo)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color status-warning"></span>
                <span>50-74% (Atenção)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color status-critical"></span>
                <span>&lt; 50% (Crítico)</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Gráficos -->
        <section class="admin-section">
          <div class="charts-grid">
            <!-- Distribuição das Respostas -->
            <div class="chart-container">
              <h3>Distribuição das Respostas (Escala Likert)</h3>
              <div class="chart-placeholder">
                <div class="likert-distribution">
                  <div class="likert-bar">
                    <div class="likert-item concordo-sempre" style="width: ${(questionStats.reduce((sum, q) => sum + q.concordoSempre, 0) / questionStats.reduce((sum, q) => sum + q.totalRespostas, 0) * 100)}%">
                      <span>Concordo Sempre</span>
                    </div>
                    <div class="likert-item concordo" style="width: ${(questionStats.reduce((sum, q) => sum + q.concordo, 0) / questionStats.reduce((sum, q) => sum + q.totalRespostas, 0) * 100)}%">
                      <span>Concordo</span>
                    </div>
                    <div class="likert-item discordo" style="width: ${(questionStats.reduce((sum, q) => sum + q.discordo, 0) / questionStats.reduce((sum, q) => sum + q.totalRespostas, 0) * 100)}%">
                      <span>Discordo</span>
                    </div>
                    <div class="likert-item discordo-sempre" style="width: ${(questionStats.reduce((sum, q) => sum + q.discordoSempre, 0) / questionStats.reduce((sum, q) => sum + q.totalRespostas, 0) * 100)}%">
                      <span>Discordo Sempre</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Satisfação por Pilar -->
            <div class="chart-container">
              <h3>Satisfação por Pilar</h3>
              <div class="chart-placeholder">
                <div class="pillar-chart">
                  ${pillarStats.map(pillar => `
                    <div class="pillar-bar">
                      <div class="pillar-label">${pillar.pilar}</div>
                      <div class="pillar-progress">
                        <div class="pillar-fill" style="width: ${pillar.percentualSatisfacao}%"></div>
                      </div>
                      <div class="pillar-value">${pillar.percentualSatisfacao}%</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Alertas Críticos -->
        <section class="admin-section">
          <h2>Alertas Críticos</h2>
          <div class="alerts-grid">
            ${questionStats
              .filter(q => parseFloat(q.percentualSatisfacao) < 50)
              .map(question => {
                const status = getQuestionStatus(question.percentualSatisfacao);
                return `
                  <div class="alert-card alert-critical">
                    <div class="alert-header">
                      <div class="alert-icon">${icons.alertTriangle}</div>
                      <div class="alert-title">
                        <h4>Crítico: Q${question.id}</h4>
                        <span class="alert-percentage">${question.percentualSatisfacao}% Discordam</span>
                      </div>
                    </div>
                    <p class="alert-description">${question.pergunta}</p>
                    <div class="alert-meta">
                      <span class="alert-pillar">${question.pilar}</span>
                    </div>
                    <div class="alert-suggestions">
                      <p><strong>Sugestões Estratégicas:</strong></p>
                      <ul>
                        <li>Promover dinâmicas de integração entre equipes</li>
                        <li>Revisar processos internos para reduzir atritos</li>
                        <li>Fortalecer canais de comunicação</li>
                        <li>Estabelecer reuniões periódicas de alinhamento</li>
                      </ul>
                    </div>
                  </div>
                `;
              }).join('')}
          </div>
        </section>

        <!-- Top Piores e Melhores Perguntas -->
        <section class="admin-section">
          <div class="top-questions-grid">
            <!-- Top Piores -->
            <div class="top-questions-card">
              <h3>Top Piores Perguntas</h3>
              <div class="top-questions-list">
                ${questionStats
                  .sort((a, b) => parseFloat(a.percentualSatisfacao) - parseFloat(b.percentualSatisfacao))
                  .slice(0, 5)
                  .map((q, index) => `
                    <div class="top-question-item worst">
                      <span class="question-rank">${index + 1}.</span>
                      <div class="question-content">
                        <span class="question-text">Q${q.id}: ${q.pergunta.substring(0, 60)}...</span>
                        <span class="question-pillar">${q.pilar}</span>
                      </div>
                      <span class="question-percentage">${q.percentualSatisfacao}%</span>
                    </div>
                  `).join('')}
              </div>
            </div>

            <!-- Top Melhores -->
            <div class="top-questions-card">
              <h3>Top Melhores Perguntas</h3>
              <div class="top-questions-list">
                ${questionStats
                  .sort((a, b) => parseFloat(b.percentualSatisfacao) - parseFloat(a.percentualSatisfacao))
                  .slice(0, 5)
                  .map((q, index) => `
                    <div class="top-question-item best">
                      <span class="question-rank">${index + 1}.</span>
                      <div class="question-content">
                        <span class="question-text">Q${q.id}: ${q.pergunta.substring(0, 60)}...</span>
                        <span class="question-pillar">${q.pilar}</span>
                      </div>
                      <span class="question-percentage">${q.percentualSatisfacao}%</span>
                    </div>
                  `).join('')}
              </div>
            </div>
          </div>
        </section>

        <!-- Todas as Questões -->
        <section class="admin-section">
          <div class="questions-header">
            <h2>Todas as Questões</h2>
            <div class="questions-controls">
              <div class="control-group">
                <label>Clique para ver comentários</label>
              </div>
              <div class="control-group">
                <label>Ordenar por:</label>
                <select onchange="${onSortQuestions}('id', this.value === 'desc' ? 'desc' : 'asc')" class="control-select">
                  <option value="asc">Número ↑</option>
                  <option value="desc">Número ↓</option>
                </select>
              </div>
              <div class="control-group">
                <select onchange="${onSortQuestions}('comments', this.value === 'desc' ? 'desc' : 'asc')" class="control-select">
                  <option value="desc">Comentários</option>
                </select>
              </div>
              <div class="control-group">
                <select onchange="${onSortQuestions}('satisfaction', this.value === 'desc' ? 'desc' : 'asc')" class="control-select">
                  <option value="desc">Satisfação</option>
                </select>
              </div>
              <div class="control-group">
                <select onchange="${onFilterComments}(this.value)" class="control-select">
                  <option value="all">Todas</option>
                  <option value="most">Mais Comentadas</option>
                  <option value="least">Menos Comentadas</option>
                </select>
              </div>
            </div>
          </div>

          <div class="questions-grid">
            ${filteredQuestions.map(question => {
              const status = getQuestionStatus(question.percentualSatisfacao);
              const isSelected = selectedQuestion === question.id;
              
              return `
                <div class="question-card ${isSelected ? 'selected' : ''}" onclick="${onSelectQuestion}(${question.id})">
                  <div class="question-header">
                    <span class="question-number">Q${question.id}</span>
                    <span class="question-status ${status.class}">${status.text}</span>
                  </div>
                  <p class="question-text">${question.pergunta}</p>
                  <div class="question-stats">
                    <div class="stat-item">
                      <span class="stat-label">Satisfação</span>
                      <span class="stat-value">${question.percentualSatisfacao}%</span>
                    </div>
                    ${question.totalComentarios > 0 ? `
                      <div class="stat-item">
                        <span class="stat-label">Comentários</span>
                        <span class="stat-value">${question.totalComentarios}</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Comentários da Questão Selecionada -->
        ${selectedQuestion ? `
          <section class="admin-section">
            <div class="comments-header">
              <h2>Comentários</h2>
              <p>Questão Q${selectedQuestion}: ${questionStats.find(q => q.id === selectedQuestion)?.pergunta}</p>
            </div>
            
            <div class="comments-container">
              ${selectedQuestionComments.length > 0 ? selectedQuestionComments.map(comment => `
                <div class="comment-card">
                  <div class="comment-header">
                    <span class="comment-date">${comment.data || 'Data não informada'}</span>
                  </div>
                  <p class="comment-text">${comment.comentario}</p>
                </div>
              `).join('') : `
                <div class="no-comments">
                  <p>Nenhum comentário encontrado para esta questão.</p>
                </div>
              `}
            </div>
          </section>
        ` : ''}
      </main>
    </div>
  `;
}

// Exportar a função para uso global
window.renderPcoAdminView = renderPcoAdminView;
