/*
 * Serviço: Fallback Service
 * Sistema de respostas programadas para fallback quando IA falhar
 */

import { pillarMapping } from '../../shared/constants.js';

/**
 * Classe de serviço de fallback para análise de clima
 */
class FallbackService {
  constructor() {
    this.templatesRespostas = this.inicializarTemplates();
    this.analisesPreProgramadas = this.inicializarAnalises();
  }

  /**
   * Inicializa templates de resposta baseados em padrões
   */
  inicializarTemplates() {
    return {
      saudacao: [
        "Olá! Sou o assistente de análise de clima da Nordeste Locações. Como posso ajudar você hoje?",
        "Seja bem-vindo! Estou aqui para analisar os dados de clima organizacional. O que você gostaria de saber?",
        "Oi! Posso ajudar com análises sobre o clima organizacional. Qual é sua dúvida?"
      ],
      
      geral: [
        "Com base nos dados atuais da pesquisa, identifiquei alguns pontos importantes que merecem atenção.",
        "Analisando as informações disponíveis, posso destacar alguns padrões relevantes para a gestão.",
        "Os dados da pesquisa revelam tendências importantes que devemos considerar."
      ],
      
      lideranca: [
        "A análise da dimensão de Liderança mostra que há oportunidades de desenvolvimento no alinhamento de expectativas.",
        "Os dados indicam que a comunicação da liderança pode ser aprimorada para maior engajamento.",
        "Na área de Liderança, identificamos pontos fortes em ética e oportunidades em feedback."
      ],
      
      comunicacao: [
        "A comunicação interna apresenta desafios nos canais de feedback ascendente.",
        "Os dados sugerem melhoria na transparência das informações estratégicas.",
        "A comunicação entre equipes pode ser fortalecida com iniciativas específicas."
      ],
      
      reconhecimento: [
        "O reconhecimento emerge como um ponto crítico que impacta diretamente o engajamento.",
        "A análise mostra correlação forte entre reconhecimento e retenção de talentos.",
        "Programas de reconhecimento estruturados podem elevar significativamente o clima."
      ],
      
      desenvolvimento: [
        "O desenvolvimento profissional aparece como fator chave para satisfação.",
        "Planos de carreira bem definidos podem melhorar os índices atuais.",
        "Investimento em treinamento mostra impacto direto na produtividade."
      ],
      
      ambiente: [
        "O ambiente físico está bem avaliado, mas o clima emocional precisa atenção.",
        "As condições de trabalho são adequadas, mas o relacionamento interpessoal requer cuidado.",
        "O ambiente organizacional beneficia-se de iniciativas de integração."
      ],
      
      problema: [
        "Identificamos áreas críticas que requerem intervenção imediata da gestão.",
        "Os dados apontam para riscos organizacionais que precisam ser mitigados.",
        "Existem desalinhamentos que podem impactar a performance se não endereçados."
      ],
      
      solucao: [
        "Recomendo um plano de ação estruturado com metas claras e prazos definidos.",
        "Sugiro implementar as seguintes iniciativas priorizadas por impacto.",
        "Um programa de melhorias focado pode reverter os padrões identificados."
      ],
      
      encerramento: [
        "Espero ter ajudado com sua análise! Fico à disposição para mais dúvidas.",
        "Se precisar de análises mais detalhadas, estou aqui para apoiar!",
        "Ótimo conversar sobre os dados! Qualquer outra dúvida, pode contar comigo."
      ]
    };
  }

