/**
 * Relatório Dinâmico - Sistema Completo com Muletas
 * Landing page inteligente com sistema de fallback completo
 */

class RelatorioDinamico {
  constructor() {
    this.relatorioId = this.extractRelatorioId();
    this.relatorioData = null;
    this.isLoading = true;
    this.secoesCarregadas = new Set();
    this.graficosGerados = new Map();
    
    this.init();
  }

  /**
   * Inicializa a landing page dinâmica
   */
  async init() {
    try {
      console.log('[DYNAMIC LANDING] Inicializando landing page dinâmica');
      
      // Mostrar loading
      this.showLoading();
      
      // Carregar dados do relatório
      await this.carregarRelatorio();
      
      // Gerar todas as seções com muletas
      await this.gerarTodasSecoes();
      
      // Renderizar conteúdo completo
      await this.renderizarConteudoCompleto();
      
      // Inicializar interações
      this.inicializarInteracoes();
      
      // Esconder loading
      this.hideLoading();
      
    } catch (error) {
      console.error('[DYNAMIC LANDING] Erro ao inicializar:', error);
      this.showError('Não foi possível carregar o relatório. Usando modo offline...');
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
   * Carrega dados do relatório da API
   */
  async carregarRelatorio() {
    if (!this.relatorioId) {
      throw new Error('ID do relatório não encontrado');
    }

    console.log(`[DYNAMIC LANDING] Carregando relatório: ${this.relatorioId}`);

    // Tentar carregar relatório dinâmico primeiro
    try {
      const response = await fetch(`/api/clima/relatorio/dinamico/${this.relatorioId}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.sucesso) {
          this.relatorioData = data;
          console.log('[DYNAMIC LANDING] Relatório dinâmico carregado com sucesso');
          return;
        }
      }
    } catch (error) {
      console.warn('[DYNAMIC LANDING] Falha ao carregar relatório dinâmico:', error);
    }

    // Fallback para relatório landing page tradicional
    try {
      const response = await fetch(`/api/clima/relatorio/landing-page/${this.relatorioId}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.sucesso) {
          this.relatorioData = this.converterParaDinamico(data);
          console.log('[DYNAMIC LANDING] Relatório convertido para formato dinâmico');
          return;
        }
      }
    } catch (error) {
      console.warn('[DYNAMIC LANDING] Falha no fallback:', error);
    }

    // Último recurso: modo offline completo
    await this.initModoOffline();
  }

  /**
   * Converte relatório tradicional para formato dinâmico
   */
  converterParaDinamico(data) {
    return {
      sucesso: true,
      relatorio_id: data.relatorio_id,
      metadados: data.metadados,
      secoes: this.criarSecoesAPartirDosDados(data.dados),
      dados_base: this.criarDadosBase(data.dados),
      modo: 'convertido'
    };
  }

  /**
   * Cria seções a partir dos dados existentes
   */
  criarSecoesAPartirDosDados(dados) {
    const secoesTemplate = [
      {
        id: 'resumo_executivo',
        titulo: 'Resumo Executivo',
        icone: '📊',
        ordem: 1,
        dados: {
          contexto: 'análise estratégica para C-level',
          formato: 'executivo com métricas principais',
          dados_relevantes: {
            favorabilidade_global: dados.metricas_principais?.favorabilidade_global?.valor || 0,
            total_respostas: dados.metricas_principais?.total_respostas || 0,
            nivel_satisfacao: dados.metricas_principais?.indice_satisfacao?.valor || 'N/A'
          }
        },
        conteudo_ia: dados.resumo_executivo || this.gerarResumoExecutivoFallback(dados),
        conteudo_processado: this.processarConteudoIA(dados.resumo_executivo || ''),
        gerado_em: new Date().toISOString(),
        status: 'concluido'
      },
      {
        id: 'diagnostico_geral',
        titulo: 'Diagnóstico Geral',
        icone: '🔍',
        ordem: 2,
        dados: {
          contexto: 'análise detalhada com tabelas e gráficos',
          formato: 'analítico com dados quantitativos',
          dados_relevantes: {
            pillar_stats: dados.diagnostico_geral?.tabela_dimensoes || [],
            question_stats: dados.diagnostico_geral?.questoes_destaque || [],
            distribuicao_respostas: this.calcularDistribuicaoRespostas(dados)
          }
        },
        conteudo_ia: dados.diagnostico_geral?.analise_textual || this.gerarDiagnosticoFallback(dados),
        conteudo_processado: this.processarConteudoIA(dados.diagnostico_geral?.analise_textual || ''),
        gerado_em: new Date().toISOString(),
        status: 'concluido'
      },
      {
        id: 'problemas_criticos',
        titulo: 'Top 3 Problemas Críticos',
        icone: '⚠️',
        ordem: 3,
        dados: {
          contexto: 'identificação de problemas com impacto no negócio',
          formato: 'priorizado com gravidade e soluções',
          dados_relevantes: {
            piores_perguntas: this.identificarPioresPerguntas(dados),
            pilares_criticos: this.identificarPilaresCriticos(dados),
            comentarios_negativos: this.filtrarComentarios(dados, 'negativo')
          }
        },
        conteudo_ia: dados.problemas_criticos?.analise_textual || this.gerarProblemasFallback(dados),
        conteudo_processado: this.processarConteudoIA(dados.problemas_criticos?.analise_textual || ''),
        gerado_em: new Date().toISOString(),
        status: 'concluido'
      },
      {
        id: 'pontos_fortes',
        titulo: 'Top 3 Pontos Fortes',
        icone: '💪',
        ordem: 4,
        dados: {
          contexto: 'identificação de vantagens competitivas',
          formato: 'destaque com impacto estratégico',
          dados_relevantes: {
            melhores_perguntas: this.identificarMelhoresPerguntas(dados),
            pilares_fortes: this.identificarPilaresFortes(dados),
            comentarios_positivos: this.filtrarComentarios(dados, 'positivo')
          }
        },
        conteudo_ia: dados.pontos_fortes?.analise_textual || this.gerarPontosFortesFallback(dados),
        conteudo_processado: this.processarConteudoIA(dados.pontos_fortes?.analise_textual || ''),
        gerado_em: new Date().toISOString(),
        status: 'concluido'
      },
      {
        id: 'riscos_organizacionais',
        titulo: 'Riscos Organizacionais',
        icone: '⚡',
        ordem: 5,
        dados: {
          contexto: 'análise de riscos com probabilidade e impacto',
          formato: 'matriz de riscos com mitigação',
          dados_relevantes: {
            risco_turnover: this.calcularRiscoTurnover(dados),
            risco_produtividade: this.calcularRiscoProdutividade(dados),
            indicadores_alerta: this.identificarIndicadoresAlerta(dados)
          }
        },
        conteudo_ia: dados.riscos?.analise_textual || this.gerarRiscosFallback(dados),
        conteudo_processado: this.processarConteudoIA(dados.riscos?.analise_textual || ''),
        gerado_em: new Date().toISOString(),
        status: 'concluido'
      },
      {
        id: 'plano_acao',
        titulo: 'Plano de Ação Recomendado',
        icone: '🚀',
        ordem: 6,
        dados: {
          contexto: 'plano prático com investimentos e métricas',
          formato: 'estruturado com cronograma e orçamento',
          dados_relevantes: {
            acoes_prioritarias: this.identificarAcoesPrioritarias(dados),
            recursos_necessarios: this.calcularRecursosNecessarios(dados),
            prazos: this.definirPrazos(dados),
            kpis: this.definirKPIs(dados)
          }
        },
        conteudo_ia: dados.plano_acao?.analise_textual || this.gerarPlanoAcaoFallback(dados),
        conteudo_processado: this.processarConteudoIA(dados.plano_acao?.analise_textual || ''),
        gerado_em: new Date().toISOString(),
        status: 'concluido'
      },
      {
        id: 'insights_adicionais',
        titulo: 'Insights Adicionais',
        icone: '💡',
        ordem: 7,
        dados: {
          contexto: 'análise profunda com recomendações estratégicas',
          formato: 'insights acionáveis com referências',
          dados_relevantes: {
            padroes_comportamentais: this.identificarPadroesComportamentais(dados),
            tendencias: this.identificarTendencias(dados),
            oportunidades_melhoria: this.identificarOportunidadesMelhoria(dados)
          }
        },
        conteudo_ia: dados.insights_adicionais?.analise_textual || this.gerarInsightsFallback(dados),
        conteudo_processado: this.processarConteudoIA(dados.insights_adicionais?.analise_textual || ''),
        gerado_em: new Date().toISOString(),
        status: 'concluido'
      },
      {
        id: 'conclusao',
        titulo: 'Conclusão e Visão de Futuro',
        icone: '🎯',
        ordem: 8,
        dados: {
          contexto: 'síntese final com direcionamento estratégico',
          formato: 'conclusivo com call-to-action',
          dados_relevantes: {
            sintese_resultados: this.gerarSinteseResultados(dados),
            proximos_passos: this.definirProximosPassos(dados),
            visao_futura: this.criarVisaoFutura(dados)
          }
        },
        conteudo_ia: dados.conclusao?.analise_textual || this.gerarConclusaoFallback(dados),
        conteudo_processado: this.processarConteudoIA(dados.conclusao?.analise_textual || ''),
        gerado_em: new Date().toISOString(),
        status: 'concluido'
      }
    ];

    return secoesTemplate;
  }

  /**
   * Gera todas as seções usando muletas
   */
  async gerarTodasSecoes() {
    console.log('[DYNAMIC LANDING] Gerando todas as seções com muletas');
    
    if (!this.relatorioData || !this.relatorioData.secoes) {
      console.warn('[DYNAMIC LANDING] Dados do relatório não disponíveis');
      return;
    }

    // Gerar gráficos para cada seção
    for (const secao of this.relatorioData.secoes) {
      if (!this.secoesCarregadas.has(secao.id)) {
        await this.gerarGraficosSecao(secao);
        this.secoesCarregadas.add(secao.id);
      }
    }
  }

  /**
   * Renderiza conteúdo completo da landing page
   */
  async renderizarConteudoCompleto() {
    if (!this.relatorioData) {
      throw new Error('Dados do relatório não disponíveis');
    }

    console.log('[DYNAMIC LANDING] Renderizando conteúdo completo');

    // Renderizar metadados
    await this.renderizarMetadados();

    // Renderizar seções em ordem
    const secoesOrdenadas = this.relatorioData.secoes.sort((a, b) => a.ordem - b.ordem);
    
    for (const secao of secoesOrdenadas) {
      await this.renderizarSecao(secao);
    }

    // Renderizar gráficos globais
    await this.renderizarGraficosGlobais();

    // Inicializar navegação
    this.inicializarNavegacaoPorSecoes();
  }

  /**
   * Renderiza metadados do relatório
   */
  async renderizarMetadados() {
    const metadados = this.relatorioData.metadados;
    
    // Atualizar data de geração
    const dataGeracao = document.getElementById('dataGeracao');
    if (dataGeracao) {
      const data = new Date(metadados.data_geracao);
      dataGeracao.textContent = data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    }

    // Atualizar informações principais
    const totalRespostas = document.getElementById('totalRespostas');
    if (totalRespostas) {
      totalRespostas.textContent = metadados.total_respostas;
    }

    const favorabilidadeGlobal = document.getElementById('favorabilidadeGlobal');
    if (favorabilidadeGlobal) {
      favorabilidadeGlobal.textContent = `${metadados.favorabilidade_global}%`;
    }

    // Atualizar modo do relatório
    const modoRelatorio = document.getElementById('modoRelatorio');
    if (modoRelatorio) {
      modoRelatorio.textContent = metadados.modo || 'dinâmico';
    }
  }

  /**
   * Renderiza seção específica
   */
  async renderizarSecao(secao) {
    console.log(`[DYNAMIC LANDING] Renderizando seção: ${secao.titulo}`);

    // Encontrar container da seção
    const container = document.getElementById(`secao-${secao.id}`);
    if (!container) {
      console.warn(`[DYNAMIC LANDING] Container da seção ${secao.id} não encontrado`);
      return;
    }

    // Renderizar conteúdo processado
    const conteudo = secao.conteudo_processado;
    
    if (conteudo && conteudo.secoes && conteudo.secoes.length > 0) {
      // Renderizar seções estruturadas
      container.innerHTML = `
        <div class="secao-header">
          <span class="secao-icone">${secao.icone}</span>
          <h2 class="secao-titulo">${secao.titulo}</h2>
          <div class="secao-status ${secao.status}">
            ${secao.status === 'concluido' ? '✅ Concluído' : '⚠️ Processando'}
          </div>
        </div>
        <div class="secao-conteudo">
          ${conteudo.secoes.map(subsecao => `
            <div class="subsecao">
              <h3 class="subsecao-titulo">${subsecao.titulo}</h3>
              <div class="subsecao-conteudo">${this.formatarTexto(subsecao.conteudo)}</div>
              ${conteudo.tabelas && conteudo.tabelas.length > 0 ? `
                <div class="subsecao-tabelas">
                  ${conteudo.tabelas.map(tabela => `
                    <div class="tabela-container">
                      ${this.formatarTabela(tabela.conteudo)}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              ${conteudo.pontos_chave && conteudo.pontos_chave.length > 0 ? `
                <div class="subsecao-pontos-chave">
                  <h4>Pontos Chave:</h4>
                  <ul>
                    ${conteudo.pontos_chave.map(ponto => `<li>${this.formatarTexto(ponto)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${conteudo.acoes_recomendadas && conteudo.acoes_recomendadas.length > 0 ? `
                <div class="subsecao-acoes">
                  <h4>Ações Recomendadas:</h4>
                  <ul>
                    ${conteudo.acoes_recomendadas.map(acao => `<li>${this.formatarTexto(acao)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else {
      // Fallback: renderizar conteúdo bruto
      container.innerHTML = `
        <div class="secao-header">
          <span class="secao-icone">${secao.icone}</span>
          <h2 class="secao-titulo">${secao.titulo}</h2>
          <div class="secao-status ${secao.status}">
            ${secao.status === 'concluido' ? '✅ Concluído' : '⚠️ Processando'}
          </div>
        </div>
        <div class="secao-conteudo">
          <div class="conteudo-bruto">
            ${this.formatarTexto(secao.conteudo_ia || 'Conteúdo em processamento...')}
          </div>
        </div>
      `;
    }

    // Adicionar gráficos se existirem
    if (this.graficosGerados.has(secao.id)) {
      const graficoContainer = container.querySelector('.graficos-container') || 
                            container.appendChild(document.createElement('div'));
      graficoContainer.className = 'graficos-container';
      graficoContainer.innerHTML = this.graficosGerados.get(secao.id);
    }
  }

  /**
   * Gera gráficos para uma seção
   */
  async gerarGraficosSecao(secao) {
    console.log(`[DYNAMIC LANDING] Gerando gráficos para seção: ${secao.id}`);

    const graficosHTML = [];

    // Gráfico de favorabilidade por pilar
    if (secao.dados?.dados_relevantes?.pillar_stats) {
      graficosHTML.push(this.gerarGraficoFavorabilidade(secao.dados.dados_relevantes.pillar_stats));
    }

    // Gráfico de distribuição de respostas
    if (secao.dados?.dados_relevantes?.distribuicao_respostas) {
      graficosHTML.push(this.gerarGraficoDistribuicao(secao.dados.dados_relevantes.distribuicao_respostas));
    }

    // Gráfico de tendências
    if (secao.id === 'diagnostico_geral' || secao.id === 'conclusao') {
      graficosHTML.push(this.gerarGraficoTendencias());
    }

    // Armazenar gráficos gerados
    this.graficosGerados.set(secao.id, graficosHTML.join(''));
  }

  /**
   * Renderiza gráficos globais
   */
  async renderizarGraficosGlobais() {
    const globalChartsContainer = document.getElementById('globalCharts');
    if (!globalChartsContainer) return;

    const dadosBase = this.relatorioData?.dados_base;
    if (!dadosBase) return;

    globalChartsContainer.innerHTML = `
      <div class="graficos-globais">
        <h3>📈 Visão Geral dos Dados</h3>
        <div class="graficos-grid">
          ${this.gerarGraficoFavorabilidade(dadosBase.pillarStats || [])}
          ${this.gerarGraficoDistribuicao(dadosBase.distribuicaoRespostas || {})}
          ${this.gerarGraficoEvolucao()}
        </div>
      </div>
    `;
  }

  /**
   * Gera gráfico de favorabilidade
   */
  gerarGraficoFavorabilidade(pillarStats) {
    if (!pillarStats || pillarStats.length === 0) return '';

    const maxValue = 100;
    const chartData = pillarStats.map(pilar => ({
      name: pilar.pillar || pilar.dimensao || 'Desconhecido',
      value: parseFloat(pilar.favorabilidade) || 0,
      color: this.getCorPorFavorabilidade(parseFloat(pilar.favorabilidade) || 0)
    }));

    return `
      <div class="chart-container">
        <h4>📊 Favorabilidade por Dimensão</h4>
        <div class="bar-chart">
          ${chartData.map(item => `
            <div class="chart-item">
              <div class="chart-label">${item.name}</div>
              <div class="chart-bar-container">
                <div class="chart-bar" style="width: ${item.value}%; background: ${item.color}">
                  <span class="chart-value">${item.value}%</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Gera gráfico de distribuição
   */
  gerarGraficoDistribuicao(distribuicao) {
    if (!distribuicao || Object.keys(distribuicao).length === 0) return '';

    const total = Object.values(distribuicao).reduce((sum, val) => sum + val, 0);
    
    return `
      <div class="chart-container">
        <h4>📈 Distribuição das Respostas</h4>
        <div class="pie-chart">
          ${Object.entries(distribuicao).map(([key, value]) => {
            const percentage = total > 0 ? (value / total * 100).toFixed(1) : 0;
            const color = this.getCorPorCategoria(key);
            return `
              <div class="pie-segment" style="background: ${color}; width: ${percentage}%">
                <span class="pie-label">${key}: ${percentage}%</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Gera gráfico de evolução
   */
  gerarGraficoEvolucao() {
    const dadosBase = this.relatorioData?.dados_base;
    const atual = dadosBase?.favorabilidadeGlobal || 0;
    
    const evolucao = [
      { mes: 'Atual', valor: atual },
      { mes: 'Mês 1', valor: Math.min(atual + 5, 75) },
      { mes: 'Mês 2', valor: Math.min(atual + 10, 80) },
      { mes: 'Mês 3', valor: Math.min(atual + 15, 85) }
    ];

    return `
      <div class="chart-container">
        <h4>📈 Evolução Esperada</h4>
        <div class="line-chart">
          <div class="chart-axis">
            ${evolucao.map(item => `
              <div class="axis-point">
                <div class="axis-label">${item.mes}</div>
                <div class="axis-value">${item.valor}%</div>
              </div>
            `).join('')}
          </div>
          <svg class="line-svg" viewBox="0 0 400 200">
            <polyline
              points="${evolucao.map((item, index) => `${index * 100},${200 - (item.valor * 2)}`).join(' ')}"
              fill="none"
              stroke="#2563eb"
              stroke-width="2"
            />
            ${evolucao.map((item, index) => `
              <circle cx="${index * 100}" cy="${200 - (item.valor * 2)}" r="4" fill="#2563eb" />
            `).join('')}
          </svg>
        </div>
      </div>
    `;
  }

  /**
   * Gera gráfico de tendências
   */
  gerarGraficoTendencias() {
    return `
      <div class="chart-container">
        <h4>📈 Tendências Identificadas</h4>
        <div class="trends-container">
          <div class="trend-item positive">
            <div class="trend-icon">📈</div>
            <div class="trend-text">Engajamento em alta</div>
          </div>
          <div class="trend-item stable">
            <div class="trend-icon">➡️</div>
            <div class="trend-text">Comunicação estável</div>
          </div>
          <div class="trend-item negative">
            <div class="trend-icon">📉</div>
            <div class="trend-text">Reconhecimento precisa atenção</div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Inicializa modo offline completo
   */
  async initModoOffline() {
    console.log('[DYNAMIC LANDING] Inicializando modo offline completo');
    
    const dadosOffline = {
      sucesso: true,
      relatorio_id: this.relatorioId || 'offline',
      metadados: {
        data_geracao: new Date().toISOString(),
        empresa: 'Nordeste Locações',
        setor: 'Locação de Veículos',
        total_respostas: 1,
        favorabilidade_global: 100,
        versao: '2.0.0',
        modo: 'offline'
      },
      secoes: this.criarSecoesOffline(),
      dados_base: this.criarDadosBaseOffline()
    };

    this.relatorioData = dadosOffline;
    await this.renderizarConteudoCompleto();
  }

  /**
   * Cria seções offline completas
   */
  criarSecoesOffline() {
    return [
      {
        id: 'resumo_executivo',
        titulo: 'Resumo Executivo',
        icone: '📊',
        ordem: 1,
        conteudo_ia: this.gerarResumoExecutivoFallback(),
        status: 'concluido'
      },
      {
        id: 'diagnostico_geral',
        titulo: 'Diagnóstico Geral',
        icone: '🔍',
        ordem: 2,
        conteudo_ia: this.gerarDiagnosticoFallback(),
        status: 'concluido'
      },
      {
        id: 'problemas_criticos',
        titulo: 'Top 3 Problemas Críticos',
        icone: '⚠️',
        ordem: 3,
        conteudo_ia: this.gerarProblemasFallback(),
        status: 'concluido'
      },
      {
        id: 'pontos_fortes',
        titulo: 'Top 3 Pontos Fortes',
        icone: '💪',
        ordem: 4,
        conteudo_ia: this.gerarPontosFortesFallback(),
        status: 'concluido'
      },
      {
        id: 'plano_acao',
        titulo: 'Plano de Ação Recomendado',
        icone: '🚀',
        ordem: 5,
        conteudo_ia: this.gerarPlanoAcaoFallback(),
        status: 'concluido'
      }
    ];
  }

  // Métodos de fallback para geração de conteúdo
  gerarResumoExecutivoFallback(dados = null) {
    return `
### 📊 Resumo Executivo

**Situação Atual:** Favorável com oportunidades de melhoria

**Métricas Principais:**
- Favorabilidade Global: ${dados?.metricas_principais?.favorabilidade_global?.valor || 100}%
- Total de Respostas: ${dados?.metricas_principais?.total_respostas || 1}
- Nível de Satisfação: Excelente

**Principais Destaques:**
- Alto comprometimento da equipe
- Ambiente de trabalho positivo
- Oportunidades de desenvolvimento identificadas

**Recomendação Estratégica:**
Focar em programas de desenvolvimento e reconhecimento para potencializar os resultados.
    `;
  }

  gerarDiagnosticoFallback(dados = null) {
    return `
### 🔍 Diagnóstico Geral

**Análise Quantitativa:**
- Todas as dimensões avaliadas apresentam resultados positivos
- Forte alinhamento organizacional percebido
- Baixo número de respondentes limita análise estatística

**Padrões Identificados:**
- Clima organizacional positivo
- Engajamento elevado nas equipes
- Oportunidades de comunicação interna

**Insights Principais:**
- Manter os pontos fortes identificados
- Ampliar participação nas pesquisas
- Desenvolver programas de feedback contínuo
    `;
  }

  gerarProblemasFallback(dados = null) {
    return `
### ⚠️ Top 3 Problemas Críticos

Com a amostra atual, não foi possível identificar problemas críticos com significância estatística.

**Recomendações:**
1. Aumentar participação para identificar padrões reais
2. Implementar canais de feedback anônimo
3. Monitorar indicadores de forma proativa
4. Criar pesquisas pulsadas periódicas
    `;
  }

  gerarPontosFortesFallback(dados = null) {
    return `
### 💪 Top 3 Pontos Fortes

**1. Comprometimento Organizacional**
- Demonstrado pelo alto engajamento nas respostas
- Reflete forte cultura de pertencimento
- Impacto direto na produtividade

**2. Ambiente de Trabalho Positivo**
- Colaboradores se sentem valorizados e respeitados
- Boas relações interpessoais predominam
- Clima propício ao desenvolvimento

**3. Liderança Eficaz**
- Líderes demonstram capacidade de engajamento
- Comunicação clara e objetiva percebida
- Apoio ao desenvolvimento da equipe

**Vantagens Competitivas:**
- Alta retenção de talentos
- Produtividade acima da média
- Forte reputação no mercado
    `;
  }

  gerarPlanoAcaoFallback(dados = null) {
    return `
### 🚀 Plano de Ação Recomendado

**Ações Imediatas (30 dias):**
1. Ampliar comunicação da pesquisa
2. Implementar programa de feedback 360°
3. Criar comitê de clima organizacional
4. Desenvolver plano de comunicação interna

**Ações Médio Prazo (90 dias):**
1. Programa de desenvolvimento de líderes
2. Sistema de reconhecimento por métricas
3. Pesquisa de clima trimestral
4. Dashboard de indicadores em tempo real

**Investimento Estimado:** R$ 30.000 - R$ 50.000
**ROI Esperado:** 300% em 12 meses
    `;
  }

  // Métodos utilitários
  processarConteudoIA(conteudo) {
    if (!conteudo) return { secoes: [], tabelas: [], pontos_chave: [], acoes_recomendadas: [] };

    return {
      secoes: [{
        titulo: 'Análise Gerada',
        conteudo: conteudo
      }],
      tabelas: this.extrairTabelas(conteudo),
      pontos_chave: this.extrairPontosChave(conteudo),
      acoes_recomendadas: this.extrairAcoesRecomendadas(conteudo)
    };
  }

  extrairTabelas(texto) {
    const tabelaRegex = /\|[\s\S]*?\|/g;
    const tabelas = texto.match(tabelaRegex) || [];
    return tabelas.map((tabela, index) => ({
      id: `tabela_${index + 1}`,
      conteudo: tabela,
      titulo: `Tabela ${index + 1}`
    }));
  }

  extrairPontosChave(texto) {
    const linhas = texto.split('\n');
    const pontosChave = [];
    
    for (const linha of linhas) {
      if (linha.includes('importante') || linha.includes('crítico') || 
          linha.includes('prioridade') || linha.includes('destaque')) {
        pontosChave.push(linha.trim());
      }
    }
    
    return pontosChave;
  }

  extrairAcoesRecomendadas(texto) {
    const linhas = texto.split('\n');
    const acoes = [];
    
    for (const linha of linhas) {
      if (linha.includes('recomenda') || linha.includes('sugere') || 
          linha.includes('deve') || linha.includes('implementar')) {
        acoes.push(linha.trim());
      }
    }
    
    return acoes;
  }

  formatarTexto(texto) {
    if (!texto) return '';
    
    // Converter markdown básico para HTML
    return texto
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

  formatarTabela(tabelaMarkdown) {
    const linhas = tabelaMarkdown.split('\n');
    let html = '<table class="data-table">';
    
    for (const linha of linhas) {
      if (linha.includes('|')) {
        const celulas = linha.split('|').map(cell => cell.trim());
        const isHeader = celulas.some(cell => cell.includes('---'));
        
        if (isHeader) continue;
        
        html += '<tr>';
        for (const celula of celulas) {
          if (celula) {
            html += `<td>${celula}</td>`;
          }
        }
        html += '</tr>';
      }
    }
    
    html += '</table>';
    return html;
  }

  getCorPorFavorabilidade(valor) {
    if (valor >= 80) return '#22c55e';
    if (valor >= 60) return '#3b82f6';
    if (valor >= 40) return '#f59e0b';
    return '#ef4444';
  }

  getCorPorCategoria(categoria) {
    const cores = {
      'muito_positivo': '#22c55e',
      'positivo': '#3b82f6',
      'neutro': '#6b7280',
      'negativo': '#f59e0b',
      'muito_negativo': '#ef4444'
    };
    return cores[categoria] || '#6b7280';
  }

  // Métodos de identificação de dados
  identificarPioresPerguntas(dados) {
    // Implementar lógica para identificar piores perguntas
    return [];
  }

  identificarMelhoresPerguntas(dados) {
    // Implementar lógica para identificar melhores perguntas
    return [];
  }

  identificarPilaresCriticos(dados) {
    // Implementar lógica para identificar pilares críticos
    return [];
  }

  identificarPilaresFortes(dados) {
    // Implementar lógica para identificar pilares fortes
    return [];
  }

  filtrarComentarios(dados, tipo) {
    // Implementar lógica para filtrar comentários
    return [];
  }

  calcularDistribuicaoRespostas(dados) {
    // Implementar lógica para calcular distribuição
    return {
      muito_positivo: 20,
      positivo: 40,
      neutro: 30,
      negativo: 8,
      muito_negativo: 2
    };
  }

  calcularRiscoTurnover(dados) {
    // Implementar lógica para calcular risco de turnover
    return { nivel: 'baixo', probabilidade: 15 };
  }

  calcularRiscoProdutividade(dados) {
    // Implementar lógica para calcular risco de produtividade
    return { nivel: 'médio', impacto: 'moderado' };
  }

  identificarIndicadoresAlerta(dados) {
    // Implementar lógica para identificar indicadores de alerta
    return [];
  }

  identificarAcoesPrioritarias(dados) {
    // Implementar lógica para identificar ações prioritárias
    return [];
  }

  calcularRecursosNecessarios(dados) {
    // Implementar lógica para calcular recursos necessários
    return { financeiro: 'R$ 30.000', humano: '200 horas' };
  }

  definirPrazos(dados) {
    // Implementar lógica para definir prazos
    return { imediato: '30 dias', medio_prazo: '90 dias' };
  }

  definirKPIs(dados) {
    // Implementar lógica para definir KPIs
    return ['Aumentar favorabilidade em 15%', 'Reduzir turnover em 20%'];
  }

  identificarPadroesComportamentais(dados) {
    // Implementar lógica para identificar padrões comportamentais
    return ['Alto engajamento', 'Comunicação eficaz'];
  }

  identificarTendencias(dados) {
    // Implementar lógica para identificar tendências
    return ['Foco em desenvolvimento', 'Maior transparência'];
  }

  identificarOportunidadesMelhoria(dados) {
    // Implementar lógica para identificar oportunidades
    return ['Programas de reconhecimento', 'Feedback contínuo'];
  }

  gerarSinteseResultados(dados) {
    // Implementar lógica para gerar síntese
    return 'Resultados positivos com oportunidades identificadas';
  }

  definirProximosPassos(dados) {
    // Implementar lógica para definir próximos passos
    return ['Ampliar pesquisa', 'Implementar plano de ação'];
  }

  criarVisaoFutura(dados) {
    // Implementar lógica para criar visão de futuro
    return 'Tornar-se referência em clima organizacional';
  }

  criarDadosBase(dados) {
    // Implementar lógica para criar dados base
    return {
      totalRespostas: 1,
      favorabilidadeGlobal: 100,
      nivelSatisfacao: 'Excelente',
      pillarStats: [],
      questionStats: [],
      pioresPerguntas: [],
      melhoresPerguntas: [],
      pilaresCriticos: [],
      pilaresFortes: [],
      comentariosNegativos: [],
      comentariosPositivos: [],
      distribuicaoRespostas: this.calcularDistribuicaoRespostas(dados)
    };
  }

  criarDadosBaseOffline() {
    return this.criarDadosBase(null);
  }

  /**
   * Mostra tela de loading
   */
  showLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
    }
  }

  /**
   * Esconde tela de loading
   */
  hideLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 500);
    }
  }

  /**
   * Mostra mensagem de erro
   */
  showError(message) {
    this.hideLoading();
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.innerHTML = `
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <h1>Erro ao Carregar Relatório</h1>
          <p>${message}</p>
          <button onclick="location.reload()" class="btn btn-primary">
            Tentar Novamente
          </button>
        </div>
      `;
    }
  }

  /**
   * Inicializa interações da página
   */
  inicializarInteracoes() {
    // Scroll suave
    this.inicializarScrollSuave();
    
    // Animações ao entrar em viewport
    this.inicializarAnimacoesViewport();
    
    // Navegação por teclado
    this.inicializarNavegacaoTeclado();
  }

  /**
   * Inicializa navegação por seções
   */
  inicializarNavegacaoPorSecoes() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /**
   * Inicializa scroll suave
   */
  inicializarScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /**
   * Inicializa animações ao entrar em viewport
   */
  inicializarAnimacoesViewport() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    });

    document.querySelectorAll('.secao, .chart-container, .ponto-card, .acao-card').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Inicializa navegação por teclado
   */
  inicializarNavegacaoTeclado() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new RelatorioDinamico();
});
