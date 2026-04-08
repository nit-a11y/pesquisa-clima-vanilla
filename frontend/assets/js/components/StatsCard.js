/*
 * Componente: StatsCard
 * Card de estatísticas para o dashboard
 */

function renderStatsCard({ label, value, icon, color, sub, delay = 0 }) {
  const colors = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500'
  };
  
  return `
    <div class="card stat-card animate-fade-in" style="animation-delay: ${delay}s;">
      <div class="stat-icon ${colors[color] || color}" style="color: white;">
        ${icons[icon] || ''}
      </div>
      <div class="stat-content">
        <p class="stat-label">${label}</p>
        <p class="stat-value">${value}</p>
        ${sub ? `<p class="stat-sub">${sub}</p>` : ''}
      </div>
    </div>
  `;
}

window.renderStatsCard = renderStatsCard;
