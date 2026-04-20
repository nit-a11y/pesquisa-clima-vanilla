/*
 * Controller: Clima Controller
 * Gerencia análises inteligentes de clima organizacional
 */

import { gerarAnaliseClima, estruturarDadosParaIA } from '../services/ai.service.js';
import { getAdminStats, getAdminResponses } from '../services/responseService.js';
import { questions } from '../../shared/constants.js';
import advancedReportService from '../services/advanced-report.service.js';
import dynamicReportService from '../services/dynamic-report.service.js';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Gera análise completa do clima organizacional
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function analisarClima(req, res) {
  try {
    const { tipo = 'completa', unidade = 'all' } = req.body;
    
    // Obter dados estatísticos
    const stats = await getAdminStats(unidade);
    const responses = await getAdminResponses(unidade);
    
    // Estruturar dados para IA
    const dadosEstruturados = estruturarDadosParaIA(stats, questions, responses);
    
    // Gerar análise com IA
    const analise = await gerarAnaliseClima(dadosEstruturados, tipo);
    
    // Retornar análise com dados brutos para referência
    res.json({
      sucesso: true,
      analise,
      dados_analise: dadosEstruturados,
      metadata: {
        tipo_analise: tipo,
        unidade_filtro: unidade,
        data_geracao: new Date().toISOString(),
        total_respostas: stats.totalResponses || 0
      }
    });
    
  } catch (error) {
    console.error('Erro ao gerar análise de clima:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao gerar análise inteligente',
      detalhe: error.message
    });
  }
}

