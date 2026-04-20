/*
 * Controller: Chat Controller
 * Sistema avançado de chat com IA mantendo contexto e gerando análises visuais
 */

import { sendMessageToAI, processAIResponse, startNewChatSession, initializeChatContext, getDashboardCompleteData, getChatStats, chatContext } from '../services/chat.service.js';
import { getAdminStats, getAdminResponses } from '../services/responseService.js';
import { questions } from '../../shared/constants.js';

/**
 * Inicia nova sessão de chat
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function iniciarChat(req, res) {
  try {
    const { unidade = 'all' } = req.body;
    
    // Obter dados da pesquisa
    const stats = await getAdminStats(unidade);
    const responses = await getAdminResponses(unidade);
    
    // Preparar dados estruturados
    const dadosEstruturados = {
      dados_gerais: {
        clima_geral: stats.globalFavorability || 0,
        favorabilidade_global: stats.globalFavorability || 0,
        total_respostas: stats.totalResponses || 0,
        data_analise: new Date().toLocaleDateString('pt-BR')
      },
      dimensoes: (stats.pillarStats || []).map(pilar => ({
        nome: pilar.pillar,
        favorabilidade: parseFloat(pilar.favorabilidade) || 0,
        media: parseFloat(pilar.average) || 0,
        total_respostas: pilar.count || 0
      })),
      piores_perguntas: (stats.questionStats || [])
        .sort((a, b) => (a.favorabilidade || 0) - (b.favorabilidade || 0))
        .slice(0, 5)
        .map(q => {
          const question = questions.find(qq => qq.id === q.question_id);
          return {
            pergunta_id: q.question_id,
            pergunta: question ? question.text : 'Pergunta não encontrada',
            pilar: question ? question.pillar : '',
            favorabilidade: parseFloat(q.favorabilidade) || 0,
            media: parseFloat(q.average) || 0,
            total_comentarios: q.comment_count || 0
          };
        }),
      melhores_perguntas: (stats.questionStats || [])
        .sort((a, b) => (b.favorabilidade || 0) - (a.favorabilidade || 0))
        .slice(0, 5)
        .map(q => {
          const question = questions.find(qq => qq.id === q.question_id);
          return {
            pergunta_id: q.question_id,
            pergunta: question ? question.text : 'Pergunta não encontrada',
            pilar: question ? question.pillar : '',
            favorabilidade: parseFloat(q.favorabilidade) || 0,
            media: parseFloat(q.average) || 0,
            total_comentarios: q.comment_count || 0
          };
        })
    };
    
    // Iniciar nova sessão
    const session = startNewChatSession(dadosEstruturados);
    
    res.json({
      sucesso: true,
      session,
      dados: dadosEstruturados,
      message: 'Sessão de chat iniciada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao iniciar chat:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao iniciar sessão de chat',
      detalhe: error.message
    });
  }
}

/**
 * Inicializa contexto completo do chat com dados da pesquisa
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function inicializarContexto(req, res) {
  try {
    const resultado = await initializeChatContext();
    
    if (resultado.success) {
      res.json({
        sucesso: true,
        mensagem: resultado.message,
        contexto: {
          carregado: resultado.contextLoaded,
          totalRespostas: resultado.totalResponses,
          favorabilidadeGlobal: resultado.globalFavorability,
          dimensoesAnalisadas: resultado.dimensionsAnalyzed,
          dashboardCompleto: resultado.dashboardData
        }
      });
    } else {
      res.status(500).json({
        sucesso: false,
        erro: resultado.message
      });
    }
    
  } catch (error) {
    console.error('Erro ao inicializar contexto:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao inicializar contexto do chat'
    });
  }
}

/**
 * Envia mensagem para a IA
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function enviarMensagem(req, res) {
  try {
    const { mensagem, incluirContexto = true, gerarSVG = false, tipoAnalise = 'completa' } = req.body;
    
    // Validar mensagem
    if (!mensagem || mensagem.trim().length === 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Mensagem é obrigatória'
      });
    }
    
    // Enviar para IA
    const resultado = await sendMessageToAI(mensagem, {
      includeContext: incluirContexto,
      generateSVG: gerarSVG,
      analysisType: tipoAnalise
    });
    
    // Processar resposta
    let respostaProcessada;
    let temSVG = false;
    let codigoSVG = null;
    
    if (resultado.isFallback) {
      // Resposta do fallback service
      respostaProcessada = {
        hasSVG: resultado.hasSVG,
        svgCode: resultado.svgCode,
        textAnalysis: resultado.response
      };
      temSVG = resultado.hasSVG;
      codigoSVG = resultado.svgCode;
    } else {
      // Resposta da IA normal
      respostaProcessada = processAIResponse(resultado.response);
      temSVG = respostaProcessada.hasSVG;
      codigoSVG = respostaProcessada.svgCode;
    }
    
    res.json({
      sucesso: true,
      resposta: resultado.response,
      respostaProcessada,
      temSVG,
      codigoSVG,
      analiseTextual: resultado.response,
      contexto: {
        totalMensagens: resultado.contextSize,
        temContexto: !!chatContext.contextData
      },
      isFallback: resultado.isFallback || false,
      message: resultado.isFallback ? 'Mensagem processada com análise programada (modo offline)' : 'Mensagem processada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao processar mensagem',
      detalhe: error.message
    });
  }
}

/**
 * Gera análise visual em SVG
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function gerarAnaliseVisual(req, res) {
  try {
    const { unidade = 'all', tipo = 'completa' } = req.body;
    
    // Obter dados da pesquisa
    const stats = await getAdminStats(unidade);
    const responses = await getAdminResponses(unidade);
    
    // Preparar dados estruturados
    const dadosEstruturados = {
      dados_gerais: {
        clima_geral: stats.globalFavorability || 0,
        favorabilidade_global: stats.globalFavorability || 0,
        total_respostas: stats.totalResponses || 0,
        data_analise: new Date().toLocaleDateString('pt-BR')
      },
      dimensoes: (stats.pillarStats || []).map(pilar => ({
        nome: pilar.pillar,
        favorabilidade: parseFloat(pilar.favorabilidade) || 0,
        media: parseFloat(pilar.average) || 0,
        total_respostas: pilar.count || 0
      })),
      piores_perguntas: (stats.questionStats || [])
        .sort((a, b) => (a.favorabilidade || 0) - (b.favorabilidade || 0))
        .slice(0, 5)
        .map(q => {
          const question = questions.find(qq => qq.id === q.question_id);
          return {
            pergunta_id: q.question_id,
            pergunta: question ? question.text : 'Pergunta não encontrada',
            pilar: question ? question.pillar : '',
            favorabilidade: parseFloat(q.favorabilidade) || 0,
            media: parseFloat(q.average) || 0,
            total_comentarios: q.comment_count || 0
          };
        })
    };
    
    // Gerar análise visual
    const resultado = await sendMessageToAI('Gere análise visual completa em SVG', {
      includeContext: true,
      generateSVG: true,
      analysisType: tipo
    });
    
    const respostaProcessada = processAIResponse(resultado.response);
    
    res.json({
      sucesso: true,
      analise: resultado.response,
      analiseProcessada: respostaProcessada,
      dados: dadosEstruturados,
      message: 'Análise visual gerada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao gerar análise visual:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao gerar análise visual',
      detalhe: error.message
    });
  }
}

/**
 * Obtém estatísticas do chat
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function getChatStatistics(req, res) {
  try {
    const stats = getChatStats();
    
    res.json({
      sucesso: true,
      stats,
      message: 'Estatísticas obtidas com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao obter estatísticas',
      detalhe: error.message
    });
  }
}

/**
 * Limpa contexto do chat
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function limparContexto(req, res) {
  try {
    chatContext.clear();
    
    res.json({
      sucesso: true,
      message: 'Contexto do chat limpo com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao limpar contexto:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao limpar contexto',
      detalhe: error.message
    });
  }
}


export {
  iniciarChat,
  inicializarContexto,
  enviarMensagem,
  gerarAnaliseVisual,
  getChatStatistics,
  limparContexto
};
