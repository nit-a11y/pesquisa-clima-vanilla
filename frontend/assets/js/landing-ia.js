/**
 * Landing Page com IA Integrada
 * Sistema inteligente que processa dados da pesquisa em tempo real
 */

class LandingIA {
  constructor() {
    this.relatorioId = this.extractRelatorioId();
    this.dadosProcessados = null;
    this.analisePrincipal = null;
    this.analiseComentarios = null;
    this.processando = false;
    this.cacheValidacao = new Map();
    
    this.init();
  }

  /**
   * Inicializa a landing page com IA
   */
  async init() {
    try {
      console.log('[LANDING IA] Inicializando sistema inteligente');
      
      // Mostrar loading
      this.showLoading('Iniciando análise inteligente...');
      
      // Inicializar interface
      this.inicializarInterface();
      
      // Processar dados com IA
      await this.processarDadosComIA();
      
      // Renderizar conteúdo
      await this.renderizarConteudoInteligente();
      
      // Inicializar interações
      this.inicializarInteracoesIA();
      
      // Esconder loading
      this.hideLoading();
      
    } catch (error) {
      console.error('[LANDING IA] Erro na inicialização:', error);
      this.showError('Não foi possível processar os dados. Usando modo offline...');
      await this.initModoOffline();
    }
  }

