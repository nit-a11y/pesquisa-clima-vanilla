/*
 * Routes: Landing IA Routes
 * Rotas para processamento inteligente de landing pages
 */

import { Router } from 'express';
import { 
  processarPesquisaCompleta, 
  gerarAnalisePrincipal, 
  processarComentarios, 
  gerarRelatorioLandingIA, 
  chatSuporteValidacao, 
  validarDadosSistema 
} from '../controllers/landing-ia.controller.js';

const router = Router();

/**
 * POST /api/landing-ia/processar-completo
 * Processa pesquisa completa com IA (dados + comentários)
 * Body: { unidade?: string }
 */
router.post('/processar-completo', processarPesquisaCompleta);

/**
 * POST /api/landing-ia/analise-principal
 * Gera análise principal com IA
 * Body: { unidade?: string }
 */
router.post('/analise-principal', gerarAnalisePrincipal);

/**
 * POST /api/landing-ia/processar-comentarios
 * Processa comentários separadamente com IA
 * Body: { unidade?: string }
 */
router.post('/processar-comentarios', processarComentarios);

/**
 * POST /api/landing-ia/gerar-relatorio
 * Gera relatório completo para landing page com IA
 * Body: { unidade?: string }
 */
router.post('/gerar-relatorio', gerarRelatorioLandingIA);

/**
 * POST /api/landing-ia/chat-suporte
 * Chat de suporte para validação de dados
 * Body: { mensagem: string, dados_selecionados: object, contexto_pagina: object }
 */
router.post('/chat-suporte', chatSuporteValidacao);

/**
 * POST /api/landing-ia/validar-dados
 * Valida se os dados batem com o sistema
 * Body: { dados_para_validar: object, unidade?: string }
 */
router.post('/validar-dados', validarDadosSistema);

export default router;
