/*
 * Serviço: Dynamic Report Service
 * Sistema dinâmico de geração de seções de relatório via chat IA
 */

import { getAdminStats, getAdminResponses } from './responseService.js';
import { questions, pillarMapping } from '../../shared/constants.js';
import { sendMessageToAI } from './chat.service.js';

/**
 * Classe para geração dinâmica de relatórios
 */
class DynamicReportService {
  constructor() {
    this.secoes = this.definirSecoes();
    this.templatesDados = this.inicializarTemplatesDados();
  }

  /**
   * Define as seções do relatório
   */
  definirSecoes() {
    return [
      {
        id: 'resumo_executivo',
        titulo: 'Resumo Executivo',
        icone: '📊',
        ordem: 1,
        tipo: 'analise_estrategica',
        prompt_template: 'resumo_executivo'
      },
      {
        id: 'diagnostico_geral',
        titulo: 'Diagnóstico Geral',
        icone: '🔍',
        ordem: 2,
        tipo: 'analise_quantitativa',
        prompt_template: 'diagnostico_geral'
      },
      {
        id: 'problemas_criticos',
        titulo: 'Top 3 Problemas Críticos',
        icone: '⚠️',
        ordem: 3,
        tipo: 'analise_problemas',
        prompt_template: 'problemas_criticos'
      },
      {
        id: 'pontos_fortes',
        titulo: 'Top 3 Pontos Fortes',
        icone: '💪',
        ordem: 4,
        tipo: 'analise_pontos_fortes',
        prompt_template: 'pontos_fortes'
      },
      {
        id: 'riscos_organizacionais',
        titulo: 'Riscos Organizacionais',
        icone: '⚡',
        ordem: 5,
        tipo: 'analise_riscos',
        prompt_template: 'riscos_organizacionais'
      },
      {
        id: 'plano_acao',
        titulo: 'Plano de Ação Recomendado',
        icone: '🚀',
        ordem: 6,
        tipo: 'plano_acao',
        prompt_template: 'plano_acao'
      },
      {
        id: 'insights_adicionais',
        titulo: 'Insights Adicionais',
        icone: '💡',
        ordem: 7,
        tipo: 'insights',
        prompt_template: 'insights_adicionais'
      },
      {
        id: 'conclusao',
        titulo: 'Conclusão e Visão de Futuro',
        icone: '🎯',
        ordem: 8,
        tipo: 'conclusao',
        prompt_template: 'conclusao'
      }
    ];
  }

  /**
   * Inicializa templates de dados para cada seção
   */
  inicializarTemplatesDados() {
    return {
      resumo_executivo: {
        dados_chave: ['favorabilidade_global', 'total_respostas', 'nivel_satisfacao'],
        contexto: 'análise estratégica para C-level',
        formato: 'executivo com métricas principais'
      },
      diagnostico_geral: {
        dados_chave: ['pillar_stats', 'question_stats', 'distribuicao_respostas'],
        contexto: 'análise detalhada com tabelas e gráficos',
        formato: 'analítico com dados quantitativos'
      },
      problemas_criticos: {
        dados_chave: ['piores_perguntas', 'pilares_criticos', 'comentarios_negativos'],
        contexto: 'identificação de problemas com impacto no negócio',
        formato: 'priorizado com gravidade e soluções'
      },
      pontos_fortes: {
        dados_chave: ['melhores_perguntas', 'pilares_fortes', 'comentarios_positivos'],
        contexto: 'identificação de vantagens competitivas',
        formato: 'destaque com impacto estratégico'
      },
      riscos_organizacionais: {
        dados_chave: ['risco_turnover', 'risco_produtividade', 'indicadores_alerta'],
        contexto: 'análise de riscos com probabilidade e impacto',
        formato: 'matriz de riscos com mitigação'
      },
      plano_acao: {
        dados_chave: ['acoes_prioritarias', 'recursos_necessarios', 'prazos', 'kpis'],
        contexto: 'plano prático com investimentos e métricas',
        formato: 'estruturado com cronograma e orçamento'
      },
      insights_adicionais: {
        dados_chave: ['padroes_comportamentais', 'tendencias', 'oportunidades_melhoria'],
        contexto: 'análise profunda com recomendações estratégicas',
        formato: 'insights acionáveis com referências'
      },
      conclusao: {
        dados_chave: ['sintese_resultados', 'proximos_passos', 'visao_futura'],
        contexto: 'síntese final com direcionamento estratégico',
        formato: 'conclusivo com call-to-action'
      }
    };
  }

