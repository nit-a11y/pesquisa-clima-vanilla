/*
 * Serviço: Advanced Chat Service
 * Gerencia o sistema avançado de chat com IA mantendo contexto e gerando análises visuais
 */

let chatSession = null;
let currentContext = null;

/**
 * Inicia nova sessão de chat avançado
 * @param {string} unidade - Unidade filtrada
 */
async function iniciarChatAvancado(unidade = 'all') {
  try {
    const response = await fetch('/api/chat/iniciar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ unidade })
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      chatSession = data.session;
      currentContext = data.dados;
      
      // Mostrar chat com contexto inicial
      showAdvancedChat();
      addMessageToAdvancedChat('system', 'Sessão iniciada com sucesso! Contexto da pesquisa carregado.');
      
      return { success: true, session: data.session, dados: data.dados };
    } else {
      throw new Error(data.erro || 'Erro ao iniciar chat');
    }
    
  } catch (error) {
    console.error('Erro ao iniciar chat avançado:', error);
    throw error;
  }
}

/**
 * Envia mensagem para o chat avançado
 * @param {string} mensagem - Mensagem do usuário
 * @param {Object} options - Opções adicionais
 */
async function enviarMensagemAvancada(mensagem, options = {}) {
  if (!chatSession) {
    throw new Error('Sessão não iniciada. Inicie o chat primeiro.');
  }
  
  try {
    const { gerarSVG = false, tipoAnalise = 'completa', incluirContexto = true } = options;
    
    // Mostrar indicador de carregamento
    updateAdvancedChat({ 
      messages: [...getMessages()], 
      isLoading: true 
    });
    
    const response = await fetch('/api/chat/enviar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mensagem,
        gerarSVG,
        tipoAnalise,
        incluirContexto
      })
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      // Adicionar mensagem do usuário
      addMessageToAdvancedChat('user', mensagem);
      
      // Adicionar resposta da IA
      addMessageToAdvancedChat('assistant', data.resposta, {
        hasSVG: data.temSVG,
        svgCode: data.codigoSVG,
        generateSVG: gerarSVG,
        analysisType: tipoAnalise
      });
      
      return { success: true, data };
    } else {
      throw new Error(data.erro || 'Erro ao enviar mensagem');
    }
    
  } catch (error) {
    console.error('Erro ao enviar mensagem avançada:', error);
    
    // Remover indicador de carregamento
    updateAdvancedChat({ 
      messages: [...getMessages()], 
      isLoading: false 
    });
    
    throw error;
  }
}

/**
 * Gera análise visual em SVG
 * @param {string} tipo - Tipo de análise
 */
async function gerarAnaliseVisualAvancada(tipo = 'completa') {
  if (!chatSession) {
    throw new Error('Sessão não iniciada. Inicie o chat primeiro.');
  }
  
  try {
    // Mostrar indicador de carregamento
    addMessageToAdvancedChat('system', 'Gerando análise visual...');
    
    const response = await fetch('/api/chat/analise-visual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        unidade: currentContext?.unidade || 'all',
        tipo
      })
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      // Adicionar análise ao chat
      addMessageToAdvancedChat('assistant', data.analise, {
        hasSVG: true,
        svgCode: data.analiseProcessada?.svgCode,
        generateSVG: true,
        analysisType: tipo
      });
      
      return { success: true, data };
    } else {
      throw new Error(data.erro || 'Erro ao gerar análise visual');
    }
    
  } catch (error) {
    console.error('Erro ao gerar análise visual:', error);
    throw error;
  }
}

/**
 * Limpa contexto do chat
 */
