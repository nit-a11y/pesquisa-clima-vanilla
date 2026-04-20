/*
 * Routes: Chat Routes
 * Rotas para sistema avançado de chat com IA mantendo contexto e gerando análises visuais
 */

import { Router } from 'express';
import { 
  iniciarChat, 
  inicializarContexto, 
  enviarMensagem, 
  gerarAnaliseVisual, 
  getChatStatistics, 
  limparContexto 
} from '../controllers/chat.controller.js';

const router = Router();

/**
 * POST /api/chat/iniciar
 * Inicia nova sessão de chat com contexto dos dados da pesquisa
 * Body: { unidade?: string }
 */
router.post('/iniciar', iniciarChat);

/**
 * POST /api/chat/inicializar-contexto
 * Inicializa contexto completo com dados da pesquisa
 */
router.post('/inicializar-contexto', inicializarContexto);

/**
 * POST /api/chat/enviar
 * Envia mensagem para IA mantendo contexto
 * Body: { mensagem: string, gerarSVG?: boolean, tipoAnalise?: string, incluirContexto?: boolean }
 */
router.post('/enviar', enviarMensagem);

/**
 * POST /api/chat/analise-visual
 * Gera análise visual em SVG
 * Body: { unidade?: string, tipo?: 'completa' | 'rapida' }
 */
router.post('/analise-visual', gerarAnaliseVisual);

/**
 * GET /api/chat/estatisticas
 * Obtém estatísticas do chat atual
 */
router.get('/estatisticas', getChatStatistics);

/**
 * DELETE /api/chat/contexto
 * Limpa contexto do chat
 */
router.delete('/contexto', limparContexto);

export default router;