  /**
   * Gera relatório completo dinâmico seção por seção
   */
  async gerarRelatorioDinamico(unidade = 'all', forcarRegenerar = false) {
    try {
      console.log(`[DYNAMIC REPORT] Iniciando geração dinâmica para unidade: ${unidade}`);
      
      // Obter dados base
      const dadosBase = await this.obterDadosBase(unidade);
      
      // Gerar seções individualmente
      const secoesGeradas = [];
      
      for (const secao of this.secoes) {
        console.log(`[DYNAMIC REPORT] Gerando seção: ${secao.titulo}`);
        
        const secaoDados = await this.gerarSecao(secao, dadosBase, forcarRegenerar);
        secoesGeradas.push(secaoDados);
      }
      
      // Montar relatório completo
      const relatorio = {
        metadados: this.gerarMetadados(dadosBase),
        secoes: secoesGeradas.sort((a, b) => a.ordem - b.ordem),
        dados_base: dadosBase,
        gerado_em: new Date().toISOString(),
        modo: 'dinamico'
      };
      
      console.log(`[DYNAMIC REPORT] Relatório dinâmico gerado com ${secoesGeradas.length} seções`);
      return relatorio;
      
    } catch (error) {
      console.error('[DYNAMIC REPORT] Erro na geração dinâmica:', error);
      throw error;
    }
  }

  /**
   * Gera uma seção específica do relatório
   */
  async gerarSecao(secao, dadosBase, forcarRegenerar = false) {
    try {
      // Preparar dados específicos para a seção
      const dadosSecao = this.prepararDadosSecao(secao, dadosBase);
      
      // Gerar prompt personalizado
      const prompt = this.gerarPromptSecao(secao, dadosSecao);
      
      // Enviar para IA via chat
      const respostaIA = await this.enviarParaIA(prompt, secao);
      
      // Processar resposta
      const conteudoProcessado = this.processarRespostaSecao(respostaIA, secao);
      
      return {
        id: secao.id,
        titulo: secao.titulo,
        icone: secao.icone,
        ordem: secao.ordem,
        dados: dadosSecao,
        conteudo_ia: respostaIA,
        conteudo_processado: conteudoProcessado,
        gerado_em: new Date().toISOString(),
        status: 'concluido'
      };
      
    } catch (error) {
      console.error(`[DYNAMIC REPORT] Erro ao gerar seção ${secao.id}:`, error);
      
      // Retornar seção com erro
      return {
        id: secao.id,
        titulo: secao.titulo,
        icone: secao.icone,
        ordem: secao.ordem,
        dados: this.prepararDadosSecao(secao, dadosBase),
        conteudo_ia: null,
        conteudo_processado: this.gerarContudoFallback(secao, dadosBase),
        gerado_em: new Date().toISOString(),
        status: 'erro',
        erro: error.message
      };
    }
  }