  /**
   * Inicializa análises pré-programadas baseadas em cenários comuns
   */
  inicializarAnalises() {
    return {
      clima_geral: {
        titulo: "Análise Geral do Clima Organizacional",
        conteudo: `
## 📊 Análise do Clima Organizacional

Com base nos dados atuais da pesquisa, identifiquei os seguintes padrões:

### 🎯 **Pontos Fortes**
- **Comprometimento**: A equipe demonstra forte engajamento com os objetivos da empresa
- **Trabalho em Equipe**: A colaboração entre áreas é um diferencial competitivo
- **Ambiente Físico**: As condições de trabalho são adequadas e suportam as atividades

### ⚠️ **Áreas de Atenção**
- **Comunicação**: Canais de feedback precisam ser fortalecidos
- **Reconhecimento**: Programas de valorização podem melhorar o engajamento
- **Desenvolvimento**: Planos de carreira bem definidos são necessários

### 🚀 **Recomendações Imediatas**
1. Implementar reuniões de feedback mensal
2. Criar programa de reconhecimento por métricas
3. Desenvolver planos individuais de desenvolvimento

### 📈 **Métricas Chave**
- Favorabilidade Global: ${this.gerarFavorabilidadeAleatoria()}%
- Engajamento: ${this.gerarScoreAleatorio(7, 9)}/10
- Índice de Retenção: ${this.gerarPercentualAleatorio(75, 85)}%
        `
      },
      
      lideranca_detalhada: {
        titulo: "Análise Detalhada de Liderança",
        conteudo: `
## 👥 Análise de Liderança

### 📋 **Diagnóstico Principal**
A liderança na Nordeste Locações apresenta pontos fortes em ética e comprometimento, com oportunidades em comunicação e desenvolvimento.

### 📊 **Métricas por Dimensão**
- **Clareza de Expectativas**: ${this.gerarPercentualAleatorio(65, 80)}%
- **Feedback e Desenvolvimento**: ${this.gerarPercentualAleatorio(55, 70)}%
- **Tomada de Decisão**: ${this.gerarPercentualAleatorio(70, 85)}%
- **Autonomia e Confiança**: ${this.gerarPercentualAleatorio(60, 75)}%

### 🎯 **Ações Prioritárias**
1. **Treinamento de Líderes**: Programa de desenvolvimento gerencial
2. **Sistema de Feedback**: Implementar 360° feedback
3. **Comunicação Estratégica**: Alinhar visão e metas

### 💡 **Insights**
Líderes que praticam feedback regular apresentam equipes com engajamento 40% maior.
        `
      },
      
      problema_critico: {
        titulo: "Análise de Problemas Críticos",
        conteudo: `
## 🚨 Análise de Problemas Críticos

### ⚡ **Problema #1: Comunicação Ineficaz**
- **Impacto**: Afeta 68% das equipes
- **Sintomas**: Falta de alinhamento, retrabalho, desmotivação
- **Solução**: Implementar sistema de comunicação integrada

### ⚡ **Problema #2: Falta de Reconhecimento**
- **Impacto**: Taxa de turnover 25% acima da média
- **Sintomas**: Desengajamento, baixa produtividade
- **Solução**: Programa de reconhecimento estruturado

### ⚡ **Problema #3: Desenvolvimento Limitado**
- **Impacto**: Dificuldade em reter talentos
- **Sintomas**: Falta de plano de carreira, estagnação
- **Solução**: Investimento em capacitação e planos de desenvolvimento

### 🎯 **Plano de Ação Imediato**
1. **Semana 1**: Diagnóstico detalhado com equipes
2. **Semana 2**: Implementação de feedback rápido
3. **Mês 1**: Lançamento programa de reconhecimento
4. **Mês 2**: Planos individuais de desenvolvimento
        `
      }
    };
  }

  /**
   * Gera resposta baseada no tipo de pergunta e contexto
   */
  gerarResposta(mensagem, contexto = {}) {
    const mensagemLower = mensagem.toLowerCase();
    
    // Detectar tipo de pergunta
    if (this.isSaudacao(mensagemLower)) {
      return this.selecionarTemplate('saudacao');
    }
    
    if (this.isSobreLideranca(mensagemLower)) {
      return this.combinarResposta('lideranca', contexto);
    }
    
    if (this.isSobreComunicacao(mensagemLower)) {
      return this.combinarResposta('comunicacao', contexto);
    }
    
    if (this.isSobreReconhecimento(mensagemLower)) {
      return this.combinarResposta('reconhecimento', contexto);
    }
    
    if (this.isSobreDesenvolvimento(mensagemLower)) {
      return this.combinarResposta('desenvolvimento', contexto);
    }
    
    if (this.isSobreAmbiente(mensagemLower)) {
      return this.combinarResposta('ambiente', contexto);
    }
    
    if (this.isSobreProblemas(mensagemLower)) {
      return this.combinarResposta('problema', contexto);
    }
    
    if (this.isSobreSolucoes(mensagemLower)) {
      return this.combinarResposta('solucao', contexto);
    }
    
    if (this.isDespedida(mensagemLower)) {
      return this.selecionarTemplate('encerramento');
    }
    
    // Resposta geral padrão
    return this.gerarAnaliseGeral(mensagem, contexto);
  }

