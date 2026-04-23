/**
 * Dashboard Comparativo - Pesquisa de Clima 2025 vs 2026
 * Carrega e processa todos os dados JSON para visualização completa
 */

class DashboardComparativo {
  constructor() {
    this.data = {
      comparativo: null,
      appReviews: null,
      analise2025: null,
      analise2026: null,
      comentarios: null
    };
    this.charts = {};
    this.isLoading = true;
    
    this.init();
  }

  async init() {
    try {
      await this.loadData();
      await this.renderDashboard();
      this.setupEventListeners();
      this.hideLoading();
    } catch (error) {
      console.error('Erro ao inicializar dashboard:', error);
      this.showError();
    }
  }

  async loadData() {
    const loadPromises = [
      fetch('assets/data/comparativo/comparativo-2025-2026.json')
        .then(res => res.json())
        .then(data => this.data.comparativo = data),
      
      fetch('assets/data/comparativo/app-reviews-pesquisa-clima-completo.json')
        .then(res => res.json())
        .then(data => this.data.appReviews = data),
      
      fetch('assets/data/comparativo/analise-2025.json')
        .then(res => res.json())
        .then(data => this.data.analise2025 = data),
      
      fetch('assets/data/comparativo/analise-2026.json')
        .then(res => res.json())
        .then(data => this.data.analise2026 = data),
      
      fetch('assets/data/comparativo/analise-comentarios-2025-2026.json')
        .then(res => res.json())
        .then(data => this.data.comentarios = data)
    ];

    await Promise.all(loadPromises);
  }

  async renderDashboard() {
    this.renderMetrics();
    this.renderResumoExecutivo();
    this.renderPilaresComparativo();
    this.renderReviewsCategoria();
    this.renderComentariosAnalysis();
    this.renderInsightsEstrategicos();
    this.renderAlertasCriticos();
    this.renderProjecoesFuturas();
    this.setupCharts();
  }

  renderMetrics() {
    const { comparativo } = this.data;
    
    // Satisfação Geral
    const satisfacaoCard = document.getElementById('satisfacaoCard');
    const satisfacao2025 = parseFloat(comparativo.resumo_geral.satisfacao_geral['2025']);
    const satisfacao2026 = parseFloat(comparativo.resumo_geral.satisfacao_geral['2026']);
    const variacaoSatisfacao = satisfacao2026 - satisfacao2025;
    
    satisfacaoCard.querySelector('.metric-value').textContent = `${satisfacao2026}%`;
    satisfacaoCard.querySelector('.metric-variation').textContent = `${variacaoSatisfacao >= 0 ? '+' : ''}${variacaoSatisfacao.toFixed(2)}pp`;
    satisfacaoCard.querySelector('.metric-variation').className = `metric-variation ${variacaoSatisfacao >= 0 ? 'positiva' : 'negativa'}`;

    // Favorabilidade
    const favorabilidadeCard = document.getElementById('favorabilidadeCard');
    const favorabilidade2025 = parseFloat(comparativo.resumo_geral.favorabilidade['2025']);
    const favorabilidade2026 = parseFloat(comparativo.resumo_geral.favorabilidade['2026']);
    const variacaoFavorabilidade = favorabilidade2026 - favorabilidade2025;
    
    favorabilidadeCard.querySelector('.metric-value').textContent = `${favorabilidade2026}%`;
    favorabilidadeCard.querySelector('.metric-variation').textContent = `${variacaoFavorabilidade >= 0 ? '+' : ''}${variacaoFavorabilidade.toFixed(2)}pp`;
    favorabilidadeCard.querySelector('.metric-variation').className = `metric-variation ${variacaoFavorabilidade >= 0 ? 'positiva' : 'negativa'}`;

    // Respondentes
    const respondentesCard = document.getElementById('respondentesCard');
    const respondentes2025 = comparativo.resumo_geral.participacao['2025'].respondentes;
    const respondentes2026 = comparativo.resumo_geral.participacao['2026'].respondentes;
    const variacaoRespondentes = ((respondentes2026 - respondentes2025) / respondentes2025 * 100);
    
    respondentesCard.querySelector('.metric-value').textContent = respondentes2026;
    respondentesCard.querySelector('.metric-variation').textContent = `+${respondentes2026 - respondentes2025} (${variacaoRespondentes.toFixed(1)}%)`;
    respondentesCard.querySelector('.metric-variation').className = 'metric-variation positiva';

    // Pilares
    const pilaresCard = document.getElementById('pilaresCard');
    const totalPilares = comparativo.comparativo_pilares.length;
    pilaresCard.querySelector('.metric-value').textContent = totalPilares;
    pilaresCard.querySelector('.metric-variation').textContent = 'Analisados';
    pilaresCard.querySelector('.metric-variation').className = 'metric-variation positiva';
  }