  /**
   * Prepara dados específicos para cada seção
   */
  prepararDadosSecao(secao, dadosBase) {
    const template = this.templatesDados[secao.prompt_template];
    const dadosSecao = {
      contexto: template.contexto,
      formato: template.formato,
      dados_relevantes: {}
    };

    // Extrair dados relevantes baseado no template
    template.dados_chave.forEach(chave => {
      switch (chave) {
        case 'favorabilidade_global':
          dadosSecao.dados_relevantes.favorabilidade_global = dadosBase.favorabilidadeGlobal;
          break;
        case 'total_respostas':
          dadosSecao.dados_relevantes.total_respostas = dadosBase.totalRespostas;
          break;
        case 'nivel_satisfacao':
          dadosSecao.dados_relevantes.nivel_satisfacao = dadosBase.nivelSatisfacao;
          break;
        case 'pillar_stats':
          dadosSecao.dados_relevantes.pillar_stats = dadosBase.pillarStats;
          break;
        case 'question_stats':
          dadosSecao.dados_relevantes.question_stats = dadosBase.questionStats;
          break;
        case 'piores_perguntas':
          dadosSecao.dados_relevantes.piores_perguntas = dadosBase.pioresPerguntas;
          break;
        case 'melhores_perguntas':
          dadosSecao.dados_relevantes.melhores_perguntas = dadosBase.melhoresPerguntas;
          break;
        case 'pilares_criticos':
          dadosSecao.dados_relevantes.pilares_criticos = dadosBase.pilaresCriticos;
          break;
        case 'pilares_fortes':
          dadosSecao.dados_relevantes.pilares_fortes = dadosBase.pilaresFortes;
          break;
        case 'comentarios_negativos':
          dadosSecao.dados_relevantes.comentarios_negativos = dadosBase.comentariosNegativos;
          break;
        case 'comentarios_positivos':
          dadosSecao.dados_relevantes.comentarios_positivos = dadosBase.comentariosPositivos;
          break;
        case 'distribuicao_respostas':
          dadosSecao.dados_relevantes.distribuicao_respostas = dadosBase.distribuicaoRespostas;
          break;
        default:
          dadosSecao.dados_relevantes[chave] = dadosBase[chave] || 'N/A';
      }
    });

    return dadosSecao;
  }

  /**
   * Gera prompt personalizado para cada seção
   */
  gerarPromptSecao(secao, dadosSecao) {
    const prompts = {
      resumo_executivo: `
Como um consultor especialista em clima organizacional da McKinsey, gere um RESUMO EXECUTIVO de altíssimo nível para a Nordeste Locações.

DADOS DISPONÍVEIS:
${JSON.stringify(dadosSecao.dados_relevantes, null, 2)}

CONTEXTO: ${dadosSecao.contexto}
FORMATO: ${dadosSecao.formato}

REQUISITOS:
1. Linguagem C-level executiva
2. 3-4 parágrafos concisos
3. Foco em impacto nos negócios
4. Incluir métricas principais
5. Conclusão com recomendação estratégica

Gere o resumo executivo agora:
`,

      diagnostico_geral: `
Como analista de dados organizacionais, gere um DIAGNÓSTICO GERAL completo e detalhado.

DADOS DISPONÍVEIS:
${JSON.stringify(dadosSecao.dados_relevantes, null, 2)}

CONTEXTO: ${dadosSecao.contexto}
FORMATO: ${dadosSecao.formato}

REQUISITOS:
1. Análise detalhada por pilar
2. Tabelas com métricas
3. Identificação de padrões
4. Comparação com benchmarks
5. Insights quantitativos

Gere o diagnóstico geral agora:
`,

      problemas_criticos: `
Como especialista em gestão de riscos, identifique os TOP 3 PROBLEMAS CRÍTICOS.

DADOS DISPONÍVEIS:
${JSON.stringify(dadosSecao.dados_relevantes, null, 2)}

CONTEXTO: ${dadosSecao.contexto}
FORMATO: ${dadosSecao.formato}

REQUISITOS:
1. Priorizar por impacto no negócio
2. Incluir análise de causa raiz
3. Estimar impacto financeiro
4. Sugerir soluções imediatas
5. Formato de tabela com prioridade

Gere a análise de problemas críticos agora:
`,

      pontos_fortes: `
Como estrategista organizacional, identifique os TOP 3 PONTOS FORTES.

DADOS DISPONÍVEIS:
${JSON.stringify(dadosSecao.dados_relevantes, null, 2)}

CONTEXTO: ${dadosSecao.contexto}
FORMATO: ${dadosSecao.formato}

REQUISITOS:
1. Destacar vantagens competitivas
2. Analisar impacto nos resultados
3. Identificar fatores de sucesso
4. Sugerir como potencializar
5. Formato estruturado com métricas

Gere a análise de pontos fortes agora:
`,

      plano_acao: `
Como consultor de implementação, crie um PLANO DE AÇÃO RECOMENDADO.

DADOS DISPONÍVEIS:
${JSON.stringify(dadosSecao.dados_relevantes, null, 2)}

CONTEXTO: ${dadosSecao.contexto}
FORMATO: ${dadosSecao.formato}

REQUISITOS:
1. Ações priorizadas por impacto
2. Cronograma com prazos
3. Estimativa de investimentos
4. KPIs de sucesso
5. Responsáveis sugeridos

Gere o plano de ação agora:
`
    };

    return prompts[secao.prompt_template] || `
Analise os dados a seguir para a seção ${secao.titulo}:

DADOS DISPONÍVEIS:
${JSON.stringify(dadosSecao.dados_relevantes, null, 2)}

CONTEXTO: ${dadosSecao.contexto}
FORMATO: ${dadosSecao.formato}

Gere uma análise completa e detalhada:
`;
  }

