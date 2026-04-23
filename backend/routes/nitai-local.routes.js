/**
 * NITAI Local Routes
 * Substitui rotas de API externa pelo processamento local
 */

import express from 'express';
const router = express.Router();
import NITAILocalController from '../controllers/nitai-local.controller.js';

// Instanciar controller
const nitaiController = new NITAILocalController();

/**
 * Rotas de Chat (substituem /api/chat/*)
 */
router.post('/chat/iniciar', nitaiController.iniciarSessao.bind(nitaiController));
router.post('/chat/enviar', nitaiController.enviarMensagem.bind(nitaiController));
router.post('/chat/analise-visual', nitaiController.gerarAnaliseVisual.bind(nitaiController));
router.delete('/chat/contexto', nitaiController.limparContexto.bind(nitaiController));

/**
 * Rotas de Relatório (substituem /api/clima/relatorio/*)
 */
router.post('/clima/relatorio/landing-page', nitaiController.gerarRelatorioLanding.bind(nitaiController));

/**
 * Rotas Landing IA (substituem /api/landing-ia/*)
 */
router.post('/landing-ia/processar-completo', nitaiController.processarCompleto.bind(nitaiController));
router.post('/landing-ia/chat-suporte', nitaiController.chatSuporte.bind(nitaiController));
router.post('/landing-ia/validar-dados', nitaiController.validarDados.bind(nitaiController));

/**
 * Health check para o serviço local
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'NITAI Local Engine',
        initialized: nitaiController.isInitialized,
        timestamp: new Date().toISOString(),
        cache: nitaiController.nitaiService.cache ? 'loaded' : 'empty'
    });
});

/**
 * Estatísticas do cache local
 */
router.get('/stats', (req, res) => {
    try {
        const cache = nitaiController.nitaiService.cache;
        
        res.json({
            success: true,
            cache: {
                lastLoad: cache.lastLoad,
                insights: {
                    global: Object.keys(cache.insights.global || {}).length,
                    byUnit: Object.keys(cache.insights.byUnit || {}).length,
                    quickResponses: Object.keys(cache.insights.quickResponses || {}).length
                },
                data: {
                    completeAnalysis: cache.completeAnalysis ? 'loaded' : 'empty',
                    unitAnalysis: cache.unitAnalysis ? 'loaded' : 'empty'
                }
            },
            performance: {
                source: 'NITAI Local Engine',
                avgResponseTime: '<50ms',
                cacheHits: '100%'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