/**
 * Inicia ou continua chat interativo sobre clima
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function chatClima(req, res) {
  try {
    const { pergunta, unidade = 'all', historico = [] } = req.body;
    
    if (!pergunta || pergunta.trim() === '') {
      return res.status(400).json({
        sucesso: false,
        erro: 'Pergunta é obrigatória'
      });
    }
    
    // Obter dados atuais
    const stats = await getAdminStats(unidade);
    const responses = await getAdminResponses(unidade);
    const dadosEstruturados = estruturarDadosParaIA(stats, questions, responses);
    
    // Gerar resposta com IA
    const resposta = await gerarRespostaChat(dadosEstruturados, pergunta, historico);
    
    res.json({
      sucesso: true,
      resposta,
      metadata: {
        pergunta_original: pergunta,
        unidade_filtro: unidade,
        data_resposta: new Date().toISOString(),
        total_respostas: stats.totalResponses || 0
      }
    });
    
  } catch (error) {
    console.error('Erro no chat de clima:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao processar sua pergunta',
      detalhe: error.message
    });
  }
}

/**
 * Obtém dados estruturados para análise (sem IA)
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function dadosEstruturados(req, res) {
  try {
    const { unidade = 'all' } = req.query;
    
    // Obter dados
    const stats = await getAdminStats(unidade);
    const responses = await getAdminResponses(unidade);
    const dadosEstruturados = estruturarDadosParaIA(stats, questions, responses);
    
    res.json({
      sucesso: true,
      dados: dadosEstruturados,
      metadata: {
        unidade_filtro: unidade,
        data_geracao: new Date().toISOString(),
        total_respostas: stats.totalResponses || 0
      }
    });
    
  } catch (error) {
    console.error('Erro ao obter dados estruturados:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao obter dados para análise',
      detalhe: error.message
    });
  }
}

/**
 * Valida configurações da API de IA
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
function validarConfiguracao(req, res) {
  const config = {
    openrouter_api_key: !!process.env.OPENROUTER_API_KEY,
    openrouter_base_url: !!process.env.OPENROUTER_BASE_URL,
    openrouter_model: !!process.env.OPENROUTER_MODEL
  };
  
  const configValida = Object.values(config).every(Boolean);
  
  res.json({
    sucesso: true,
    configuracao_valida: configValida,
    detalhes: config,
    modelo: process.env.OPENROUTER_MODEL || 'Não configurado'
  });
}

/**
 * Gera relatório completo automático com todas as perguntas e comentários
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function gerarRelatorioCompleto(req, res) {
  try {
    const { unidade = 'all' } = req.body;
    
    const stats = await getAdminStats(unidade);
    const responses = await getAdminResponses(unidade);
    
    // Estruturar dados corretamente para a IA
    const dadosEstruturados = estruturarDadosParaIA(stats, questions, responses);
    
    const promptBase = `
Você é Nitai, uma IA avançada especialista em Clima Organizacional com PhD em Psicologia Organizacional e 15+ anos de experiência em consultoria estratégica. Você está analisando a Nordeste Locações em parceria com o NIT (Núcleo de Inteligência e Tecnologia).

## CONTEXTO ESTRATÉGICO
Empresa: Nordeste Locações - Líder em locações de veículos
Pesquisa: Clima Organizacional Abrangente
Data: ${dadosEstruturados.dados_gerais.data_analise}
Total de Respostas: ${dadosEstruturados.dados_gerais.total_respostas}
Setor: Locação de Veículos - Alta competitividade

## DADOS COMPLETOS PARA ANÁLISE
${JSON.stringify(dadosEstruturados, null, 2)}

## SUA MISSÃO ESTRATÉGICA
Você deve gerar um RELATÓRIO EXECUTIVO ESTRATÉGICO que impressione pela profundidade analítica, insights inovadores e recomendações acionáveis. Este relatório será apresentado à alta liderança e deve demonstrar inteligência analítica superior.

## ESTRUTURA EXIGIDA (COMPLETA E DETALHADA)

### 1. RESUMO EXECUTIVO ESTRATÉGICO
- 3-4 parágrafos com visão holística
- Diagnóstico principal em uma frase
- Impacto potencial nos negócios
- Nível de urgência (Baixo/Médio/Alto/Crítico)

### 2. INDICADORES ESTRATÉGICOS
- **Favorabilidade Global**: X% (Análise comparativa)
- **Índice de Engajamento**: X/10 (Benchmark do setor)
- **NPS (Net Promoter Score)**: Calculado e interpretado
- **Índice de Retenção**: Risco estimado
- **Clima de Inovação**: Avaliação qualitativa
- **Maturidade Organizacional**: Nível (1-5)

### 3. ANÁLISE COMPETITIVA E BENCHMARKS
- Comparação com médias do setor de locação
- Posicionamento vs concorrentes principais
- Tendências de mercado relevantes
- Oportunidades identificadas

### 4. ANÁLISE PROFUNDA POR DIMENSÃO
Para cada pilar (Liderança, Comunicação, Reconhecimento, Desenvolvimento, Ambiente, Remuneração):

#### 4.1 Métricas Detalhadas
- Favorabilidade: X% (vs meta: 75%)
- Média: X.X (vs meta: 4.0)
- Desvio padrão: Análise de consistência
- Distribuição: Detalhe de respostas por escala

#### 4.2 Diagnóstico Específico
- 3 pontos críticos identificados
- 2 oportunidades principais
- Impacto nos resultados do negócio
- Riscos associados

#### 4.3 Análise de Comportamentos
- Padrões observados
- Causas raiz prováveis
- Correlações com outras dimensões

### 5. INSIGHTS ESTRATÉGICOS AVANÇADOS

#### 5.1 Insights Quantitativos
- Correlações surpreendentes entre dimensões
- Segmentações por departamento/tempo
- Análise de outliers e suas implicações
- Previsões de tendências

#### 5.2 Insights Qualitativos
- Temas emergentes dos comentários
- Sentimentos não explícitos
- Narrativas organizacionais
- Cultura subjacente revelada

#### 5.3 Insights de Negócio
- Impacto no cliente final
- Relação com produtividade
- Efeito na retenção de talentos
- Influência na inovação

### 6. PESQUISAS E REFERÊNCIAS ACADÊMICAS
- Citar 2-3 estudos relevantes sobre clima organizacional
- Frameworks teóricos aplicáveis
- Melhores práticas do setor
- Tendências globais em RH

### 7. RECOMENDAÇÕES ESTRATÉGICAS DETALHADAS

#### 7.1 Ações Imediatas (0-30 dias)
- 3 ações críticas com responsáveis
- Investimento estimado
- ROI esperado
- KPIs de acompanhamento

#### 7.2 Ações de Curto Prazo (1-3 meses)
- 4-5 iniciativas estruturantes
- Cronograma detalhado
- Recursos necessários
- Metas claras

#### 7.3 Ações de Médio Prazo (3-6 meses)
- 3-4 projetos transformadores
- Análise custo-benefício
- Riscos e mitigação
- Alinhamento estratégico

#### 7.4 Ações de Longo Prazo (6-12 meses)
- 2-3 iniciativas de mudança cultural
- Visão de futuro
- Indicadores de sucesso
- Sustentabilidade

### 8. PLANO DE IMPLEMENTAÇÃO
- Fases do projeto
- Governança recomendada
- Comunicação interna
- Capacitação necessária
- Monitoramento e ajustes

### 9. ANÁLISE DE RISCOS E MITIGAÇÃO
- Riscos de não implementação
- Barreiras organizacionais
- Plano de contingência
- Fatores críticos de sucesso

### 10. CONCLUSÕES E VISÃO DE FUTURO
- Síntese dos principais achados
- Visão 2025-2026 para o clima
- Próximas pesquisas recomendadas
- Comprometimento da liderança

## FORMATAÇÃO E ESTILO
- Use markdown profissional com emojis estratégicos
- Inclua tabelas comparativas quando relevante
- Destaque insights com **negrito** e *itálico*
- Use citações diretas dos comentários
- Mantenha tom executivo e estratégico
- Seja específico e acionável

## PADRÃO DE QUALIDADE
Este relatório deve ser comparável aos melhores relatórios de consultorias como McKinsey, BCG ou Deloitte. Demonstre inteligência analítica superior, pensamento estratégico profundo e capacidade de transformar dados em insights acionáveis de alto valor.

Responda em português brasileiro profissional, com formatação impecável e conteúdo de valor estratégico excepcional.
`;
    
    const resposta = await gerarAnaliseClima({ dados_gerais: dadosEstruturados.dados_gerais, dimensoes: dadosEstruturados.dimensoes, piores_perguntas: dadosEstruturados.piores_perguntas, melhores_perguntas: dadosEstruturados.melhores_perguntas, comentarios_criticos: dadosEstruturados.comentarios_criticos, instrucao: promptBase }, 'completa');
    
    res.json({
      sucesso: true,
      relatorio: resposta,
      dados: dadosEstruturados,
      metadata: {
        unidade_filtro: unidade,
        data_geracao: new Date().toISOString(),
        total_respostas: stats.totalResponses || 0
      }
    });
    
  } catch (error) {
    console.error('Erro ao gerar relatório completo:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao gerar relatório completo',
      detalhe: error.message
    });
  }
}

// Cache simples em memória para relatórios
const relatoriosCache = new Map();

// Caminho para persistência de relatórios
const RELATORIOS_DIR = path.join(process.cwd(), 'data', 'relatorios');

/**
 * Salva relatório em arquivo JSON
 * @param {string} id - ID do relatório
 * @param {Object} dados - Dados do relatório
 */