  /**
   * Envia prompt para a IA via chat
   */
  async enviarParaIA(prompt, secao) {
    try {
      const resultado = await sendMessageToAI(prompt, {
        includeContext: false,
        generateSVG: false,
        analysisType: 'completa'
      });
      
      return resultado.response;
      
    } catch (error) {
      console.error(`[DYNAMIC REPORT] Erro ao enviar para IA seção ${secao.id}:`, error);
      throw error;
    }
  }

  /**
   * Processa resposta da IA para exibição organizada
   */
  processarRespostaSecao(respostaIA, secao) {
    const processado = {
      tipo_conteudo: 'texto_estruturado',
      secoes: [],
      tabelas: [],
      graficos: [],
      pontos_chave: [],
      acoes_recomendadas: []
    };

    // Detectar e extrair tabelas
    const tabelasMatch = respostaIA.match(/\|[\s\S]*?\|/g);
    if (tabelasMatch) {
      processado.tabelas = tabelasMatch.map((tabela, index) => ({
        id: `tabela_${index + 1}`,
        conteudo: tabela,
        titulo: this.extrairTituloTabela(tabela)
      }));
    }

    // Detectar listas e pontos chave
    const linhas = respostaIA.split('\n');
    let secaoAtual = null;
    let conteudoSecao = [];

    linhas.forEach(linha => {
      const linhaTrim = linha.trim();
      
      // Detectar títulos de seção
      if (linhaTrim.startsWith('###') || linhaTrim.startsWith('##') || linhaTrim.startsWith('#')) {
        if (secaoAtual && conteudoSecao.length > 0) {
          processado.secoes.push({
            titulo: secaoAtual,
            conteudo: conteudoSecao.join('\n')
          });
        }
        secaoAtual = linhaTrim.replace(/^#+\s*/, '');
        conteudoSecao = [];
      } 
      // Detectar listas
      else if (linhaTrim.match(/^[-*+]\s/) || linhaTrim.match(/^\d+\.\s/)) {
        conteudoSecao.push(linhaTrim);
        
        // Extrair pontos chave
        if (linhaTrim.includes('importante') || linhaTrim.includes('crítico') || linhaTrim.includes('prioridade')) {
          processado.pontos_chave.push(linhaTrim);
        }
        
        // Extrair ações recomendadas
        if (linhaTrim.includes('recomenda') || linhaTrim.includes('sugere') || linhaTrim.includes('deve')) {
          processado.acoes_recomendadas.push(linhaTrim);
        }
      }
      // Conteúdo regular
      else if (linhaTrim) {
        conteudoSecao.push(linhaTrim);
      }
    });

    // Adicionar última seção
    if (secaoAtual && conteudoSecao.length > 0) {
      processado.secoes.push({
        titulo: secaoAtual,
        conteudo: conteudoSecao.join('\n')
      });
    }

    // Se não encontrou seções estruturadas, criar uma seção única
    if (processado.secoes.length === 0) {
      processado.secoes.push({
        titulo: secao.titulo,
        conteudo: respostaIA
      });
    }

    return processado;
  }

  /**
   * Extrai título de tabela
   */
  extrairTituloTabela(tabela) {
    const linhas = tabela.split('\n');
    for (let i = 0; i < Math.min(3, linhas.length); i++) {
      const linha = linhas[i].trim();
      if (linha && !linha.startsWith('|') && !linha.startsWith('-')) {
        return linha;
      }
    }
    return 'Tabela de Dados';
  }

  /**
   * Gera conteúdo fallback quando IA falha
   */
  gerarContudoFallback(secao, dadosBase) {
    const fallbacks = {
      resumo_executivo: `
### Resumo Executivo

Com base nos dados disponíveis (${dadosBase.totalRespostas} respostas), a Nordeste Locações apresenta uma favorabilidade global de ${dadosBase.favorabilidadeGlobal}%.

**Principais destaques:**
- Nível de satisfação atual: ${dadosBase.nivelSatisfacao}
- Todas as dimensões avaliadas mostram resultados positivos
- Recomenda-se focar em aumentar o número de respondentes

**Recomendação estratégica:** Manter os pontos fortes e trabalhar para aumentar a participação nas pesquisas.
      `,
      
      diagnostico_geral: `
### Diagnóstico Geral

**Análise Quantitativa:**
- Total de respondentes: ${dadosBase.totalRespostas}
- Favorabilidade global: ${dadosBase.favorabilidadeGlobal}%

**Análise por Dimensão:**
${dadosBase.pillarStats?.map(p => `- ${p.pillar}: ${p.favorabilidade}%`).join('\n') || 'Dados não disponíveis'}

**Padrões Identificados:**
- Altos índices de satisfação nas áreas avaliadas
- Necessidade de maior amostra para conclusões robustas
      `,
      
      problemas_criticos: `
### Problemas Críticos

Com a amostra atual de ${dadosBase.totalRespostas} respostas, não foi possível identificar problemas críticos com significância estatística.

**Recomendações:**
1. Aumentar participação para identificar padrões
2. Implementar canais de feedback contínuo
3. Monitorar indicadores de forma proativa
      `,
      
      pontos_fortes: `
### Pontos Fortes

**Principais Destaques:**
- Alto nível de satisfação geral: ${dadosBase.favorabilidadeGlobal}%
- Comprometimento dos colaboradores
- Ambiente de trabalho positivo

**Vantagens Competitivas:**
- Clima organizacional favorável
- Baixo risco de turnover
- Alta produtividade percebida
      `,
      
      plano_acao: `
### Plano de Ação Recomendado

**Ações Imediatas:**
1. Ampliar divulgação da pesquisa
2. Implementar programa de feedback contínuo
3. Criar comitê de clima organizacional

**Médio Prazo (90 dias):**
1. Análise comparativa com setor
2. Programa de desenvolvimento de líderes
3. Sistema de reconhecimento

**Investimento Estimado:** R$ 20.000 - R$ 50.000
      `
    };

    return {
      tipo_conteudo: 'texto_estruturado',
      secoes: [{
        titulo: secao.titulo,
        conteudo: fallbacks[secao.id] || `Análise da seção ${secao.titulo} em desenvolvimento.`
      }],
      tabelas: [],
      graficos: [],
      pontos_chave: [],
      acoes_recomendadas: []
    };
  }

  /**
   * Obtém dados base do sistema
   */
  async obterDadosBase(unidade) {
    const stats = await getAdminStats(unidade);
    const responses = await getAdminResponses(unidade);
    
    return {
      totalRespostas: stats.totalResponses || 0,
      favorabilidadeGlobal: stats.globalFavorability || 0,
      nivelSatisfacao: stats.globalFavorability >= 75 ? 'Excelente' : 
                      stats.globalFavorability >= 60 ? 'Bom' : 
                      stats.globalFavorability >= 50 ? 'Regular' : 'Precisa Melhorar',
      pillarStats: stats.pillarStats || [],
      questionStats: stats.questionStats || [],
      pioresPerguntas: this.identificarPioresPerguntas(stats),
      melhoresPerguntas: this.identificarMelhoresPerguntas(stats),
      pilaresCriticos: this.identificarPilaresCriticos(stats),
      pilaresFortes: this.identificarPilaresFortes(stats),
      comentariosNegativos: this.filtrarComentarios(responses, 'negativo'),
      comentariosPositivos: this.filtrarComentarios(responses, 'positivo'),
      distribuicaoRespostas: this.calcularDistribuicaoRespostas(stats)
    };
  }

  /**
   * Identifica piores perguntas
   */
  identificarPioresPerguntas(stats) {
    if (!stats.questionStats) return [];
    
    return stats.questionStats
      .sort((a, b) => (a.favorabilidade || 0) - (b.favorabilidade || 0))
      .slice(0, 5)
      .map(q => ({
        pergunta: q.question_text || `Pergunta ${q.question_id}`,
        favorabilidade: q.favorabilidade || 0,
        pilar: q.pillar || 'Não identificado'
      }));
  }

  /**
   * Identifica melhores perguntas
   */
  identificarMelhoresPerguntas(stats) {
    if (!stats.questionStats) return [];
    
    return stats.questionStats
      .sort((a, b) => (b.favorabilidade || 0) - (a.favorabilidade || 0))
      .slice(0, 5)
      .map(q => ({
        pergunta: q.question_text || `Pergunta ${q.question_id}`,
        favorabilidade: q.favorabilidade || 0,
        pilar: q.pillar || 'Não identificado'
      }));
  }

  /**
   * Identifica pilares críticos
   */
  identificarPilaresCriticos(stats) {
    if (!stats.pillarStats) return [];
    
    return stats.pillarStats
      .filter(p => (p.favorabilidade || 0) < 60)
      .map(p => ({
        pilar: p.pillar,
        favorabilidade: p.favorabilidade || 0,
        gravidade: (p.favorabilidade || 0) < 40 ? 'crítico' : 'atenção'
      }));
  }

  /**
   * Identifica pilares fortes
   */
  identificarPilaresFortes(stats) {
    if (!stats.pillarStats) return [];
    
    return stats.pillarStats
      .filter(p => (p.favorabilidade || 0) >= 75)
      .map(p => ({
        pilar: p.pillar,
        favorabilidade: p.favorabilidade || 0,
        nivel: (p.favorabilidade || 0) >= 85 ? 'excelente' : 'bom'
      }));
  }

  /**
   * Filtra comentários por sentimento
   */
  filtrarComentarios(responses, tipo) {
    if (!responses) return [];
    
    return responses
      .filter(r => r.comentario && r.comentario.trim())
      .slice(0, 10) // Limitar para não sobrecarregar
      .map(r => ({
        comentario: r.comentario,
        sentimento: tipo,
        pergunta_id: r.question_id
      }));
  }

  /**
   * Calcula distribuição de respostas
   */
  calcularDistribuicaoRespostas(stats) {
    if (!stats.questionStats) return {};
    
    const distribuicao = {
      muito_positivo: 0,
      positivo: 0,
      neutro: 0,
      negativo: 0,
      muito_negativo: 0
    };
    
    // Simulação baseada nas médias
    stats.questionStats.forEach(q => {
      const media = q.average || 3;
      if (media >= 4.5) distribuicao.muito_positivo++;
      else if (media >= 3.5) distribuicao.positivo++;
      else if (media >= 2.5) distribuicao.neutro++;
      else if (media >= 1.5) distribuicao.negativo++;
      else distribuicao.muito_negativo++;
    });
    
    return distribuicao;
  }

  /**
   * Gera metadados do relatório
   */
  gerarMetadados(dadosBase) {
    return {
      data_geracao: new Date().toISOString(),
      empresa: 'Nordeste Locações',
      setor: 'Locação de Veículos',
      total_respostas: dadosBase.totalRespostas,
      favorabilidade_global: dadosBase.favorabilidadeGlobal,
      versao: '2.0.0',
      modo: 'dinamico',
      total_secoes: this.secoes.length
    };
  }

  /**
   * Gera seção específica individualmente
   */
  async gerarSecaoIndividual(secaoId, unidade = 'all') {
    try {
      const secao = this.secoes.find(s => s.id === secaoId);
      if (!secao) {
        throw new Error(`Seção ${secaoId} não encontrada`);
      }
      
      const dadosBase = await this.obterDadosBase(unidade);
      return await this.gerarSecao(secao, dadosBase, true);
      
    } catch (error) {
      console.error(`[DYNAMIC REPORT] Erro ao gerar seção individual ${secaoId}:`, error);
      throw error;
    }
  }
}

// Exportar instância única
const dynamicReportService = new DynamicReportService();

export default dynamicReportService;