  /**
   * Extrai ID do relatório da URL
   */
  extractRelatorioId() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1] || null;
  }

  /**
   * Inicializa interface da landing page
   */
  inicializarInterface() {
    // Criar elementos dinâmicos
    this.criarElementosInterface();
    
    // Adicionar listeners
    this.adicionarListenersInterface();
    
    // Configurar tema
    this.configurarTema();
  }

  /**
   * Cria elementos dinâmicos da interface
   */
  criarElementosInterface() {
    const container = document.querySelector('.hero-content') || document.body;
    
    // Botão de processamento com IA
    const btnProcessar = document.createElement('div');
    btnProcessar.className = 'ia-processamento-container';
    btnProcessar.innerHTML = `
      <button id="btnProcessarIA" class="btn-ia-processamento">
        <span class="btn-icon">🤖</span>
        <span class="btn-text">Processar com IA</span>
        <div class="btn-loading hidden">
          <div class="spinner"></div>
          <span>Processando...</span>
        </div>
      </button>
      <div class="ia-status" id="iaStatus">
        <span class="status-icon">⚪</span>
        <span class="status-text">Sistema pronto</span>
      </div>
    `;
    container.appendChild(btnProcessar);

    // Chat de suporte flutuante
    const chatSuporte = document.createElement('div');
    chatSuporte.className = 'chat-suporte-flutuante';
    chatSuporte.innerHTML = `
      <button id="btnChatSuporte" class="chat-toggle">
        <span class="chat-icon">💬</span>
        <span class="chat-badge">IA</span>
      </button>
      <div class="chat-container hidden" id="chatContainer">
        <div class="chat-header">
          <h4>Assistente IA</h4>
          <button class="chat-close" id="chatClose">×</button>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="message system">
            <span class="message-text">Olá! Sou o assistente IA da Nordeste Locações. Posso ajudar você a validar dados, gerar insights ou responder perguntas sobre a pesquisa de clima.</span>
          </div>
        </div>
        <div class="chat-input-container">
          <input type="text" id="chatInput" placeholder="Digite sua pergunta..." />
          <button id="chatSend" class="chat-send">
            <span>➤</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(chatSuporte);

    // Painel de validação de dados
    const painelValidacao = document.createElement('div');
    painelValidacao.className = 'painel-validacao hidden';
    painelValidacao.id = 'painelValidacao';
    painelValidacao.innerHTML = `
      <div class="validacao-header">
        <h3>Validação de Dados</h3>
        <button class="validacao-close" id="validacaoClose">×</button>
      </div>
      <div class="validacao-content">
        <div class="validacao-status" id="validacaoStatus">
          <div class="status-item">
            <span class="status-label">Status:</span>
            <span class="status-value" id="validacaoStatusText">Aguardando...</span>
          </div>
          <div class="status-item">
            <span class="status-label">Similaridade:</span>
            <span class="status-value" id="validacaoSimilaridade">--</span>
          </div>
        </div>
        <div class="validacao-detalhes" id="validacaoDetalhes">
          <!-- Detalhes serão preenchidos dinamicamente -->
        </div>
      </div>
    `;
    document.body.appendChild(painelValidacao);
  }

  /**
   * Adiciona listeners da interface
   */
  adicionarListenersInterface() {
    // Botão de processamento com IA
    const btnProcessar = document.getElementById('btnProcessarIA');
    if (btnProcessar) {
      btnProcessar.addEventListener('click', () => this.processarDadosComIA());
    }

    // Chat de suporte
    const btnChat = document.getElementById('btnChatSuporte');
    const chatClose = document.getElementById('chatClose');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');

    if (btnChat) {
      btnChat.addEventListener('click', () => this.toggleChat());
    }

    if (chatClose) {
      chatClose.addEventListener('click', () => this.toggleChat());
    }

    if (chatSend) {
      chatSend.addEventListener('click', () => this.enviarMensagemChat());
    }

    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.enviarMensagemChat();
        }
      });
    }

    // Painel de validação
    const validacaoClose = document.getElementById('validacaoClose');
    if (validacaoClose) {
      validacaoClose.addEventListener('click', () => this.togglePainelValidacao());
    }

    // Listener para validação de dados
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-validar]')) {
        this.validarDadoElemento(e.target.closest('[data-validar]'));
      }
    });
  }

  /**
   * Processa dados com IA
   */
  async processarDadosComIA() {
    if (this.processando) {
      console.log('[LANDING IA] Já está processando...');
      return;
    }

    this.processando = true;
    this.atualizarStatusIA('processando', 'Processando dados com IA...');

    try {
      // Mostrar loading no botão
      this.toggleLoadingBotao(true);

      console.log('[LANDING IA] Enviando dados para processamento completo');

      // Processar pesquisa completa com IA
      const response = await fetch('/api/landing-ia/processar-completo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          unidade: 'all'
        })
      });

      const resultado = await response.json();

      if (!resultado.sucesso) {
        throw new Error(resultado.erro || 'Erro no processamento');
      }

      console.log('[LANDING IA] Dados processados com sucesso');

      // Armazenar resultados
      this.dadosProcessados = resultado.dados;
      this.analisePrincipal = resultado.dados.analise_principal;
      this.analiseComentarios = resultado.dados.analise_comentarios;

      // Renderizar conteúdo
      await this.renderizarConteudoInteligente();

      // Atualizar status
      this.atualizarStatusIA('concluido', 'Processamento concluído com sucesso!');

    } catch (error) {
      console.error('[LANDING IA] Erro no processamento:', error);
      this.atualizarStatusIA('erro', `Erro: ${error.message}`);
      this.showError('Não foi possível processar com IA. Tentando modo offline...');
      await this.initModoOffline();
    } finally {
      this.processando = false;
      this.toggleLoadingBotao(false);
    }
  }

  /**
   * Renderiza conteúdo inteligente
   */
  async renderizarConteudoInteligente() {
    if (!this.dadosProcessados) {
      console.warn('[LANDING IA] Dados não processados ainda');
      return;
    }

    console.log('[LANDING IA] Renderizando conteúdo inteligente');

    // Renderizar seções com IA
    await this.renderizarSecaoComIA('resumo_executivo', this.dadosProcessados.resumo_executivo);
    await this.renderizarSecaoComIA('diagnostico_geral', this.dadosProcessados.diagnostico_geral);
    await this.renderizarSecaoComIA('problemas_criticos', this.dadosProcessados.problemas_criticos);
    await this.renderizarSecaoComIA('pontos_fortes', this.dadosProcessados.pontos_fortes);
    await this.renderizarSecaoComIA('plano_acao', this.dadosProcessados.plano_acao);
    await this.renderizarSecaoComIA('insights_adicionais', this.dadosProcessados.insights_adicionais);
    await this.renderizarSecaoComIA('conclusao', this.dadosProcessados.conclusao);

    // Renderizar análise de comentários
    await this.renderizarAnaliseComentarios();

    // Adicionar elementos interativos
    this.adicionarElementosInterativos();
  }

  /**
   * Renderiza seção específica com IA
   */
  async renderizarSecaoComIA(secaoId, dadosSecao) {
    const container = document.getElementById(`secao-${secaoId}`);
    if (!container) {
      console.warn(`[LANDING IA] Container da seção ${secaoId} não encontrado`);
      return;
    }

    // Adicionar indicador de IA
    const iaIndicator = document.createElement('div');
    iaIndicator.className = 'ia-indicator';
    iaIndicator.innerHTML = `
      <span class="ia-icon">🤖</span>
      <span class="ia-text">Gerado por IA</span>
    `;

    // Renderizar conteúdo
    container.innerHTML = `
      <div class="secao-header">
        <span class="secao-icone">${this.getIconeSecao(secaoId)}</span>
        <h2 class="secao-titulo">${dadosSecao?.titulo || this.getTituloPadrao(secaoId)}</h2>
        <div class="secao-meta">
          ${iaIndicator.outerHTML}
          <span class="secao-timestamp">Processado em ${new Date().toLocaleTimeString('pt-BR')}</span>
        </div>
      </div>
      <div class="secao-conteudo ia-processado">
        <div class="conteudo-ia">
          ${this.formatarConteudoIA(dadosSecao?.conteudo || 'Conteúdo em processamento...')}
        </div>
        ${dadosSecao?.insights_comentarios && dadosSecao.insights_comentarios.length > 0 ? `
          <div class="insights-comentarios">
            <h4>Insights dos Comentários:</h4>
            <ul>
              ${dadosSecao.insights_comentarios.map(insight => `
                <li class="insight-item">
                  <span class="insight-icon">💡</span>
                  <span class="insight-text">${insight}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;

    // Adicionar atributos para validação
    container.setAttribute('data-secao', secaoId);
    container.setAttribute('data-validar', 'true');
    container.setAttribute('data-conteudo-ia', dadosSecao?.conteudo || '');
  }

  /**
   * Renderiza análise de comentários
   */
  async renderizarAnaliseComentarios() {
    if (!this.analiseComentarios) return;

    const container = document.getElementById('analise-comentarios') || 
                    document.querySelector('.content-section:last-child');
    
    if (!container) return;

    const analiseHTML = `
      <div class="analise-comentarios-container">
        <div class="analise-header">
          <h3>Análise de Comentários</h3>
          <div class="analise-meta">
            <span class="total-comentarios">${this.analiseComentarios?.total_comentarios || 0} comentários</span>
            <span class="processado-ia">🤖 IA</span>
          </div>
        </div>
        
        ${this.analiseComentarios?.padroes_identificados?.padroes?.length > 0 ? `
          <div class="padroes-section">
            <h4>Padrões Identificados</h4>
            <div class="padroes-grid">
              ${(this.analiseComentarios.padroes_identificados.padroes || []).map(padrao => `
                <div class="padrao-card">
                  <div class="padrao-icon">🔍</div>
                  <div class="padrao-text">${padrao}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${this.analiseComentarios?.problemas_mencionados?.length > 0 ? `
          <div class="problemas-section">
            <h4>Problemas Mais Mencionados</h4>
            <div class="problemas-list">
              ${(this.analiseComentarios.problemas_mencionados || []).map((problema, index) => `
                <div class="problema-item">
                  <div class="problema-rank">${index + 1}</div>
                  <div class="problema-content">
                    <h5>${problema}</h5>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${this.analiseComentarios?.pontos_fortes?.length > 0 ? `
          <div class="pontos-fortes-section">
            <h4>Pontos Fortes Identificados</h4>
            <div class="pontos-list">
              ${(this.analiseComentarios.pontos_fortes || []).map((ponto, index) => `
                <div class="ponto-item">
                  <div class="ponto-rank">${index + 1}</div>
                  <div class="ponto-content">
                    <h5>${ponto}</h5>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${this.analiseComentarios?.recomendacoes?.length > 0 ? `
          <div class="recomendacoes-section">
            <h4>Recomendações Baseadas nos Comentários</h4>
            <div class="recomendacoes-list">
              ${(this.analiseComentarios.recomendacoes || []).map(rec => `
                <div class="recomendacao-item">
                  <div class="recomendacao-icon">🎯</div>
                  <div class="recomendacao-text">${rec}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Inserir análise após a última seção
    const analiseDiv = document.createElement('div');
    analiseDiv.className = 'content-section analise-comentarios-section';
    analiseDiv.innerHTML = analiseHTML;
    
    container.parentNode.insertBefore(analiseDiv, container.nextSibling);
  }

  /**
   * Adiciona elementos interativos
   */
  adicionarElementosInterativos() {
    // Adicionar botões de validação em elementos de dados
    this.adicionarBotoesValidacao();
    
    // Adicionar tooltips com insights da IA
    this.adicionarTooltipsIA();
    
    // Adicionar botões de exportação
    this.adicionarBotoesExportacao();
  }

  /**
   * Adiciona botões de validação
   */
  adicionarBotoesValidacao() {
    const elementosDados = document.querySelectorAll('[data-conteudo-ia]');
    
    elementosDados.forEach(elemento => {
      const btnValidar = document.createElement('button');
      btnValidar.className = 'btn-validar-dado';
      btnValidar.innerHTML = '🔍 Validar';
      btnValidar.onclick = () => this.validarDadoElemento(elemento);
      
      elemento.appendChild(btnValidar);
    });
  }

  /**
   * Valida um elemento específico
   */
  async validarDadoElemento(elemento) {
    const secao = elemento.getAttribute('data-secao');
    const conteudo = elemento.getAttribute('data-conteudo-ia');
    
    if (!conteudo) {
      this.showNotification('Nenhum dado para validar', 'warning');
      return;
    }

    try {
      console.log(`[LANDING IA] Validando seção: ${secao}`);

      const response = await fetch('/api/landing-ia/validar-dados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dados_para_validar: {
            secao,
            conteudo,
            timestamp: new Date().toISOString()
          },
          unidade: 'all'
        })
      });

      const resultado = await response.json();

      if (resultado.sucesso) {
        this.mostrarPainelValidacao(resultado.validacao);
      } else {
        throw new Error(resultado.erro || 'Erro na validação');
      }

    } catch (error) {
      console.error('[LANDING IA] Erro na validação:', error);
      this.showNotification('Erro na validação: ' + error.message, 'error');
    }
  }

  /**
   * Mostra painel de validação
   */
  mostrarPainelValidacao(validacao) {
    const painel = document.getElementById('painelValidacao');
    const statusText = document.getElementById('validacaoStatusText');
    const similaridade = document.getElementById('validacaoSimilaridade');
    const detalhes = document.getElementById('validacaoDetalhes');

    if (!painel) return;

    // Atualizar status
    statusText.textContent = validacao.dados_batem ? '✅ Dados Válidos' : '⚠️ Divergências';
    statusText.className = `status-value ${validacao.dados_batem ? 'valido' : 'invalido'}`;
    
    similaridade.textContent = `${validacao.percentual_similaridade}%`;
    similaridade.className = `status-value ${validacao.percentual_similaridade >= 80 ? 'valido' : 'invalido'}`;

    // Mostrar detalhes
    if (validacao.divergencias && validacao.divergencias.length > 0) {
      detalhes.innerHTML = `
        <h4>Divergências Encontradas:</h4>
        <ul>
          ${validacao.divergencias.map(div => `
            <li class="divergencia-item">
              <strong>${div.campo}:</strong>
              <span class="valor-fornecido">Fornecido: ${div.fornecido}</span>
              <span class="valor-sistema">Sistema: ${div.sistema}</span>
            </li>
          `).join('')}
        </ul>
      `;
    } else {
      detalhes.innerHTML = `
        <div class="validacao-sucesso">
          <span class="sucesso-icon">✅</span>
          <span class="sucesso-text">Todos os dados conferem com o sistema!</span>
        </div>
      `;
    }

    // Mostrar painel
    painel.classList.remove('hidden');
  }

  /**
   * Toggle do chat de suporte
   */
  toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
      chatContainer.classList.toggle('hidden');
    }
  }

  /**
   * Envia mensagem para o chat
   */
  async enviarMensagemChat() {
    const input = document.getElementById('chatInput');
    const mensagem = input.value.trim();
    
    if (!mensagem) return;

    // Adicionar mensagem do usuário
    this.adicionarMensagemChat(mensagem, 'user');
    
    // Limpar input
    input.value = '';

    try {
      console.log(`[LANDING IA] Enviando mensagem para chat: "${mensagem}"`);

      const response = await fetch('/api/landing-ia/chat-suporte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mensagem,
          dados_selecionados: this.obterDadosContexto(),
          contexto_pagina: {
            url: window.location.href,
            titulo: document.title,
            secoes: this.obterSecoesVisiveis()
          }
        })
      });

      const resultado = await response.json();

      if (resultado.sucesso) {
        this.adicionarMensagemChat(resultado.resposta, 'assistant');
      } else {
        throw new Error(resultado.erro || 'Erro no chat');
      }

    } catch (error) {
      console.error('[LANDING IA] Erro no chat:', error);
      this.adicionarMensagemChat('Desculpe, não foi possível processar sua mensagem. Tente novamente.', 'system');
    }
  }

  /**
   * Adiciona mensagem ao chat
   */
  adicionarMensagemChat(mensagem, tipo) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}`;
    messageDiv.innerHTML = `
      <span class="message-text">${mensagem}</span>
      <span class="message-time">${new Date().toLocaleTimeString('pt-BR')}</span>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /**
   * Toggle do painel de validação
   */
  togglePainelValidacao() {
    const painel = document.getElementById('painelValidacao');
    if (painel) {
      painel.classList.toggle('hidden');
    }
  }

  /**
   * Métodos utilitários
   */
  getIconeSecao(secaoId) {
    const icones = {
      'resumo_executivo': '📊',
      'diagnostico_geral': '🔍',
      'problemas_criticos': '⚠️',
      'pontos_fortes': '💪',
      'plano_acao': '🚀',
      'insights_adicionais': '💡',
      'conclusao': '🎯'
    };
    return icones[secaoId] || '📄';
  }

  getTituloPadrao(secaoId) {
    const titulos = {
      'resumo_executivo': 'Resumo Executivo',
      'diagnostico_geral': 'Diagnóstico Geral',
      'problemas_criticos': 'Top 3 Problemas Críticos',
      'pontos_fortes': 'Top 3 Pontos Fortes',
      'plano_acao': 'Plano de Ação Recomendado',
      'insights_adicionais': 'Insights Adicionais',
      'conclusao': 'Conclusão e Visão de Futuro'
    };
    return titulos[secaoId] || 'Análise';
  }

  formatarConteudoIA(conteudo) {
    if (!conteudo) return '';
    
    return conteudo
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^\n/g, '<br>');
  }

  atualizarStatusIA(status, mensagem) {
    const statusElement = document.getElementById('iaStatus');
    if (!statusElement) return;

    const iconElement = statusElement.querySelector('.status-icon');
    const textElement = statusElement.querySelector('.status-text');

    const icones = {
      'processando': '🔄',
      'concluido': '✅',
      'erro': '❌',
      'pronto': '⚪'
    };

    iconElement.textContent = icones[status] || '⚪';
    textElement.textContent = mensagem;
    statusElement.className = `ia-status status-${status}`;
  }

  toggleLoadingBotao(loading) {
    const btn = document.getElementById('btnProcessarIA');
    const btnText = btn?.querySelector('.btn-text');
    const btnLoading = btn?.querySelector('.btn-loading');

    if (loading) {
      btn?.classList.add('loading');
      btnText?.classList.add('hidden');
      btnLoading?.classList.remove('hidden');
    } else {
      btn?.classList.remove('loading');
      btnText?.classList.remove('hidden');
      btnLoading?.classList.add('hidden');
    }
  }

  showLoading(mensagem = 'Processando...') {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.querySelector('h2').textContent = mensagem;
      loadingScreen.classList.remove('hidden');
    }
  }

  hideLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 500);
    }
  }

  showError(mensagem) {
    this.hideLoading();
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.innerHTML = `
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <h1>Erro no Processamento</h1>
          <p>${mensagem}</p>
          <button onclick="location.reload()" class="btn btn-primary">
            Tentar Novamente
          </button>
        </div>
      `;
    }
  }

  showNotification(mensagem, tipo = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${tipo}`;
    notification.innerHTML = `
      <span class="notification-icon">${tipo === 'success' ? '✅' : tipo === 'error' ? '❌' : 'ℹ️'}</span>
      <span class="notification-text">${mensagem}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  obterDadosContexto() {
    return {
      dados_processados: this.dadosProcessados,
      analise_principal: this.analisePrincipal,
      analise_comentarios: this.analiseComentarios,
      timestamp: new Date().toISOString()
    };
  }

  obterSecoesVisiveis() {
    const secoes = document.querySelectorAll('.content-section');
    return Array.from(secoes).map(secao => ({
      id: secao.id,
      titulo: secao.querySelector('.secao-titulo')?.textContent,
      visivel: !secao.classList.contains('hidden')
    }));
  }

  configurarTema() {
    // Adicionar classes de tema
    document.body.classList.add('landing-ia-theme');
  }

  inicializarInteracoesIA() {
    // Adicionar listeners para elementos interativos
    this.adicionarListenersTooltips();
    this.adicionarListenersExportacao();
  }

  adicionarListenersTooltips() {
    // Implementar tooltips para elementos com IA
    document.addEventListener('mouseenter', (e) => {
      if (e.target.closest('.ia-processado')) {
        this.mostrarTooltip(e.target, 'Conteúdo gerado por Inteligência Artificial');
      }
    });
  }

  adicionarListenersExportacao() {
    // Adicionar listeners para exportação
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-exportar')) {
        this.exportarDados();
      }
    });
  }

  adicionarBotoesExportacao() {
    const header = document.querySelector('.hero-header');
    if (!header) return;

    const exportContainer = document.createElement('div');
    exportContainer.className = 'export-container';
    exportContainer.innerHTML = `
      <button class="btn-exportar" title="Exportar análise completa">
        <span class="export-icon">📥</span>
        <span class="export-text">Exportar</span>
      </button>
    `;

    header.appendChild(exportContainer);
  }

  adicionarTooltipsIA() {
    // Implementar tooltips personalizados
    const elementosIA = document.querySelectorAll('.ia-processado');
    
    elementosIA.forEach(elemento => {
      elemento.addEventListener('mouseenter', (e) => {
        this.mostrarTooltip(e.target, 'Processado com IA');
      });
      
      elemento.addEventListener('mouseleave', () => {
        this.esconderTooltip();
      });
    });
  }

  mostrarTooltip(elemento, texto) {
    const tooltip = document.createElement('div');
    tooltip.className = 'ia-tooltip';
    tooltip.textContent = texto;
    
    document.body.appendChild(tooltip);
    
    const rect = elemento.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - 30) + 'px';
  }

  esconderTooltip() {
    const tooltip = document.querySelector('.ia-tooltip');
    if (tooltip) {
      document.body.removeChild(tooltip);
    }
  }

  exportarDados() {
    if (!this.dadosProcessados) {
      this.showNotification('Nenhum dado para exportar', 'warning');
      return;
    }

    const dadosExportar = {
      metadados: {
        exportado_em: new Date().toISOString(),
        sistema: 'Landing Page IA',
        versao: '2.0.0'
      },
      dados_processados: this.dadosProcessados,
      analise_principal: this.analisePrincipal,
      analise_comentarios: this.analiseComentarios
    };

    const blob = new Blob([JSON.stringify(dadosExportar, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-ia-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification('Dados exportados com sucesso!', 'success');
  }

  /**
   * Inicializa modo offline
   */
  async initModoOffline() {
    console.log('[LANDING IA] Inicializando modo offline');
    
    // Implementar modo offline básico
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.innerHTML = `
        <div class="offline-container">
          <h1>Modo Offline</h1>
          <p>Sistema operando em modo offline. Funcionalidades básicas disponíveis.</p>
          <button onclick="location.reload()" class="btn btn-primary">
            Tentar Reconexão
          </button>
        </div>
      `;
    }
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new LandingIA();
});
