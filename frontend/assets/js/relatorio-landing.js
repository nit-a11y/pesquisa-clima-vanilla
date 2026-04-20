/**
 * Relatório Landing Page - Engine Interativo
 * Sistema de renderização de landing pages para relatórios de clima organizacional
 */

class RelatorioLandingPage {
  constructor() {
    this.relatorioId = this.extractRelatorioId();
    this.relatorioData = null;
    this.isLoading = true;
    
    this.init();
  }

  /**
   * Inicializa a landing page
   */
  async init() {
    try {
      // Mostrar loading
      this.showLoading();
      
      // Carregar dados do relatório
      await this.carregarRelatorio();
      
      // Renderizar conteúdo
      await this.renderizarConteudo();
      
      // Inicializar interações
      this.inicializarInteracoes();
      
      // Esconder loading
      this.hideLoading();
      
    } catch (error) {
      console.error('Erro ao inicializar landing page:', error);
      this.showError('Não foi possível carregar o relatório. Tente novamente mais tarde.');
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
          <div class="error-icon">error</div>
          <h1>Erro ao Carregar Relatório</h1>
          <p>${message}</p>
          <button onclick="window.location.href='/'" class="btn btn-primary">
            Voltar para página inicial
          </button>
        </div>
      `;
    }
  }

  /**
   * Carrega dados do relatório da API
   */
  async carregarRelatorio() {
    if (!this.relatorioId) {
      throw new Error('ID do relatório não encontrado');
    }

    // Buscar dados reais da API
    const response = await fetch(`/api/clima/relatorio/landing-page/${this.relatorioId}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar relatório: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.sucesso) {
      throw new Error(data.erro || 'Erro ao carregar dados do relatório');
    }
    
    this.relatorioData = data;
  }

  /**
   * Renderiza todo o conteúdo da landing page
   */
  async renderizarConteudo() {
    if (!this.relatorioData || !this.relatorioData.dados) {
      throw new Error('Dados do relatório não disponíveis');
    }

    const dados = this.relatorioData.dados;
    
    // Renderizar seções em ordem
    await this.renderizarHero(dados);
    await this.renderizarResumo(dados);
    await this.renderizarDiagnostico(dados);
    await this.renderizarProblemas(dados);
    await this.renderizarPontosFortes(dados);
    await this.renderizarRiscos(dados);
    await this.renderizarPlanoAcao(dados);
    await this.renderizarFooter(dados);
  }

  /**
   * Renderiza seção hero
   */
  async renderizarHero(dados) {
    // Atualizar data
    const dataGeracao = document.getElementById('dataGeracao');
    if (dataGeracao) {
      const data = new Date(this.relatorioData.metadados.data_geracao);
      dataGeracao.textContent = data.toLocaleDateString('pt-BR');
    }

    // Typewriter effect para título
    const typewriter = document.querySelector('.typewriter');
    if (typewriter) {
      await this.typeWriter(typewriter, dados.titulo, 50);
    }

    // Animar métricas
    await this.animarMetrica('favorabilidadeCard', dados.metricas_principais?.favorabilidade_global || '0');
    await this.animarMetrica('engajamentoCard', (dados.metricas_principais?.indice_engajamento || 0).toString());
    await this.animarMetrica('respostasCard', (dados.metricas_principais?.total_respostas || 0).toString());

    // Diagnóstico principal
    const diagnosticoTexto = document.getElementById('diagnosticoTexto');
    if (diagnosticoTexto) {
      diagnosticoTexto.textContent = dados.resumo_executivo.diagnostico_principal;
    }
  }

  /**
   * Renderiza seção de resumo executivo
   */
  async renderizarResumo(dados) {
    const visaoGeralTexto = document.getElementById('visaoGeralTexto');
    if (visaoGeralTexto) {
      visaoGeralTexto.textContent = dados.resumo_executivo?.visao_geral || 'Visão geral não disponível';
    }

    const impactoTexto = document.getElementById('impactoTexto');
    if (impactoTexto) {
      impactoTexto.textContent = dados.resumo_executivo?.impacto_negocios || 'Impacto não disponível';
    }

    const urgenciaTexto = document.getElementById('urgenciaTexto');
    const urgenciaLevel = document.getElementById('urgenciaLevel');
    if (urgenciaTexto && urgenciaLevel) {
      const urgencia = dados.resumo_executivo?.urgencia || 'Médio';
      urgenciaTexto.textContent = urgencia;
      
      // Definir cor baseada na urgência
      const cores = {
        'Baixo': '#22c55e',
        'Médio': '#f59e0b',
        'Alto': '#ef4444',
        'Crítico': '#dc2626'
      };
      
      urgenciaLevel.style.background = cores[urgencia] || '#f59e0b';
    }
  }

