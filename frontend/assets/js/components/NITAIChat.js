/**
 * Componente: NITAI Chat
 * Chatbot inteligente para análise de clima organizacional
 */

function renderNITAIChat() {
  return `
    <div class="nitai-chat-section">
      <div class="card">
        <h3 class="card-title">
          🤖 Chat com NITAI
        </h3>
        <div class="chat-container">
          <div class="chat-messages" id="nitaiChatMessages">
            <div class="ai-message">
              <div class="ai-avatar">🤖</div>
              <div class="ai-content">
                <p>Olá! Sou a NITAI, sua assistente de inteligência artificial para análise de clima organizacional.</p>
                <p>Posso ajudar você com:</p>
                <ul>
                  <li>Análise detalhada dos comentários</li>
                  <li>Identificação de padrões e tendências</li>
                  <li>Recomendações personalizadas</li>
                  <li>Comparativos entre unidades</li>
                </ul>
                <p>Como posso ajudar você hoje?</p>
              </div>
            </div>
          </div>
          <div class="chat-input-container">
            <input 
              type="text" 
              id="nitaiChatInput" 
              placeholder="Digite sua pergunta para a NITAI..."
              class="chat-input"
              onkeypress="handleNITAIChatKeyPress(event)"
            />
            <button onclick="sendToNITAI()" class="btn btn-primary">
              ${icons.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Funções do Chat NITAI
function handleNITAIChatKeyPress(event) {
  if (event.key === 'Enter') {
    sendToNITAI();
  }
}

function sendToNITAI() {
  const input = document.getElementById('nitaiChatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  const chatMessages = document.getElementById('nitaiChatMessages');
  
  // Adicionar mensagem do usuário
  const userMessage = `
    <div class="user-message">
      <div class="user-content">
        <p>${message}</p>
        <span class="message-time">${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
    </div>
  `;
  
  chatMessages.innerHTML += userMessage;
  input.value = '';
  
  // Mostrar indicador de digitação
  const typingIndicator = `
    <div class="ai-message typing-indicator">
      <div class="ai-avatar">🤖</div>
      <div class="ai-content">
        <div class="dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <span class="typing-text">NITAI está digitando...</span>
      </div>
    </div>
  `;
  
  chatMessages.innerHTML += typingIndicator;
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Simular resposta da NITAI
  setTimeout(() => {
    // Remover indicador de digitação
    const typingElement = chatMessages.querySelector('.typing-indicator');
    if (typingElement) {
      typingElement.remove();
    }
    
    const aiResponse = generateNITAIResponse(message);
    const aiMessage = `
      <div class="ai-message">
        <div class="ai-avatar">🤖</div>
        <div class="ai-content">
          <p>${aiResponse}</p>
          <span class="message-time">${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>
    `;
    
    chatMessages.innerHTML += aiMessage;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1500);
}

function generateNITAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Respostas baseadas em palavras-chave
  if (lowerMessage.includes('benefício') || lowerMessage.includes('vale')) {
    return "Baseado na minha análise dos 634 comentários, os benefícios são a principal preocupação dos colaboradores. A questão Q15 teve 64 comentários com insatisfação de 41,67%. As principais reclamações são sobre vale alimentação e falta de plano de saúde. <strong>Recomendo revisão urgente do pacote de benefícios.</strong>";
  }
  
  if (lowerMessage.includes('unidade') || lowerMessage.includes('qual melhor')) {
    return "A unidade com melhor desempenho é <strong>Eusébio com 92,5% de satisfação</strong>. Juazeiro do Norte está em situação crítica com 79,2% e necessita intervenção imediata. A diferença entre a melhor e pior unidade é de 13,3 pontos percentuais.";
  }
  
  if (lowerMessage.includes('liderança') || lowerMessage.includes('chefe')) {
    return "A liderança é o pilar mais forte da organização com <strong>95,52% de satisfação média</strong>. No entanto, há relatos isolados de problemas em algumas unidades. Recomendo programa de desenvolvimento para líderes e monitoramento contínuo do clima.";
  }
  
  if (lowerMessage.includes('comunicação') || lowerMessage.includes('canal')) {
    return "A comunicação precisa melhorar, especialmente em Juazeiro do Norte onde a satisfação é de apenas 33,3%. <strong>Fortalecer canais de comunicação</strong> e garantir feedback contínuo são ações prioritárias.";
  }
  
  if (lowerMessage.includes('recomendação') || lowerMessage.includes('o que fazer')) {
    return "Com base na análise completa dos 634 comentários, recomendo: <strong>1) Revisar urgente pacote de benefícios; 2) Intervenção em Juazeiro do Norte; 3) Manter programas de liderança que funcionam; 4) Melhorar comunicação interna; 5) Implementar sistema de monitoramento contínuo.</strong>";
  }
  
  if (lowerMessage.includes('salário') || lowerMessage.includes('remuneração')) {
    return "A remuneração aparece em 23 comentários como preocupação secundária. Embora não seja a principal issue, há insatisfação com comparativos de mercado. Sugiro pesquisa salarial e plano de carreira para reter talentos.";
  }
  
  if (lowerMessage.includes('ambiente') || lowerMessage.includes('espaço')) {
    return "O ambiente de trabalho tem avaliação mista. Alguns colaboradores elogiam as condições físicas, enquanto outros reclamam de ventilação e espaço. Recomendo avaliação específica por unidade para identificar problemas locais.";
  }
  
  if (lowerMessage.includes('treinamento') || lowerMessage.includes('desenvolvimento')) {
    return "O desenvolvimento profissional é mencionado positivamente em vários comentários. Colaboradores valorizam oportunidades de crescimento. Manter e expandir programas de capacitação é um diferencial competitivo.";
  }
  
  if (lowerMessage.includes('cultura') || lowerMessage.includes('clima')) {
    return "A cultura organizacional está em evolução positiva. O tratamento entre colegas é bem avaliado (98,91% satisfação). O foco deve ser manter os pontos fortes e trabalhar as issues críticas identificadas.";
  }
  
  if (lowerMessage.includes('estatística') || lowerMessage.includes('número') || lowerMessage.includes('dados')) {
    return "Estatísticas gerais da pesquisa 2026: <strong>96 respondentes, 84,72% satisfação geral, 634 comentários analisados, 5 unidades avaliadas.</strong> A participação foi de 91,3% com redução de 57,3% no volume de comentários em relação à pesquisa anterior.";
  }
  
  // Resposta padrão
  return "Entendi sua pergunta. Com base na análise dos <strong>634 comentários</strong> e dados das <strong>5 unidades</strong>, posso ajudar com insights específicos. Você gostaria de saber sobre alguma unidade, categoria específica (benefícios, liderança, comunicação), ou precisa recomendações prioritárias?";
}

// Exportar funções globalmente
window.renderNITAIChat = renderNITAIChat;
window.handleNITAIChatKeyPress = handleNITAIChatKeyPress;
window.sendToNITAI = sendToNITAI;
window.generateNITAIResponse = generateNITAIResponse;