  renderResumoExecutivo() {
    const { comparativo } = this.data;
    
    // Atualizar valores no resumo
    const resumoCards = document.querySelectorAll('.resumo-card');
    
    // Participação
    const participacaoCard = resumoCards[0];
    participacaoCard.querySelector('.ano-data:nth-child(1) .ano-value').textContent = `${comparativo.resumo_geral.participacao['2025'].respondentes} respondentes`;
    participacaoCard.querySelector('.ano-data:nth-child(2) .ano-value').textContent = `${comparativo.resumo_geral.participacao['2026'].respondentes} respondentes`;
    participacaoCard.querySelector('.variacao .variacao-text').textContent = comparativo.resumo_geral.participacao.variacao;

    // Satisfação
    const satisfacaoCard = resumoCards[1];
    satisfacaoCard.querySelector('.ano-data:nth-child(1) .ano-value').textContent = comparativo.resumo_geral.satisfacao_geral['2025'];
    satisfacaoCard.querySelector('.ano-data:nth-child(2) .ano-value').textContent = comparativo.resumo_geral.satisfacao_geral['2026'];
    satisfacaoCard.querySelector('.variacao .variacao-text').textContent = comparativo.resumo_geral.satisfacao_geral.variacao;
    satisfacaoCard.querySelector('.variacao').className = 'variacao negativa';

    // Favorabilidade
    const favorabilidadeCard = resumoCards[2];
    favorabilidadeCard.querySelector('.ano-data:nth-child(1) .ano-value').textContent = comparativo.resumo_geral.favorabilidade['2025'];
    favorabilidadeCard.querySelector('.ano-data:nth-child(2) .ano-value').textContent = comparativo.resumo_geral.favorabilidade['2026'];
    favorabilidadeCard.querySelector('.variacao .variacao-text').textContent = comparativo.resumo_geral.favorabilidade.variacao;
    favorabilidadeCard.querySelector('.variacao').className = 'variacao positiva';

    // Interpretação
    const interpretacaoCard = resumoCards[3];
    interpretacaoCard.querySelector('.interpretacao-text').textContent = comparativo.resumo_geral.status_geral.interpretacao;
  }

  renderPilaresComparativo() {
    const { comparativo } = this.data;
    const container = document.getElementById('pilaresComparativo');
    
    container.innerHTML = comparativo.comparativo_pilares.map(pilar => `
      <div class="pilar-comparativo-card">
        <div class="pilar-nome">${pilar.pilar}</div>
        <div class="pilar-valores">
          <div class="ano-comparativo">
            <div class="ano-label">2025</div>
            <div class="ano-value">${pilar['2025'].satisfacao}</div>
          </div>
          <div class="ano-comparativo">
            <div class="ano-label">2026</div>
            <div class="ano-value">${pilar['2026'].satisfacao}</div>
          </div>
        </div>
        <div class="pilar-variacao ${pilar.variacao.startsWith('+') ? 'positiva' : 'negativa'}">
          <div class="variacao-valor">${pilar.variacao}</div>
          <div class="variacao-texto">variação</div>
        </div>
      </div>
    `).join('');
  }

