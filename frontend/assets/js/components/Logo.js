/*
 * Componente: Logo
 * Renderiza o logo da empresa
 */

const LOGO_NORDESTE_PATH = 'assets/images/nordeste-logo-with-text.svg';

function renderLogo(onClick = null) {
  const clickAttr = onClick ? `onclick="${onClick}" style="cursor: pointer;"` : '';
  return `
    <div class="logo" ${clickAttr}>
      <img src="${LOGO_NORDESTE_PATH}" alt="Nordeste Locações" class="logo-img">
    </div>
  `;
}

window.LOGO_NORDESTE_PATH = LOGO_NORDESTE_PATH;
window.renderLogo = renderLogo;