  /**
   * Renderiza seção de diagnóstico geral
   */
  async renderizarDiagnostico(dados) {
    // Renderizar tabela de dimensões
    const tabelaDimensoes = document.getElementById('tabelaDimensoes');
    if (tabelaDimensoes) {
      tabelaDimensoes.innerHTML = `
        <div class="dimensao-row header">
          <div class="dimensao-nome">Dimensão</div>
          <div class="dimensao-valor">Favorabilidade</div>
          <div class="dimensao-valor">Média</div>
          <div class="dimensao-valor">Respostas</div>
        </div>
        ${(dados.diagnostico_geral?.tabela_dimensoes || []).map(dimensao => `
          <div class="dimensao-row">
            <div class="dimensao-nome">${dimensao?.dimensao || 'N/A'}</div>
            <div class="dimensao-valor">${dimensao?.favorabilidade || 'N/A'}</div>
            <div class="dimensao-valor">${dimensao?.media || 'N/A'}</div>
            <div class="dimensao-valor">${dimensao?.respostas || 'N/A'}</div>
          </div>
        `).join('')}
      `;
    }

    // Renderizar padrões identificados
    const padroesList = document.getElementById('padroesList');
    if (padroesList) {
      padroesList.innerHTML = (dados.diagnostico_geral?.padroes_identificados || []).map(padrao => `
        <div class="padrao-item">
          <div class="padrao-icon">i</div>
          <div class="padrao-texto">${padrao}</div>
        </div>
      `).join('');
    }
  }

  /**
   * Renderiza seção de problemas críticos
   */
  async renderizarProblemas(dados) {
    const problemasTimeline = document.getElementById('problemasTimeline');
    if (problemasTimeline) {
      problemasTimeline.innerHTML = (dados.problemas_criticos || []).map((problema, index) => `
        <div class="problema-item" style="animation-delay: ${index * 0.2}s">
          <div class="problema-number">${problema.numero || (index + 1)}</div>
          <div class="problema-content">
            <h3 class="problema-titulo">${problema.problema || 'Problema não identificado'}</h3>
            <p class="problema-descricao">
              <strong>Evidência:</strong> ${problema.evidencia || 'Não disponível'}<br>
              <strong>Impacto:</strong> ${problema.impacto || 'Não avaliado'}
            </p>
            <span class="problema-impacto">Impacto: ${problema.impacto || 'Não avaliado'}</span>
          </div>
        </div>
      `).join('');
    }
  }

  /**
   * Renderiza seção de pontos fortes
   */
  async renderizarPontosFortes(dados) {
    const pontosGrid = document.getElementById('pontosGrid');
    if (pontosGrid) {
      pontosGrid.innerHTML = (dados.pontos_fortes || []).map((ponto, index) => `
        <div class="ponto-card" style="animation-delay: ${index * 0.15}s">
          <div class="ponto-header">
            <div class="ponto-number">${ponto.numero || (index + 1)}</div>
            <h3 class="ponto-titulo">${ponto.ponto_forte || 'Ponto forte não identificado'}</h3>
          </div>
          <p class="ponto-descricao">${ponto.destaque || 'Destaque não disponível'}</p>
        </div>
      `).join('');
    }
  }

  /**
   * Renderiza seção de riscos
   */
  async renderizarRiscos(dados) {
    const riscosMatriz = document.getElementById('riscosMatriz');
    if (riscosMatriz) {
      riscosMatriz.innerHTML = (dados.riscos || []).map(risco => `
        <div class="risco-card">
          <h3 class="risco-titulo">${risco.risco || 'Risco não identificado'}</h3>
          <p class="risco-descricao">${risco.descricao || 'Descrição não disponível'}</p>
          <div class="risco-meta">
            <div class="risco-probabilidade">Probabilidade: ${risco.probabilidade || 'N/A'}</div>
            <div class="risco-consequencia">Consequência: ${risco.consequencia || 'N/A'}</div>
          </div>
        </div>
      `).join('');
    }
  }

