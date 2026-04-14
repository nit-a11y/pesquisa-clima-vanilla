/*
 * Dados da versão DEMONSTRATIVA - apenas 3 perguntas para tutorial
 * 2 perguntas normais + 1 pergunta invertida
 */

const questions = [
  { id: 1, text: "Você gosta de pizza aos domingos?", pillar: "Preferências Pessoais", isNegative: false },
  { id: 2, text: "A cor azul transmite tranquilidade.", pillar: "Percepção Visual", isNegative: false },
  { id: 3, text: "Você gosta de trabalhar todos os domingos sem folga.", pillar: "Qualidade de Vida", isNegative: true }
];

const RATING_LABELS = ['Discordo muito', 'Discordo', 'Concordo', 'Concordo muito'];
const RATING_EMOJIS = ['😡', '😟', '😐', '🤩'];
const UNITS = ['Eusebio', 'Fortaleza', 'São Luis', 'Juazeiro do Norte'];
const NEGATIVE_QUESTIONS = [3];

const pillars = [...new Set(questions.map(q => q.pillar))];

function getPillarByQuestionId(qId) {
  const q = questions.find(qu => qu.id === qId);
  return q ? q.pillar : '';
}

function getQuestionsByPillar() {
  const groups = {};
  pillars.forEach(pillar => {
    groups[pillar] = questions.filter(q => q.pillar === pillar);
  });
  return groups;
}

window.questions = questions;
window.UNITS = UNITS;
window.pillars = pillars;
window.RATING_LABELS = RATING_LABELS;
window.RATING_EMOJIS = RATING_EMOJIS;
window.NEGATIVE_QUESTIONS = NEGATIVE_QUESTIONS;
window.getPillarByQuestionId = getPillarByQuestionId;
window.getQuestionsByPillar = getQuestionsByPillar;
