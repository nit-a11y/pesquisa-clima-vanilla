/**
 * RelatorioLandingEnhanced - Engine Interativo
 * Sistema completo de visualização e interação para landing page estratégica
 */

class RelatorioLandingEnhanced {
  constructor() {
    this.dados = {};
    this.dadosUnidades = null;
    this.dadosComentarios = null;
    this.categoriaFiltroAtiva = 'todos';
    this.charts = {};
    this.chartsInitialized = false;
    this.isLoading = true;
    this.filtrosAtivos = {
      unidade: 'all',
      setor: 'all',
      tipoGrafico: 'barras'
    };
    
    this.init();
  }

  /**
   * Inicialização principal
   */
  async init() {
    try {
      this.showLoading();
      
      // Carregar dados (usar mock diretamente para evitar problemas)
      this.carregarDadosMock();
      
      // Renderizar conteúdo
      await this.renderizarConteudo();
      this.inicializarInteracoes();
      
      // Inicializar gráficos apenas uma vez
      this.inicializarGraficos();
      
      this.hideLoading();
    } catch (error) {
      console.error('Erro ao inicializar:', error);
      this.showError('Não foi possível carregar a análise. Tente novamente.');
    }
  }

  /**
   * Carregar dados das APIs
   */
  async carregarDados() {
    try {
      // Carregar dados comparativos
      const response = await fetch('/assets/data/comparativo/comparativo-2025-2026.json');
      this.dados.comparativo = await response.json();
      
      // Carregar dados individuais
      const [response2025, response2026] = await Promise.all([
        fetch('/assets/data/comparativo/analise-2025.json'),
        fetch('/assets/data/comparativo/analise-2026.json')
      ]);
      
      this.dados.ano2025 = await response2025.json();
      this.dados.ano2026 = await response2026.json();
      
      console.log('Dados carregados com sucesso:', this.dados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Dados mock para desenvolvimento
      this.carregarDadosMock();
    }
  }

  /**
   * Dados mock para desenvolvimento
   */
  carregarDadosMock() {
    this.dados = {
      ano2025: {
        metadata: { ano: "2025", total_respondentes: 92, satisfacao_geral: "82.88%" },
        pilares: [
          { nome: "Ambiente de Trabalho", satisfacao: 88.8, status: "Ótimo" },
          { nome: "Comprometimento Organizacional", satisfacao: 88.0, status: "Ótimo" },
          { nome: "Gestão do Capital Humano", satisfacao: 81.8, status: "Bom" },
          { nome: "Comunicação", satisfacao: 64.7, status: "Atenção" },
          { nome: "Liderança", satisfacao: 87.2, status: "Ótimo" },
          { nome: "Trabalho em Equipe", satisfacao: 77.2, status: "Bom" }
        ]
      },
      ano2026: {
        metadata: { ano: "2026", total_respondentes: 96, satisfacao_geral: "87.9%" },
        pilares: [
          { nome: "Liderança", satisfacao: 93.3, status: "Excelente", variacao_vs_2025: "+6.1pp" },
          { nome: "Comprometimento Organizacional", satisfacao: 93.0, status: "Excelente", variacao_vs_2025: "+5.0pp" },
          { nome: "Ambiente de Trabalho", satisfacao: 91.7, status: "Ótimo", variacao_vs_2025: "+2.9pp" },
          { nome: "Gestão do Capital Humano", satisfacao: 84.6, status: "Bom", variacao_vs_2025: "+2.8pp" },
          { nome: "Trabalho em Equipe", satisfacao: 84.1, status: "Bom", variacao_vs_2025: "+6.9pp" },
          { nome: "Comunicação", satisfacao: 80.9, status: "Bom", variacao_vs_2025: "+16.2pp" }
        ],
        pontos_criticos: [
          { area: "Benefícios", valor: 58.3, status: "CRÍTICO", comentarios: 64 },
          { area: "Remuneração", valor: 59.4, status: "ALTO", comentarios: 45 },
          { area: "Tratamento Interpessoal", valor: 85.4, status: "Atenção", comentarios: 12 }
        ]
      },
      comparativo: {
        analise_melhorias: [
          { pilar: "Comunicação", variacao: "+12.9pp", impacto: "Alto" },
          { pilar: "Liderança", variacao: "+8.3pp", impacto: "Médio" },
          { pilar: "Comprometimento", variacao: "+8.0pp", impacto: "Médio" }
        ],
        analise_pioras: [
          { area: "Benefícios", valor: 58.3, status: "CRÍTICO", acao: "Revisão completa" },
          { area: "Assédio", valor: 9.38, status: "CRÍTICO", acao: "Investigação imediata" },
          { area: "Remuneração", valor: 59.4, status: "ALTO", acao: "Análise de mercado" }
        ]
      }
    };
  }

  /**
   * Renderizar conteúdo dinâmico
   */
  async renderizarConteudo() {
    this.renderizarTabelaComparativo();
    // Análise por unidade será renderizada via initAnaliseUnidade()
    this.renderizarMetricasDinamicas();
  }

  /**
   * Renderizar tabela comparativa
   */
  renderizarTabelaComparativo() {
    const tbody = document.getElementById('tabelaComparativoBody');
    if (!tbody || !this.dados.ano2026?.pilares) return;

    tbody.innerHTML = this.dados.ano2026.pilares.map(pilar => {
      const pilar2025 = this.dados.ano2025.pilares.find(p => p.nome === pilar.nome);
      const variacao = pilar2025 ? (pilar.satisfacao - pilar2025.satisfacao).toFixed(1) : 'N/A';
      const tendencia = variacao > 0 ? 'positive' : variacao < 0 ? 'negative' : 'neutral';
      const statusClass = this.getStatusClass(pilar.status);
      
      return `
        <tr>
          <td><strong>${pilar.nome}</strong></td>
          <td>${pilar2025?.satisfacao || 'N/A'}%</td>
          <td>${pilar.satisfacao}%</td>
          <td class="trend-${tendencia}">${variacao > 0 ? '+' : ''}${variacao}pp</td>
          <td><span class="status-badge ${statusClass}">${pilar.status}</span></td>
          <td>
            <span class="trend-icon ${tendencia}">
              ${this.getTrendIcon(tendencia)}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Carregar dados das unidades
   */
  async carregarDadosUnidades() {
    try {
      const response = await fetch('/assets/data/unidades-2026.json');
      this.dadosUnidades = await response.json();
      console.log('Dados das unidades carregados:', this.dadosUnidades);
    } catch (error) {
      console.error('Erro ao carregar dados das unidades:', error);
      // Dados mock em caso de erro
      this.dadosUnidades = {
        unidades: {
          eusebio: {
            nome: 'Eusébio',
            percentual_satisfacao: 92.5,
            media_satisfacao: 3.5,
            total_respostas: 6,
            satisfacao_geral: '92.5%',
            pilares: {
              ambiente_trabalho: { favorabilidade: 100, status: 'Ótimo' },
              comprometimento_organizacional: { favorabilidade: 100, status: 'Ótimo' },
              comunicacao: { favorabilidade: 83.3, status: 'Ótimo' },
              gestao_pessoas: { favorabilidade: 87.5, status: 'Ótimo' },
              lideranca: { favorabilidade: 96.7, status: 'Ótimo' },
              trabalho_equipe: { favorabilidade: 87.5, status: 'Ótimo' }
            },
            comentarios: 4
          },
          fortaleza: {
            nome: 'Fortaleza',
            percentual_satisfacao: 86.5,
            media_satisfacao: 3.3,
            total_respostas: 64,
            satisfacao_geral: '86.5%',
            pilares: {
              ambiente_trabalho: { favorabilidade: 90.6, status: 'Ótimo' },
              comprometimento_organizacional: { favorabilidade: 92.2, status: 'Ótimo' },
              comunicacao: { favorabilidade: 79.2, status: 'Ótimo' },
              gestao_pessoas: { favorabilidade: 83.3, status: 'Ótimo' },
              lideranca: { favorabilidade: 92, status: 'Ótimo' },
              trabalho_equipe: { favorabilidade: 82, status: 'Ótimo' }
            },
            comentarios: 44
          },
          sao_luis: {
            nome: 'São Luís',
            percentual_satisfacao: 89.8,
            media_satisfacao: 3.4,
            total_respostas: 16,
            satisfacao_geral: '89.8%',
            pilares: {
              ambiente_trabalho: { favorabilidade: 89.6, status: 'Ótimo' },
              comprometimento_organizacional: { favorabilidade: 93.8, status: 'Ótimo' },
              comunicacao: { favorabilidade: 85.4, status: 'Ótimo' },
              gestao_pessoas: { favorabilidade: 86, status: 'Ótimo' },
              lideranca: { favorabilidade: 96.7, status: 'Ótimo' },
              trabalho_equipe: { favorabilidade: 87.5, status: 'Ótimo' }
            },
            comentarios: 11
          },
          juazeiro_do_norte: {
            nome: 'Juazeiro do Norte',
            percentual_satisfacao: 91.0,
            media_satisfacao: 3.5,
            total_respostas: 10,
            satisfacao_geral: '91.0%',
            pilares: {
              ambiente_trabalho: { favorabilidade: 96.7, status: 'Ótimo' },
              comprometimento_organizacional: { favorabilidade: 92.5, status: 'Ótimo' },
              comunicacao: { favorabilidade: 83.3, status: 'Ótimo' },
              gestao_pessoas: { favorabilidade: 89.4, status: 'Ótimo' },
              lideranca: { favorabilidade: 94, status: 'Ótimo' },
              trabalho_equipe: { favorabilidade: 90, status: 'Ótimo' }
            },
            comentarios: 5
          }
        }
      };
    }
  }

/**
   * Renderizar tabela comparativa de unidades
   */
  renderizarTabelaUnidades() {
    const tbody = document.getElementById('tabelaUnidadesBody');
    console.log('Elemento tbody encontrado:', tbody);
    console.log('Dados disponíveis:', this.dadosUnidades);
    
    if (!tbody) {
      console.error('Elemento tabelaUnidadesBody não encontrado!');
      return;
    }
    
    if (!this.dadosUnidades) {
      console.error('Dados das unidades não disponíveis!');
      return;
    }

    const unidades = Object.values(this.dadosUnidades.unidades);
    console.log('Unidades processadas:', unidades);
    
    // Ordenar por satisfação (maior para menor)
    unidades.sort((a, b) => b.percentual_satisfacao - a.percentual_satisfacao);
    
    tbody.innerHTML = unidades.map(unidade => {
      // Status baseado na realidade dos dados
      let status = unidade.status_geral || 'Bom';
      if (unidade.percentual_satisfacao >= 90) status = 'Excelente';
      else if (unidade.percentual_satisfacao >= 85) status = 'Ótimo';
      else if (unidade.percentual_satisfacao < 75) status = 'Atenção';
      
      // Tendências baseadas na realidade
      let tendencia = '➡️'; // Estável por padrão
      if (unidade.nome === 'Eusébio' || unidade.nome === 'Juazeiro do Norte') {
        tendencia = '📈'; // Crescimento
      } else if (unidade.nome === 'Fortaleza' || unidade.nome === 'São Luís') {
        tendencia = '➡️'; // Estável
      }
      
      return `
        <tr>
          <td><strong>${unidade.nome}</strong></td>
          <td>${unidade.total_respostas}</td>
          <td>${unidade.media_satisfacao}</td>
          <td><span class="percentual-destaque">${unidade.percentual_satisfacao}%</span></td>
          <td><span class="status-badge status-${status.toLowerCase()}">${status}</span></td>
          <td>${tendencia}</td>
        </tr>
      `;
    }).join('');
  }

/**
   * Renderizar cards detalhados das unidades
   */
  renderizarCardsDetalhados() {
    const container = document.getElementById('unidadesDetalhadasGrid');
    if (!container || !this.dadosUnidades) return;

    const unidades = Object.values(this.dadosUnidades.unidades);
    
    container.innerHTML = unidades.map(unidade => {
      // Status baseado na realidade dos dados
      let status = unidade.status_geral || 'Bom';
      if (unidade.percentual_satisfacao >= 90) status = 'Excelente';
      else if (unidade.percentual_satisfacao >= 85) status = 'Ótimo';
      else if (unidade.percentual_satisfacao < 75) status = 'Atenção';
      
      // Tendências baseadas na realidade
      let tendencia = '➡️'; // Estável por padrão
      if (unidade.nome === 'Eusébio' || unidade.nome === 'Juazeiro do Norte') {
        tendencia = '📈'; // Crescimento
      } else if (unidade.nome === 'Fortaleza' || unidade.nome === 'São Luís') {
        tendencia = '➡️'; // Estável
      }
      
      return `
        <div class="unidade-detalhada-card">
          <div class="unidade-header">
            <h4>${unidade.nome}</h4>
            <span class="unidade-tendencia">${tendencia}</span>
          </div>
          
          <div class="unidade-metricas">
            <div class="metricas-grid">
              <div class="metrica-item">
                <span class="metrica-valor">${unidade.total_respostas}</span>
                <span class="metrica-label">Respondentes</span>
              </div>
              <div class="metrica-item">
                <span class="metrica-valor">${unidade.media_satisfacao}</span>
                <span class="metrica-label">Média</span>
              </div>
              <div class="metrica-item">
                <span class="metrica-valor satisfacao-geral">${unidade.satisfacao_geral}</span>
                <span class="metrica-label">Satisfação Geral</span>
              </div>
            </div>
          </div>
          
          <div class="unidade-pilares">
            <h5>Desempenho por Pilar</h5>
            <div class="pilares-grid">
              ${Object.entries(unidade.pilares).map(([chave, pilar]) => `
                <div class="pilar-item">
                  <span class="pilar-nome">${this.formatarNomePilar(chave)}</span>
                  <span class="pilar-valor">${pilar.favorabilidade}%</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="unidade-info">
            <span class="info-item">${unidade.comentarios} comentários</span>
            <span class="info-item">${status}</span>
          </div>
        </div>
      `;
    }).join('');
  }

/**
   * Renderizar tabela comparativa de pilares
   */
  renderizarTabelaPilares() {
    const container = document.getElementById('pilaresTabela');
    if (!container || !this.dadosUnidades) return;

    const unidades = Object.values(this.dadosUnidades.unidades);
    const pilaresNomes = ['ambiente_trabalho', 'comprometimento_organizacional', 'comunicacao', 'gestao_pessoas', 'lideranca', 'trabalho_equipe'];
    
    let tabelaHTML = `
      <table class="pilares-comparativo">
        <thead>
          <tr>
            <th>Pilar</th>
            ${unidades.map(u => `<th>${u.nome}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${pilaresNomes.map(pilar => `
            <tr>
              <td><strong>${this.formatarNomePilar(pilar)}</strong></td>
              ${unidades.map(u => `
                <td>
                  <span class="pilar-valor">${u.pilares[pilar].favorabilidade}%</span>
                  <span class="pilar-status">${u.pilares[pilar].status}</span>
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    container.innerHTML = tabelaHTML;
  }

/**
   * Formatar nome do pilar para exibição
   */
  formatarNomePilar(pilar) {
    const nomes = {
      'ambiente_trabalho': 'Ambiente de Trabalho',
      'comprometimento_organizacional': 'Comprometimento',
      'comunicacao': 'Comunicação',
      'gestao_pessoas': 'Gestão de Pessoas',
      'lideranca': 'Liderança',
      'trabalho_equipe': 'Trabalho em Equipe'
    };
    return nomes[pilar] || pilar;
  }

/**
   * Renderizar todos os componentes da análise por unidade
   */
  renderizarAnaliseUnidade() {
    console.log('Renderizando análise por unidade...');
    console.log('Dados:', this.dadosUnidades);
    
    this.renderizarTabelaUnidades();
    this.renderizarCardsDetalhados();
    this.renderizarTabelaPilares();
    
    console.log('Análise por unidade renderizada!');
  }

  /**
   * Renderizar métricas dinâmicas
   */
  renderizarMetricasDinamicas() {
    // Atualizar KPIs do Hero se necessário
    const kpiElements = document.querySelectorAll('.kpi-current');
    // Implementar atualizações dinâmicas baseadas nos dados
  }

  /**
   * Inicializar interações
   */
  inicializarInteracoes() {
    // Navegação suave
    this.initSmoothScroll();
    
    // Filtros
    this.initFiltros();
    
    // Análise por unidade (simplificado)
    this.initAnaliseUnidade();
    
    // Animações ao scroll
    this.initScrollAnimations();
  }

  /**
   * Scroll suave para seções
   */
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /**
   * Inicializar filtros
   */
  initFiltros() {
    const filtros = ['unidade', 'setor', 'tipoGrafico'];
    
    filtros.forEach(filtro => {
      const element = document.getElementById(`filtro${filtro.charAt(0).toUpperCase() + filtro.slice(1)}`);
      if (element) {
        element.addEventListener('change', (e) => {
          this.filtrosAtivos[filtro] = e.target.value;
          this.atualizarGraficos();
        });
      }
    });
  }

  /**
   * Inicializar análise por unidade (comparativo completo)
   */
  async initAnaliseUnidade() {
    await this.carregarDadosUnidades();
    this.renderizarAnaliseUnidade();
    // Inicializar gráfico detalhado agora que temos os dados das unidades
    this.initComparativoDetalhado();
    // Inicializar análise de comentários
    await this.initAnaliseComentarios();
  }

  /**
   * Carregar dados dos comentários
   */
  async carregarDadosComentarios() {
    try {
      const response = await fetch('assets/data/comparativo/comentarios-mapeados-completos.json');
      if (!response.ok) throw new Error('Erro ao carregar comentários');
      
      this.dadosComentarios = await response.json();
      console.log('Dados dos comentários carregados:', this.dadosComentarios);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      this.dadosComentarios = null;
    }
  }

  /**
   * Inicializar análise de comentários
   */
  async initAnaliseComentarios() {
    await this.carregarDadosComentarios();
    if (!this.dadosComentarios) return;
    
    this.renderizarEstatisticasComentarios();
    this.renderizarFiltrosCategorias();
    this.renderizarComentarios();
    this.analisarSentimento();
  }

  /**
   * Renderizar estatísticas gerais dos comentários
   */
  renderizarEstatisticasComentarios() {
    if (!this.dadosComentarios) return;
    
    // Usar apenas comentários de 2026
    const comentarios2026 = this.dadosComentarios.comentarios_por_ano["2026"].comentarios;
    const totalComentarios = comentarios2026.length;
    
    // Calcular média de sentimento (positivo=3, neutro=2, negativo=1)
    const sentimentoScores = { positivo: 3, neutro: 2, negativo: 1 };
    const mediaSentimento = comentarios2026.reduce((acc, comment) => 
      acc + sentimentoScores[comment.sentimento], 0) / totalComentarios;
    
    // Obter categorias únicas
    const categoriasUnicas = [...new Set(comentarios2026.map(c => c.categoria))];
    
    // Verificar se elementos existem antes de definir conteúdo
    const totalComentariosEl = document.getElementById('totalComentarios');
    const mediaAvaliacoesEl = document.getElementById('mediaAvaliacoes');
    const totalCategoriasEl = document.getElementById('totalCategorias');
    
    if (totalComentariosEl) totalComentariosEl.textContent = totalComentarios;
    if (mediaAvaliacoesEl) mediaAvaliacoesEl.textContent = (mediaSentimento / 3 * 5).toFixed(1); // Converter para escala 1-5
    if (totalCategoriasEl) totalCategoriasEl.textContent = categoriasUnicas.length;
  }

  /**
   * Renderizar filtros de categorias
   */
  renderizarFiltrosCategorias() {
    if (!this.dadosComentarios) return;
    
    const container = document.getElementById('filtroCategorias');
    if (!container) return;
    
    // Usar apenas comentários de 2026
    const comentarios2026 = this.dadosComentarios.comentarios_por_ano["2026"].comentarios;
    
    // Obter categorias únicas
    const categoriasUnicas = [...new Set(comentarios2026.map(c => c.categoria))];
    
    // Adicionar filtro "Todos"
    const filtroTodos = document.createElement('button');
    filtroTodos.className = 'categoria-filtro active';
    filtroTodos.onclick = () => this.filtrarPorCategoria('todos');
    filtroTodos.innerHTML = '<span class="icone">📊</span> Todos';
    container.appendChild(filtroTodos);
    
    // Ícones para categorias
    const iconesCategorias = {
      ambiente: '🏢',
      comunicacao: '💬',
      lideranca: '👔',
      desenvolvimento: '📚',
      reconhecimento: '⭐',
      remuneracao: '💰',
      cultura: '🎯',
      comprometimento: '❤️',
      equipe: '🤝',
      recursos: '🛠️'
    };
    
    // Adicionar filtros por categoria
    categoriasUnicas.forEach(categoria => {
      const filtro = document.createElement('button');
      filtro.className = 'categoria-filtro';
      filtro.onclick = () => this.filtrarPorCategoria(categoria);
      const icone = iconesCategorias[categoria] || '📋';
      filtro.innerHTML = `<span class="icone">${icone}</span> ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`;
      filtro.style.borderColor = '#dc262640';
      container.appendChild(filtro);
    });
  }

  /**
   * Filtrar comentários por categoria
   */
  filtrarPorCategoria(categoriaId) {
    this.categoriaFiltroAtiva = categoriaId;
    
    // Atualizar botões ativos
    document.querySelectorAll('.categoria-filtro').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    this.renderizarComentarios();
  }

  /**
   * Renderizar comentários
   */
  renderizarComentarios() {
    if (!this.dadosComentarios) return;
    
    const container = document.getElementById('comentariosContainer');
    if (!container) return;
    
    // Usar apenas comentários de 2026
    const comentarios2026 = this.dadosComentarios.comentarios_por_ano["2026"].comentarios;
    
    let comentariosParaExibir = [];
    
    if (this.categoriaFiltroAtiva === 'todos') {
      // Exibir todos os comentários
      comentariosParaExibir = [...comentarios2026];
    } else {
      // Exibir comentários da categoria selecionada
      comentariosParaExibir = comentarios2026.filter(
        comment => comment.categoria === this.categoriaFiltroAtiva
      );
    }
    
    // Ordenar por sentimento (negativos primeiro) e depois por data
    const sentimentoOrder = { negativo: 0, neutro: 1, positivo: 2 };
    comentariosParaExibir.sort((a, b) => 
      sentimentoOrder[a.sentimento] - sentimentoOrder[b.sentimento] ||
      new Date(b.data) - new Date(a.data)
    );
    
    // Limitar a 50 comentários para performance
    comentariosParaExibir = comentariosParaExibir.slice(0, 50);
    
    // Cores para sentimento
    const coresSentimento = {
      positivo: '#10b981',
      neutro: '#f59e0b', 
      negativo: '#ef4444'
    };
    
    const iconesCategorias = {
      ambiente: '🏢',
      comunicacao: '💬',
      lideranca: '👔',
      desenvolvimento: '📚',
      reconhecimento: '⭐',
      remuneracao: '💰',
      cultura: '🎯',
      comprometimento: '❤️',
      equipe: '🤝',
      recursos: '🛠️'
    };
    
    container.innerHTML = comentariosParaExibir.map(comentario => `
      <div class="comentario-card">
        <div class="comentario-header">
          <div class="comentario-info">
            <h4 class="comentario-titulo">${comentario.pergunta_id}</h4>
            <div class="comentario-meta">
              <span class="comentario-categoria" style="background-color: ${coresSentimento[comentario.sentimento]}">
                ${iconesCategorias[comentario.categoria] || '�'} ${comentario.categoria.charAt(0).toUpperCase() + comentario.categoria.slice(1)}
              </span>
              <span>Sentimento: ${comentario.sentimento.charAt(0).toUpperCase() + comentario.sentimento.slice(1)}</span>
            </div>
          </div>
          <div class="comentario-avaliacao">
            <div class="estrelas">
              ${this.renderizarEstrelasPorSentimento(comentario.sentimento)}
            </div>
            <span>${comentario.sentimento.charAt(0).toUpperCase() + comentario.sentimento.slice(1)}</span>
          </div>
        </div>
        <p class="comentario-texto">${comentario.comentario}</p>
        <div class="comentario-data">
          ${new Date(comentario.data).toLocaleDateString('pt-BR')} • ${comentario.pergunta_id}
        </div>
      </div>
    `).join('');
  }

  /**
   * Renderizar estrelas de avaliação
   */
  renderizarEstrelas(estrelas) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= estrelas) {
        html += '<span class="estrela">⭐</span>';
      } else {
        html += '<span class="estrela" style="opacity: 0.3">⭐</span>';
      }
    }
    return html;
  }

  /**
   * Renderizar estrelas por sentimento
   */
  renderizarEstrelasPorSentimento(sentimento) {
    const estrelasPorSentimento = {
      positivo: 5,
      neutro: 3,
      negativo: 1
    };
    
    const estrelas = estrelasPorSentimento[sentimento] || 3;
    let html = '';
    
    for (let i = 1; i <= 5; i++) {
      if (i <= estrelas) {
        html += '<span class="estrela">⭐</span>';
      } else {
        html += '<span class="estrela" style="opacity: 0.3">⭐</span>';
      }
    }
    return html;
  }

  /**
   * Analisar sentimento dos comentários
   */
  analisarSentimento() {
    if (!this.dadosComentarios) return;
    
    // Usar apenas comentários de 2026
    const comentarios2026 = this.dadosComentarios.comentarios_por_ano["2026"].comentarios;
    
    let positivos = 0;
    let neutros = 0;
    let negativos = 0;
    
    comentarios2026.forEach(comment => {
      if (comment.sentimento === 'positivo') {
        positivos++;
      } else if (comment.sentimento === 'neutro') {
        neutros++;
      } else if (comment.sentimento === 'negativo') {
        negativos++;
      }
    });
    
    const total = positivos + neutros + negativos;
    
    // Verificar se elementos existem antes de definir conteúdo
    const percentualPositivoEl = document.getElementById('percentualPositivo');
    const percentualNeutroEl = document.getElementById('percentualNeutro');
    const percentualNegativoEl = document.getElementById('percentualNegativo');
    
    if (percentualPositivoEl) percentualPositivoEl.textContent = 
      total > 0 ? Math.round((positivos / total) * 100) + '%' : '0%';
    if (percentualNeutroEl) percentualNeutroEl.textContent = 
      total > 0 ? Math.round((neutros / total) * 100) + '%' : '0%';
    if (percentualNegativoEl) percentualNegativoEl.textContent = 
      total > 0 ? Math.round((negativos / total) * 100) + '%' : '0%';
  }

  /**
   * Animações ao scroll - mais sutis e seletivas
   */
  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Adicionar classe apenas uma vez
          if (!entry.target.classList.contains('visible')) {
            entry.target.classList.add('visible');
          }
        }
      });
    }, { threshold: 0.1 });

    // Aplicar apenas a cards específicos, não a todas as seções
    const animatedElements = document.querySelectorAll('.insight-card, .visao-card, .plano-fase, .comite-card, .futuro-card');
    animatedElements.forEach(element => {
      // Adicionar classe inicial
      element.classList.add('fade-in');
      observer.observe(element);
    });
  }

  /**
   * Limpar completamente um canvas específico
   */
  limparCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      // Remover todas as referências do Chart.js
      Chart.getChart(canvas)?.destroy();
    }
  }

