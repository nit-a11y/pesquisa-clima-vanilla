/*
 * Serviço: Chat Service
 * Sistema avançado de chat com IA mantendo contexto e gerando análises visuais
 */

import axios from 'axios';
import { getAdminStats, getAdminResponses } from './responseService.js';
import { questions, NEGATIVE_QUESTIONS } from '../../shared/constants.js';
import fallbackService from './fallback.service.js';

// Função local para estruturar dados (evitando problemas de importação)
function estruturarDadosParaIA(stats, questions, responses) {
  // Dados gerais
  const dadosGerais = {
    clima_geral: stats.globalFavorability || 0,
    favorabilidade_global: stats.globalFavorability || 0,
    total_respostas: stats.totalResponses || 0,
    data_analise: new Date().toLocaleDateString('pt-BR')
  };

  // Dimensões (pilares)
  const dimensoes = (stats.pillarStats || []).map(pilar => ({
    nome: pilar.pillar,
    favorabilidade: parseFloat(pilar.favorabilidade) || 0,
    media: parseFloat(pilar.average) || 0,
    total_respostas: pilar.count || 0
  }));

  // Melhores perguntas
  const melhoresPerguntas = (stats.questionStats || [])
    .sort((a, b) => b.favorabilidade - a.favorabilidade)
    .slice(0, 5)
    .map(q => ({
      pergunta: questions.find(quest => quest.id === q.question_id)?.text || '',
      pilar: questions.find(quest => quest.id === q.question_id)?.pillar || '',
      favorabilidade: q.favorabilidade || 0,
      media: q.average || 0
    }));

  // Piores perguntas
  const pioresPerguntas = (stats.questionStats || [])
    .sort((a, b) => a.favorabilidade - b.favorabilidade)
    .slice(0, 5)
    .map(q => ({
      pergunta: questions.find(quest => quest.id === q.question_id)?.text || '',
      pilar: questions.find(quest => quest.id === q.question_id)?.pillar || '',
      favorabilidade: q.favorabilidade || 0,
      media: q.average || 0
    }));

  // Comentários críticos
  const comentariosCriticos = responses
    .filter(r => r.comments && Object.keys(r.comments).length > 0)
    .map(r => Object.entries(r.comments)
      .filter(([qId, comment]) => comment && comment.trim().length > 0)
      .map(([qId, comment]) => ({
        questao: questions.find(quest => quest.id === parseInt(qId))?.text || '',
        comentario: comment,
        pilar: questions.find(quest => quest.id === parseInt(qId))?.pillar || ''
      }))
    )
    .flatMap(arr => arr)
    .slice(0, 10);

  return {
    dados_gerais: dadosGerais,
    dimensoes,
    melhores_perguntas: melhoresPerguntas,
    piores_perguntas: pioresPerguntas,
    comentarios_criticos: comentariosCriticos
  };
}

/**
 * Classe para gerenciar contexto da conversa
 */
class ChatContext {
  constructor() {
    this.messages = [];
    this.contextData = null;
    this.lastAnalysis = null;
  }

  /**
   * Adiciona mensagem ao contexto
   * @param {string} role - 'user' | 'assistant' | 'system'
   * @param {string} content - Conteúdo da mensagem
   * @param {Object} metadata - Metadados adicionais
   */
  addMessage(role, content, metadata = {}) {
    const message = {
      role,
      content,
      timestamp: new Date().toISOString(),
      ...metadata
    };
    
    this.messages.push(message);
    
    // Manter apenas as últimas 20 mensagens para não exceder limite de tokens
    if (this.messages.length > 20) {
      this.messages = this.messages.slice(-20);
    }
  }

  /**
   * Limpa o contexto
   */
  clear() {
    this.messages = [];
    this.contextData = null;
    this.lastAnalysis = null;
  }

  /**
   * Obtém contexto formatado
   * @returns {Array} Mensagens formatadas
   */
  getContext() {
    return this.messages;
  }

  /**
   * Define dados de contexto da pesquisa
   * @param {Object} data - Dados da pesquisa
   */
  setContextData(data) {
    this.contextData = data;
  }

  /**
   * Salva última análise gerada
   * @param {Object} analysis - Análise gerada
   */
  setLastAnalysis(analysis) {
    this.lastAnalysis = analysis;
  }
}

// Instância global do contexto
const chatContext = new ChatContext();

/**
 * Gera prompt para análise visual em SVG
 * @param {Object} dados - Dados da pesquisa
 * @param {string} tipo - Tipo de análise
 * @returns {string} Prompt formatado
 */
