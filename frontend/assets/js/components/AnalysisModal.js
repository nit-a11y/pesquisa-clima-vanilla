/*
 * Componente: AnalysisModal
 * Modal para exibir análise inteligente do clima
 */

function renderAnalysisModal({ isVisible, analysis, isLoading, onClose, onChat }) {
  if (!isVisible) return '';
  
  return `
    <div class="modal-overlay minimizable-modal" onclick="window.fecharModalAnalise(event)">
      <div class="modal-content analysis-modal chat-analyst-modal minimizable-content" onclick="event.stopPropagation()">
        <div class="analyst-header">
          <div class="analyst-profile">
            <div class="analyst-avatar">
              ${icons.user}
            </div>
            <div class="analyst-info">
              <h3 class="analyst-name">Nitai</h3>
              <p class="analyst-title">IA Especializada em Clima Organizacional</p>
              <p class="analyst-company">Nordeste Locações | NIT</p>
            </div>
          </div>
          <div class="analyst-controls">
            <div class="analyst-status">
              <span class="status-indicator online"></span>
              <span class="status-text">Analisando dados...</span>
            </div>
            <div class="modal-controls">
              <button onclick="window.minimizarModal()" class="btn btn-outline btn-xs" title="Minimizar">
                ${icons.minus} Minimizar
              </button>
              <button onclick="window.fecharModalAnalise()" class="btn-close">
                ${icons.x}
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-body">
          ${isLoading ? `
            <div class="analysis-loading chat-loading">
              <div class="analyst-thinking">
                <div class="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>Analisando dados da pesquisa de clima...</p>
                <p class="loading-subtitle">Preparando insights estratégicos para liderança</p>
              </div>
            </div>
          ` : `
            <div class="chat-container">
              <div class="chat-messages" id="chatMessages">
                ${analysis ? `
                  <div class="message analyst">
                    <div class="message-avatar">
                      ${icons.user}
                    </div>
                    <div class="message-content">
                      <div class="message-header">
                        <strong>Nitai</strong>
                        <span class="message-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div class="message-text">
                        ${formatAnalysisText(analysis)}
                      </div>
                      <div class="message-actions">
                        <button onclick="window.copiarAnalise()" class="btn btn-outline btn-xs">
                          ${icons.clipboard} Copiar
                        </button>
                        <button onclick="window.baixarAnalisePDF()" class="btn btn-primary btn-xs">
                          ${icons.download} Baixar PDF
                        </button>
                        <button onclick="window.gerarAnaliseVisual()" class="btn btn-success btn-xs">
                          ${icons.barChart} Gerar Visual
                        </button>
                      </div>
                    </div>
                  </div>
                ` : ''}
              </div>
              
              <div class="chat-input-container">
                <div class="input-actions">
                  <button onclick="window.incluirContexto()" class="btn btn-outline btn-sm" title="Incluir contexto">
                    ${icons.database} Contexto
                  </button>
                  <button onclick="window.gerarSVGResposta()" class="btn btn-outline btn-sm" title="Gerar resposta em SVG">
                    ${icons.image} Gerar SVG
                  </button>
                  <select id="analysisType" class="analysis-type-select">
                    <option value="completa">Análise Completa</option>
                    <option value="rapida">Análise Rápida</option>
                  </select>
                </div>
                
                <div class="input-wrapper">
                  <textarea 
                    id="chatInput" 
                    placeholder="Pergunte sobre liderança, cultura, benefícios... Peça análises visuais em SVG!"
                    onkeypress="window.handleChatKeyPress(event)"
                    class="chat-input-textarea"
                    rows="3"
                  ></textarea>
                  <button onclick="window.enviarMensagemChat()" class="btn btn-primary">
                    ${icons.send}
                  </button>
                </div>
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

function formatAnalysisText(text) {
  // Converter markdown para HTML básico
  return text
    .replace(/^### (.+)$/gm, '<h3 class="analysis-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="analysis-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="analysis-h1">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="analysis-li">$1</li>')
    .replace(/(<li class="analysis-li">.*<\/li>)/gs, '<ul class="analysis-ul">$1</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li class="analysis-ol">$1</li>')
    .replace(/(<li class="analysis-ol">.*<\/li>)/gs, '<ol class="analysis-ol">$1</ol>')
    .replace(/\n\n/g, '</p><p class="analysis-p">')
    .replace(/^/, '<p class="analysis-p">')
    .replace(/$/, '</p>');
}

function showAnalysisModal() {
  const modalHtml = renderAnalysisModal({
    isVisible: true,
    isLoading: false,
    analysis: '',
    onClose: () => {}
  });
  
  // Criar container do modal se não existir
  if (!document.getElementById('analysisModal')) {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'analysisModal';
    document.body.appendChild(modalContainer);
  }
  
  document.getElementById('analysisModal').innerHTML = modalHtml;
  document.body.style.overflow = 'hidden';
}

function updateAnalysisModal({ isLoading, analysis }) {
  const modalHtml = renderAnalysisModal({
    isVisible: true,
    isLoading,
    analysis,
    onClose: () => {}
  });
  
  document.getElementById('analysisModal').innerHTML = modalHtml;
}

function hideAnalysisModal() {
  const modal = document.getElementById('analysisModal');
  if (modal) {
    modal.innerHTML = '';
    document.body.style.overflow = '';
  }
}

/**
 * Adiciona mensagem ao chat
 * @param {string} role - 'user' | 'assistant' | 'system'
 * @param {string} content - Conteúdo da mensagem
 */
function addMessageToChat(role, content) {
  const messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${role}`;
  messageDiv.innerHTML = `
    <div class="message-header">
      <strong>${role === 'user' ? 'Você' : role === 'assistant' ? 'Nitai' : 'Sistema'}</strong>
      <span class="message-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div class="message-content">
      ${content.replace(/\n/g, '<br>')}
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Adiciona mensagem SVG ao chat
 * @param {string} svgContent - Conteúdo SVG
 */
function addSVGMensagem(svgContent) {
  const messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message assistant';
  messageDiv.innerHTML = `
    <div class="message-header">
      <strong>Nitai</strong>
      <span class="message-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div class="message-content svg-message">
      <div class="svg-container">
        ${svgContent}
      </div>
      <div class="svg-actions">
        <button onclick="window.copiarSVG()" class="btn btn-outline btn-xs">
          ${icons.clipboard} Copiar SVG
        </button>
        <button onclick="window.baixarSVG()" class="btn btn-success btn-xs">
          ${icons.download} Baixar SVG
        </button>
      </div>
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function minimizarModal() {
  const modal = document.querySelector('.minimizable-content');
  const overlay = document.querySelector('.modal-overlay');
   
  if (modal) {
    modal.classList.add('minimized');
  }
  
  // Remover overlay escuro quando minimizado
  if (overlay) {
    overlay.style.display = 'none';
  }
}

function restaurarModal() {
  const modal = document.querySelector('.minimizable-content');
  const overlay = document.querySelector('.modal-overlay');
  
  if (modal) {
    modal.classList.remove('minimized');
  }
  
  // Restaurar overlay quando restaurado
  if (overlay) {
    overlay.style.display = 'flex';
  }
}

window.renderAnalysisModal = renderAnalysisModal;
window.showAnalysisModal = showAnalysisModal;
window.updateAnalysisModal = updateAnalysisModal;
window.hideAnalysisModal = hideAnalysisModal;
window.addMessageToChat = addMessageToChat;
window.addSVGMensagem = addSVGMensagem;
window.minimizarModal = minimizarModal;
window.restaurarModal = restaurarModal;
