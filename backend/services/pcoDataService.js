/**
 * Serviço para processar dados da PCO - Pesquisa de Clima Organizacional 2025
 * Arquivo: analise-2025.txt (dados brutos da pesquisa)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PcoDataService {
  constructor() {
    this.dataPath = path.join(__dirname, '../../frontend/assets/data/comparativostxt/analise-2025.txt');
    this.data = null;
  }

  /**
   * Carrega e processa o arquivo de dados da PCO
   */
  async loadData() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        throw new Error('Arquivo analise-2025.txt não encontrado');
      }

      const content = fs.readFileSync(this.dataPath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Arquivo de dados inválido ou vazio');
      }

      // Primeira linha contém os cabeçalhos
      const headers = lines[0].split('\t');
      
      // Processar linhas de dados
      const responses = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split('\t');
        if (values.length >= headers.length) {
          const response = {};
          headers.forEach((header, index) => {
            response[header] = values[index] || '';
          });
          responses.push(response);
        }
      }

      this.data = {
        headers,
        responses,
        totalRespondentes: responses.length
      };

      return this.data;
    } catch (error) {
      console.error('Erro ao carregar dados PCO:', error);
      throw error;
    }
  }

  /**
   * Mapeamento das perguntas para pilares (baseado na análise do painel atual)
   */
  getPillarMapping() {
    return {
      'Ambiente de Trabalho': [1, 2, 45],
      'Comprometimento Organizacional': [3, 9, 10, 11, 12, 13],
      'Comunicação': [8, 14, 41, 42],
      'Gestão do Capital Humano': [5, 6, 7, 15, 16, 35, 36, 43, 44, 48, 50],
      'Liderança': [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
      'Trabalho em Equipe': [4, 37, 38, 39, 40, 46, 47, 49]
    };
  }

  /**
   * Obtém o texto da pergunta pelo número
   */
  getQuestionText(questionNumber) {
    if (!this.data) return '';
    
    const headerKey = `${questionNumber})`;
    const header = this.data.headers.find(h => h.startsWith(headerKey));
    return header ? header.replace(`${questionNumber}) `, '') : `Pergunta ${questionNumber}`;
  }

  /**
   * Converte resposta Likert para valor numérico
   */
  likertToValue(response) {
    const mapping = {
      'Concordo Sempre': 4,
      'Concordo': 3,
      'Discordo': 2,
      'Discordo Sempre': 1
    };
    return mapping[response] || 0;
  }

  /**
   * Calcula estatísticas gerais
   */
  getGeneralStats() {
    if (!this.data) {
      throw new Error('Dados não carregados. Chame loadData() primeiro.');
    }

    const totalQuestions = 50; // PCO tem 50 perguntas
    const totalResponses = this.data.responses.length;
    
    // Calcular satisfação geral (Concordo Sempre + Concordo)
    let totalSatisfied = 0;
    let totalAnswers = 0;

    for (let q = 1; q <= totalQuestions; q++) {
      const questionKey = `${q}) `;
      const questionHeader = this.data.headers.find(h => h.startsWith(questionKey));
      
      if (questionHeader) {
        this.data.responses.forEach(response => {
          const answer = response[questionHeader];
          if (answer && answer !== '.' && answer !== '') {
            totalAnswers++;
            if (answer === 'Concordo Sempre' || answer === 'Concordo') {
              totalSatisfied++;
            }
          }
        });
      }
    }

    const satisfactionRate = totalAnswers > 0 ? (totalSatisfied / totalAnswers * 100) : 0;
    const dissatisfactionRate = 100 - satisfactionRate;

    return {
      totalRespondentes: totalResponses,
      totalPerguntas: totalQuestions,
      satisfacaoGeral: satisfactionRate.toFixed(2),
      insatisfacaoGeral: dissatisfactionRate.toFixed(2),
      totalSatisfeitos: totalSatisfied,
      totalInsatisfeitos: totalAnswers - totalSatisfied
    };
  }

  /**
   * Obtém estatísticas por pergunta
   */
  getQuestionStats() {
    if (!this.data) {
      throw new Error('Dados não carregados. Chame loadData() primeiro.');
    }

    const questions = [];
    const pillarMapping = this.getPillarMapping();

    for (let q = 1; q <= 50; q++) {
      const questionKey = `${q}) `;
      const questionHeader = this.data.headers.find(h => h.startsWith(questionKey));
      
      if (questionHeader) {
        const questionText = this.getQuestionText(q);
        
        // Encontrar o pilar desta pergunta
        let pilar = 'Geral';
        for (const [pillarName, questionNumbers] of Object.entries(pillarMapping)) {
          if (questionNumbers.includes(q)) {
            pilar = pillarName;
            break;
          }
        }

        // Contar respostas
        const counts = {
          concordoSempre: 0,
          concordo: 0,
          discordo: 0,
          discordoSempre: 0,
          total: 0
        };

        let comments = [];
        
        this.data.responses.forEach(response => {
          const answer = response[questionHeader];
          const commentKey = `${q}) Gostaria de deixar um comentário sobre?`;
          const comment = response[commentKey];

          if (answer && answer !== '.' && answer !== '') {
            counts.total++;
            switch (answer) {
              case 'Concordo Sempre':
                counts.concordoSempre++;
                break;
              case 'Concordo':
                counts.concordo++;
                break;
              case 'Discordo':
                counts.discordo++;
                break;
              case 'Discordo Sempre':
                counts.discordoSempre++;
                break;
            }

            // Coletar comentários não vazios
            if (comment && comment !== '.' && comment !== '' && comment.trim() !== '') {
              comments.push({
                texto: comment.trim(),
                data: response['Carimbo de data/hora'] || ''
              });
            }
          }
        });

        // Calcular métricas
        const satisfacao = counts.concordoSempre + counts.concordo;
        const insatisfacao = counts.discordo + counts.discordoSempre;
        const percentualSatisfacao = counts.total > 0 ? (satisfacao / counts.total * 100) : 0;
        const percentualInsatisfacao = counts.total > 0 ? (insatisfacao / counts.total * 100) : 0;
        
        // Calcular score médio
        const scoreTotal = (counts.concordoSempre * 4) + (counts.concordo * 3) + (counts.discordo * 2) + (counts.discordoSempre * 1);
        const scoreMedio = counts.total > 0 ? (scoreTotal / counts.total) : 0;

        questions.push({
          id: q,
          pilar,
          pergunta: questionText,
          concordoSempre: counts.concordoSempre,
          concordo: counts.concordo,
          discordo: counts.discordo,
          discordoSempre: counts.discordoSempre,
          satisfacao,
          insatisfacao,
          totalRespostas: counts.total,
          percentualSatisfacao: percentualSatisfacao.toFixed(2),
          percentualInsatisfacao: percentualInsatisfacao.toFixed(2),
          scoreMedio: scoreMedio.toFixed(2),
          comentarios: comments,
          totalComentarios: comments.length
        });
      }
    }

    return questions;
  }

  /**
   * Obtém estatísticas por pilar
   */
  getPillarStats() {
    if (!this.data) {
      throw new Error('Dados não carregados. Chame loadData() primeiro.');
    }

    const questionStats = this.getQuestionStats();
    const pillarMapping = this.getPillarMapping();
    const pillarStats = {};

    // Agrupar perguntas por pilar
    Object.entries(pillarMapping).forEach(([pillarName, questionNumbers]) => {
      const pillarQuestions = questionStats.filter(q => questionNumbers.includes(q.id));
      
      if (pillarQuestions.length > 0) {
        const totalRespostas = pillarQuestions.reduce((sum, q) => sum + q.totalRespostas, 0);
        const totalSatisfeitos = pillarQuestions.reduce((sum, q) => sum + q.satisfacao, 0);
        const totalInsatisfeitos = pillarQuestions.reduce((sum, q) => sum + q.insatisfacao, 0);
        
        const percentualSatisfacao = totalRespostas > 0 ? (totalSatisfeitos / totalRespostas * 100) : 0;
        const percentualInsatisfacao = totalRespostas > 0 ? (totalInsatisfeitos / totalRespostas * 100) : 0;
        
        // Calcular score médio do pilar
        const scoreTotal = pillarQuestions.reduce((sum, q) => sum + (parseFloat(q.scoreMedio) * q.totalRespostas), 0);
        const scoreMedio = totalRespostas > 0 ? (scoreTotal / totalRespostas) : 0;

        pillarStats[pillarName] = {
          pilar: pillarName,
          totalRespostas,
          satisfacao: totalSatisfeitos,
          insatisfacao: totalInsatisfeitos,
          percentualSatisfacao: percentualSatisfacao.toFixed(2),
          percentualInsatisfacao: percentualInsatisfacao.toFixed(2),
          scoreMedio: scoreMedio.toFixed(2),
          totalPerguntas: pillarQuestions.length,
          perguntas: pillarQuestions
        };
      }
    });

    return Object.values(pillarStats);
  }

  /**
   * Obtém ranking das perguntas
   */
  getRanking() {
    const questionStats = this.getQuestionStats();
    
    return questionStats
      .sort((a, b) => parseFloat(b.percentualSatisfacao) - parseFloat(a.percentualSatisfacao))
      .map((q, index) => ({
        ...q,
        posicao: index + 1
      }));
  }

  /**
   * Obtém top melhores e piores perguntas
   */
  getTopQuestions() {
    const ranking = this.getRanking();
    
    return {
      melhores: ranking.slice(0, 5),
      piores: ranking.slice(-5).reverse()
    };
  }

  /**
   * Obtém todos os comentários
   */
  getAllComments() {
    if (!this.data) {
      throw new Error('Dados não carregados. Chame loadData() primeiro.');
    }

    const questionStats = this.getQuestionStats();
    const allComments = [];

    questionStats.forEach(question => {
      question.comentarios.forEach(comment => {
        allComments.push({
          perguntaId: question.id,
          pergunta: question.pergunta,
          pilar: question.pilar,
          comentario: comment.texto,
          data: comment.data
        });
      });
    });

    return allComments;
  }

  /**
   * Obtém dados completos para o dashboard
   */
  async getDashboardData() {
    if (!this.data) {
      await this.loadData();
    }

    return {
      generalStats: this.getGeneralStats(),
      questionStats: this.getQuestionStats(),
      pillarStats: this.getPillarStats(),
      ranking: this.getRanking(),
      topQuestions: this.getTopQuestions(),
      comments: this.getAllComments()
    };
  }

  /**
   * Exporta dados em formato CSV
   */
  async exportToCSV() {
    if (!this.data) {
      await this.loadData();
    }

    const questionStats = this.getQuestionStats();
    
    // Criar CSV
    const headers = [
      'ID', 'Pilar', 'Pergunta', 'Concordo Sempre', 'Concordo', 
      'Discordo', 'Discordo Sempre', 'Satisfação', 'Insatisfação',
      'Total Respostas', '% Satisfação', '% Insatisfação', 'Score Médio', 'Total Comentários'
    ];
    
    const csvRows = questionStats.map(q => [
      q.id,
      `"${q.pilar}"`,
      `"${q.pergunta}"`,
      q.concordoSempre,
      q.concordo,
      q.discordo,
      q.discordoSempre,
      q.satisfacao,
      q.insatisfacao,
      q.totalRespostas,
      q.percentualSatisfacao,
      q.percentualInsatisfacao,
      q.scoreMedio,
      q.totalComentarios
    ]);
    
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    
    return csvContent;
  }
}

export default PcoDataService;