  renderReviewsCategoria() {
    const { appReviews } = this.data;
    const container = document.getElementById('reviewsContainer');
    
    if (!appReviews || !appReviews.produtos) {
      container.innerHTML = '<p>Dados de reviews não disponíveis</p>';
      return;
    }
    
    // Agrupar produtos por categoria
    const produtosPorCategoria = {};
    appReviews.produtos.forEach(produto => {
      if (!produtosPorCategoria[produto.categoria]) {
        produtosPorCategoria[produto.categoria] = [];
      }
      produtosPorCategoria[produto.categoria].push(produto);
    });
    
    container.innerHTML = Object.entries(produtosPorCategoria).map(([categoriaId, produtos]) => {
      const categoriaInfo = appReviews.categorias_info.find(cat => cat.id === categoriaId);
      if (!categoriaInfo) return '';
      
      // Calcular média geral da categoria
      const mediaEstrelas = produtos.reduce((sum, p) => sum + p.avaliacao.estrelas, 0) / produtos.length;
      const totalAvaliacoes = produtos.reduce((sum, p) => sum + p.avaliacao.total_avaliacoes, 0);
      
      return `
      <div class="review-categoria-card">
        <div class="review-categoria-header">
          <div class="categoria-info">
            <h3>${categoriaInfo.icone} ${categoriaInfo.nome}</h3>
            <p>${categoriaInfo.descricao}</p>
          </div>
          <div class="categoria-avaliacao">
            <div class="avaliacao-estrelas">${mediaEstrelas.toFixed(1)} ⭐</div>
            <div class="avaliacao-total">${totalAvaliacoes} avaliações</div>
          </div>
        </div>
        <div class="review-categoria-content">
          ${produtos.map(produto => `
            <div class="produto-item">
              <h4>${produto.nome_produto}</h4>
              <div class="produto-avaliacao">
                <span class="estrelas-produto">${'⭐'.repeat(Math.round(produto.avaliacao.estrelas))}</span>
                <span class="media-produto">${produto.avaliacao.estrelas.toFixed(1)} (${produto.avaliacao.total_avaliacoes})</span>
              </div>
              <div class="distribuicao-estrelas">
                ${Object.entries(produto.avaliacao.distribuicao).reverse().map(([estrelas, count]) => {
                  const percentage = (count / produto.avaliacao.total_avaliacoes * 100).toFixed(1);
                  return `
                    <div class="estrela-bar">
                      <div class="estrela-label">${estrelas.replace('_', ' ')}</div>
                      <div class="estrela-progress">
                        <div class="estrela-fill" style="width: ${percentage}%"></div>
                      </div>
                      <div class="estrela-count">${count}</div>
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="reviews-list">
                ${produto.reviews.slice(0, 2).map(review => `
                  <div class="review-item">
                    <div class="review-header">
                      <span class="review-usuario">${review.usuario}</span>
                      <span class="review-estrelas">${'⭐'.repeat(review.estrelas)}</span>
                    </div>
                    <div class="review-titulo">${review.titulo}</div>
                    <div class="review-comentario">${review.comentario || 'Sem comentário'}</div>
                    <div class="review-data">${new Date(review.data).toLocaleDateString('pt-BR')}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    }).join('');
  }
  }

  renderComentariosAnalysis() {
    const { comentarios } = this.data;
    const container = document.getElementById('categoriasComentarios');
    
    if (!container) return;
    
    // Renderizar categorias de comentários
    const categoriasHtml = Object.entries(comentarios.analise_comentarios_2026.categorias_principais).map(([categoria, dados]) => `
      <div class="categoria-comentarios">
        <h4>${categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h4>
        <div class="comentarios-exemplos">
          ${dados.comentarios_tipicos ? dados.comentarios_tipicos.slice(0, 3).map(comentario => `
            <div class="comentario-exemplo">"${comentario}"</div>
          `).join('') : ''}
        </div>
        <div class="comentario-meta">
          <span class="frequencia">Frequência: ${dados.frequencia || 'Média'}</span>
          <span class="intensidade">Intensidade: ${dados.intensidade || 'Moderada'}</span>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = categoriasHtml;
  }

  renderInsightsEstrategicos() {
    // Insights já estão renderizados no HTML, apenas precisamos garantir que os dados estejam corretos
    // Esta função pode ser expandida para dinamizar os insights baseados nos dados
  }

  renderAlertasCriticos() {
    // Alertas já estão renderizados no HTML com valores fixos baseados na análise
    // Podemos dinamizar isso no futuro baseado nos dados reais
  }

  renderProjecoesFuturas() {
    // Projeções já estão renderizadas no HTML
    // Podemos calcular projeções mais precisas baseadas nos dados históricos
  }

  setupCharts() {
    this.setupEvolucaoChart();
    this.setupPilaresChart();
  }

  setupEvolucaoChart() {
    const ctx = document.getElementById('evolucaoChart').getContext('2d');
    const { comparativo } = this.data;
    
    this.charts.evolucao = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2025', '2026'],
        datasets: [
          {
            label: 'Satisfação Geral',
            data: [
              parseFloat(comparativo.resumo_geral.satisfacao_geral['2025']),
              parseFloat(comparativo.resumo_geral.satisfacao_geral['2026'])
            ],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          },
          {
            label: 'Favorabilidade',
            data: [
              parseFloat(comparativo.resumo_geral.favorabilidade['2025']),
              parseFloat(comparativo.resumo_geral.favorabilidade['2026'])
            ],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 70,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }

  setupPilaresChart() {
    const ctx = document.getElementById('pilaresChart').getContext('2d');
    const { comparativo } = this.data;
    
    const pilares = comparativo.comparativo_pilares;
    
    this.charts.pilares = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: pilares.map(p => p.pilar),
        datasets: [
          {
            label: '2025',
            data: pilares.map(p => parseFloat(p['2025'].satisfacao)),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
          },
          {
            label: '2026',
            data: pilares.map(p => parseFloat(p['2026'].satisfacao)),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 70,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }

  setupEventListeners() {
    // Navegação flutuante
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          
          // Atualizar active state
          navItems.forEach(nav => nav.classList.remove('active'));
          item.classList.add('active');
        }
      });
    });

    // Scroll spy for navigation
    const sections = document.querySelectorAll('.dashboard-section');
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetId = entry.target.id;
          const correspondingNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
          
          if (correspondingNav) {
            navItems.forEach(nav => nav.classList.remove('active'));
            correspondingNav.classList.add('active');
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Export functions
    window.exportPDF = this.exportPDF.bind(this);
    window.exportExcel = this.exportExcel.bind(this);
    window.exportImages = this.exportImages.bind(this);
    window.generateEmbedCode = this.generateEmbedCode.bind(this);
  }

  hideLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
    this.isLoading = false;
  }

  showError() {
    this.hideLoading();
    const errorHtml = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h2>Erro ao carregar dados</h2>
        <p>Não foi possível carregar os dados do dashboard. Por favor, tente recarregar a página.</p>
        <button onclick="window.location.reload()" class="btn btn-primary">Recarregar</button>
      </div>
    `;
    
    document.querySelector('.dashboard-main').innerHTML = errorHtml;
  }

  // Export Functions
  exportPDF() {
    window.print();
  }

  exportExcel() {
    // Criar CSV com dados principais
    const { comparativo } = this.data;
    let csv = 'Métrica,2025,2026,Variação\n';
    
    csv += `Satisfação Geral,${comparativo.resumo_geral.satisfacao_geral['2025']},${comparativo.resumo_geral.satisfacao_geral['2026']},${comparativo.resumo_geral.satisfacao_geral.variacao}\n`;
    csv += `Favorabilidade,${comparativo.resumo_geral.favorabilidade['2025']},${comparativo.resumo_geral.favorabilidade['2026']},${comparativo.resumo_geral.favorabilidade.variacao}\n`;
    csv += `Participação,${comparativo.resumo_geral.participacao['2025'].respondentes},${comparativo.resumo_geral.participacao['2026'].respondentes},${comparativo.resumo_geral.participacao.variacao}\n`;
    
    // Adicionar dados dos pilares
    csv += '\n\nPilares\n';
    csv += 'Pilar,2025,2026,Variação\n';
    comparativo.comparativo_pilares.forEach(pilar => {
      csv += `${pilar.pilar},${pilar['2025'].satisfacao},${pilar['2026'].satisfacao},${pilar.variacao}\n`;
    });
    
    // Download do CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dashboard-comparativo-pesquisa-clima.csv';
    link.click();
  }

  exportImages() {
    // Exportar gráficos como imagens
    Object.entries(this.charts).forEach(([name, chart]) => {
      const url = chart.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.download = `chart-${name}.png`;
      link.click();
    });
  }

  generateEmbedCode() {
    const embedCode = `<iframe src="${window.location.href}" width="100%" height="800" frameborder="0"></iframe>`;
    
    // Criar modal ou alert com o código
    const modal = document.createElement('div');
    modal.className = 'embed-modal';
    modal.innerHTML = `
      <div class="embed-modal-content">
        <h3>Código Embed</h3>
        <textarea readonly>${embedCode}</textarea>
        <button onclick="this.copyCode()">Copiar</button>
        <button onclick="this.parentElement.parentElement.remove()">Fechar</button>
      </div>
    `;
    
    modal.querySelector('button').onclick = function() {
      navigator.clipboard.writeText(embedCode);
      this.textContent = 'Copiado!';
      setTimeout(() => {
        this.textContent = 'Copiar';
      }, 2000);
    };
    
    document.body.appendChild(modal);
  }
}

// Inicializar dashboard quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new DashboardComparativo();
});

// Adicionar estilos para o modal de embed (se não existir no CSS)
const embedStyles = `
.embed-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.embed-modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
}

.embed-modal-content h3 {
  margin-bottom: 1rem;
}

.embed-modal-content textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: monospace;
}

.embed-modal-content button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.embed-modal-content button:first-child {
  background: #3b82f6;
  color: white;
}

.embed-modal-content button:last-child {
  background: #6b7280;
  color: white;
}
`;

// Adicionar estilos ao head se não existirem
if (!document.querySelector('#embed-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'embed-styles';
  styleSheet.textContent = embedStyles;
  document.head.appendChild(styleSheet);
}
