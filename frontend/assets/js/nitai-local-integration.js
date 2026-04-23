/**
 * NITAI Local Integration
 * Integração frontend com motor IA local ultra-rápido
 * Substitui chamadas de API externa por processamento local
 */

class NITAILocalIntegration {
    constructor() {
        this.isLocalMode = true;
        this.performanceMetrics = {
            apiCalls: 0,
            localCalls: 0,
            avgResponseTime: 0,
            cacheHits: 0
        };
        
        this.initialize();
    }

    /**
     * Inicializa integração local
     */
    initialize() {
        console.log(' NITAI Local Integration initialized');
        console.log(' Mode: Ultra-fast local processing');
        
        // Substituir funções globais de API
        this.replaceGlobalFunctions();
        
        // Adicionar indicadores de performance
        this.addPerformanceIndicators();
    }

    /**
     * Substitui funções globais que usam API externa
     */
    replaceGlobalFunctions() {
        // Substituir iniciarChatUnificado
        window.iniciarChatUnificado = this.iniciarChatLocal.bind(this);
        
        // Substituir enviarMensagemUnificada
        window.enviarMensagemUnificada = this.enviarMensagemLocal.bind(this);
        
        // Substituir gerarAnaliseVisualUnificada
        window.gerarAnaliseVisualUnificada = this.gerarAnaliseVisualLocal.bind(this);
        
        // Substituir gerarRelatorioCompleto
        window.gerarRelatorioCompleto = this.gerarRelatorioLocal.bind(this);
        
        // Substituir limparContextoUnificado
        window.limparContextoUnificado = this.limparContextoLocal.bind(this);
        
        console.log(' Global functions replaced with local processing');
    }

