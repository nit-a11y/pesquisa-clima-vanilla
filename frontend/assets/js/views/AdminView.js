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
  onSelectQuestion, 
  onClearDatabase, 
  onExport,
  onFilterUnit,
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
            onclick="${onClearDatabase}()" 
            class="btn btn-danger btn-sm"
            ${isClearing ? 'disabled' : ''}
          >
            ${isClearing 
              ? `<span class="spinner-sm"></span> Limpando...` 
              : `${icons.trash} Limpar Dados`}
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
            value: avgPillar.toFixed(1),
            icon: 'trendingUp',
            color: 'yellow',
            delay: 0.1
          })}
          ${renderStatsCard({
            label: 'Taxa de Engajamento',
            value: `${stats.engagementRate?.toFixed(1) || 0}%`,
            icon: 'zap',
            color: 'green',
            sub: 'Comentários / Respostas possíveis',
            delay: 0.2
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
        
        <!-- Gráficos -->
        <div class="charts-grid">
          ${renderChartContainer({
            title: 'Tendência por Pergunta',
            icon: 'trendingUp',
            chartId: 'trendChart',
            size: 'large'
          })}
          
          ${renderChartContainer({
            title: 'Satisfação por Unidade',
            icon: 'shieldCheck',
            chartId: 'unitChart'
          })}
          
          ${renderChartContainer({
            title: 'Satisfação por Pilar',
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
                Todas as Questões
              </h3>
              <span class="questions-hint">Clique para ver comentários</span>
            </div>
            
            <div class="questions-list">
              ${[...questions].sort((a, b) => {
                const aStat = stats.questionStats?.find(s => s.question_id === a.id);
                const bStat = stats.questionStats?.find(s => s.question_id === b.id);
                return (bStat?.comment_count || 0) - (aStat?.comment_count || 0);
              }).map(q => {
                const qStat = stats.questionStats?.find(s => s.question_id === q.id);
                const isSelected = selectedQuestion === q.id;
                return `
                  <button
                    onclick="${onSelectQuestion}(${q.id})"
                    class="question-list-item ${isSelected ? 'selected' : ''}"
                  >
                    <div class="question-info">
                      <span class="q-number">${q.id}</span>
                      <p class="q-text">${q.text}</p>
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
  `;
}

function getScoreColor(score) {
  if (score >= 3.5) return 'var(--green-500)';
  if (score >= 2.5) return 'var(--yellow-500)';
  return 'var(--red-500)';
}

window.renderAdminView = renderAdminView;
window.getScoreColor = getScoreColor;