  /**
   * Renderiza seção de plano de ação
   */
  async renderizarPlanoAcao(dados) {
    // Renderizar ações imediatas
    const acoesImediatas = document.getElementById('acoesImediatas');
    if (acoesImediatas) {
      acoesImediatas.innerHTML = (dados.plano_acao?.imediatas || []).map(acao => `
        <div class="acao-card">
          <div class="acao-header">
            <div class="acao-number">${acao.numero || '1'}</div>
            <h4 class="acao-titulo">${acao.titulo || 'Ação não identificada'}</h4>
          </div>
          <p class="acao-descricao">${acao.descricao || 'Descrição não disponível'}</p>
          <div class="acao-meta">
            <span class="acao-responsavel">${acao.responsavel || 'Responsável não definido'}</span>
            <span class="acao-kpi">${acao.kpi || 'KPI não definido'}</span>
          </div>
        </div>
      `).join('');
    }

    // Renderizar ações médio prazo
    const acoesMedioPrazo = document.getElementById('acoesMedioPrazo');
    if (acoesMedioPrazo) {
      acoesMedioPrazo.innerHTML = (dados.plano_acao?.medio_prazo || []).map(acao => `
        <div class="acao-card">
          <div class="acao-header">
            <div class="acao-number">${acao.numero || '2'}</div>
            <h4 class="acao-titulo">${acao.titulo || 'Ação não identificada'}</h4>
          </div>
          <p class="acao-descricao">${acao.descricao || 'Descrição não disponível'}</p>
          <div class="acao-meta">
            <span class="acao-responsavel">${acao.responsavel || 'Responsável não definido'}</span>
            <span class="acao-kpi">${acao.kpi || 'KPI não definido'}</span>
          </div>
        </div>
      `).join('');
    }

    // Renderizar ações estratégicas
    const acoesEstrategicas = document.getElementById('acoesEstrategicas');
    if (acoesEstrategicas) {
      acoesEstrategicas.innerHTML = (dados.plano_acao?.estrategicas || []).map(acao => `
        <div class="acao-card">
          <div class="acao-header">
            <div class="acao-number">${acao.numero || '3'}</div>
            <h4 class="acao-titulo">${acao.titulo || 'Ação estratégica não identificada'}</h4>
          </div>
          <p class="acao-descricao">${acao.descricao || 'Descrição não disponível'}</p>
          <div class="acao-meta">
            <span class="acao-responsavel">${acao.responsavel || 'Responsável não definido'}</span>
            <span class="acao-kpi">${acao.kpi || 'KPI não definido'}</span>
          </div>
        </div>
      `).join('');
    }
  }

  /**
   * Renderiza footer
   */
  async renderizarFooter(dados) {
    const footerData = document.getElementById('footerData');
    if (footerData) {
      const data = new Date(this.relatorioData.metadados.data_geracao);
      footerData.textContent = `Gerado em ${data.toLocaleDateString('pt-BR')}`;
    }
  }

  /**
   * Inicializa interações da página
   */
  inicializarInteracoes() {
    // Navegação flutuante
    this.inicializarNavegacao();
    
    // Tabs do plano de ação
    this.inicializarTabs();
    
    // Scroll animations
    this.inicializarScrollAnimations();
    
    // Scroll progress
    this.inicializarScrollProgress();
  }

  /**
   * Inicializa navegação flutuante
   */
  inicializarNavegacao() {
    const floatingNav = document.getElementById('floatingNav');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Mostrar/esconder navegação baseado no scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        floatingNav.classList.add('visible');
      } else {
        floatingNav.classList.remove('visible');
      }
    });

    // Scroll suave para seções
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          
          // Ativar item atual
          navItems.forEach(nav => nav.classList.remove('active'));
          item.classList.add('active');
        }
      });
    });
  }

  /**
   * Inicializa tabs do plano de ação
   */
  inicializarTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Remover classes ativas
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Adicionar classes ativas
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
      });
    });
  }

  /**
   * Inicializa animações no scroll
   */
  inicializarScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll(
      '.resumo-card, .problema-item, .ponto-card, .risco-card, .acao-card'
    );
    
    animatedElements.forEach(el => observer.observe(el));
  }

  /**
   * Inicializa barra de progresso do scroll
   */
  inicializarScrollProgress() {
    // Criar barra de progresso
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    // Atualizar progresso no scroll
    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  /**
   * Efeito de digitação para texto
   */
  async typeWriter(element, text, speed = 50) {
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
      element.textContent += text.charAt(i);
      await this.sleep(speed);
    }
  }

  /**
   * Anima contador de métrica
   */
  async animarMetrica(cardId, valorFinal) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const valueElement = card.querySelector('.metric-value');
    if (!valueElement) return;

    // Validar e converter valorFinal para string
    if (valorFinal === undefined || valorFinal === null) {
      console.warn(`[DEBUG] valorFinal é undefined/null para cardId: ${cardId}`);
      valorFinal = '0';
    }
    
    const valorString = String(valorFinal);
    
    // Extrair número do valor
    const numero = parseFloat(valorString.replace(/[^0-9.]/g, ''));
    const isPercentage = valorString.includes('%');
    
    // Animação de contagem
    const duration = 2000;
    const steps = 60;
    const increment = numero / steps;
    let current = 0;

    for (let i = 0; i <= steps; i++) {
      await this.sleep(duration / steps);
      current += increment;
      
      if (i === steps) {
        current = numero; // Garantir valor exato no final
      }
      
      const displayValue = isPercentage 
        ? Math.round(current) + '%' 
        : current.toFixed(1);
      
      valueElement.textContent = displayValue;
    }
  }

  /**
   * Função utilitária para delay
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new RelatorioLandingPage();
});
