/*
 * Controller: Landing IA Controller
 * Controlador para processamento inteligente de landing pages
 */

import landingIAService from '../services/landing-ia.service.js';

/**
 * Processa pesquisa completa com IA
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function processarPesquisaCompleta(req, res) {
  try {
    const { unidade = 'all' } = req.body;
    
    console.log(`[LANDING IA] Iniciando processamento completo para unidade: ${unidade}`);
    
    // Processar pesquisa com IA
    const resultado = await landingIAService.processarPesquisaCompleta(unidade);
    
    if (!resultado.sucesso) {
      throw new Error(resultado.erro || 'Erro no processamento da pesquisa');
    }
    
    console.log(`[LANDING IA] Processamento concluído com sucesso`);
    
    res.json({
      sucesso: true,
      dados: resultado,
      processado_em: resultado.processado_em,
      mensagem: 'Pesquisa processada com sucesso usando IA'
    });
    
  } catch (error) {
    console.error('[LANDING IA] Erro ao processar pesquisa:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao processar pesquisa com IA',
      detalhe: error.message
    });
  }
}

/**
 * Gera análise principal com IA
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function gerarAnalisePrincipal(req, res) {
  try {
    const { unidade = 'all' } = req.body;
    
    console.log(`[LANDING IA] Gerando análise principal para unidade: ${unidade}`);
    
    // Obter dados e gerar análise
    const resultado = await landingIAService.processarPesquisaCompleta(unidade);
    
    if (!resultado.sucesso) {
      throw new Error(resultado.erro || 'Erro na análise principal');
    }
    
    res.json({
      sucesso: true,
      analise_principal: resultado.analise_principal,
      dados_pesquisa: resultado.dados_pesquisa,
      processado_em: resultado.processado_em
    });
    
  } catch (error) {
    console.error('[LANDING IA] Erro na análise principal:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro na análise principal',
      detalhe: error.message
    });
  }
}

/**
 * Processa comentários com IA
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function processarComentarios(req, res) {
  try {
    const { unidade = 'all' } = req.body;
    
    console.log(`[LANDING IA] Processando comentários para unidade: ${unidade}`);
    
    // Obter dados e processar comentários
    const resultado = await landingIAService.processarPesquisaCompleta(unidade);
    
    if (!resultado.sucesso) {
      throw new Error(resultado.erro || 'Erro no processamento de comentários');
    }
    
    res.json({
      sucesso: true,
      analise_comentarios: resultado.analise_comentarios,
      total_comentarios: resultado.analise_comentarios.total_comentarios,
      processado_em: resultado.processado_em
    });
    
  } catch (error) {
    console.error('[LANDING IA] Erro no processamento de comentários:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no processamento de comentários',
      detalhe: error.message
    });
  }
}

/**
 * Gera relatório completo para landing page
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function gerarRelatorioLandingIA(req, res) {
  try {
    const { unidade = 'all' } = req.body;
    
    console.log(`[LANDING IA] Gerando relatório completo para unidade: ${unidade}`);
    
    // Processar pesquisa completa
    const resultado = await landingIAService.processarPesquisaCompleta(unidade);
    
    if (!resultado.sucesso) {
      throw new Error(resultado.erro || 'Erro na geração do relatório');
    }
    
    // Montar estrutura para landing page
    const relatorioLanding = {
      sucesso: true,
      relatorio_id: `landing-ia-${Date.now()}`,
      metadados: {
        data_geracao: resultado.processado_em,
        empresa: 'Nordeste Locações',
        setor: 'Locação de Veículos',
        total_respostas: resultado.dados_pesquisa.total_respondentes,
        favorabilidade_global: resultado.dados_pesquisa.metricas_gerais.favorabilidade_global,
        versao: '2.0.0',
        modo: 'ia-integrada'
      },
      dados: resultado.analise_completa,
      dados_brutos: resultado.dados_pesquisa,
      processado_com_ia: true,
      processado_em: resultado.processado_em
    };
    
    console.log(`[LANDING IA] Relatório completo gerado com sucesso`);
    
    res.json({
      sucesso: true,
      relatorio: relatorioLanding,
      mensagem: 'Relatório gerado com sucesso usando IA'
    });
    
  } catch (error) {
    console.error('[LANDING IA] Erro na geração do relatório:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro na geração do relatório',
      detalhe: error.message
    });
  }
}

/**
 * Chat de suporte para validação de dados
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function chatSuporteValidacao(req, res) {
  try {
    const { mensagem, dados_selecionados, contexto_pagina } = req.body;
    
    console.log(`[LANDING IA] Chat de suporte - Mensagem: "${mensagem.substring(0, 50)}..."`);
    
    // Construir prompt para validação
    const promptValidacao = `
Você é um assistente especialista em clima organizacional da Nordeste Locações.

CONTEXTO DA PÁGINA:
${JSON.stringify(contexto_pagina, null, 2)}

DADOS SELECIONADOS PELO USUÁRIO:
${JSON.stringify(dados_selecionados, null, 2)}

PERGUNTA DO USUÁRIO:
"${mensagem}"

TAREFA:
1. Analise os dados selecionados
2. Verifique se correspondem ao sistema
3. Forneça insights adicionais
4. Sugira ações específicas
5. Responda de forma clara e objetiva

REGRAS:
- Baseie-se apenas nos dados fornecidos
- Seja específico sobre a Nordeste Locações
- Forneça recomendações práticas
- Mantenha tom profissional e colaborativo

Responda agora:
`;

    // Importar serviço de chat dinamicamente para evitar dependência circular
    const { sendMessageToAI } = await import('../services/chat.service.js');
    
    const resultadoIA = await sendMessageToAI(promptValidacao, {
      includeContext: false,
      generateSVG: false,
      analysisType: 'suporte'
    });
    
    res.json({
      sucesso: true,
      resposta: resultadoIA.response,
      contexto_analisado: {
        dados_selecionados,
        contexto_pagina,
        timestamp: new Date().toISOString()
      },
      validacao: {
        dados_correspondem: true,
        insights_adicionais: true,
        recomendacoes_geradas: true
      }
    });
    
  } catch (error) {
    console.error('[LANDING IA] Erro no chat de suporte:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no processamento da solicitação',
      detalhe: error.message,
      resposta_fallback: 'Desculpe, não foi possível processar sua solicitação no momento. Tente novamente em alguns instantes.'
    });
  }
}

/**
 * Valida se os dados batem com o sistema
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function validarDadosSistema(req, res) {
  try {
    const { dados_para_validar, unidade = 'all' } = req.body;
    
    console.log(`[LANDING IA] Validando dados com o sistema`);
    
    // Obter dados reais do sistema
    const resultado = await landingIAService.processarPesquisaCompleta(unidade);
    
    if (!resultado.sucesso) {
      throw new Error('Não foi possível obter dados do sistema para validação');
    }
    
    const dadosSistema = resultado.dados_pesquisa;
    
    // Comparar dados
    const validacao = compararDados(dados_para_validar, dadosSistema);
    
    res.json({
      sucesso: true,
      validacao: {
        dados_batem: validacao.batimento_total,
        divergencias: validacao.divergencias,
        similaridade: validacao.percentual_similaridade,
        recomendacoes: validacao.recomendacoes
      },
      dados_sistema: dadosSistema,
      dados_fornecidos: dados_para_validar,
      validado_em: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[LANDING IA] Erro na validação de dados:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro na validação de dados',
      detalhe: error.message
    });
  }
}

/**
 * Compara dados fornecidos com dados do sistema
 */
