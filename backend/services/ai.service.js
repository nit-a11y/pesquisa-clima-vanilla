/*
 * Serviço: AI Service
 * Análise inteligente de clima organizacional usando OpenRouter
 */

import axios from 'axios';

/**
 * Estrutura os dados da pesquisa para envio à IA
 * @param {Object} stats - Estatísticas da pesquisa
 * @param {Array} questions - Lista de perguntas
 * @param {Array} responses - Respostas detalhadas
 * @returns {Object} Dados estruturados para análise
 */
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

  // Piores perguntas (menor favorabilidade)
  const pioresPerguntas = (stats.questionStats || [])
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
    });

  // Melhores perguntas (maior favorabilidade)
  const melhoresPerguntas = (stats.questionStats || [])
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
    });

  // Comentários críticos (perguntas com baixa favorabilidade e comentários)
  const comentariosCriticos = responses
    .filter(r => {
      const qStat = stats.questionStats?.find(s => s.question_id === r.question_id);
      return qStat && (qStat.favorabilidade || 0) < 50 && r.comment && r.comment.trim();
    })
    .slice(0, 10)
    .map(r => {
      const question = questions.find(qq => qq.id === r.question_id);
      return {
        pergunta_id: r.question_id,
        pergunta: question ? question.text : 'Pergunta não encontrada',
        comentario: r.comment,
        unidade: r.unit,
        favorabilidade_pergunta: (() => {
          const qStat = stats.questionStats?.find(s => s.question_id === r.question_id);
          return qStat ? parseFloat(qStat.favorabilidade) || 0 : 0;
        })()
      };
    });

  const resultado = {
    dados_gerais: dadosGerais,
    dimensoes: dimensoes,
    piores_perguntas: pioresPerguntas,
    melhores_perguntas: melhoresPerguntas,
    comentarios_criticos: comentariosCriticos,
    alertas: stats.criticalAlerts || [],
    engajamento: stats.engagementRate || 0
  };

  return resultado;
}

/**
 * Gera análise completa do clima organizacional usando IA
 * @param {Object} dadosEstruturados - Dados estruturados da pesquisa
 * @param {string} tipoAnalise - Tipo de análise: 'completa' ou 'resumida'
 * @returns {Promise<string>} Análise gerada pela IA
 */
