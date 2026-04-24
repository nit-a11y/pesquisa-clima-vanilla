import express from 'express';
import PcoDataService from '../services/pcoDataService.js';

const router = express.Router();
const pcoService = new PcoDataService();

/**
 * Middleware para carregar dados
 */
async function loadData(req, res, next) {
  try {
    await pcoService.loadData();
    next();
  } catch (error) {
    console.error('Erro ao carregar dados PCO:', error);
    res.status(500).json({ 
      error: 'Erro ao carregar dados da pesquisa PCO',
      details: error.message 
    });
  }
}

/**
 * GET /api/pco/dashboard
 * Retorna dados completos do dashboard PCO
 */
router.get('/dashboard', loadData, async (req, res) => {
  try {
    const dashboardData = await pcoService.getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    console.error('Erro ao obter dashboard PCO:', error);
    res.status(500).json({ 
      error: 'Erro ao obter dados do dashboard',
      details: error.message 
    });
  }
});

/**
 * GET /api/pco/stats
 * Retorna estatísticas gerais
 */
router.get('/stats', loadData, async (req, res) => {
  try {
    const stats = pcoService.getGeneralStats();
    res.json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas PCO:', error);
    res.status(500).json({ 
      error: 'Erro ao obter estatísticas',
      details: error.message 
    });
  }
});

/**
 * GET /api/pco/questions
 * Retorna estatísticas por pergunta
 */
router.get('/questions', loadData, async (req, res) => {
  try {
    const questions = pcoService.getQuestionStats();
    res.json(questions);
  } catch (error) {
    console.error('Erro ao obter perguntas PCO:', error);
    res.status(500).json({ 
      error: 'Erro ao obter dados das perguntas',
      details: error.message 
    });
  }
});

/**
 * GET /api/pco/pillars
 * Retorna estatísticas por pilar
 */
router.get('/pillars', loadData, async (req, res) => {
  try {
    const pillars = pcoService.getPillarStats();
    res.json(pillars);
  } catch (error) {
    console.error('Erro ao obter pilares PCO:', error);
    res.status(500).json({ 
      error: 'Erro ao obter dados dos pilares',
      details: error.message 
    });
  }
});

/**
 * GET /api/pco/ranking
 * Retorna ranking das perguntas
 */
router.get('/ranking', loadData, async (req, res) => {
  try {
    const ranking = pcoService.getRanking();
    res.json(ranking);
  } catch (error) {
    console.error('Erro ao obter ranking PCO:', error);
    res.status(500).json({ 
      error: 'Erro ao obter ranking',
      details: error.message 
    });
  }
});

/**
 * GET /api/pco/top-questions
 * Retorna top melhores e piores perguntas
 */
router.get('/top-questions', loadData, async (req, res) => {
  try {
    const topQuestions = pcoService.getTopQuestions();
    res.json(topQuestions);
  } catch (error) {
    console.error('Erro ao obter top perguntas PCO:', error);
    res.status(500).json({ 
      error: 'Erro ao obter top perguntas',
      details: error.message 
    });
  }
});

/**
 * GET /api/pco/comments
 * Retorna todos os comentários
 */
router.get('/comments', loadData, async (req, res) => {
  try {
    const comments = pcoService.getAllComments();
    res.json(comments);
  } catch (error) {
    console.error('Erro ao obter comentários PCO:', error);
    res.status(500).json({ 
      error: 'Erro ao obter comentários',
      details: error.message 
    });
  }
});

/**
 * GET /api/pco/comments/:questionId
 * Retorna comentários de uma pergunta específica
 */
router.get('/comments/:questionId', loadData, async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);
    if (isNaN(questionId) || questionId < 1 || questionId > 50) {
      return res.status(400).json({ 
        error: 'ID de pergunta inválido',
        details: 'O ID deve ser um número entre 1 e 50'
      });
    }

    const questionStats = pcoService.getQuestionStats();
    const question = questionStats.find(q => q.id === questionId);
    
    if (!question) {
      return res.status(404).json({ 
        error: 'Pergunta não encontrada',
        details: `Pergunta ${questionId} não encontrada nos dados`
      });
    }

    res.json({
      perguntaId: question.id,
      pergunta: question.pergunta,
      pilar: question.pilar,
      comentarios: question.comentarios,
      totalComentarios: question.totalComentarios
    });
  } catch (error) {
    console.error(`Erro ao obter comentários da pergunta ${req.params.questionId}:`, error);
    res.status(500).json({ 
      error: 'Erro ao obter comentários da pergunta',
      details: error.message 
    });
  }
});

/**
 * GET /api/pco/export/csv
 * Exporta dados em formato CSV
 */
router.get('/export/csv', loadData, async (req, res) => {
  try {
    const csvContent = await pcoService.exportToCSV();
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="pco-pesquisa-clima-2025.csv"');
    
    // Adicionar BOM para Excel reconhecer caracteres especiais
    const bom = '\uFEFF';
    res.send(bom + csvContent);
  } catch (error) {
    console.error('Erro ao exportar PCO CSV:', error);
    res.status(500).json({ 
      error: 'Erro ao exportar dados',
      details: error.message 
    });
  }
});

/**
 * GET /api/pco/question/:questionId
 * Retorna dados detalhados de uma pergunta específica
 */
router.get('/question/:questionId', loadData, async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);
    if (isNaN(questionId) || questionId < 1 || questionId > 50) {
      return res.status(400).json({ 
        error: 'ID de pergunta inválido',
        details: 'O ID deve ser um número entre 1 e 50'
      });
    }

    const questionStats = pcoService.getQuestionStats();
    const question = questionStats.find(q => q.id === questionId);
    
    if (!question) {
      return res.status(404).json({ 
        error: 'Pergunta não encontrada',
        details: `Pergunta ${questionId} não encontrada nos dados`
      });
    }

    res.json(question);
  } catch (error) {
    console.error(`Erro ao obter dados da pergunta ${req.params.questionId}:`, error);
    res.status(500).json({ 
      error: 'Erro ao obter dados da pergunta',
      details: error.message 
    });
  }
});

/**
 * GET /api/pco/health
 * Verifica se o serviço está funcionando
 */
router.get('/health', async (req, res) => {
  try {
    // Verificar se o arquivo de dados existe
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dataPath = path.join(__dirname, '../../frontend/assets/data/comparativostxt/analise-2025.txt');
    
    const fileExists = fs.existsSync(dataPath);
    
    res.json({
      status: 'ok',
      service: 'PCO Data Service',
      dataFileExists: fileExists,
      dataPath: fileExists ? dataPath : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      service: 'PCO Data Service',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