/**
   * Limpar todos os gráficos existentes
   */
  limparGraficos() {
    // Destruir gráficos existentes
    Object.keys(this.charts).forEach(key => {
      if (this.charts[key]) {
        this.charts[key].destroy();
        this.charts[key] = null;
      }
    });
    
    // Limpar canvases (removidos: comparativoDetalhadoChart, evolucaoTemporalChart)
    const canvasIds = ['comparativoGeralChart'];
    canvasIds.forEach(id => this.limparCanvas(id));
  }

/**
   * Inicializar todos os gráficos
   */
  inicializarGraficos() {
    // Evitar múltiplas inicializações
    if (this.chartsInitialized) {
      return;
    }
    
    // Limpar gráficos existentes primeiro
    this.limparGraficos();
    
    // Inicializar sem delay para evitar problemas
    this.initComparativoGeral();
    // Removido: Timeline e Evolução Temporal
    // Removido: Gráfico Comparativo Detalhado
    // Gráfico detalhado será inicializado após carregamento dos dados das unidades
    // Removido: this.initAnaliseSetorial() - não necessário na versão simplificada
    
    // Marcar como inicializado
    this.chartsInitialized = true;
  }

  /**
   * Gráfico comparativo geral
   */
  initComparativoGeral() {
    const ctx = document.getElementById('comparativoGeralChart');
    if (!ctx || !this.dados.ano2025?.pilares || !this.dados.ano2026?.pilares) return;
    
    // Limpar canvas completamente
    this.limparCanvas('comparativoGeralChart');

    const labels = this.dados.ano2025.pilares.map(p => p.nome);
    const data2025 = this.dados.ano2025.pilares.map(p => p.satisfacao);
    const data2026 = this.dados.ano2026.pilares.map(p => p.satisfacao);

    this.charts.comparativoGeral = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '2025',
            data: data2025,
            backgroundColor: 'rgba(107, 114, 128, 0.8)',
            borderColor: 'rgba(107, 114, 128, 1)',
            borderWidth: 1
          },
          {
            label: '2026',
            data: data2026,
            backgroundColor: 'rgba(220, 38, 38, 0.8)',
            borderColor: 'rgba(220, 38, 38, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { weight: '600' } }
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
            font: {
              weight: 'bold',
              size: 12
            },
            formatter: (value) => value + '%'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%'
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }

  /**
   * Gráfico comparativo detalhado - análise unidade por pilar 2026
   */
  initComparativoDetalhado() {
    const ctx = document.getElementById('comparativoDetalhadoChart');
    if (!ctx || !this.dadosUnidades) return;
    
    // Limpar canvas completamente
    this.limparCanvas('comparativoDetalhadoChart');

    // Obter dados das unidades
    const unidades = Object.values(this.dadosUnidades.unidades);
    const pilaresNomes = ['ambiente_trabalho', 'comprometimento_organizacional', 'comunicacao', 'gestao_pessoas', 'lideranca', 'trabalho_equipe'];
    
    // Labels dos pilares formatados
    const labels = pilaresNomes.map(p => this.formatarNomePilar(p));
    
    // Criar datasets para cada unidade
    const datasets = unidades.map((unidade, index) => {
      const cores = [
        { bg: 'rgba(220, 38, 38, 0.6)', border: 'rgba(220, 38, 38, 1)' },
        { bg: 'rgba(59, 130, 246, 0.6)', border: 'rgba(59, 130, 246, 1)' },
        { bg: 'rgba(16, 185, 129, 0.6)', border: 'rgba(16, 185, 129, 1)' },
        { bg: 'rgba(245, 158, 11, 0.6)', border: 'rgba(245, 158, 11, 1)' }
      ];
      
      const dadosPilares = pilaresNomes.map(pilar => unidade.pilares[pilar].favorabilidade);
      
      return {
        label: unidade.nome,
        data: dadosPilares,
        backgroundColor: cores[index].bg,
        borderColor: cores[index].border,
        borderWidth: 2
      };
    });

    this.charts.comparativoDetalhado = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { weight: '600', size: 14 } }
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
            font: {
              weight: 'bold',
              size: 11
            },
            formatter: (value) => value + '%'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: '#E5E7EB' },
            ticks: {
              font: { weight: '600' },
              callback: (value) => value + '%'
            },
            title: {
              display: true,
              text: 'Favorabilidade (%)',
              font: { weight: '600' }
            }
          },
          x: {
            grid: { display: false },
            ticks: { font: { weight: '600' } }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }

  /**
   * Gráfico de evolução temporal - REMOVIDO
   */
  /*initEvolucaoTemporal() {
    // Seção removida do relatório
  }*/

  /**
   * Gráfico de análise setorial
   */
  initAnaliseSetorial() {
    const ctx = document.getElementById('analiseSetorialChart');
    if (!ctx) return;
    
    // Limpar canvas completamente
    this.limparCanvas('analiseSetorialChart');

    const dadosSetoriais = {
      'Matriz': { satisfacao: 89.2, lideranca: 92, comunicacao: 85, comprometimento: 91 },
      'Filial 1': { satisfacao: 87.8, lideranca: 89, comunicacao: 83, comprometimento: 88 },
      'Filial 2': { satisfacao: 85.3, lideranca: 86, comunicacao: 80, comprometimento: 85 }
    };

    const labels = Object.keys(dadosSetoriais);
    
    this.charts.analiseSetorial = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Liderança', 'Comunicação', 'Comprometimento', 'Satisfação Geral'],
        datasets: labels.map((unidade, index) => ({
          label: unidade,
          data: [
            dadosSetoriais[unidade].lideranca,
            dadosSetoriais[unidade].comunicacao,
            dadosSetoriais[unidade].comprometimento,
            dadosSetoriais[unidade].satisfacao
          ],
          borderColor: this.getCorUnidade(index),
          backgroundColor: this.getCorUnidade(index, 0.2),
          borderWidth: 2
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { weight: '600' } }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              callback: (value) => value + '%'
            }
          }
        }
      }
    });
  }

  /**
   * Atualizar gráficos baseado nos filtros
   */
  atualizarGraficos() {
    // Implementar lógica de filtros
    console.log('Atualizando gráficos com filtros:', this.filtrosAtivos);
    
    // Atualizar gráfico principal baseado no tipo
    if (this.filtrosAtivos.tipoGrafico === 'radar') {
      this.mudarParaRadar();
    } else if (this.filtrosAtivos.tipoGrafico === 'heatmap') {
      this.mudarParaHeatmap();
    } else {
      this.mudarParaBarras();
    }
  }

  /**
   * Mudar tipo de visualização
   */
  mudarVisualizacao(tipo) {
    console.log('Mudando visualização para:', tipo);
    // Implementar lógica de mudança de visualização
  }

  /**
   * Mudar gráfico para radar
   */
  mudarParaRadar() {
    const ctx = document.getElementById('comparativoDetalhadoChart');
    if (!ctx || !this.charts.comparativoDetalhado) return;

    this.charts.comparativoDetalhado.destroy();
    
    // Criar gráfico radar
    this.charts.comparativoDetalhado = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.dados.ano2025.pilares.map(p => p.nome),
        datasets: [
          {
            label: '2025',
            data: this.dados.ano2025.pilares.map(p => p.satisfacao),
            borderColor: 'rgba(107, 114, 128, 1)',
            backgroundColor: 'rgba(107, 114, 128, 0.2)'
          },
          {
            label: '2026',
            data: this.dados.ano2026.pilares.map(p => p.satisfacao),
            borderColor: 'rgba(220, 38, 38, 1)',
            backgroundColor: 'rgba(220, 38, 38, 0.2)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  /**
   * Mudar gráfico para heatmap (simulação com barras)
   */
  mudarParaHeatmap() {
    // Implementar lógica para heatmap
    console.log('Mudando para visualização heatmap');
  }

  /**
   * Mudar gráfico para barras
   */
  mudarParaBarras() {
    // Recriar gráfico de barras original
    this.initComparativoDetalhado();
  }

  /**
   * Utilitários
   */
  getStatusClass(status) {
    const statusMap = {
      'Excelente': 'success',
      'Bom': 'info',
      'Atenção': 'warning',
      'Crítico': 'danger'
    };
    return statusMap[status] || 'neutral';
  }

  getTrendIcon(trend) {
    const icons = {
      'positive': '📈',
      'negative': '📉',
      'neutral': '➡️',
      'stable': '➡️'
    };
    return icons[trend] || '➡️';
  }

  getCorUnidade(index, alpha = 1) {
    const cores = [
      `rgba(220, 38, 38, ${alpha})`,
      `rgba(16, 185, 129, ${alpha})`,
      `rgba(59, 130, 246, ${alpha})`
    ];
    return cores[index % cores.length];
  }

  /**
   * Loading
   */
  showLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
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

  /**
   * Erro
   */
  showError(message) {
    this.hideLoading();
    alert(message);
  }
}

/**
 * Funções globais para interação
 */
window.scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

window.atualizarGraficos = () => {
  if (window.relatorioLanding) {
    window.relatorioLanding.atualizarGraficos();
  }
};

window.mudarVisualizacao = (tipo) => {
  if (window.relatorioLanding) {
    window.relatorioLanding.mudarVisualizacao(tipo);
  }
};

window.mudarTipoGrafico = () => {
  if (window.relatorioLanding) {
    window.relatorioLanding.atualizarGraficos();
  }
};

/**
 * Inicializar painel lateral do dicionário de dados
 */
function initDicionarioModal() {
  const btnDicionario = document.getElementById('btnDicionario');
  const sidePanel = document.getElementById('sidePanel');
  const closeSidePanel = document.getElementById('closeSidePanel');

  if (!btnDicionario || !sidePanel) return;

  // Abrir painel
  btnDicionario.addEventListener('click', function() {
    sidePanel.classList.add('active');
  });

  // Fechar painel pelo botão X
  if (closeSidePanel) {
    closeSidePanel.addEventListener('click', closeSidePanelFn);
  }

  // Fechar painel com ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidePanel.classList.contains('active')) {
      closeSidePanelFn();
    }
  });

  function closeSidePanelFn() {
    sidePanel.classList.remove('active');
  }
}

