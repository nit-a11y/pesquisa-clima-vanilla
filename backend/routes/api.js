import express from 'express';
import { listResponses, createResponse, deleteResponses, getStats, getResponses } from '../controllers/responseController.js';

const router = express.Router();

// Rotas de respostas
router.get('/responses', listResponses);
router.post('/responses', createResponse);
router.delete('/responses', deleteResponses);

// Rotas administrativas
router.get('/admin/stats', getStats);
router.get('/admin/responses', getResponses);

export default router;