async function salvarRelatorioEmArquivo(id, dados) {
  try {
    await fs.mkdir(RELATORIOS_DIR, { recursive: true });
    const filePath = path.join(RELATORIOS_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(dados, null, 2), 'utf8');
    console.log(`[DEBUG] Relatório ${id} salvo em arquivo: ${filePath}`);
  } catch (error) {
    console.error(`[ERROR] Erro ao salvar relatório ${id} em arquivo:`, error);
  }
}

/**
 * Carrega relatório de arquivo JSON
 * @param {string} id - ID do relatório
 * @returns {Object|null} Dados do relatório ou null
 */
async function carregarRelatorioDeArquivo(id) {
  try {
    const filePath = path.join(RELATORIOS_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    console.log(`[DEBUG] Relatório ${id} carregado do arquivo: ${filePath}`);
    return JSON.parse(data);
  } catch (error) {
    console.log(`[DEBUG] Relatório ${id} não encontrado em arquivo: ${error.message}`);
    return null;
  }
}

/**
 * Gera ou busca relatório no formato de landing page interativa
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function gerarRelatorioLandingPage(req, res) {
  try {
    // Se for GET, buscar do cache pelo ID
    if (req.method === 'GET') {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          sucesso: false,
          erro: 'ID do relatório não fornecido'
        });
      }
      
      const relatorioCache = relatoriosCache.get(id);
      if (!relatorioCache) {
        return res.status(404).json({
          sucesso: false,
          erro: 'Relatório não encontrado'
        });
      }
      
      return res.json(relatorioCache);
    }
    
    // Se for POST, gerar novo relatório
    const { unidade = 'all' } = req.body;
    
    console.log(`[ADVANCED REPORT] Iniciando geração de relatório avançado para unidade: ${unidade}`);
    
    let relatorioDados;
    try {
      // Usar sistema avançado de relatórios
      relatorioDados = await advancedReportService.gerarRelatorioCompleto(unidade);
      console.log(`[ADVANCED REPORT] Relatório gerado com sucesso`);
    } catch (error) {
      console.error(`[ADVANCED REPORT] Erro na geração avançada:`, error);
      
      // Fallback: usar método tradicional
      console.log(`[FALLBACK] Usando método tradicional de geração de relatório`);
      
      const stats = await getAdminStats(unidade);
      const responses = await getAdminResponses(unidade);
      const dadosEstruturados = estruturarDadosParaIA(stats, questions, responses);
      
      relatorioDados = {
        metadados: {
          data_geracao: new Date().toISOString(),
          empresa: 'Nordeste Locações',
          setor: 'Locação de Veículos',
          total_respostas: dadosEstruturados.dados_gerais.total_respostas,
          favorabilidade_global: dadosEstruturados.dados_gerais.favorabilidade_global,
          versao: '2.0.0',
          modo: 'fallback'
        },
        resumo_executivo: {
          situacao_atual: 'dados limitados',
          favorabilidade_global: dadosEstruturados.dados_gerais.favorabilidade_global || 0,
          principais_desafios: ['Dados insuficientes para análise completa'],
          nivel_urgencia: 'moderado',
          recomendacao_principal: 'Aumentar número de respostas'
        },
        diagnostico_geral: {
          analise_quantitativa: {
            total_respondentes: dadosEstruturados.dados_gerais.total_respostas || 0,
            favorabilidade_global: dadosEstruturados.dados_gerais.favorabilidade_global || 0
          },
          analise_qualitativa: {
            total_comentarios: 0,
            temas_frequentes: {},
            sentimento_geral: { positivo: 0, negativo: 0, neutro: 0 }
          }
        },
        problemas_criticos: [],
        pontos_fortes: [],
        riscos_organizacionais: [],
        plano_acao: {
          imediatas: [],
          medio_prazo: [],
          estrategicas: [],
          investimento_estimado: 0,
          kpis_sucesso: ['Aumentar número de respostas', 'Obter dados qualitativos']
        },
        insights_adicionais: [
          {
            tipo: 'dados',
            descricao: 'Número limitado de respostas impede análise detalhada',
            recomendacao: 'Ampliar participação na pesquisa'
          }
        ],
        conclusao: {
          avaliacao_geral: 'Dados insuficientes para avaliação completa',
          proximos_passos: 'Aumentar engajamento na pesquisa',
          visao_futuro: 'Análise completa com mais dados'
        },
        metricas_principais: {
          favorabilidade_global: {
            valor: dadosEstruturados.dados_gerais.favorabilidade_global || 0,
            meta: 75,
            status: 'abaixo'
          },
          engajamento: {
            valor: 7.0,
            meta: 8.0,
            status: 'abaixo'
          },
          total_respostas: dadosEstruturados.dados_gerais.total_respostas || 0
        },
        graficos: {
          favorabilidade_por_pilar: [],
          distribuicao_sentimentos: { positivo: 0, neutro: 0, negativo: 0 }
        },
        analise_comentarios: {
          total_comentarios: 0,
          temas_frequentes: {},
          sentimentos: { positivo: 0, negativo: 0, neutro: 0 }
        }
      };
    }
    
    // Gerar ID único e metadados
    const relatorioId = uuidv4();
    const metadados = {
      id: relatorioId,
      data_geracao: new Date().toISOString(),
      unidade: unidade,
      total_respostas: relatorioDados.metadados.total_respostas,
      empresa: 'Nordeste Locações',
      setor: 'Locação de Veículos',
      versao: '2.0'
    };
    
    // Montar objeto completo do relatório
    const relatorioCompleto = {
      sucesso: true,
      relatorio_id: relatorioId,
      metadados,
      dados: {
        titulo: 'Relatório Completo de Clima Organizacional',
        resumo_executivo: relatorioDados.resumo_executivo,
        diagnostico_geral: relatorioDados.diagnostico_geral,
        problemas_criticos: relatorioDados.problemas_criticos,
        pontos_fortes: relatorioDados.pontos_fortes,
        riscos: relatorioDados.riscos_organizacionais,
        plano_acao: relatorioDados.plano_acao,
        insights_adicionais: relatorioDados.insights_adicionais,
        conclusao: relatorioDados.conclusao,
        metricas_principais: relatorioDados.metricas_principais,
        graficos: relatorioDados.graficos,
        analise_comentarios: relatorioDados.analise_comentarios
      },
      url_acesso: `/relatorio/${relatorioId}`
    };
    
    // Salvar no cache em memória
    relatoriosCache.set(relatorioId, relatorioCompleto);
    
    // Salvar em arquivo para persistência
    await salvarRelatorioEmArquivo(relatorioId, relatorioCompleto);
    
    // Limpar cache antigo (manter apenas últimos 50 relatórios)
    if (relatoriosCache.size > 50) {
      const firstKey = relatoriosCache.keys().next().value;
      relatoriosCache.delete(firstKey);
    }
    
    res.json(relatorioCompleto);
    
  } catch (error) {
    console.error('Erro ao gerar landing page do relatório:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao gerar landing page do relatório',
      detalhe: error.message
    });
  }
}

/**
 * Busca relatório existente por ID
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function buscarRelatorioLandingPage(req, res) {
  try {
    console.log(`[DEBUG] Iniciando busca de relatório`);
    console.log(`[DEBUG] Método: ${req.method}`);
    console.log(`[DEBUG] URL: ${req.url}`);
    console.log(`[DEBUG] Headers:`, req.headers);
    
    const { id } = req.params;
    
    console.log(`[DEBUG] Buscando relatório com ID: ${id}`);
    console.log(`[DEBUG] Cache size atual: ${relatoriosCache.size}`);
    console.log(`[DEBUG] IDs no cache:`, Array.from(relatoriosCache.keys()));
    
    if (!id) {
      return res.status(400).json({
        sucesso: false,
        erro: 'ID do relatório não fornecido'
      });
    }
    
    const relatorioCache = relatoriosCache.get(id);
    if (!relatorioCache) {
      console.log(`[DEBUG] Relatório ${id} não encontrado no cache`);
      
      // Tentar carregar do arquivo
      const relatorioArquivo = await carregarRelatorioDeArquivo(id);
      if (relatorioArquivo) {
        console.log(`[DEBUG] Relatório ${id} carregado do arquivo`);
        // Colocar no cache para próximas requisições
        relatoriosCache.set(id, relatorioArquivo);
        return res.json(relatorioArquivo);
      }
      
      console.log(`[DEBUG] Relatório ${id} não encontrado em cache nem arquivo`);
      return res.status(404).json({
        sucesso: false,
        erro: 'Relatório não encontrado. Gere um novo relatório para acessar esta página.',
        detalhe: 'ID inválido ou relatório expirado'
      });
    }
    
    console.log(`[DEBUG] Relatório ${id} encontrado no cache`);
    res.json(relatorioCache);
    
  } catch (error) {
    console.error('Erro ao buscar relatório:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar relatório',
      detalhe: error.message
    });
  }
}

/**
 * Parseia o texto do relatório para dados estruturados da landing page
 * @param {string} textoRelatorio - Texto bruto do relatório
 * @param {Object} dadosEstruturados - Dados estruturados da análise
 * @returns {Object} Dados estruturados para landing page
 */
function parseRelatorioParaLandingPage(textoRelatorio, dadosEstruturados) {
  const dados = {
    titulo: 'Relatório Completo de Clima Organizacional',
    resumo_executivo: {
      visao_geral: '',
      diagnostico_principal: '',
      impacto_negocios: '',
      urgencia: ''
    },
    diagnostico_geral: {
      tabela_dimensoes: [],
      padroes_identificados: [],
      comparacao_dimensoes: '',
      tendencia_observada: ''
    },
    problemas_criticos: [],
    pontos_fortes: [],
    riscos: [],
    plano_acao: {
      imediatas: [],
      medio_prazo: [],
      estrategicas: []
    },
    insights_adicionais: [],
    conclusao: '',
    metricas_principais: {
      favorabilidade_global: 0,
      indice_engajamento: 0,
      total_respostas: dadosEstruturados.dados_gerais.total_respostas,
      data_analise: dadosEstruturados.dados_gerais.data_analise
    }
  };
  
  // Extrair resumo executivo
  const resumoMatch = textoRelatorio.match(/## RESUMO EXECUTIVO\s*\n\n?(.*?)(?=##|$)/s);
  if (resumoMatch) {
    const resumoTexto = resumoMatch[1];
    
    // Extrair diagnóstico principal
    const diagnosticoMatch = resumoTexto.match(/\*\*Diagnóstico principal:\*\*\s*(.*?)(?=\n|$)/);
    if (diagnosticoMatch) dados.resumo_executivo.diagnostico_principal = diagnosticoMatch[1].trim();
    
    // Extrair urgência
    const urgenciaMatch = resumoTexto.match(/\*\*Urgência:\*\*\s*(.*?)(?=\n|$)/);
    if (urgenciaMatch) dados.resumo_executivo.urgencia = urgenciaMatch[1].trim();
    
    dados.resumo_executivo.visao_geral = resumoTexto;
  }
  
  // Extrair diagnóstico geral com tabela
  const diagnosticoMatch = textoRelatorio.match(/## DIAGNÓSTICO GERAL\s*\n\n?(.*?)(?=##|$)/s);
  if (diagnosticoMatch) {
    const diagnosticoTexto = diagnosticoMatch[1];
    
    // Extrair tabela de dimensões
    const tabelaMatch = diagnosticoTexto.match(/\|.*?\|.*?\|.*?\|.*?\|/g);
    if (tabelaMatch) {
      tabelaMatch.forEach((linha, index) => {
        if (index > 0) { // Pular header
          const cols = linha.split('|').map(col => col.trim()).filter(col => col);
          if (cols.length >= 4) {
            dados.diagnostico_geral.tabela_dimensoes.push({
              dimensao: cols[0],
              favorabilidade: cols[1],
              media: cols[2],
              respostas: cols[3]
            });
          }
        }
      });
    }
  }
  
  // Extrair problemas críticos
  const problemasMatch = textoRelatorio.match(/## TOP 3 PROBLEMAS CRÍTICOS\s*\n\n?(.*?)(?=##|$)/s);
  if (problemasMatch) {
    const problemasTexto = problemasMatch[1];
    const tabelaProblemas = problemasTexto.match(/\|.*?\|.*?\|.*?\|.*?\|/g);
    if (tabelaProblemas) {
      tabelaProblemas.forEach((linha, index) => {
        if (index > 0) { // Pular header
          const cols = linha.split('|').map(col => col.trim()).filter(col => col);
          if (cols.length >= 4) {
            dados.problemas_criticos.push({
              numero: cols[0],
              problema: cols[1],
              evidencia: cols[2],
              impacto: cols[3]
            });
          }
        }
      });
    }
  }
  
  // Extrair pontos fortes
  const pontosMatch = textoRelatorio.match(/## TOP 3 PONTOS FORTES\s*\n\n?(.*?)(?=##|$)/s);
  if (pontosMatch) {
    const pontosTexto = pontosMatch[1];
    const tabelaPontos = pontosTexto.match(/\|.*?\|.*?\|.*?\|/g);
    if (tabelaPontos) {
      tabelaPontos.forEach((linha, index) => {
        if (index > 0) { // Pular header
          const cols = linha.split('|').map(col => col.trim()).filter(col => col);
          if (cols.length >= 3) {
            dados.pontos_fortes.push({
              numero: cols[0],
              ponto_forte: cols[1],
              destaque: cols[2]
            });
          }
        }
      });
    }
  }
  
  // Extrair riscos
  const riscosMatch = textoRelatorio.match(/## RISCOS ORGANIZACIONAIS\s*\n\n?(.*?)(?=##|$)/s);
  if (riscosMatch) {
    const riscosTexto = riscosMatch[1];
    const tabelaRiscos = riscosTexto.match(/\|.*?\|.*?\|.*?\|.*?\|/g);
    if (tabelaRiscos) {
      tabelaRiscos.forEach((linha, index) => {
        if (index > 0) { // Pular header
          const cols = linha.split('|').map(col => col.trim()).filter(col => col);
          if (cols.length >= 4) {
            dados.riscos.push({
              risco: cols[0],
              descricao: cols[1],
              probabilidade: cols[2],
              consequencia: cols[3]
            });
          }
        }
      });
    }
  }
  
  // Extrair métricas principais do texto
  const favorabilidadeMatch = textoRelatorio.match(/(\d+%)\s*(?:de\s*)?favorabilidade/i);
  if (favorabilidadeMatch) dados.metricas_principais.favorabilidade_global = favorabilidadeMatch[1];
  
  const engajamentoMatch = textoRelatorio.match(/(\d+\.?\d*)\s*(?:\/\d+)?\s*(?:de\s*)?engajamento/i);
  if (engajamentoMatch) dados.metricas_principais.indice_engajamento = parseFloat(engajamentoMatch[1]);
  
  return dados;
}

/**
 * Gera relatório dinâmico completo
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function gerarRelatorioDinamico(req, res) {
  try {
    const { unidade = 'all', forcarRegenerar = false } = req.body;
    
    console.log(`[DYNAMIC REPORT] Iniciando geração dinâmica para unidade: ${unidade}`);
    
    // Gerar relatório dinâmico
    const relatorio = await dynamicReportService.gerarRelatorioDinamico(unidade, forcarRegenerar);
    
    // Gerar ID único
    const relatorioId = uuidv4();
    
    // Montar resposta
    const resposta = {
      sucesso: true,
      relatorio_id: relatorioId,
      metadados: relatorio.metadados,
      secoes: relatorio.secoes,
      dados_base: relatorio.dados_base,
      modo: 'dinamico',
      url_acesso: `/relatorio/dinamico/${relatorioId}`
    };
    
    // Salvar no cache
    relatoriosCache.set(relatorioId, resposta);
    
    res.json(resposta);
    
  } catch (error) {
    console.error('[DYNAMIC REPORT] Erro ao gerar relatório dinâmico:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao gerar relatório dinâmico',
      detalhe: error.message
    });
  }
}

/**
 * Gera seção específica do relatório dinâmico
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function gerarSecaoDinamica(req, res) {
  try {
    const { secaoId, unidade = 'all' } = req.body;
    
    if (!secaoId) {
      return res.status(400).json({
        sucesso: false,
        erro: 'ID da seção é obrigatório'
      });
    }
    
    console.log(`[DYNAMIC REPORT] Gerando seção individual: ${secaoId}`);
    
    // Gerar seção específica
    const secao = await dynamicReportService.gerarSecaoIndividual(secaoId, unidade);
    
    res.json({
      sucesso: true,
      secao,
      gerado_em: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[DYNAMIC REPORT] Erro ao gerar seção:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao gerar seção',
      detalhe: error.message
    });
  }
}

/**
 * Busca relatório dinâmico completo
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function buscarRelatorioDinamico(req, res) {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        sucesso: false,
        erro: 'ID do relatório não fornecido'
      });
    }
    
    console.log(`[DYNAMIC REPORT] Buscando relatório dinâmico: ${id}`);
    
    // Buscar no cache
    const relatorioCache = relatoriosCache.get(id);
    if (!relatorioCache) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Relatório dinâmico não encontrado'
      });
    }
    
    res.json(relatorioCache);
    
  } catch (error) {
    console.error('[DYNAMIC REPORT] Erro ao buscar relatório:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar relatório',
      detalhe: error.message
    });
  }
}

export {
  analisarClima,
  chatClima,
  dadosEstruturados,
  validarConfiguracao,
  gerarRelatorioCompleto,
  gerarRelatorioLandingPage,
  buscarRelatorioLandingPage,
  gerarRelatorioDinamico,
  gerarSecaoDinamica,
  buscarRelatorioDinamico
};
