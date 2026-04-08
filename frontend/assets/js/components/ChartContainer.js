/*
 * Componente: ChartContainer
 * Container para gráficos Chart.js
 */

function renderChartContainer({ title, icon, chartId, size = 'normal', extraHeader = '' }) {
  const sizeClass = size === 'large' ? 'chart-large' : size === 'small' ? 'chart-small' : '';
  
  return `
    <div class="card chart-card ${sizeClass}">
      <div class="chart-header">
        <h3 class="chart-title">
          <span class="chart-icon">${icons[icon] || ''}</span>
          ${title}
        </h3>
        ${extraHeader}
      </div>
      <div class="chart-container">
        <canvas id="${chartId}"></canvas>
      </div>
    </div>
  `;
}

window.renderChartContainer = renderChartContainer;
