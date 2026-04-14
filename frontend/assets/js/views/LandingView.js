/*
 * View: LandingView
 * Página inicial com boas-vindas e seleção de unidade
 */

function renderLandingView(onStartSurvey, onGoToAdmin) {
  return `
    <div class="landing-page">
      ${renderFloatingBackground()}
      
      <main class="landing-main">
        <div class="landing-content">
          ${renderLogo()}
          
          <div class="landing-hero">
            <span class="landing-badge">
              ${icons.clipboard}
              Pesquisa de Clima Organizacional 2026
            </span>
            
            <h1 class="landing-title">
              Sua opinião é
              <span class="text-gradient">fundamental</span>
              para o nosso crescimento
            </h1>
            
            <p class="landing-description">
              Participe da pesquisa de clima organizacional da Nordeste Locações. 
              Suas respostas são anônimas e nos ajudam a criar um ambiente de trabalho melhor para todos.
            </p>
            
            <div class="landing-features">
              <div class="feature-item">
                <div class="feature-icon">🔒</div>
                <span>100% Anônimo</span>
              </div>
              <div class="feature-item" onclick="window.location.href=questions.length <= 3 ? 'index.html' : 'index-demo.html'" style="cursor: pointer;" title="Clique para alternar versão">
                <div class="feature-icon">⚡</div>
                <span>5 minutos</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📊</div>
                <span>45 questões</span>
              </div>
            </div>
          </div>
          
          <div class="landing-actions">
            <button onclick="${onStartSurvey}()" class="btn btn-primary btn-xl">
              Iniciar Pesquisa
              ${icons.arrowRight}
            </button>
            
            <button onclick="${onGoToAdmin}()" class="btn btn-ghost btn-md">
              ${icons.lock}
              Acesso Administrativo
            </button>
          </div>
        </div>
        
        <footer class="landing-footer">
          <p>© 2026 Nordeste Locações — Núcleo de Inteligência e Tecnologia (NIT)</p>
        </footer>
      </main>
    </div>
  `;
}

function renderFloatingBackground() {
  return `
    <div class="floating-background">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    </div>
  `;
}

function renderUnitSelector(selectedUnit, onSelect) {
  return `
    <div class="unit-selector">
      <h3 class="unit-title">Selecione sua unidade</h3>
      <p class="unit-subtitle">Esta informação é opcional e usada apenas para análise estatística</p>
      
      <div class="unit-grid">
        ${UNITS.map(unit => `
          <button 
            type="button"
            class="unit-btn ${selectedUnit === unit ? 'selected' : ''}"
            onclick="${onSelect}('${unit}')"
          >
            <span class="unit-name">${unit}</span>
            ${selectedUnit === unit ? `<span class="unit-check">${icons.checkCircle}</span>` : ''}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

window.renderLandingView = renderLandingView;
window.renderFloatingBackground = renderFloatingBackground;
window.renderUnitSelector = renderUnitSelector;