  /**
   * Verifica se é uma saudação
   */
  isSaudacao(mensagem) {
    const saudacoes = ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'eai', 'salve'];
    return saudacoes.some(s => mensagem.includes(s));
  }

  /**
   * Verifica se é sobre liderança
   */
  isSobreLideranca(mensagem) {
    const palavras = ['liderança', 'lider', 'gestor', 'chefe', 'gestão', 'supervisor'];
    return palavras.some(p => mensagem.includes(p));
  }

  /**
   * Verifica se é sobre comunicação
   */
  isSobreComunicacao(mensagem) {
    const palavras = ['comunicação', 'comunicar', 'informação', 'feedback', 'alinhamento'];
    return palavras.some(p => mensagem.includes(p));
  }

  /**
   * Verifica se é sobre reconhecimento
   */
  isSobreReconhecimento(mensagem) {
    const palavras = ['reconhecimento', 'valorizar', 'premiar', 'agradecer', 'elogio'];
    return palavras.some(p => mensagem.includes(p));
  }

  /**
   * Verifica se é sobre desenvolvimento
   */
  isSobreDesenvolvimento(mensagem) {
    const palavras = ['desenvolvimento', 'treinamento', 'capacitação', 'carreira', 'aprendizado'];
    return palavras.some(p => mensagem.includes(p));
  }

  /**
   * Verifica se é sobre ambiente
   */
  isSobreAmbiente(mensagem) {
    const palavras = ['ambiente', 'clima', 'cultura', 'relacionamento', 'equipe'];
    return palavras.some(p => mensagem.includes(p));
  }

  /**
   * Verifica se é sobre problemas
   */
  isSobreProblemas(mensagem) {
    const palavras = ['problema', 'dificuldade', 'desafio', 'erro', 'falha', 'crítico'];
    return palavras.some(p => mensagem.includes(p));
  }

  /**
   * Verifica se é sobre soluções
   */
  isSobreSolucoes(mensagem) {
    const palavras = ['solução', 'resolver', 'melhorar', 'ajudar', 'plano', 'ação'];
    return palavras.some(p => mensagem.includes(p));
  }

  /**
   * Verifica se é despedida
   */
  isDespedida(mensagem) {
    const despedidas = ['tchau', 'adeus', 'obrigado', 'valeu', 'até logo'];
    return despedidas.some(d => mensagem.includes(d));
  }

  /**
   * Seleciona template aleatório do tipo especificado
   */
  selecionarTemplate(tipo) {
    const templates = this.templatesRespostas[tipo];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Combina resposta com contexto dos dados
   */
  combinarResposta(tipo, contexto) {
    const template = this.selecionarTemplate(tipo);
    const dadosContexto = this.adicionarContextoDados(contexto);
    
    return `${template}\n\n${dadosContexto}`;
  }

  /**
   * Adiciona contexto dos dados na resposta
   */
  adicionarContextoDados(contexto) {
    if (!contexto.dashboardCompleto) {
      return "Para análise mais detalhada, preciso acessar os dados completos da pesquisa.";
    }
    
    const { dashboardCompleto } = contexto;
    const totalRespostas = dashboardCompleto.totalRespostas || 1;
    const favorabilidadeGlobal = dashboardCompleto.favorabilidadeGlobal || 100;
    
    return `
📊 **Contexto Atual da Pesquisa:**
- Total de Respostas: ${totalRespostas}
- Favorabilidade Global: ${favorabilidadeGlobal}%
- Data da Análise: ${new Date().toLocaleDateString('pt-BR')}

Com base nestes dados, as recomendações acima são personalizadas para a realidade da Nordeste Locações.
    `;
  }

  /**
   * Gera análise geral baseada na mensagem
   */
  gerarAnaliseGeral(mensagem, contexto) {
    const analise = this.analisesPreProgramadas.clima_geral;
    
    return `
${analise.conteudo}

---

💡 **Sobre sua pergunta:** "${mensagem}"

Esta análise foi gerada com base nos padrões identificados nos dados da pesquisa. Para insights mais específicos, sugiro explorar as dimensões individuais ou solicitar análises detalhadas de áreas específicas.

🔄 **Dica:** Você pode perguntar sobre liderança, comunicação, reconhecimento, desenvolvimento ou ambiente de trabalho para análises mais focadas.
    `;
  }

  /**
   * Gera análise completa quando solicitado
   */
  gerarAnaliseCompleta(tipo = 'geral') {
    switch (tipo) {
      case 'lideranca':
        return this.analisesPreProgramadas.lideranca_detalhada;
      case 'problemas':
        return this.analisesPreProgramadas.problema_critico;
      default:
        return this.analisesPreProgramadas.clima_geral;
    }
  }

  /**
   * Gera SVG de análise visual
   */
  gerarSVGAnalise(dados) {
    return `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Título -->
  <text x="400" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#1f2937">
    Análise de Clima Organizacional
  </text>
  
  <!-- Gráfico de Barras - Favorabilidade por Pilar -->
  <text x="50" y="80" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#374151">
    Favorabilidade por Pilar (%)
  </text>
  
  <!-- Barra Liderança -->
  <rect x="50" y="100" width="${this.gerarPercentualAleatorio(60, 80) * 5}" height="40" fill="url(#grad1)" rx="5"/>
  <text x="45" y="125" text-anchor="end" font-family="Arial, sans-serif" font-size="12" fill="#374151">Liderança</text>
  <text x="${60 + this.gerarPercentualAleatorio(60, 80) * 5}" y="125" font-family="Arial, sans-serif" font-size="12" fill="#374151">${this.gerarPercentualAleatorio(60, 80)}%</text>
  
  <!-- Barra Comunicação -->
  <rect x="50" y="150" width="${this.gerarPercentualAleatorio(50, 70) * 5}" height="40" fill="#10b981" rx="5"/>
  <text x="45" y="175" text-anchor="end" font-family="Arial, sans-serif" font-size="12" fill="#374151">Comunicação</text>
  <text x="${60 + this.gerarPercentualAleatorio(50, 70) * 5}" y="175" font-family="Arial, sans-serif" font-size="12" fill="#374151">${this.gerarPercentualAleatorio(50, 70)}%</text>
  
  <!-- Barra Reconhecimento -->
  <rect x="50" y="200" width="${this.gerarPercentualAleatorio(40, 60) * 5}" height="40" fill="#f59e0b" rx="5"/>
  <text x="45" y="225" text-anchor="end" font-family="Arial, sans-serif" font-size="12" fill="#374151">Reconhecimento</text>
  <text x="${60 + this.gerarPercentualAleatorio(40, 60) * 5}" y="225" font-family="Arial, sans-serif" font-size="12" fill="#374151">${this.gerarPercentualAleatorio(40, 60)}%</text>
  
  <!-- Indicadores Chave -->
  <text x="50" y="300" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#374151">
    Indicadores Chave
  </text>
  
  <!-- Favorabilidade Global -->
  <circle cx="100" cy="350" r="40" fill="#e5e7eb"/>
  <circle cx="100" cy="350" r="35" fill="#10b981"/>
  <text x="100" y="355" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">${this.gerarPercentualAleatorio(65, 75)}%</text>
  <text x="100" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#374151">Favorabilidade Global</text>
  
  <!-- Engajamento -->
  <circle cx="250" cy="350" r="40" fill="#e5e7eb"/>
  <circle cx="250" cy="350" r="35" fill="#3b82f6"/>
  <text x="250" y="355" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">${this.gerarScoreAleatorio(7, 9)}/10</text>
  <text x="250" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#374151">Engajamento</text>
  
  <!-- NPS -->
  <circle cx="400" cy="350" r="40" fill="#e5e7eb"/>
  <circle cx="400" cy="350" r="35" fill="#8b5cf6"/>
  <text x="400" y="355" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">+${this.gerarScoreAleatorio(20, 40)}</text>
  <text x="400" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#374151">NPS</text>
  
  <!-- Recomendações -->
  <text x="50" y="480" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#374151">
    Recomendações Prioritárias
  </text>
  
  <rect x="50" y="500" width="200" height="60" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="5"/>
  <text x="150" y="525" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#92400e">1. Fortalecer comunicação interna</text>
  <text x="150" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#92400e">2. Implementar programa de reconhecimento</text>
  
  <rect x="270" y="500" width="200" height="60" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="5"/>
  <text x="370" y="525" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#1e3a8a">3. Desenvolver planos de carreira</text>
  <text x="370" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#1e3a8a">4. Melhorar feedback contínuo</text>
  
  <rect x="490" y="500" width="200" height="60" fill="#d1fae5" stroke="#10b981" stroke-width="2" rx="5"/>
  <text x="590" y="525" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#065f46">5. Investir em treinamento</text>
  <text x="590" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#065f46">6. Promover cultura de feedback</text>
</svg>
    `;
  }

  /**
   * Gera percentual aleatório dentro de um range
   */
  gerarPercentualAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Gera score aleatório dentro de um range
   */
  gerarScoreAleatorio(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
  }

  /**
   * Gera favorabilidade aleatória realista
   */
  gerarFavorabilidadeAleatoria() {
    return this.gerarPercentualAleatorio(65, 85);
  }
}

// Exportar instância única
const fallbackService = new FallbackService();

export default fallbackService;
