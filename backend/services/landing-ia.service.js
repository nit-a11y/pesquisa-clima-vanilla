/*
 * Serviço: Landing IA Service
 * Processamento inteligente de dados da pesquisa com IA
 */

import { getAdminStats, getAdminResponses } from './responseService.js';
import { questions, pillarMapping } from '../../shared/constants.js';
import { sendMessageToAI } from './chat.service.js';

/**
 * Classe para processamento inteligente de landing pages
 */
class LandingIAService {
  constructor() {
    this.cacheAnalises = new Map();
    this.cacheComentarios = new Map();
  }

  /**
   * Processa completo da pesquisa com IA
   */
  async processarPesquisaCompleta(unidade = 'all') {
    try {
      console.log('[LANDING IA] Iniciando processamento completo');
      
      // Obter dados do banco
      const stats = await getAdminStats(unidade);
      const responses = await getAdminResponses(unidade);
      
      // Estruturar dados para IA
      const dadosEstruturados = this.estruturarDadosParaIA(stats, responses);
      
      // Gerar análise principal
      const analisePrincipal = await this.gerarAnalisePrincipal(dadosEstruturados);
      
      // Processar comentários separadamente
      const analiseComentarios = await this.processarComentarios(responses);
      
      // Combinar análises
      const analiseCompleta = this.combinarAnalises(analisePrincipal, analiseComentarios);
      
      return {
        sucesso: true,
        dados_pesquisa: dadosEstruturados,
        analise_principal: analisePrincipal,
        analise_comentarios: analiseComentarios,
        analise_completa: analiseCompleta,
        processado_em: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('[LANDING IA] Erro no processamento:', error);
      return {
        sucesso: false,
        erro: error.message,
        processado_em: new Date().toISOString()
      };
    }
  }

  /**
   * Estrutura dados da pesquisa para IA
   */
  estruturarDadosParaIA(stats, responses) {
    return {
      empresa: 'Nordeste Locações',
      setor: 'Locação de Veículos',
      data_analise: new Date().toLocaleDateString('pt-BR'),
      total_respondentes: stats.totalResponses || 0,
      
      // Métricas gerais
      metricas_gerais: {
        favorabilidade_global: stats.globalFavorability || 0,
        indice_engajamento: this.calcularEngajamento(stats),
        taxa_resposta: this.calcularTaxaResposta(stats),
        nps_estimado: this.calcularNPS(stats)
      },
      
      // Análise por pilares
      analise_pilares: stats.pillarStats?.map(pilar => ({
        pilar: pilar.pillar,
        favorabilidade: parseFloat(pilar.favorabilidade) || 0,
        media: parseFloat(pilar.average) || 0,
        respostas: pilar.count || 0,
        classificacao: this.classificarFavorabilidade(parseFloat(pilar.favorabilidade) || 0)
      })) || [],
      
      // Perguntas destacadas
      perguntas_destaque: this.identificarPerguntasDestaque(stats),
      
      // Comentários brutos
      comentarios_brutos: responses.filter(r => r.comentario && r.comentario.trim()).map(r => ({
        pergunta_id: r.question_id,
        pergunta_texto: this.obterTextoPergunta(r.question_id),
        comentario: r.comentario,
        sentimento: this.analisarSentimento(r.comentario),
        pilar: this.obterPilarDaPergunta(r.question_id)
      }))
    };
  }

  /**
   * Gera análise principal com IA
   */
  async gerarAnalisePrincipal(dadosEstruturados) {
    const prompt = `
Você é um especialista em clima organizacional da Nordeste Locações.

DADOS COMPLETOS DA PESQUISA:
${JSON.stringify(dadosEstruturados, null, 2)}

ANÁLISE SOLICITADA:
1. RESUMO EXECUTIVO - Destaque os pontos principais
2. DIAGNÓSTICO GERAL - Análise detalhada por pilares
3. TOP 3 PROBLEMAS CRÍTICOS - Com impacto e soluções
4. TOP 3 PONTOS FORTES - Com vantagens competitivas
5. PLANO DE AÇÃO - Com investimentos e KPIs
6. INSIGHTS ADICIONAIS - Recomendações estratégicas
7. CONCLUSÃO - Com visão de futuro

FORMATO DE RESPOSTA:
- Use linguagem profissional e executiva
- Seja objetivo e baseado nos dados
- Inclua métricas e percentuais
- Forneça recomendações práticas
- Mantenha foco no negócio da locação de veículos

Gere a análise completa agora:
`;

    try {
      const resultado = await sendMessageToAI(prompt, {
        includeContext: false,
        generateSVG: false,
        analysisType: 'completa'
      });
      
      return {
        sucesso: true,
        resposta: resultado.response,
        processado_em: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('[LANDING IA] Erro na análise principal:', error);
      return {
        sucesso: false,
        erro: error.message,
        resposta: this.gerarAnaliseFallback(dadosEstruturados),
        processado_em: new Date().toISOString()
      };
    }
  }

  /**
   * Processa comentários separadamente com IA
   */
  async processarComentarios(responses) {
    try {
      console.log('[LANDING IA] Processando comentários separadamente');
      
      // Extrair apenas comentários válidos
      const comentariosValidos = responses.filter(r => r.comentario && r.comentario.trim());
      
      if (comentariosValidos.length === 0) {
        return {
          sucesso: true,
          total_comentarios: 0,
          padroes_identificados: [],
          problemas_mencionados: [],
          pontos_fortes: [],
          recomendacoes: [],
          processado_em: new Date().toISOString()
        };
      }

      // Agrupar comentários por sentimento inicial
      const comentariosPorSentimento = this.agruparPorSentimento(comentariosValidos);
      
      // Gerar análise de padrões
      const analisePadroes = await this.analisarPadroesComentarios(comentariosValidos);
      
      // Identificar problemas mais mencionados
      const problemasMaisMencionados = await this.identificarProblemasMaisMencionados(comentariosValidos);
      
      // Identificar pontos fortes
      const pontosFortes = await this.identificarPontosFortesComentarios(comentariosValidos);
      
      return {
        sucesso: true,
        total_comentarios: comentariosValidos.length,
        comentarios_por_sentimento: comentariosPorSentimento,
        padroes_identificados: analisePadroes.padroes,
        problemas_mencionados: problemasMaisMencionados.problemas,
        pontos_fortes: pontosFortes.pontos,
        recomendacoes: this.gerarRecomendacoesComentarios(analisePadroes, problemasMaisMencionados),
        processado_em: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('[LANDING IA] Erro no processamento de comentários:', error);
      return {
        sucesso: false,
        erro: error.message,
        total_comentarios: 0,
        padroes_identificados: [],
        problemas_mencionados: [],
        pontos_fortes: [],
        recomendacoes: [],
        processado_em: new Date().toISOString()
      };
    }
  }

  /**
   * Analisa padrões nos comentários com IA
   */
  async analisarPadroesComentarios(comentarios) {
    const textoComentarios = comentarios.map(c => c.comentario).join('\n---\n');
    
    const prompt = `
Analise os seguintes comentários de funcionários da Nordeste Locações:

COMENTÁRIOS:
${textoComentarios}

ANÁLISE SOLICITADA:
1. PADRÕES COMPORTAMENTAIS - Comportamentos recorrentes
2. TEMAS FREQUENTES - Assuntos mais mencionados
3. SENTIMENTO GERAL - Positivo, negativo ou neutro
4. TENDÊNCIAS - Padrões de melhoria ou preocupação
5. INSIGHTS - Observações importantes sobre a cultura

FORNEÇA:
- Lista de 5-10 padrões identificados
- Análise de sentimento geral
- Tendências organizacionais
- Insights acionáveis

Responda de forma estruturada e objetiva:
`;

    try {
      const resultado = await sendMessageToAI(prompt, {
        includeContext: false,
        generateSVG: false,
        analysisType: 'padroes'
      });
      
      return {
        sucesso: true,
        padroes: this.extrairPadroes(resultado.response),
        resposta_completa: resultado.response
      };
      
    } catch (error) {
      console.error('[LANDING IA] Erro na análise de padrões:', error);
      return {
        sucesso: false,
        padroes: this.gerarPadroesFallback(comentarios),
        resposta_completa: 'Análise de padrões não disponível no momento'
      };
    }
  }

  /**
   * Identifica problemas mais mencionados nos comentários
   */
  async identificarProblemasMaisMencionados(comentarios) {
    const textoComentarios = comentarios.map(c => c.comentario).join('\n---\n');
    
    const prompt = `
Analise os comentários abaixo e identifique os 3 problemas mais mencionados pelos funcionários da Nordeste Locações:

COMENTÁRIOS:
${textoComentarios}

ANÁLISE SOLICITADA:
1. PROBLEMAS MAIS FREQUENTES - Top 3 problemas mencionados
2. FREQUÊNCIA - Quantas vezes cada problema aparece
3. IMPACTO - Qual o impacto de cada problema no negócio
4. CATEGORIAS - Classifique os problemas (liderança, comunicação, etc.)
5. EVIDÊNCIAS - Citações diretas dos comentários

FORNEÇA:
- Lista dos 3 principais problemas
- Frequência de menção
- Análise de impacto
- Categorias organizadas
- Evidências textuais

Seja específico e baseado apenas nos comentários fornecidos:
`;

    try {
      const resultado = await sendMessageToAI(prompt, {
        includeContext: false,
        generateSVG: false,
        analysisType: 'problemas'
      });
      
      return {
        sucesso: true,
        problemas: this.extrairProblemas(resultado.response),
        resposta_completa: resultado.response
      };
      
    } catch (error) {
      console.error('[LANDING IA] Erro na identificação de problemas:', error);
      return {
        sucesso: false,
        problemas: this.gerarProblemasFallback(comentarios),
        resposta_completa: 'Análise de problemas não disponível no momento'
      };
    }
  }

  /**
   * Identifica pontos fortes nos comentários
   */
  async identificarPontosFortesComentarios(comentarios) {
    const textoComentarios = comentarios.map(c => c.comentario).join('\n---\n');
    
    const prompt = `
Analise os comentários abaixo e identifique os 3 pontos fortes mais mencionados pelos funcionários da Nordeste Locações:

COMENTÁRIOS:
${textoComentarios}

ANÁLISE SOLICITADA:
1. PONTOS FORTES - Top 3 pontos positivos mencionados
2. FREQUÊNCIA - Quantas vezes cada ponto forte aparece
3. IMPACTO - Qual o impacto positivo de cada ponto
4. CATEGORIAS - Classifique os pontos (cultura, liderança, ambiente, etc.)
5. EVIDÊNCIAS - Citações diretas dos comentários

FORNEÇA:
- Lista dos 3 principais pontos fortes
- Frequência de menção
- Análise de impacto positivo
- Categorias organizadas
- Evidências textuais

Seja específico e baseado apenas nos comentários fornecidos:
`;

    try {
      const resultado = await sendMessageToAI(prompt, {
        includeContext: false,
        generateSVG: false,
        analysisType: 'pontos_fortes'
      });
      
      return {
        sucesso: true,
        pontos: this.extrairPontosFortes(resultado.response),
        resposta_completa: resultado.response
      };
      
    } catch (error) {
      console.error('[LANDING IA] Erro na identificação de pontos fortes:', error);
      return {
        sucesso: false,
        pontos: this.gerarPontosFortesFallback(comentarios),
        resposta_completa: 'Análise de pontos fortes não disponível no momento'
      };
    }
  }

  /**
   * Combina análises principal e de comentários
   */
  combinarAnalises(analisePrincipal, analiseComentarios) {
    return {
      resumo_executivo: {
        titulo: 'Resumo Executivo',
        conteudo: analisePrincipal.resposta || 'Análise em processamento',
        insights_comentarios: analiseComentarios.padroes_identificados?.padroes?.slice(0, 3) || []
      },
      
      diagnostico_geral: {
        titulo: 'Diagnóstico Geral',
        conteudo: this.extrairSecao(analisePrincipal.resposta, 'DIAGNÓSTICO GERAL'),
        analise_comentarios: analiseComentarios.resposta_completa || 'Análise de comentários em processamento'
      },
      
      problemas_criticos: {
        titulo: 'Top 3 Problemas Críticos',
        conteudo: this.extrairSecao(analisePrincipal.resposta, 'PROBLEMAS CRÍTICOS'),
        problemas_mencionados: analiseComentarios.problemas_mencionados || []
      },
      
      pontos_fortes: {
        titulo: 'Top 3 Pontos Fortes',
        conteudo: this.extrairSecao(analisePrincipal.resposta, 'PONTOS FORTES'),
        pontos_mencionados: analiseComentarios.pontos_fortes || []
      },
      
      plano_acao: {
        titulo: 'Plano de Ação Recomendado',
        conteudo: this.extrairSecao(analisePrincipal.resposta, 'PLANO DE AÇÃO'),
        recomendacoes_comentarios: this.gerarRecomendacoesComentarios(analiseComentarios, analiseComentarios.problemas_mencionados)
      },
      
      insights_adicionais: {
        titulo: 'Insights Adicionais',
        conteudo: this.extrairSecao(analisePrincipal.resposta, 'INSIGHTS'),
        analise_padroes: analiseComentarios.padroes_identificados || {}
      },
      
      conclusao: {
        titulo: 'Conclusão e Visão de Futuro',
        conteudo: this.extrairSecao(analisePrincipal.resposta, 'CONCLUSÃO'),
        visao_comentarios: this.gerarVisaoComentarios(analiseComentarios)
      }
    };
  }

  /**
   * Métodos utilitários
   */
  calcularEngajamento(stats) {
    if (!stats.pillarStats || stats.pillarStats.length === 0) return '7.0';
    
    const somaMedias = stats.pillarStats.reduce((sum, p) => sum + (parseFloat(p.average) || 0), 0);
    return (somaMedias / stats.pillarStats.length).toFixed(1);
  }

  calcularTaxaResposta(stats) {
    const totalFuncionarios = 100; // Estimativa
    return ((stats.totalResponses || 0) / totalFuncionarios * 100).toFixed(1) + '%';
  }

  calcularNPS(stats) {
    // Cálculo simplificado de NPS baseado na favorabilidade
    const favorabilidade = stats.globalFavorability || 0;
    if (favorabilidade >= 75) return '+40';
    if (favorabilidade >= 60) return '+20';
    if (favorabilidade >= 40) return '0';
    return '-20';
  }

  classificarFavorabilidade(favorabilidade) {
    if (favorabilidade >= 80) return 'Excelente';
    if (favorabilidade >= 65) return 'Bom';
    if (favorabilidade >= 50) return 'Regular';
    return 'Precisa Melhorar';
  }

  identificarPerguntasDestaque(stats) {
    if (!stats.questionStats) return [];
    
    const melhores = stats.questionStats
      .sort((a, b) => (parseFloat(b.favorabilidade) || 0) - (parseFloat(a.favorabilidade) || 0))
      .slice(0, 3);
      
    const piores = stats.questionStats
      .sort((a, b) => (parseFloat(a.favorabilidade) || 0) - (parseFloat(b.favorabilidade) || 0))
      .slice(0, 3);
    
    return {
      melhores: melhores.map(q => ({
        pergunta_id: q.question_id,
        texto: q.question_text || `Pergunta ${q.question_id}`,
        favorabilidade: q.favorabilidade,
        pilar: q.pillar
      })),
      piores: piores.map(q => ({
        pergunta_id: q.question_id,
        texto: q.question_text || `Pergunta ${q.question_id}`,
        favorabilidade: q.favorabilidade,
        pilar: q.pillar
      }))
    };
  }

  obterTextoPergunta(questionId) {
    const pergunta = questions.find(q => q.id === questionId);
    return pergunta?.text || `Pergunta ${questionId}`;
  }

  obterPilarDaPergunta(questionId) {
    const pergunta = questions.find(q => q.id === questionId);
    return pergunta?.pillar || 'Não identificado';
  }

  analisarSentimento(comentario) {
    const positivas = ['bom', 'ótimo', 'excelente', 'gostei', 'feliz', 'satisfeito', 'legal', 'parabéns'];
    const negativas = ['ruim', 'péssimo', 'horrível', 'não gostei', 'triste', 'frustrado', 'chateado', 'problema'];
    
    const comentarioLower = comentario.toLowerCase();
    
    if (positivas.some(p => comentarioLower.includes(p)) && !negativas.some(n => comentarioLower.includes(n))) {
      return 'positivo';
    } else if (negativas.some(n => comentarioLower.includes(n))) {
      return 'negativo';
    } else {
      return 'neutro';
    }
  }

  agruparPorSentimento(comentarios) {
    const agrupado = {
      positivo: 0,
      negativo: 0,
      neutro: 0
    };
    
    comentarios.forEach(c => {
      const sentimento = this.analisarSentimento(c.comentario);
      agrupado[sentimento]++;
    });
    
    return agrupado;
  }

  extrairPadroes(resposta) {
    // Extrai padrões da resposta da IA
    const linhas = resposta.split('\n');
    const padroes = [];
    
    for (const linha of linhas) {
      if (linha.includes('PADRÃO') || linha.includes('TENDÊNCIA') || linha.includes('COMPORTAMENTO')) {
        const limpo = linha.replace(/^\d+\.\s*/, '').trim();
        if (limpo) padroes.push(limpo);
      }
    }
    
    return padroes.slice(0, 10);
  }

  extrairProblemas(resposta) {
    // Extrai problemas da resposta da IA
    const linhas = resposta.split('\n');
    const problemas = [];
    
    for (const linha of linhas) {
      if (linha.includes('PROBLEMA') || linha.includes('QUESTÃO') || linha.includes('DESAFIO')) {
        const limpo = linha.replace(/^\d+\.\s*/, '').trim();
        if (limpo) problemas.push(limpo);
      }
    }
    
    return problemas.slice(0, 3);
  }

  extrairPontosFortes(resposta) {
    // Extrai pontos fortes da resposta da IA
    const linhas = resposta.split('\n');
    const pontos = [];
    
    for (const linha of linhas) {
      if (linha.includes('PONTO FORTE') || linha.includes('VANTAGEM') || linha.includes('DESTAQUE')) {
        const limpo = linha.replace(/^\d+\.\s*/, '').trim();
        if (limpo) pontos.push(limpo);
      }
    }
    
    return pontos.slice(0, 3);
  }

  extrairSecao(resposta, tituloSecao) {
    // Extrai seção específica da resposta
    const linhas = resposta.split('\n');
    const secoes = [];
    let secaoAtual = null;
    let conteudoSecao = [];
    
    for (const linha of linhas) {
      if (linha.includes(tituloSecao)) {
        if (secaoAtual) {
          secoes.push({
            titulo: secaoAtual,
            conteudo: conteudoSecao.join('\n').trim()
          });
        }
        secaoAtual = tituloSecao;
        conteudoSecao = [];
      } else if (linha.includes('###') || linha.includes('##')) {
        continue;
      } else if (secaoAtual === tituloSecao) {
        conteudoSecao.push(linha);
      }
    }
    
    if (secaoAtual && conteudoSecao.length > 0) {
      secoes.push({
        titulo: secaoAtual,
        conteudo: conteudoSecao.join('\n').trim()
      });
    }
    
    return secoes.length > 0 ? secoes[0]?.conteudo : '';
  }

  gerarRecomendacoesComentarios(analisePadroes, problemasMaisMencionados) {
    const recomendacoes = [];
    
    if (analisePadroes.padroes && analisePadroes.padroes.length > 0) {
      recomendacoes.push(`Monitorar os padrões identificados: ${analisePadroes.padroes.slice(0, 3).join(', ')}`);
    }
    
    if (problemasMaisMencionados.problemas && problemasMaisMencionados.problemas.length > 0) {
      recomendacoes.push(`Endereçar os problemas mais citados: ${problemasMaisMencionados.problemas.slice(0, 3).join(', ')}`);
    }
    
    recomendacoes.push('Implementar canal de feedback contínuo');
    recomendacoes.push('Realizar pesquisa de acompanhamento trimestral');
    
    return recomendacoes;
  }

  gerarVisaoComentarios(analiseComentarios) {
    if (!analiseComentarios.padroes_identificados || !analiseComentarios.padroes_identificados.padroes || analiseComentarios.padroes_identificados.padroes.length === 0) {
      return 'Visão baseada apenas nos dados quantitativos da pesquisa';
    }
    
    return `Visão integrada: os comentários dos colaboradores revelam ${analiseComentarios.padroes_identificados.padroes.length} padrões comportamentais importantes que devem orientar as ações futuras da empresa.`;
  }

  gerarAnaliseFallback(dadosEstruturados) {
    return `
### RESUMO EXECUTIVO
Com base nos dados da pesquisa (${dadosEstruturados.total_respondentes} respondentes), a Nordeste Locações apresenta favorabilidade de ${dadosEstruturados.metricas_gerais.favorabilidade_global}%.

### DIAGNÓSTICO GERAL
A análise por pilares mostra desempenho geral positivo, com oportunidades de melhoria identificadas.

### PROBLEMAS CRÍTICOS
Com a amostra atual, não foi possível identificar problemas críticos com significância estatística.

### PONTOS FORTES
Destacam-se os pilares com melhor desempenho e engajamento da equipe.

### PLANO DE AÇÃO
Recomenda-se focar em aumentar a participação e implementar ações de melhoria contínua.
    `;
  }

  gerarPadroesFallback(comentarios) {
    return [
      'Necessidade de maior comunicação interna',
      'Desejo por desenvolvimento profissional',
      'Busca por reconhecimento e valorização',
      'Preocupação com ambiente de trabalho',
      'Sugestões de melhoria em processos'
    ];
  }

  gerarProblemasFallback(comentarios) {
    return [
      { problema: 'Comunicação interna', frequencia: 'Alta', impacto: 'Médio' },
      { problema: 'Reconhecimento', frequencia: 'Média', impacto: 'Alto' },
      { problema: 'Desenvolvimento', frequencia: 'Média', impacto: 'Médio' }
    ];
  }

  gerarPontosFortesFallback(comentarios) {
    return [
      { ponto: 'Trabalho em equipe', frequencia: 'Alta', impacto: 'Positivo' },
      { ponto: 'Comprometimento', frequência: 'Média', impacto: 'Positivo' },
      { ponto: 'Ambiente físico', frequência: 'Média', impacto: 'Positivo' }
    ];
  }
}

// Exportar instância única
const landingIAService = new LandingIAService();

export default landingIAService;
