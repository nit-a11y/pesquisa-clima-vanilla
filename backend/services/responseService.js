import { db } from '../database/connection.js';
import { getPillarByQuestionId, questions, NEGATIVE_QUESTIONS } from '../../shared/constants.js';

// Inverter score para perguntas negativas (1↔4, 2↔3)
function invertScore(score) {
  return 5 - score;
}

// Buscar todas as respostas com filtro opcional por unidade
export function getAllResponses(unidade = null) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM survey_responses';
    const params = [];

    if (unidade && unidade !== 'all') {
      query += ' WHERE unidade = ?';
      params.push(unidade);
    }

    query += ' ORDER BY timestamp DESC';

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const responses = rows.map(row => ({
        ...row,
        answers: safeParseJSON(row.answers, {}),
        comments: safeParseJSON(row.comments, {})
      }));

      resolve(responses);
    });
  });
}

// Salvar nova resposta
export function saveResponse(unit, answers) {
  return new Promise((resolve, reject) => {
    const answersObj = answers.reduce((acc, answer) => {
      acc[answer.questionId] = {
        score: answer.score,
        comment: answer.comment || ''
      };
      return acc;
    }, {});

    const commentsObj = answers.reduce((acc, answer) => {
      if (answer.comment) {
        acc[answer.questionId] = answer.comment;
      }
      return acc;
    }, {});

    const stmt = db.prepare(
      'INSERT INTO survey_responses (timestamp, answers, comments, unidade) VALUES (?, ?, ?, ?)'
    );

    stmt.run(
      new Date().toISOString(),
      JSON.stringify(answersObj),
      JSON.stringify(commentsObj),
      unit || null,
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID });
      }
    );

    stmt.finalize();
  });
}

// Limpar todas as respostas
export function clearAllResponses() {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM survey_responses', [], function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ deleted: this.changes });
    });
  });
}

