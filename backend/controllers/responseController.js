import { getAllResponses, saveResponse, clearAllResponses, getAdminStats, getAdminResponses, getAllComentariosWithQuestions } from '../services/responseService.js';

// Listar respostas
export async function listResponses(req, res) {
  try {
    const { unidade } = req.query;
    const responses = await getAllResponses(unidade);
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
}

// Criar nova resposta
export async function createResponse(req, res) {
  try {
    const { unit, answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    await saveResponse(unit, answers);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({ error: 'Failed to save response' });
  }
}

// Deletar todas as respostas
export async function deleteResponses(req, res) {
  try {
    const result = await clearAllResponses();
    res.json({ success: true, deleted: result.deleted });
  } catch (error) {
    console.error('Error clearing responses:', error);
    res.status(500).json({ error: 'Failed to clear responses' });
  }
}

// Obter estatísticas de admin
export async function getStats(req, res) {
  try {
    const { unit } = req.query;
    const stats = await getAdminStats(unit);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
}

// Obter respostas para admin
export async function getResponses(req, res) {
  try {
    const { unit } = req.query;
    const responses = await getAdminResponses(unit);
    res.json(responses);
  } catch (error) {
    console.error('Error fetching admin responses:', error);
    res.status(500).json({ error: 'Failed to fetch admin responses' });
  }
}

// Obter todos os comentários com perguntas
export async function getComentarios(req, res) {
  try {
    const { unidade } = req.query;
    const comentarios = await getAllComentariosWithQuestions(unidade);
    res.json({
      sucesso: true,
      total_perguntas: comentarios.length,
      total_comentarios: comentarios.reduce((sum, p) => sum + p.comentarios.length, 0),
      perguntas: comentarios
    });
  } catch (error) {
    console.error('Error fetching comentarios:', error);
    res.status(500).json({ error: 'Failed to fetch comentarios' });
  }
}