async function gerarAnaliseClima(dadosEstruturados, tipoAnalise = 'completa') {
  const promptBase = tipoAnalise === 'completa' ? `
Você é um especialista em clima organizacional e análise de dados de RH.

Analise os dados da pesquisa de clima organizacional e gere uma análise estruturada e completa:

## CONTEXTO
Empresa: Nordeste Locações
Pesquisa: Clima Organizacional
Data: ${dadosEstruturados.dados_gerais.data_analise}
Total de Respostas: ${dadosEstruturados.dados_gerais.total_respostas}

## DADOS ESTRUTURADOS
${JSON.stringify(dadosEstruturados, null, 2)}

## FORMATO DA ANÁLISE (OBRIGATÓRIO)

### 📊 RESUMO EXECUTIVO
- Visão geral do clima em 2-3 frases
- Favorabilidade geral e status atual

### 🔍 DIAGNÓSTICO GERAL  
- Principais padrões identificados
- Comparação entre dimensões
- Tendências observadas

### ⚠️ TOP 3 PROBLEMAS CRÍTICOS
1. [Problema] - Impacto e evidências
2. [Problema] - Impacto e evidências  
3. [Problema] - Impacto e evidências

### ✅ TOP 3 PONTOS FORTES
1. [Ponto forte] - Por que é forte
2. [Ponto forte] - Por que é forte
3. [Ponto forte] - Por que é forte

### 🚨 RISCOS ORGANIZACIONAIS
- Riscos de turnover
- Riscos de produtividade
- Riscos de clima geral

### 📋 PLANO DE AÇÃO RECOMENDADO
### Ações Imediatas (0-30 dias)
1. [Ação] - Responsável esperado - KPI
2. [Ação] - Responsável esperado - KPI

### Ações de Médio Prazo (30-90 dias)
1. [Ação] - Responsável esperado - KPI
2. [Ação] - Responsável esperado - KPI

### Ações Estratégicas (90+ dias)
1. [Ação] - Responsável esperado - KPI
2. [Ação] - Responsável esperado - KPI

### 💡 INSIGHTS ADICIONAIS
- Padrões nos comentários
- Recomendações específicas por dimensão
- Pontos de atenção para próxima pesquisa

Seja objetivo, profissional e orientado à decisão. Use dados concretos da análise.
Evite frases genéricas. Seja específico e acionável.
` : `
Você é um especialista em clima organizacional.

Gere uma análise resumida e direta:

## DADOS
${JSON.stringify(dadosEstruturados, null, 2)}

## ANÁLISE RESUMIDA

### 🎯 SITUAÇÃO ATUAL
- Status geral do clima
- Favorabilidade: ${dadosEstruturados.dados_gerais.favorabilidade_global}%

### ⚡ TOP 2 PROBLEMAS
1. [Problema principal]
2. [Segundo problema]

### 💪 TOP 2 FORÇAS  
1. [Principal força]
2. [Segunda força]

### 🚀 AÇÕES PRIORITÁRIAS
1. [Ação mais crítica]
2. [Segunda ação]

Seja breve e direto. Foque no essencial.
`;

  try {
    const response = await axios.post(
      `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: process.env.OPENROUTER_MODEL,
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista sênior em clima organizacional, People Analytics e consultoria de RH. Suas análises são sempre baseadas em dados, acionáveis e estratégicas.' 
          },
          { role: 'user', content: promptBase }
        ],
        max_tokens: tipoAnalise === 'completa' ? 2000 : 800,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://nordeste-locacoes.com.br',
          'X-Title': 'Pesquisa de Clima Organizacional'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao gerar análise com IA:', error.response?.data || error.message);
    throw new Error('Falha ao gerar análise inteligente. Verifique as configurações da API.');
  }
}

/**
 * Gera resposta para chat interativo sobre clima
 * @param {Object} dadosEstruturados - Dados estruturados da pesquisa
 * @param {string} pergunta - Pergunta do usuário
 * @param {Array} historico - Histórico da conversa
 * @returns {Promise<string>} Resposta gerada pela IA
 */
async function gerarRespostaChat(dadosEstruturados, pergunta, historico = []) {
  const prompt = `
Você é um analista especialista em clima organizacional da Nordeste Locações.

## CONTEXTO DA EMPRESA
- Empresa: Nordeste Locações
- Setor: Locação de veículos e equipamentos
- Pesquisa recente de clima organizacional realizada

## DADOS DA PESQUISA
${JSON.stringify(dadosEstruturados, null, 2)}

## HISTÓRICO DA CONVERSA
${historico.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

## PERGUNTA ATUAL
${pergunta}

## INSTRUÇÕES
- Responda como especialista em clima organizacional
- Baseie suas respostas nos dados fornecidos
- Seja específico e cite dados quando relevante
- Mantenha o tom profissional e consultivo
- Se não tiver informação suficiente nos dados, diga claramente
- Respostas devem ser objetivas e acionáveis
`;

  try {
    const response = await axios.post(
      `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: process.env.OPENROUTER_MODEL,
        messages: [
          { 
            role: 'system', 
            content: 'Você é um analista especialista em clima organizacional da Nordeste Locações. Use os dados da pesquisa para responder perguntas específicas sobre o clima da empresa.' 
          },
          ...historico,
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.6
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao gerar resposta do chat:', error.response?.data || error.message);
    throw new Error('Falha ao processar sua pergunta. Tente novamente.');
  }
}

export {
  estruturarDadosParaIA,
  gerarAnaliseClima,
  gerarRespostaChat
};