async function limparContextoChat() {
  try {
    const response = await fetch('/api/chat/contexto', {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      chatSession = null;
      currentContext = null;
      
      addMessageToAdvancedChat('system', 'Contexto limpo com sucesso.');
      
      return { success: true };
    } else {
      throw new Error(data.erro || 'Erro ao limpar contexto');
    }
    
  } catch (error) {
    console.error('Erro ao limpar contexto:', error);
    throw error;
  }
}

/**
 * Obtém estatísticas do chat
 */
async function getEstatisticasChat() {
  try {
    const response = await fetch('/api/chat/estatisticas');
    const data = await response.json();
    
    if (data.sucesso) {
      return { success: true, stats: data.stats };
    } else {
      throw new Error(data.erro || 'Erro ao obter estatísticas');
    }
    
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw error;
  }
}

/**
 * Obtém mensagens atuais do chat
 * @returns {Array} Lista de mensagens
 */
function getMessages() {
  const messagesContainer = document.getElementById('advancedChatMessages');
  if (!messagesContainer) return [];
  
  const messages = [];
  const messageElements = messagesContainer.querySelectorAll('.chat-message');
  
  messageElements.forEach(element => {
    const role = element.classList.contains('user') ? 'user' : 
                   element.classList.contains('assistant') ? 'assistant' : 'system';
    const content = element.querySelector('.message-content')?.innerHTML || '';
    const timestamp = element.querySelector('.message-time')?.textContent || '';
    
    messages.push({
      role,
      content,
      timestamp,
      element
    });
  });
  
  return messages;
}

/**
 * Atualiza interface do chat
 * @param {Object} options - Opções de atualização
 */
function updateAdvancedChat(options = {}) {
  const { messages = [], isLoading = false } = options;
  
  // Renderizar o chat com as opções atuais
  const chatHtml = window.renderAdvancedChat({
    isVisible: true,
    messages,
    isLoading,
    onSendMessage: () => {},
    onGenerateAnalysis: () => {},
    onClearContext: () => {}
  });
  
  const container = document.getElementById('advancedChatContainer');
  if (container) {
    container.innerHTML = chatHtml;
    
    // Manter scroll no final
    const messagesContainer = document.getElementById('advancedChatMessages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
}

/**
 * Manipula tecla Enter no chat
 * @param {Event} event - Evento do teclado
 */
function handleAdvancedChatKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    enviarMensagemAvancada();
  }
}

/**
 * Inclui contexto da pesquisa
 */
function incluirContexto() {
  const input = document.getElementById('advancedChatInput');
  if (!input) return;
  
  const contextText = `
Contexto da Pesquisa:
- Total de Respostas: ${currentContext?.dados_gerais?.total_respostas || 0}
- Favorabilidade Global: ${currentContext?.dados_gerais?.favorabilidade_global || 0}%
- Data: ${currentContext?.dados_gerais?.data_analise || 'N/A'}

Dimensões:
${currentContext?.dimensoes?.map(d => `- ${d.nome}: ${d.favorabilidade}%`).join('\n') || ''}

Top Piores:
${currentContext?.piores_perguntas?.slice(0, 3).map(p => `- Q${p.pergunta_id}: ${p.favorabilidade}%`).join('\n') || ''}

Top Melhores:
${currentContext?.melhores_perguntas?.slice(0, 3).map(p => `- Q${p.pergunta_id}: ${p.favorabilidade}%`).join('\n') || ''}
`;
  
  input.value = contextText;
  input.focus();
}

/**
 * Gera resposta em formato SVG
 */
function gerarSVGResposta() {
  const input = document.getElementById('advancedChatInput');
  const analysisType = document.getElementById('analysisType')?.value || 'completa';
  
  if (!input || !input.value.trim()) {
    alert('Digite uma mensagem antes de gerar SVG.');
    return;
  }
  
  enviarMensagemAvancada(input.value, {
    gerarSVG: true,
    tipoAnalise: analysisType,
    incluirContexto: true
  });
  
  input.value = '';
}

/**
 * Gera análise visual completa
 */
function gerarAnaliseVisual() {
  const analysisType = document.getElementById('analysisType')?.value || 'completa';
  
  gerarAnaliseVisualAvancada(analysisType);
}

/**
 * Limpa contexto do chat
 */
function limparContextoChat() {
  limparContextoChat();
}

/**
 * Fecha chat avançado
 * @param {Event} event - Evento de clique
 */
function fecharChatAvancado(event) {
  if (!event || event.target === event.currentTarget) {
    hideAdvancedChat();
  }
}

// Tornar funções globais
window.iniciarChatAvancado = iniciarChatAvancado;
window.enviarMensagemAvancada = enviarMensagemAvancada;
window.gerarAnaliseVisualAvancada = gerarAnaliseVisualAvancada;
window.limparContextoChat = limparContextoChat;
window.getEstatisticasChat = getEstatisticasChat;
window.handleAdvancedChatKeyPress = handleAdvancedChatKeyPress;
window.incluirContexto = incluirContexto;
window.gerarSVGResposta = gerarSVGResposta;
window.gerarAnaliseVisual = gerarAnaliseVisual;
window.fecharChatAvancado = fecharChatAvancado;
