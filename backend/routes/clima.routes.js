/*
 * Routes: Clima Routes
 * Rotas para análise inteligente de clima organizacional
 */

import { Router } from 'express';
import { analisarClima, chatClima, dadosEstruturados, validarConfiguracao, gerarRelatorioCompleto, gerarRelatorioLandingPage, buscarRelatorioLandingPage, gerarRelatorioDinamico, gerarSecaoDinamica, buscarRelatorioDinamico } from '../controllers/clima.controller.js';

const router = Router();

/**
 * POST /api/clima/analise
 * Gera análise completa do clima usando IA
 * Body: { tipo?: 'completa' | 'resumida', unidade?: string }
 */
router.post('/analise', analisarClima);

/**
 * POST /api/clima/relatorio
 * Gera relatório completo automático com todas as perguntas e comentários
 * Body: { unidade?: string }
 */
router.post('/relatorio', gerarRelatorioCompleto);

/**
 * POST /api/clima/relatorio/landing-page
 * Gera relatório no formato de landing page interativa
 * Body: { unidade?: string }
 */
router.post('/relatorio/landing-page', gerarRelatorioLandingPage);

/**
 * GET /api/clima/relatorio/landing-page/:id
 * Busca relatório existente por ID
 * Params: { id: string }
 */
router.get('/relatorio/landing-page/:id', buscarRelatorioLandingPage);

/**
 * POST /api/clima/chat
 * Chat interativo para perguntas sobre clima
 * Body: { pergunta: string, unidade?: string, historico?: Array }
 */
router.post('/chat', chatClima);

/**
 * GET /api/clima/dados
 * Obtém dados estruturados para análise (sem IA)
 * Query: { unidade?: string }
 */
router.get('/dados', dadosEstruturados);

/**
 * GET /api/clima/config
 * Valida configurações da API de IA
 */
router.get('/config', validarConfiguracao);

/**
 * POST /api/clima/relatorio/dinamico
 * Gera relatório dinâmico completo seção por seção
 * Body: { unidade?: string, forcarRegenerar?: boolean }
 */
router.post('/relatorio/dinamico', gerarRelatorioDinamico);

/**
 * POST /api/clima/relatorio/secao
 * Gera seção específica do relatório dinâmico
 * Body: { secaoId: string, unidade?: string }
 */
router.post('/relatorio/secao', gerarSecaoDinamica);

/**
 * GET /api/clima/relatorio/dinamico/:id
 * Busca relatório dinâmico completo por ID
 * Params: { id: string }
 */
router.get('/relatorio/dinamico/:id', buscarRelatorioDinamico);

/**
 * GET /relatorio/dinamico/:id
 * Serve a landing page dinâmica
 * Params: { id: string }
 */
router.get('/relatorio/dinamico/:id', (req, res) => {
  res.sendFile('relatorio-dinamico.html', { root: 'frontend' });
});

export default router;