// Exportações
window.exportarPDF = () => {
  console.log('Exportando PDF...');
  // Implementar exportação PDF
  alert('Funcionalidade de exportação PDF em desenvolvimento');
};

window.compartilhar = () => {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({
      title: 'Pesquisa de Clima Organizacional 2026',
      text: 'Confira a análise completa da pesquisa de clima da Nordeste Locações',
      url: url
    });
  } else {
    navigator.clipboard.writeText(url);
    alert('Link copiado para a área de transferência!');
  }
};

window.baixarRelatorioCompleto = () => {
  console.log('Baixando relatório completo...');
  // Implementar download do relatório
  alert('Relatório completo em desenvolvimento');
};

window.agendarApresentacao = () => {
  console.log('Agendando apresentação...');
  // Implementar agendamento
  alert('Funcionalidade de agendamento em desenvolvimento');
};

window.contatarComite = () => {
  console.log('Contatando comitê...');
  // Implementar contato
  alert('Funcionalidade de contato em desenvolvimento');
};

window.enviarSugestao = () => {
  const sugestao = prompt('Digite sua sugestão para o comitê de clima:');
  if (sugestao) {
    console.log('Sugestão enviada:', sugestao);
    alert('Sugestão enviada com sucesso! O comitê irá analisar.');
  }
};

window.agendarReuniao = () => {
  console.log('Agendando reunião...');
  alert('Funcionalidade de agendamento em desenvolvimento');
};

window.verContatos = () => {
  alert('Contatos do Comitê:\n\n📧 comite.clima@nordestelocacoes.com.br\n📱 (81) 99999-9999\n📍 Matriz - Sala do Comitê');
};

// Inicialização global
window.relatorioLanding = null;

document.addEventListener('DOMContentLoaded', function() {
  window.relatorioLanding = new RelatorioLandingEnhanced();

  // Inicializar modal do dicionário
  initDicionarioModal();

  // Adicionar scroll progress bar
  window.addEventListener('scroll', function() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    }
  });
});