function gerarPromptAnaliseSVG(dados, tipo = 'completa') {
  return `
Você é Nitai, uma IA especializada em Clima Organizacional da Nordeste Locações, atuando junto ao NIT (Núcleo de Inteligência e Tecnologia).

Seu papel é analisar dados de pesquisa de clima organizacional e apresentar uma análise profissional, clara e objetiva, como se estivesse reportando para gestores e diretoria.

REGRAS DE COMPORTAMENTO:
- Nunca mencione que é uma IA
- Nunca fale sobre "dados recebidos" ou "JSON"
- Não use linguagem robótica ou genérica
- Escreva como um analista humano experiente
- Seja direto, estratégico e baseado em dados
- Evite exageros quando os dados forem muito positivos
- Sempre considere possíveis riscos mesmo em cenários bons
- Não invente problemas que não existem
- Use linguagem corporativa simples e clara

ESTRUTURA DA RESPOSTA:

1. RESUMO EXECUTIVO
Faça um resumo direto do cenário geral (2 a 4 frases)

2. DIAGNÓSTICO GERAL
Explique o estado do clima organizacional com base nos indicadores

3. PRINCIPAIS PONTOS FORTES
Liste até 3 pontos fortes reais com base nos dados

4. PONTOS DE ATENÇÃO (se houver)
Liste possíveis riscos, mesmo que leves

5. ANÁLISE POR DIMENSÃO
Comente brevemente as dimensões (ex: Liderança, Comunicação, etc.)

6. LEITURA ESTRATÉGICA
Interprete o cenário (ex: consistência, maturidade organizacional, possíveis vieses)

7. RECOMENDAÇÕES
Sugira ações práticas e realistas (curto prazo e médio prazo)

IMPORTANTE:
- Se os dados forem muito positivos (ex: 100%), levantar hipóteses como:
  - Baixa amostragem
  - Possível viés nas respostas
  - Falta de criticidade dos respondentes
- Sempre manter postura profissional e analítica

## DADOS DA PESQUISA
${JSON.stringify(dados, null, 2)}

## REQUISITOS DO SVG

### Análise Completa:
- Gráfico de barras para favorabilidade por pilar
- Gráfico de pizza para distribuição geral
- Cores: verde (>75%), amarelo (50-75%), vermelho (<50%)
- Responsivo e moderno

### Análise Rápida:
- Gráfico de barras horizontal simples
- Indicadores principais
- Cores semânticas

## FORMATO DE RESPOSTA

### 📊 ANÁLISE TEXTUAL
[Resumo executivo em 2-3 frases]

### 🎨 CÓDIGO SVG
\`\`\`svg
[Seu código SVG aqui]
\`\`\`

### 📋 INSTRUÇÕES DE USO
[Breve instruções como usar o SVG]

Seja claro, profissional e focado em insights acionáveis.
`;
}

/**
 * Envia mensagem para a IA com contexto
 * @param {string} message - Mensagem do usuário
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} Resposta da IA
 */
