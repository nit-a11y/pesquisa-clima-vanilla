/*
 * View: SuccessView
 * Página de agradecimento após envio
 */

function renderSuccessView(onBackToHome) {
  return `
    <div class="success-page">
      ${renderFloatingBackground()}
      
      <main class="success-main">
        <div class="success-icon-large">
          ${icons.checkCircle.replace('width="20" height="20"', 'width="64" height="64"')}
        </div>
        
        <h1 class="success-title">Obrigado pela sua participação!</h1>
        
        <p class="success-message">
          Sua opinião é muito importante para nós. <br/>
          Juntos, vamos construir um ambiente de trabalho ainda melhor.
        </p>
        
        <div class="success-actions">
          <button onclick="${onBackToHome}()" class="btn btn-outline btn-lg">
            ${icons.home}
            Voltar ao Início
          </button>
        </div>
        
        <footer class="success-footer">
          <p>© 2026 Nordeste Locações — Núcleo de Inteligência e Tecnologia (NIT)</p>
        </footer>
      </main>
    </div>
  `;
}

window.renderSuccessView = renderSuccessView;