    /**
     * Inicia chat local (substitui API externa)
     */
    async iniciarChatLocal() {
        const startTime = Date.now();
        
        try {
            const response = await fetch('/api/chat/iniciar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ unidade: 'all' })
            });
            
            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            if (data.sucesso) {
                this.updateMetrics('local', responseTime);
                
                // Manter compatibilidade com código existente
                if (window.chatSession !== undefined) {
                    window.chatSession = data.session;
                }
                if (window.currentContext !== undefined) {
                    window.currentContext = data.dados;
                }
                
                // Mostrar modal se existir
                if (window.showAnalysisModal) {
                    window.showAnalysisModal();
                    if (window.updateAnalysisModal) {
                        window.updateAnalysisModal({ 
                            isLoading: false, 
                            analysis: null 
                        });
                    }
                }
                
                // Iniciar chat automaticamente
                setTimeout(() => {
                    if (window.toggleChat) {
                        window.toggleChat();
                    }
                    if (window.enviarMensagemUnificadaAnalise) {
                        window.enviarMensagemUnificadaAnalise();
                    }
                }, 100);
                
                return { success: true, session: data.session, dados: data.dados };
            } else {
                throw new Error(data.erro || 'Erro ao iniciar chat local');
            }
            
        } catch (error) {
            console.error('Erro ao iniciar chat local:', error);
            this.updateMetrics('error', 0);
            throw error;
        }
    }

    /**
     * Envia mensagem para processamento local
     */
    async enviarMensagemLocal() {
        const input = document.getElementById('chatInput');
        const pergunta = input?.value?.trim();
        
        if (!pergunta) return;
        
        const startTime = Date.now();
        
        try {
            // Adicionar mensagem do usuário
            if (window.addMessageToChat) {
                window.addMessageToChat('user', pergunta);
            }
            
            if (input) {
                input.value = '';
            }
            
            // Preparar dados para API local
            const dadosParaAPI = {
                mensagem: pergunta,
                gerarSVG: false,
                tipoAnalise: 'completa',
                incluirContexto: true
            };
            
            // Chamar API local
            const response = await fetch('/api/chat/enviar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosParaAPI)
            });
            
            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            if (data.sucesso) {
                this.updateMetrics('local', responseTime);
                
                // Adicionar resposta ao chat
                if (window.addMessageToChat) {
                    window.addMessageToChat('assistant', data.resposta);
                }
                
                // Se tiver SVG, exibir
                if (data.temSVG && data.codigoSVG) {
                    if (window.addMessageToChat) {
                        window.addMessageToChat('system', ` Análise visual gerada com sucesso!`);
                    }
                }
                
            } else {
                throw new Error(data.erro || 'Erro desconhecido');
            }
            
        } catch (error) {
            console.error('Erro ao enviar mensagem local:', error);
            this.updateMetrics('error', 0);
            
            if (window.addMessageToChat) {
                window.addMessageToChat('system', ` Erro: ${error.message}`);
            }
        }
    }

    /**
     * Gera análise visual local
     */
    async gerarAnaliseVisualLocal() {
        const startTime = Date.now();
        
        try {
            if (window.addMessageToChat) {
                window.addMessageToChat('system', ' Gerando análise visual em SVG...');
            }
            
            const response = await fetch('/api/chat/analise-visual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    unidade: 'all',
                    tipo: 'completa'
                })
            });
            
            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            if (data.sucesso) {
                this.updateMetrics('local', responseTime);
                
                // Adicionar análise ao chat
                if (window.addMessageToChat) {
                    window.addMessageToChat('assistant', data.analise);
                }
                
                // Se tiver SVG, exibir
                if (data.analiseProcessada?.hasSVG && data.analiseProcessada?.svgCode) {
                    const svgContainer = document.createElement('div');
                    svgContainer.className = 'message-svg';
                    svgContainer.innerHTML = `
                        <div class="svg-container">
                            ${data.analiseProcessada.svgCode}
                        </div>
                        <div class="message-actions">
                            <button onclick="window.baixarSVG('${encodeURIComponent(data.analiseProcessada.svgCode)}')" class="btn btn-outline btn-xs">
                                ${window.icons?.download || ' '} Baixar SVG
                            </button>
                            <button onclick="window.copiarSVG('${encodeURIComponent(data.analiseProcessada.svgCode)}')" class="btn btn-outline btn-xs">
                                ${window.icons?.clipboard || ' '} Copiar SVG
                            </button>
                        </div>
                    `;
                    
                    const messagesContainer = document.getElementById('chatMessages');
                    if (messagesContainer) {
                        messagesContainer.appendChild(svgContainer);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                }
                
            } else {
                throw new Error(data.erro || 'Erro ao gerar análise visual');
            }
            
        } catch (error) {
            console.error('Erro ao gerar análise visual local:', error);
            this.updateMetrics('error', 0);
            
            if (window.addMessageToChat) {
                window.addMessageToChat('system', ` Erro: ${error.message}`);
            }
        }
    }

    /**
     * Gera relatório completo local
     */
    async gerarRelatorioLocal(buttonElement) {
        const startTime = Date.now();
        
        try {
            // Evitar cliques múltiplos
            if (buttonElement) {
                buttonElement.disabled = true;
                buttonElement.textContent = 'Gerando...';
                buttonElement.style.opacity = '0.6';
            }
            
            // Abrir widget se estiver fechado
            const widget = document.getElementById('nitaiChatWidget');
            const floatButton = document.getElementById('nitaiFloatButton');
            
            if (widget && widget.classList.contains('hidden')) {
                widget.classList.remove('hidden');
                widget.classList.add('visible');
                if (floatButton) {
                    floatButton.classList.add('active');
                }
                
                // Focar no input
                const input = document.getElementById('widgetChatInput');
                if (input) {
                    setTimeout(() => input.focus(), 300);
                }
            }
            
            // Adicionar mensagem natural
            if (window.addMessageToChat) {
                window.addMessageToChat('user', 'Por favor, gere um relatório completo da pesquisa de clima organizacional.');
            }
            
            // Adicionar resposta da Nitai com animação
            const loadingMessageId = 'loading-relatorio-' + Date.now();
            const progressId = 'progress-' + Date.now();
            
            if (window.addMessageToChat) {
                window.addMessageToChat('assistant', `
                    <div id="${loadingMessageId}" class="chat-loading-message">
                        <div class="robot-container">
                            <div class="robot-thinking">
                                <div class="robot-head">
                                    <div class="robot-eyes">
                                        <div class="robot-eye"></div>
                                        <div class="robot-eye"></div>
                                    </div>
                                    <div class="robot-mouth"></div>
                                </div>
                                <div class="thought-bubble"></div>
                            </div>
                        </div>
                        <div class="loading-header">
                            <h4>Processando relatório... </h4>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div id="${progressId}" class="progress-fill" style="width: 0%"></div>
                            </div>
                            <div class="progress-text">
                                <span id="${progressId}-percent">0%</span> - <span id="${progressId}-status">Carregando dados cacheados...</span>
                            </div>
                        </div>
                        <p class="loading-subtitle">Usando inteligência pré-processada para resposta instantânea! </p>
                    </div>
                `);
            }
            
            // Simular progresso ultra-rápido
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 25; // Mais rápido por ser local
                
                if (progress >= 95) {
                    progress = 95;
                    clearInterval(progressInterval);
                }
                
                const progressElement = document.getElementById(progressId);
                const percentElement = document.getElementById(progressId + '-percent');
                const statusElement = document.getElementById(progressId + '-status');
                
                if (progressElement) progressElement.style.width = progress + '%';
                if (percentElement) percentElement.textContent = Math.round(progress) + '%';
                
                if (statusElement) {
                    if (progress < 30) {
                        statusElement.textContent = 'Acessando cache local...';
                    } else if (progress < 60) {
                        statusElement.textContent = 'Processando insights pré-calculados...';
                    } else if (progress < 90) {
                        statusElement.textContent = 'Gerando relatório inteligente...';
                    } else {
                        statusElement.textContent = 'Finalizando com dados locais...';
                    }
                }
            }, 200); // Mais rápido
            
            // Chamar API local para relatório
            const response = await fetch('/api/clima/relatorio/landing-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ unidade: 'all' })
            });
            
            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            // Completar progresso
            clearInterval(progressInterval);
            
            const progressElement = document.getElementById(progressId);
            const percentElement = document.getElementById(progressId + '-percent');
            const statusElement = document.getElementById(progressId + '-status');
            
            if (progressElement) progressElement.style.width = '100%';
            if (percentElement) percentElement.textContent = '100%';
            if (statusElement) statusElement.textContent = 'Relatório gerado localmente!';
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Mostrar robô feliz
            const loadingElement = document.getElementById(loadingMessageId);
            if (loadingElement) {
                loadingElement.innerHTML = `
                    <div class="robot-container">
                        <div class="robot-happy">
                            <div class="robot-head">
                                <div class="robot-eyes">
                                    <div class="robot-eye"></div>
                                    <div class="robot-eye"></div>
                                </div>
                                <div class="robot-mouth"></div>
                                <div class="sparkle"></div>
                                <div class="sparkle"></div>
                                <div class="sparkle"></div>
                            </div>
                        </div>
                    </div>
                    <div class="loading-header">
                        <h4>Relatório gerado em ${responseTime}ms! </h4>
                    </div>
                    <p class="loading-subtitle">Relatório processado com sucesso! </p>
                `;
                
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Remover mensagem de loading
            if (loadingElement) {
                loadingElement.remove();
            }
            
            if (data.sucesso) {
                this.updateMetrics('local', responseTime);
                
                // Salvar dados para compatibilidade
                if (window.state) {
                    window.state.relatorioData = data.dados;
                    window.state.relatorioId = data.relatorio_id;
                    window.state.relatorioUrl = data.url_acesso;
                }
                
                // Adicionar resposta final
                if (window.addMessageToChat) {
                    window.addMessageToChat('assistant', `
                        <div class="relatorio-card-compact">
                            <div class="relatorio-card-compact-header">
                                <div class="relatorio-card-compact-title">
                                    ${window.icons?.fileText || ' '}<span>Relatório Completo de Clima Organizacional</span>
                                </div>
                                <div class="relatorio-card-compact-status">
                                    ${window.icons?.checkCircle || ' '} Gerado em ${responseTime}ms
                                </div>
                            </div>
                            <div class="relatorio-card-compact-description">
                                Seu relatório foi gerado usando dados pré-processados e inteligência local, garantindo resposta ultra-rápida e consistente.
                            </div>
                            <div class="relatorio-card-compact-actions">
                                <button onclick="window.abrirRelatorioLanding()" class="btn btn-purple btn-sm">
                                    ${window.icons?.maxus || ' '} Abrir Relatório Interativo
                                </button>
                                <button onclick="window.baixarRelatorio()" class="btn btn-success btn-sm">
                                    ${window.icons?.download || ' '} Baixar agora
                                </button>
                            </div>
                        </div>
                    `);
                }
                
            } else {
                if (window.addMessageToChat) {
                    window.addMessageToChat('system', `Ops! Encontrei um erro: ${data.erro || 'Erro desconhecido'}`);
                }
            }
            
        } catch (error) {
            console.error('Erro ao gerar relatório local:', error);
            this.updateMetrics('error', 0);
            
            if (window.addMessageToChat) {
                window.addMessageToChat('system', `Ops! Ocorreu um erro: ${error.message}`);
            }
        } finally {
            // Restaurar botão
            if (buttonElement) {
                buttonElement.disabled = false;
                buttonElement.textContent = 'Gerar Relatório Completo';
                buttonElement.style.opacity = '1';
            }
        }
    }

    /**
     * Limpa contexto local
     */
    async limparContextoLocal() {
        try {
            const response = await fetch('/api/chat/contexto', {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.sucesso) {
                // Limpar variáveis globais
                if (window.chatSession !== undefined) {
                    window.chatSession = null;
                }
                if (window.currentContext !== undefined) {
                    window.currentContext = null;
                }
                
                if (window.addMessageToChat) {
                    window.addMessageToChat('system', ' Contexto local limpo com sucesso.');
                }
                
            } else {
                throw new Error(data.erro || 'Erro ao limpar contexto');
            }
            
        } catch (error) {
            console.error('Erro ao limpar contexto local:', error);
            
            if (window.addMessageToChat) {
                window.addMessageToChat('system', ` Erro: ${error.message}`);
            }
        }
    }

    /**
     * Atualiza métricas de performance
     */
    updateMetrics(type, responseTime) {
        if (type === 'local') {
            this.performanceMetrics.localCalls++;
            this.performanceMetrics.avgResponseTime = 
                (this.performanceMetrics.avgResponseTime + responseTime) / 2;
            this.performanceMetrics.cacheHits++;
        } else if (type === 'api') {
            this.performanceMetrics.apiCalls++;
        } else if (type === 'error') {
            // Log errors
        }
        
        this.updatePerformanceDisplay();
    }

    /**
     * Adiciona indicadores de performance na interface (desativado)
     */
    addPerformanceIndicators() {
        // Performance indicator removido
        return;
    }

    /**
     * Atualiza display de performance (desativado)
     */
    updatePerformanceDisplay() {
        // Performance display removido
        return;
    }

    /**
     * Obtém estatísticas do processamento
     */
    getStats() {
        return {
            mode: 'local',
            metrics: this.performanceMetrics,
            cacheStatus: 'loaded',
            avgResponseTime: `${Math.round(this.performanceMetrics.avgResponseTime)}ms`,
            totalCalls: this.performanceMetrics.localCalls + this.performanceMetrics.apiCalls,
            cacheHitRate: `${Math.round((this.performanceMetrics.cacheHits / this.performanceMetrics.localCalls) * 100)}%`
        };
    }
}

// Inicializar automaticamente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.NITAILocal = new NITAILocalIntegration();
    console.log(' NITAI Local Integration ready!');
});
