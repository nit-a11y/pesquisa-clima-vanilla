/*
 * Componente: AdvancedChat
 * Sistema avançado de chat com IA mantendo contexto e gerando análises visuais
 */

function renderAdvancedChat({ isVisible, messages, isLoading, onSendMessage, onGenerateAnalysis, onClearContext }) {
  if (!isVisible) return '';
  
  return `
    <div class="advanced-chat-overlay" onclick="window.fecharChatAvancado(event)">
      <div class="advanced-chat-container" onclick="event.stopPropagation()">
        <div class="chat-header">
          <div class="chat-title">
            ${icons.messageSquare}
            <span class="nitai-badge">🚀 Nitai - Assistente de Clima</span>
          </div>
          <div class="chat-actions">
            <button onclick="window.gerarAnaliseVisual()" class="btn btn-purple btn-sm">
              ${icons.barChart} Gerar Análise Visual
            </button>
            <button onclick="window.limparContextoChat()" class="btn btn-outline btn-sm">
              ${icons.refresh} Limpar Contexto
            </button>
            <button onclick="window.fecharChatAvancado()" class="btn-close">
              ${icons.x}
            </button>
          </div>
        </div>
        
        <div class="chat-content">
          <div class="chat-messages" id="advancedChatMessages">
            ${messages.map(msg => `
              <div class="chat-message ${msg.role}">
                <div class="message-header">
                  <strong>${msg.role === 'user' ? '👤 Você' : msg.role === 'assistant' ? '🚀 Nitai' : '📊 Sistema'}</strong>
                  <span class="message-time">${new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="message-content">
                  ${formatMessageContent(msg.content, msg.hasSVG, msg.svgCode)}
                </div>
                ${msg.metadata?.generateSVG ? `
                  <div class="message-actions">
                    <button onclick="window.baixarSVG('${encodeURIComponent(msg.svgCode)}')" class="btn btn-outline btn-xs">
                      ${icons.download} Baixar SVG
                    </button>
                    <button onclick="window.copiarSVG('${encodeURIComponent(msg.svgCode)}')" class="btn btn-outline btn-xs">
                      ${icons.clipboard} Copiar SVG
                    </button>
                  </div>
                ` : ''}
              </div>
            `).join('')}
            
            ${isLoading ? `
              <div class="chat-message assistant">
                <div class="message-content">
                  <div class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                  </div>
                  <span>Analisando...</span>
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="chat-input-container">
            <div class="input-actions">
              <button onclick="window.incluirContexto()" class="btn btn-outline btn-sm" title="Incluir contexto da pesquisa">
                ${icons.database} Contexto
              </button>
              <button onclick="window.gerarSVGResposta()" class="btn btn-outline btn-sm" title="Gerar resposta em formato SVG">
                ${icons.image} Gerar SVG
              </button>
              <select id="analysisType" class="analysis-type-select">
                <option value="completa">Análise Completa</option>
                <option value="rapida">Análise Rápida</option>
              </select>
            </div>
            
            <div class="input-wrapper">
              <textarea 
                id="advancedChatInput" 
                placeholder="💬 Converse com a Nitai sobre liderança, cultura, benefícios... estou pronta para ajudar!"
                onkeypress="window.handleAdvancedChatKeyPress(event)"
                class="chat-input-textarea"
                rows="3"
              ></textarea>
              <button onclick="window.enviarMensagemAvancada()" class="btn btn-primary">
                ${icons.send}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function formatMessageContent(content, hasSVG, svgCode) {
  if (hasSVG && svgCode) {
    // Extrair partes textual e SVG
    const textMatch = content.match(/📊 ANÁLISE TEXTUAL[\s\S]*?🎨 CÓDIGO SVG/s);
    const svgMatch = content.match(/🎨 CÓDIGO SVG[\s\S]*?```svg\n([\s\S]*?)\n```/);
    
    let textPart = content;
    let svgPart = null;
    
    if (textMatch) {
      textPart = content.substring(0, content.indexOf('🎨 CÓDIGO SVG')).trim();
    }
    
    if (svgMatch) {
      svgPart = svgMatch[1];
    }
    
    return `
      <div class="message-text">
        ${textPart.replace(/\n/g, '<br>')}
      </div>
      ${svgPart ? `
        <div class="message-svg">
          <div class="svg-container">
            ${svgPart}
          </div>
        </div>
      ` : ''}
    `;
  }
  
  return `<div class="message-text">${content.replace(/\n/g, '<br>')}</div>`;
}

function showAdvancedChat() {
  const welcomeMessage = {
    role: 'assistant',
    content: `🌟 <strong>Olá! Sou a Nitai, sua assistente de Clima Organizacional!</strong><br><br>
    Estou aqui para ajudá-lo a entender melhor os resultados da pesquisa de clima da Nordeste Locações. 
    Pode me perguntar sobre:<br><br>
    📊 <em>Análises e insights dos dados</em><br>
    💡 <em>Sugestões de melhoria</em><br>
    📈 <em>Gráficos e visualizações</em><br>
    🎯 <em>Indicadores por pilar</em><br><br>
    <strong>Como posso ajudar hoje?</strong>`,
    timestamp: new Date().toISOString()
  };
  
  const chatHtml = renderAdvancedChat({
    isVisible: true,
    messages: [welcomeMessage],
    isLoading: false,
    onSendMessage: () => {},
    onGenerateAnalysis: () => {},
    onClearContext: () => {}
  });
  
  // Criar container do chat se não existir
  if (!document.getElementById('advancedChatContainer')) {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'advancedChatContainer';
    document.body.appendChild(chatContainer);
  }
  
  document.getElementById('advancedChatContainer').innerHTML = chatHtml;
  document.body.style.overflow = 'hidden';
  
  // Focar no input
  setTimeout(() => {
    document.getElementById('advancedChatInput')?.focus();
  }, 100);
}

function updateAdvancedChat({ messages, isLoading }) {
  const chatHtml = renderAdvancedChat({
    isVisible: true,
    messages,
    isLoading,
    onSendMessage: () => {},
    onGenerateAnalysis: () => {},
    onClearContext: () => {}
  });
  
  document.getElementById('advancedChatContainer').innerHTML = chatHtml;
  
  // Manter scroll no final
  const messagesContainer = document.getElementById('advancedChatMessages');
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function hideAdvancedChat() {
  const chatContainer = document.getElementById('advancedChatContainer');
  if (chatContainer) {
    chatContainer.innerHTML = '';
    document.body.style.overflow = '';
  }
}

function addMessageToAdvancedChat(role, content, metadata = {}) {
  const messagesContainer = document.getElementById('advancedChatMessages');
  if (!messagesContainer) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${role}`;
  messageDiv.innerHTML = formatMessageContent(content, metadata.hasSVG, metadata.svgCode);
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function baixarSVG(svgCode) {
  try {
    const decodedSVG = decodeURIComponent(svgCode);
    const blob = new Blob([decodedSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `analise-clima-${new Date().toISOString().split('T')[0]}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao baixar SVG:', error);
    alert('Erro ao baixar arquivo SVG');
  }
}

function copiarSVG(svgCode) {
  try {
    const decodedSVG = decodeURIComponent(svgCode);
    navigator.clipboard.writeText(decodedSVG).then(() => {
      // Feedback visual
      const btn = event.target;
      const originalText = btn.innerHTML;
      btn.innerHTML = `${icons.check} Copiado!`;
      btn.classList.add('btn-success');
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('btn-success');
      }, 2000);
    }).catch(err => {
      console.error('Erro ao copiar SVG:', err);
      alert('Erro ao copiar SVG');
    });
  } catch (error) {
    console.error('Erro ao copiar SVG:', error);
    alert('Erro ao copiar SVG');
  }
}

window.renderAdvancedChat = renderAdvancedChat;
window.showAdvancedChat = showAdvancedChat;
window.updateAdvancedChat = updateAdvancedChat;
window.hideAdvancedChat = hideAdvancedChat;
window.addMessageToAdvancedChat = addMessageToAdvancedChat;
window.baixarSVG = baixarSVG;
window.copiarSVG = copiarSVG;