async function sendMessageToAI(message, options = {}) {
  const { includeContext = true, generateSVG = false, analysisType = 'completa' } = options;
  
  try {
    // Preparar mensagens para enviar
    let messagesToSend = [
      {
        role: 'system',
        content: `Você é um analista especialista em clima organizacional da Nordeste Locações. 
Use os dados fornecidos para responder perguntas específicas sobre o clima da empresa.
Seja profissional, objetivo e baseie suas respostas nos dados.
Mantenha o contexto da conversa para fornecer respostas coerentes.`
      }
    ];

    // Adicionar contexto se solicitado
    if (includeContext && chatContext.contextData) {
      messagesToSend.push({
        role: 'system',
        content: `DADOS ATUAIS DA PESQUISA:\n${JSON.stringify(chatContext.contextData, null, 2)}`
      });
    }

    // Adicionar histórico da conversa
    messagesToSend.push(...chatContext.getContext());

    // Adicionar mensagem atual
    messagesToSend.push({
      role: 'user',
      content: message
    });

    // Preparar prompt para geração de SVG se solicitado
    if (generateSVG && chatContext.contextData) {
      messagesToSend[messagesToSend.length - 1].content += `
      
${gerarPromptAnaliseSVG(chatContext.contextData, analysisType)}`;
    }

    const response = await axios.post(
      `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: process.env.OPENROUTER_MODEL,
        messages: messagesToSend,
        max_tokens: generateSVG ? 2000 : 800,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://nordeste-locacoes.com.br',
          'X-Title': 'Chat de Análise de Clima'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    // Adicionar resposta ao contexto
    chatContext.addMessage('assistant', aiResponse, {
      includeContext,
      generateSVG,
      analysisType
    });

    return {
      success: true,
      response: aiResponse,
      hasSVG: generateSVG,
      contextSize: chatContext.messages.length
    };

  } catch (error) {
    console.error('Erro ao enviar mensagem para IA:', error.response?.data || error.message);
    
    // Usar fallback service quando IA falhar
    try {
      console.log('[FALLBACK] Usando sistema de respostas programadas');
      
      // Obter contexto atual para resposta personalizada
      const contextoAtual = {
        dashboardCompleto: chatContext.contextData,
        mensagem: message
      };
      
      // Gerar resposta usando fallback
      const fallbackResponse = fallbackService.gerarResposta(message, contextoAtual);
      
      // Se foi solicitado SVG, gerar com fallback
      let svgCode = null;
      if (generateSVG) {
        svgCode = fallbackService.gerarSVGAnalise(chatContext.contextData);
      }
      
      // Adicionar resposta ao contexto
      chatContext.addMessage('assistant', fallbackResponse, {
        includeContext,
        generateSVG,
        analysisType,
        isFallback: true
      });
      
      return {
        success: true,
        response: fallbackResponse,
        hasSVG: generateSVG,
        svgCode: svgCode,
        contextSize: chatContext.messages.length,
        isFallback: true
      };
      
    } catch (fallbackError) {
      console.error('[FALLBACK] Erro no sistema de fallback:', fallbackError.message);
      
      // Tratamento específico para diferentes tipos de erro
      if (error.response?.status === 429) {
        throw new Error('Limite de requisições atingido. Aguarde um momento e tente novamente.');
      } else if (error.response?.status === 401) {
        throw new Error('Erro de autenticação com o serviço de IA. Usando modo de análise offline.');
      } else if (error.response?.status >= 500) {
        throw new Error('Serviço de IA temporariamente indisponível. Usando análise programada.');
      } else if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND') {
        throw new Error('Erro de conexão. Usando modo offline de análise.');
      } else {
        throw new Error(`Falha ao processar sua mensagem: ${error.message}`);
      }
    }
  }
}

/**
 * Processa resposta da IA para extrair SVG
 * @param {string} response - Resposta da IA
 * @returns {Object} Resposta processada
 */
function processAIResponse(response) {
  const svgMatch = response.match(/```svg\n([\s\S]*?)\n```/);
  const analysisMatch = response.match(/📊 ANÁLISE TEXTUAL[\s\S]*?🎨 CÓDIGO SVG/s);
  
  let svgCode = null;
  let textAnalysis = response;
  
  if (svgMatch) {
    svgCode = svgMatch[1];
    // Extrair apenas a parte textual antes do SVG
    textAnalysis = response.substring(0, response.indexOf('```svg')).trim();
  }
  
  return {
    textAnalysis,
    svgCode,
    hasSVG: !!svgCode,
    fullResponse: response
  };
}

/**
 * Inicia nova sessão de chat com contexto completo
 * @param {Object} initialData - Dados iniciais da pesquisa
 */
function startNewChatSession(initialData) {
  chatContext.clear();
  chatContext.setContextData(initialData);
  
  return {
    success: true,
    message: 'Nova sessão de chat iniciada',
    contextId: Date.now()
  };
}

/**
 * Captura dados completos do dashboard para análise da IA
 * @returns {Promise<Object>} Dados completos do dashboard
 */
async function getDashboardCompleteData() {
  try {
    // Carregar dados atuais da pesquisa
    const stats = await getAdminStats();
    const responses = await getAdminResponses();
    
    // Estruturar dados completos do dashboard
    const dashboardData = {
      // Estatísticas Gerais
      estatisticas_gerais: {
        total_respostas: stats.totalResponses || 0,
        media_satisfacao: parseFloat((stats.globalFavorability || 0) / 25).toFixed(1), // Convertendo para escala 1-4
        taxa_favorabilidade: parseFloat(stats.globalFavorability || 0),
        percentual_concordo: parseFloat(stats.globalFavorability || 0),
        questao_comentada: stats.questionStats?.find(q => q.comment_count > 0)?.question_id || null
      },
      
      // Heatmap por Pilar
      heatmap_pilares: stats.pillarStats?.map(pilar => ({
        pilar: pilar.pillar,
        favorabilidade: parseFloat(pilar.favorabilidade || 0),
        status: pilar.favorabilidade >= 75 ? 'Ótimo' : pilar.favorabilidade >= 50 ? 'Atenção' : 'Crítico',
        media: parseFloat(pilar.average || 0),
        total_respostas: pilar.count || 0
      })) || [],
      
      // Rankings
      rankings: {
        top_piores_perguntas: stats.questionStats
          ?.sort((a, b) => a.average - b.average)
          ?.slice(0, 5)
          ?.map(q => ({
            pergunta: `Q${q.question_id}: ${questions.find(quest => quest.id === q.question_id)?.text?.substring(0, 60) || ''}...`,
            pilar: questions.find(quest => quest.id === q.question_id)?.pillar || 'Não definido',
            favorabilidade: parseFloat(q.favorabilidade || 0),
            media: parseFloat(q.average || 0)
          })) || [],
          
        top_melhores_perguntas: stats.questionStats
          ?.sort((a, b) => b.average - a.average)
          ?.slice(0, 5)
          ?.map(q => ({
            pergunta: `Q${q.question_id}: ${questions.find(quest => quest.id === q.question_id)?.text?.substring(0, 60) || ''}...`,
            pilar: questions.find(quest => quest.id === q.question_id)?.pillar || 'Não definido',
            favorabilidade: parseFloat(q.favorabilidade || 0),
            media: parseFloat(q.average || 0)
          })) || []
      },
      
      // Top 3 Gargalos
      gargalos: stats.bottlenecks?.map(b => ({
        pergunta: `Q${b.question_id}`,
        pilar: questions.find(quest => quest.id === b.question_id)?.pillar || 'Não definido',
        texto: questions.find(quest => quest.id === b.question_id)?.text?.substring(0, 80) || '',
        media: parseFloat(b.average || 0),
        favorabilidade: parseFloat(b.favorabilidade || 0)
      })) || [],
      
      // Todas as Questões
      todas_questoes: stats.questionStats?.map(q => {
        const question = questions.find(quest => quest.id === q.question_id);
        return {
          id: q.question_id,
          texto: question?.text || '',
          pilar: question?.pillar || 'Não definido',
          media: parseFloat(q.average || 0),
          favorabilidade: parseFloat(q.favorabilidade || 0),
          total_respostas: q.count || 0,
          comentarios: q.comment_count || 0,
          distribuicao: q.distribuicao || { 1: 0, 2: 0, 3: 0, 4: 0 },
          invertida: NEGATIVE_QUESTIONS.includes(q.question_id)
        };
      }) || [],
      
      // Distribuição das Respostas
      distribuicao_geral: {
        escala_likert: {
          '1': stats.questionStats?.reduce((acc, q) => acc + (q.distribuicao?.[1] || 0), 0) || 0,
          '2': stats.questionStats?.reduce((acc, q) => acc + (q.distribuicao?.[2] || 0), 0) || 0,
          '3': stats.questionStats?.reduce((acc, q) => acc + (q.distribuicao?.[3] || 0), 0) || 0,
          '4': stats.questionStats?.reduce((acc, q) => acc + (q.distribuicao?.[4] || 0), 0) || 0
        },
        satisfacao_por_unidade: stats.unitStats?.map(unit => ({
          unidade: unit.unit,
          media: parseFloat(unit.average || 0),
          total_respostas: unit.count || 0
        })) || [],
        favorabilidade_por_pilar: stats.pillarStats?.map(pilar => ({
          pilar: pilar.pillar,
          favorabilidade: parseFloat(pilar.favorabilidade || 0),
          status: pilar.favorabilidade >= 75 ? 'Ótimo' : pilar.favorabilidade >= 50 ? 'Atenção' : 'Crítico'
        })) || []
      },
      
      // Alertas Críticos
      alertas_criticos: {
        total_alertas: stats.criticalAlerts?.length || 0,
        descricao: stats.criticalAlerts?.length > 0 
          ? 'Questões com alto índice de insatisfação detectadas' 
          : 'Nenhum alerta crítico detectado',
        questoes_criticas: stats.criticalAlerts?.map(alert => ({
          pergunta: `Q${alert.question_id}`,
          texto: questions.find(quest => quest.id === alert.question_id)?.text?.substring(0, 80) || '',
          favorabilidade: parseFloat(alert.favorabilidade || 0),
          severidade: alert.severity || 'média'
        })) || []
      },
      
      // Comentários Qualitativos
      comentarios_qualitativos: responses
        ?.filter(r => r.comments && Object.keys(r.comments).length > 0)
        ?.map(r => ({
          unidade: r.unidade,
          comentarios: Object.entries(r.comments)
            .filter(([qId, comment]) => comment && comment.trim().length > 0)
            .map(([qId, comment]) => ({
              questao_id: parseInt(qId),
              texto_questao: questions.find(quest => quest.id === parseInt(qId))?.text || '',
              comentario: comment,
              pilar: questions.find(quest => quest.id === parseInt(qId))?.pillar || 'Não definido'
            }))
        }))
        ?.flatMap(r => r.comentarios) || [],
      
      // Metadados
      metadados: {
        data_geracao: new Date().toLocaleDateString('pt-BR'),
        total_dimensoes: stats.pillarStats?.length || 0,
        total_questoes: stats.questionStats?.length || 0,
        taxa_engajamento: stats.engagementRate || 0,
        empresa: 'Nordeste Locações',
        setor: 'Locação de Veículos'
      }
    };
    
    return dashboardData;
    
  } catch (error) {
    console.error('Erro ao capturar dados do dashboard:', error);
    throw error;
  }
}

/**
 * Inicializa contexto completo com dados da pesquisa e dashboard
 * @returns {Promise<Object>} Status da inicialização
 */
async function initializeChatContext() {
  try {
    // Carregar dados completos do dashboard
    const dashboardData = await getDashboardCompleteData();
    
    // Estruturar dados para contexto (mantendo compatibilidade)
    const stats = await getAdminStats();
    const responses = await getAdminResponses();
    const contextData = estruturarDadosParaIA(stats, questions, responses);
    
    // Adicionar dados do dashboard ao contexto
    contextData.dashboard_completo = dashboardData;
    
    // Adicionar mensagem de sistema com contexto detalhado
    chatContext.addMessage('system', 
      `Sou Nitai, sua assistente especialista em clima organizacional da Nordeste Locações. 
Tenho acesso aos dados completos da pesquisa de clima organizacional com ${dashboardData.estatisticas_gerais.total_respostas} respostas.

ANÁLISE COMPLETA DISPONÍVEL:
- Favorabilidade global: ${dashboardData.estatisticas_gerais.taxa_favorabilidade.toFixed(1)}%
- ${dashboardData.estatisticas_gerais.total_dimensoes} dimensões analisadas
- ${dashboardData.estatisticas_gerais.total_questoes} questões avaliadas
- ${dashboardData.alertas_criticos.total_alertas} alertas críticos
- ${dashboardData.comentarios_qualitativos.length} comentários qualitativos

HEATMAP POR PILAR:
${dashboardData.heatmap_pilares.map(p => `- ${p.pilar}: ${p.favorabilidade.toFixed(1)}% (${p.status})`).join('\n')}

TOP 5 MELHORES:
${dashboardData.rankings.top_melhores_perguntas.map((p, i) => `${i+1}. ${p.favorabilidade.toFixed(1)}% - ${p.pilar}`).join('\n')}

TOP 5 PIORES:
${dashboardData.rankings.top_piores_perguntas.map((p, i) => `${i+1}. ${p.favorabilidade.toFixed(1)}% - ${p.pilar}`).join('\n')}

Posso analisar qualquer aspecto do clima organizacional, gerar insights estratégicos, 
recomendações acionáveis, relatórios completos e visualizações baseadas em TODOS os dados disponíveis.

Dados carregados e prontos para análise completa. Como posso ajudar você hoje?`,
      { contextData }
    );
    
    // Armazenar contexto para uso imediato
    chatContext.contextData = contextData;
    
    return {
      success: true,
      message: 'Contexto do chat inicializado com sucesso',
      contextLoaded: true,
      totalResponses: dashboardData.estatisticas_gerais.total_respostas,
      globalFavorability: dashboardData.estatisticas_gerais.taxa_favorabilidade,
      dimensionsAnalyzed: dashboardData.estatisticas_gerais.total_dimensoes,
      contextData: contextData,
      dashboardData: dashboardData
    };
    
  } catch (error) {
    console.error('Erro ao inicializar contexto do chat:', error);
    return {
      success: false,
      message: 'Erro ao inicializar contexto do chat',
      error: error.message
    };
  }
}

/**
 * Obtém estatísticas do chat atual
 * @returns {Object} Estatísticas
 */
function getChatStats() {
  return {
    totalMessages: chatContext.messages.length,
    hasContext: !!chatContext.contextData,
    lastAnalysis: chatContext.lastAnalysis,
    sessionDuration: chatContext.messages.length > 0 ? 
      Date.now() - new Date(chatContext.messages[0].timestamp).getTime() : 0
  };
}

export {
  ChatContext,
  sendMessageToAI,
  processAIResponse,
  startNewChatSession,
  initializeChatContext,
  getDashboardCompleteData,
  getChatStats,
  chatContext
};