// Obter estatísticas administrativas
export async function getAdminStats(unitFilter = null) {
  const rows = await new Promise((resolve, reject) => {
    let query = 'SELECT * FROM survey_responses';
    const params = [];
    
    if (unitFilter && unitFilter !== 'all') {
      query += ' WHERE unidade = ?';
      params.push(unitFilter);
    }
    
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  const totalResult = await new Promise((resolve, reject) => {
    let countQuery = 'SELECT COUNT(*) as total FROM survey_responses';
    const countParams = [];
    
    if (unitFilter && unitFilter !== 'all') {
      countQuery += ' WHERE unidade = ?';
      countParams.push(unitFilter);
    }
    
    db.get(countQuery, countParams, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  const responses = rows.map(row => ({
    ...row,
    answers: safeParseJSON(row.answers, {})
  }));

  return calculateStats(responses, totalResult?.total || 0);
}

// Calcular favorabilidade e desfavorabilidade (METODOLOGIA IDÊNTICA À DE 2025)
function calculateFavorability(responses, questionId) {
  const responsesWithQ = responses.filter(r => r.answers && r.answers[questionId]);
  
  if (responsesWithQ.length === 0) {
    return { favorabilidade: 0, desfavorabilidade: 0, distribuicao: { 1: 0, 2: 0, 3: 0, 4: 0 } };
  }
  
  const distribuicao = { 1: 0, 2: 0, 3: 0, 4: 0 };
  
  responsesWithQ.forEach(r => {
    const answer = r.answers[questionId];
    let score = typeof answer === 'object' ? answer.score : answer;
    
    if (score) {
      // Inverter score para perguntas negativas
      if (NEGATIVE_QUESTIONS.includes(questionId)) {
        score = invertScore(score);
      }
      distribuicao[score]++;
    }
  });
  
  const total = responsesWithQ.length;
  
  // METODOLOGIA 2025: Concordo Sempre (4) + Concordo (3) = Satisfação
  const satisfacao = distribuicao[4] + distribuicao[3];  // Concordo Sempre + Concordo
  const insatisfacao = distribuicao[1] + distribuicao[2];  // Discordo Sempre + Discordo
  
  // Cálculo idêntico ao de 2025
  const favorabilidade = (satisfacao / total) * 100;
  const desfavorabilidade = (insatisfacao / total) * 100;
  
  return {
    favorabilidade: favorabilidade.toFixed(1),
    desfavorabilidade: desfavorabilidade.toFixed(1),
    distribuicao: {
      1: (distribuicao[1] / total * 100).toFixed(1),
      2: (distribuicao[2] / total * 100).toFixed(1),
      3: (distribuicao[3] / total * 100).toFixed(1),
      4: (distribuicao[4] / total * 100).toFixed(1)
    }
  };
}

// Calcular estatísticas
function calculateStats(responses, totalCount) {
  const unitStats = {};
  const pillarStats = {};
  const questionStats = {};

  responses.forEach(response => {
    const unit = response.unidade;
    if (!unit) return;

    if (!unitStats[unit]) {
      unitStats[unit] = { total: 0, scores: [] };
    }
    unitStats[unit].total++;

    Object.entries(response.answers).forEach(([qId, answer]) => {
      const questionId = parseInt(qId);
      let score = typeof answer === 'object' ? answer.score : answer;

      if (score) {
        // Inverter score para perguntas negativas
        if (NEGATIVE_QUESTIONS.includes(questionId)) {
          score = invertScore(score);
        }
        unitStats[unit].scores.push(score);

        const pillar = getPillarByQuestionId(questionId);
        if (pillar) {
          if (!pillarStats[pillar]) {
            pillarStats[pillar] = { total: 0, scores: [] };
          }
          pillarStats[pillar].total++;
          pillarStats[pillar].scores.push(score);
        }

        if (!questionStats[questionId]) {
          questionStats[questionId] = { total: 0, scores: [], comments: [] };
        }
        questionStats[questionId].total++;
        questionStats[questionId].scores.push(score);

        const comment = typeof answer === 'object' ? answer.comment : '';
        if (comment) {
          questionStats[questionId].comments.push(comment);
        }
      }
    });
  });

  const unitStatsFinal = Object.entries(unitStats).map(([unit, data]) => ({
    unit,
    average: data.scores.reduce((a, b) => a + b, 0) / data.scores.length || 0,
    count: data.total
  }));

  const pillarStatsFinal = Object.entries(pillarStats).map(([pillar, data]) => {
    // Calcular favorabilidade agregada para o pilar
    const pillarQuestions = questions.filter(q => q.pillar === pillar).map(q => q.id);
    let totalFavorabilidade = 0;
    let totalDesfavorabilidade = 0;
    let validQuestions = 0;
    
    pillarQuestions.forEach(qId => {
      const favorabilityData = calculateFavorability(responses, qId);
      if (favorabilityData.favorabilidade > 0 || favorabilityData.desfavorabilidade > 0) {
        totalFavorabilidade += parseFloat(favorabilityData.favorabilidade);
        totalDesfavorabilidade += parseFloat(favorabilityData.desfavorabilidade);
        validQuestions++;
      }
    });
    
    return {
      pillar,
      average: data.scores.reduce((a, b) => a + b, 0) / data.scores.length || 0,
      count: data.total,
      favorabilidade: validQuestions > 0 ? (totalFavorabilidade / validQuestions).toFixed(1) : 0,
      desfavorabilidade: validQuestions > 0 ? (totalDesfavorabilidade / validQuestions).toFixed(1) : 0
    };
  });

  const questionStatsFinal = Object.entries(questionStats)
    .map(([qId, data]) => {
      const questionId = parseInt(qId);
      const favorabilityData = calculateFavorability(responses, questionId);
      
      return {
        question_id: questionId,
        average: data.scores.reduce((a, b) => a + b, 0) / data.scores.length || 0,
        count: data.total,
        comment_count: data.comments.length,
        favorabilidade: parseFloat(favorabilityData.favorabilidade),
        desfavorabilidade: parseFloat(favorabilityData.desfavorabilidade),
        distribuicao: favorabilityData.distribuicao
      };
    })
    .sort((a, b) => a.question_id - b.question_id);

  const bottlenecks = [...questionStatsFinal]
    .sort((a, b) => a.average - b.average)
    .slice(0, 3);

  const criticalAlerts = calculateCriticalAlerts(responses, questionStatsFinal);
  const engagementRate = calculateEngagementRate(responses, questionStatsFinal);
  
  // Calcular favorabilidade global usando todas as perguntas
  const allQuestionsFavorability = questionStatsFinal.map(q => q.favorabilidade || 0);
  const globalFavorability = allQuestionsFavorability.length > 0
    ? (allQuestionsFavorability.reduce((sum, f) => sum + f, 0) / allQuestionsFavorability.length).toFixed(1)
    : 0;

  return {
    totalResponses: totalCount,
    unitStats: unitStatsFinal,
    pillarStats: pillarStatsFinal,
    questionStats: questionStatsFinal,
    criticalAlerts,
    bottlenecks,
    engagementRate,
    globalFavorability: parseFloat(globalFavorability)
  };
}

// Calcular alertas críticos
function calculateCriticalAlerts(responses, questionStats) {
  return questionStats
    .filter(q => {
      const responsesWithQ = responses.filter(r => r.answers && r.answers[q.question_id]);
      const discordCount = responsesWithQ.filter(r => {
        const answer = r.answers[q.question_id];
        let score = typeof answer === 'object' ? answer.score : answer;
        // Para perguntas negativas, score 4 é crítico (após inversão vira 1)
        // Para perguntas normais, score 1 é crítico
        if (NEGATIVE_QUESTIONS.includes(q.question_id)) {
          score = invertScore(score);
        }
        return score === 1;
      }).length;
      return responsesWithQ.length > 0 && (discordCount / responsesWithQ.length) > 0.1;
    })
    .map(q => {
      const responsesWithQ = responses.filter(r => r.answers && r.answers[q.question_id]);
      const discordCount = responsesWithQ.filter(r => {
        const answer = r.answers[q.question_id];
        let score = typeof answer === 'object' ? answer.score : answer;
        if (NEGATIVE_QUESTIONS.includes(q.question_id)) {
          score = invertScore(score);
        }
        return score === 1;
      }).length;
      return {
        question_id: q.question_id,
        percentage_critical: responsesWithQ.length > 0 ? (discordCount / responsesWithQ.length) * 100 : 0
      };
    });
}

// Calcular taxa de engajamento
function calculateEngagementRate(responses, questionStats) {
  const totalPossibleComments = responses.length * 45;
  const actualComments = questionStats.reduce((sum, q) => sum + q.comment_count, 0);
  return totalPossibleComments > 0 ? (actualComments / totalPossibleComments) * 100 : 0;
}

// Buscar respostas formatadas para admin
export async function getAdminResponses(unitFilter = null) {
  const rows = await new Promise((resolve, reject) => {
    let query = 'SELECT * FROM survey_responses';
    const params = [];
    
    if (unitFilter && unitFilter !== 'all') {
      query += ' WHERE unidade = ?';
      params.push(unitFilter);
    }
    
    query += ' ORDER BY timestamp DESC';
    
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  return rows.map(row => {
    try {
      const answers = JSON.parse(row.answers || '{}');

      const formattedAnswers = Object.entries(answers).map(([id, data]) => {
        if (typeof data === 'object') {
          return {
            question_id: parseInt(id),
            score: data.score,
            comment: data.comment || '',
            unit: row.unidade
          };
        }
        return {
          question_id: parseInt(id),
          score: data,
          comment: '',
          unit: row.unidade
        };
      });

      return formattedAnswers;
    } catch (error) {
      return [];
    }
  }).flat();
}

// Helper para parse seguro de JSON
function safeParseJSON(jsonString, defaultValue) {
  try {
    return JSON.parse(jsonString || JSON.stringify(defaultValue));
  } catch {
    return defaultValue;
  }
}
