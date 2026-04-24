// Painel Flutuante de Dicionário de Métricas
export class DictionaryPanel {
  constructor() {
    this.isOpen = false;
    this.currentSection = null;
    this.init();
  }

  init() {
    this.createPanel();
    this.addEventListeners();
  }

  createPanel() {
    const panelHTML = `
      <div id="dictionaryPanel" class="dictionary-panel">
        <div class="dictionary-backdrop"></div>
        <div class="dictionary-container">
          <div class="dictionary-header">
            <h2 class="dictionary-title">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              Dicionário de Métricas
            </h2>
            <button class="dictionary-close" aria-label="Fechar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div class="dictionary-nav">
            <button class="nav-btn active" data-section="overview">Visão Geral</button>
            <button class="nav-btn" data-section="satisfaction">Satisfação</button>
            <button class="nav-btn" data-section="charts">Gráficos</button>
            <button class="nav-btn" data-section="rankings">Rankings</button>
            <button class="nav-btn" data-section="alerts">Alertas</button>
          </div>
          
          <div class="dictionary-content">
            <div class="dictionary-section active" id="overview">
              <h3>📊 Visão Geral da Pesquisa</h3>
              <div class="metric-card">
                <h4>🎯 O que é a Pesquisa de Clima?</h4>
                <p>A Pesquisa de Clima Organizacional mede a percepção dos colaboradores sobre o ambiente de trabalho, identificando pontos fortes e áreas de melhoria.</p>
              </div>
              
              <div class="metric-card">
                <h4>📈 Como funciona?</h4>
                <ul>
                  <li><strong>Escala Likert:</strong> 4 pontos (Concordo Sempre, Concordo, Discordo, Discordo Sempre)</li>
                  <li><strong>Pontuação:</strong> Concordo = 1 ponto | Discordo = 0 pontos</li>
                  <li><strong>Cálculo:</strong> Satisfação = (Concordo + Concordo Sempre) ÷ Total × 100%</li>
                </ul>
              </div>
              
              <div class="metric-card">
                <h4>🏗️ Estrutura da Análise</h4>
                <ul>
                  <li><strong>7 Pilares:</strong> Ambiente, Comprometimento, Comunicação, Gestão, Liderança, Trabalho em Equipe, Capital Humano</li>
                  <li><strong>45 Questões:</strong> Distribuídas entre os pilares</li>
                  <li><strong>Análise Individual:</strong> Cada questão tem sua própria métrica</li>
                </ul>
              </div>
            </div>
            
            <div class="dictionary-section" id="satisfaction">
              <h3>🎯 Métricas de Satisfação</h3>
              
              <div class="metric-card">
                <h4>📊 Satisfação Geral</h4>
                <p><strong>Definição:</strong> Percentual médio de satisfação de todas as questões.</p>
                <div class="formula">
                  <strong>Fórmula:</strong><br>
                  Satisfação = (Σ Concordo + Concordo Sempre) ÷ (Σ Total Respostas) × 100%
                </div>
                <div class="example">
                  <strong>Exemplo:</strong><br>
                  Se 25 pessoas concordam e 56 concordam sempre de 92 respondentes:<br>
                  Satisfação = (25 + 56) ÷ 92 × 100% = 88,04%
                </div>
              </div>
              
              <div class="metric-card">
                <h4>🏢 Satisfação por Unidade</h4>
                <p><strong>Definição:</strong> Satisfação calculada separadamente para cada unidade/setor.</p>
                <div class="formula">
                  <strong>Fórmula:</strong><br>
                  Satisfação Unidade = (Concordo + Concordo Sempre da Unidade) ÷ (Total da Unidade) × 100%
                </div>
                <p><strong>Utilidade:</strong> Identifica quais unidades precisam de atenção especial.</p>
              </div>
              
              <div class="metric-card">
                <h4>🎯 Satisfação por Pilar</h4>
                <p><strong>Definição:</strong> Média de satisfação de todas as questões pertencentes a cada pilar.</p>
                <div class="formula">
                  <strong>Fórmula:</strong><br>
                  Satisfação Pilar = Média das satisfações das questões do pilar
                </div>
                <p><strong>Utilidade:</strong> Mostra quais áreas organizacionais estão mais fortes ou fracas.</p>
              </div>
              
              <div class="metric-card">
                <h4>📋 Interpretação dos Resultados</h4>
                <div class="scale-interpretation">
                  <div class="scale-item excellent">
                    <span class="scale-color">🟢</span>
                    <strong>≥ 75% (Ótimo):</strong> Clima organizacional excelente
                  </div>
                  <div class="scale-item attention">
                    <span class="scale-color">🟡</span>
                    <strong>50-74% (Atenção):</strong> Clima organizacional moderado
                  </div>
                  <div class="scale-item critical">
                    <span class="scale-color">🔴</span>
                    <strong>&lt; 50% (Crítico):</strong> Clima organizacional problemático
                  </div>
                </div>
              </div>
            </div>
            
            <div class="dictionary-section" id="charts">
              <h3>📊 Gráficos e Visualizações</h3>
              
              <div class="metric-card">
                <h4>📈 Distribuição das Respostas</h4>
                <p><strong>O que mostra:</strong> Como as respostas estão distribuídas na escala Likert.</p>
                <div class="chart-explanation">
                  <ul>
                    <li><strong>Eixo X:</strong> Opções da escala (Discordo Sempre, Discordo, Concordo, Concordo Sempre)</li>
                    <li><strong>Eixo Y:</strong> Percentual de respostas em cada categoria</li>
                    <li><strong>Interpretação:</strong> Barras mais altas à direita indicam maior satisfação</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Concentração de respostas positivas (direita) é bom; concentração negativa (esquerda) indica problemas.</p>
              </div>
              
              <div class="metric-card">
                <h4>🏢 Gráfico de Satisfação por Unidade</h4>
                <p><strong>O que mostra:</strong> Comparação da satisfação entre diferentes unidades/setores.</p>
                <div class="chart-explanation">
                  <ul>
                    <li><strong>Eixo X:</strong> Percentual de satisfação (0-100%)</li>
                    <li><strong>Barras:</strong> Cada unidade com sua cor baseada no desempenho</li>
                    <li><strong>Cores:</strong> Verde (≥75%), Amarelo (50-74%), Vermelho (&lt;50%)</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Identifica unidades com melhor e pior desempenho para ações direcionadas.</p>
              </div>
              
              <div class="metric-card">
                <h4>🎯 Gráfico de Satisfação por Pilar</h4>
                <p><strong>O que mostra:</strong> Desempenho de cada pilar organizacional.</p>
                <div class="chart-explanation">
                  <ul>
                    <li><strong>Eixo X:</strong> Percentual de satisfação (0-100%)</li>
                    <li><strong>Barras:</strong> Cada pilar com cor baseada no desempenho</li>
                    <li><strong>Ordenação:</strong> Geralmente do maior para o menor percentual</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Revela quais áreas organizacionais precisam de intervenção prioritária.</p>
              </div>
            </div>
            
            <div class="dictionary-section" id="rankings">
              <h3>🏆 Rankings de Questões</h3>
              
              <div class="metric-card">
                <h4>⚠️ Top Piores Perguntas</h4>
                <p><strong>O que mostra:</strong> Questões com menor percentual de satisfação.</p>
                <div class="ranking-explanation">
                  <ul>
                    <li><strong>Ordenação:</strong> Menor satisfação para maior</li>
                    <li><strong>Informações:</strong> Número da questão, texto resumido, percentual e pilar</li>
                    <li><strong>Foco:</strong> Questões críticas que precisam de atenção imediata</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Questões com &lt;50% são críticas; 50-74% precisam de melhoria; &gt;75% são satisfatórias.</p>
              </div>
              
              <div class="metric-card">
                <h4>🌟 Top Melhores Perguntas</h4>
                <p><strong>O que mostra:</strong> Questões com maior percentual de satisfação.</p>
                <div class="ranking-explanation">
                  <ul>
                    <li><strong>Ordenação:</strong> Maior satisfação para menor</li>
                    <li><strong>Informações:</strong> Número da questão, texto resumido, percentual e pilar</li>
                    <li><strong>Foco:</strong> Pontos fortes que podem ser expandidos</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Identifica práticas positivas que podem ser replicadas em outras áreas.</p>
              </div>
              
              <div class="metric-card">
                <h4>🔥 Top 3 Gargalos</h4>
                <p><strong>O que mostra:</strong> Questões específicas com maior concentração de respostas negativas.</p>
                <div class="ranking-explanation">
                  <ul>
                    <li><strong>Cálculo:</strong> Baseado na intensidade das respostas negativas</li>
                    <li><strong>Prioridade:</strong> Questões com mais "Discordo Sempre"</li>
                    <li><strong>Ação:</strong> Foco em intervenções específicas</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Questões com escore mais alto precisam de ação imediata e específica.</p>
              </div>
            </div>
            
            <div class="dictionary-section" id="alerts">
              <h3>⚠️ Sistema de Alertas</h3>
              
              <div class="metric-card">
                <h4>🚨 Alertas Críticos</h4>
                <p><strong>O que são:</strong> Questões que ultrapassam limiares de insatisfação preocupantes.</p>
                <div class="alert-explanation">
                  <ul>
                    <li><strong>Limiar Crítico:</strong> ≥ 33% de respostas "Discordo Muito"</li>
                    <li><strong>Identificação:</strong> Questão, percentual e pilar afetado</li>
                    <li><strong>Ação:</strong> Investigação imediata necessária</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Cada alerta crítico representa um problema grave que precisa ser investigado e resolvido.</p>
              </div>
              
              <div class="metric-card">
                <h4>🎯 Heatmap de Desempenho</h4>
                <p><strong>O que mostra:</strong> Visão consolidada do desempenho por pilar.</p>
                <div class="heatmap-explanation">
                  <ul>
                    <li><strong>Linhas:</strong> Cada pilar organizacional</li>
                    <li><strong>Colunas:</strong> Percentual de satisfação</li>
                    <li><strong>Cores:</strong> Verde (≥75%), Amarelo (50-74%), Vermelho (&lt;50%)</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Permite identificação rápida de áreas críticas e pontos fortes da organização.</p>
              </div>
              
              <div class="metric-card">
                <h4>📋 Sugestões Estratégicas</h4>
                <p><strong>O que são:</strong> Recomendações baseadas nos dados da pesquisa.</p>
                <div class="suggestions-explanation">
                  <ul>
                    <li><strong>Base:</strong> Análise dos pilares e questões críticas</li>
                    <li><strong>Foco:</strong> Ações práticas e específicas</li>
                    <li><strong>Alinhamento:</strong> Com os objetivos organizacionais</li>
                  </ul>
                </div>
                <p><strong>Como analisar:</strong> Use as sugestões como ponto de partida para planos de ação detalhados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', panelHTML);
  }

  addEventListeners() {
    // Botão fechar
    document.querySelector('.dictionary-close').addEventListener('click', () => this.close());
    
    // Backdrop
    document.querySelector('.dictionary-backdrop').addEventListener('click', () => this.close());
    
    // Navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
    });
    
    // Tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  open() {
    this.isOpen = true;
    document.getElementById('dictionaryPanel').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    document.getElementById('dictionaryPanel').classList.remove('open');
    document.body.style.overflow = '';
  }

  switchSection(sectionId) {
    // Remover classe active de todos os botões e seções
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.dictionary-section').forEach(section => section.classList.remove('active'));
    
    // Adicionar classe active ao botão e seção selecionados
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    document.getElementById(sectionId).classList.add('active');
    
    this.currentSection = sectionId;
  }

  // Método para adicionar botão de ajuda em qualquer lugar
  static createHelpButton(container) {
    const helpButton = document.createElement('button');
    helpButton.className = 'help-button';
    helpButton.setAttribute('aria-label', 'Abrir dicionário de métricas');
    helpButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span>Dicionário</span>
    `;
    
    helpButton.addEventListener('click', () => {
      if (!window.dictionaryPanel) {
        window.dictionaryPanel = new DictionaryPanel();
      }
      window.dictionaryPanel.open();
    });
    
    container.appendChild(helpButton);
    return helpButton;
  }
}