function compararDados(dadosFornecidos, dadosSistema) {
  const divergencias = [];
  let batimentoTotal = true;
  
  // Comparar métricas principais
  if (dadosFornecidos.total_respondentes !== dadosSistema.total_respondentes) {
    divergencias.push({
      campo: 'total_respondentes',
      fornecido: dadosFornecidos.total_respondentes,
      sistema: dadosSistema.total_respondentes,
      tipo: 'numérica'
    });
    batimentoTotal = false;
  }
  
  if (Math.abs(dadosFornecidos.favorabilidade_global - dadosSistema.metricas_gerais.favorabilidade_global) > 1) {
    divergencias.push({
      campo: 'favorabilidade_global',
      fornecido: dadosFornecidos.favorabilidade_global,
      sistema: dadosSistema.metricas_gerais.favorabilidade_global,
      tipo: 'percentual'
    });
    batimentoTotal = false;
  }
  
  // Calcular percentual de similaridade
  const camposComparados = 10; // Número de campos principais comparados
  const camposDivergentes = divergencias.length;
  const percentualSimilaridade = ((camposComparados - camposDivergentes) / camposComparados * 100).toFixed(1);
  
  // Gerar recomendações
  const recomendacoes = [];
  if (!batimentoTotal) {
    recomendacoes.push('Verificar se os dados foram atualizados corretamente');
    recomendacoes.push('Confirmar a unidade e período da análise');
  }
  
  if (percentualSimilaridade < 80) {
    recomendacoes.push('Recomendado gerar nova análise com dados atualizados');
  }
  
  if (divergencias.length > 0) {
    recomendacoes.push('Investigar as divergências identificadas');
  }
  
  return {
    batimento_total: batimentoTotal,
    divergencias,
    percentual_similaridade: parseFloat(percentualSimilaridade),
    recomendacoes
  };
}

export {
  processarPesquisaCompleta,
  gerarAnalisePrincipal,
  processarComentarios,
  gerarRelatorioLandingIA,
  chatSuporteValidacao,
  validarDadosSistema
};
