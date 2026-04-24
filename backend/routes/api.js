import express from 'express';
import { listResponses, createResponse, deleteResponses, getStats, getResponses, getComentarios } from '../controllers/responseController.js';
import pcoRoutes from './pco.js';

const router = express.Router();

// Rotas de respostas
router.get('/responses', listResponses);
router.post('/responses', createResponse);
router.delete('/responses', deleteResponses);

// Rotas administrativas
router.get('/admin/stats', getStats);
router.get('/admin/responses', getResponses);
router.get('/admin/comentarios', getComentarios);

// Rotas PCO
router.use('/pco', pcoRoutes);

export default router;
