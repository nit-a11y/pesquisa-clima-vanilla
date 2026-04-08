/*
 * Dados compartilhados - perguntas e configurações
 */

const questions = [
  { id: 1, text: "O ambiente físico é agradável e adequado para trabalhar.", pillar: "Ambiente de Trabalho", isNegative: false },
  { id: 2, text: "Eu recebo os equipamentos e recursos necessários para realizar o meu trabalho.", pillar: "Ambiente de Trabalho", isNegative: false },
  { id: 3, text: "Este é um lugar agradável e possui um clima adequado para se trabalhar.", pillar: "Ambiente de Trabalho", isNegative: false },
  { id: 4, text: "As pessoas aqui estão dispostas a fazer um pouco além da sua obrigação para concluir um trabalho.", pillar: "Comprometimento Organizacional", isNegative: false },
  { id: 5, text: "Meu trabalho tem um sentido especial. Para mim, não é só 'mais um emprego'.", pillar: "Comprometimento Organizacional", isNegative: false },
  { id: 6, text: "Tenho orgulho de contar com as pessoas com quem trabalho aqui.", pillar: "Comprometimento Organizacional", isNegative: false },
  { id: 7, text: "Eu me sinto motivado e engajado com o meu trabalho na Nordeste Locações.", pillar: "Comprometimento Organizacional", isNegative: false },
  { id: 8, text: "Existem canais de comunicação bem definidos para que os colaboradores possam expressar suas sugestões e reivindicações.", pillar: "Comunicação", isNegative: false },
  { id: 9, text: "Quando faço uma sugestão ou reclamação, sinto que ela é ouvida e gera alguma ação.", pillar: "Comunicação", isNegative: false },
  { id: 10, text: "O seu líder lhe mantém informado sobre assuntos importantes e sobre mudanças na empresa.", pillar: "Comunicação", isNegative: false },
  { id: 11, text: "A empresa oferece treinamentos ou oportunidades de desenvolvimento para o meu crescimento profissional.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 12, text: "Você tem uma visão clara de para onde estamos indo (futuro da empresa) e como fazer para chegar lá.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 13, text: "A empresa demonstra reconhecimento pelo bom trabalho e pelo esforço extra.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 14, text: "As pessoas aqui nesta empresa são remuneradas adequadamente em relação a outras empresas do mesmo segmento de mercado.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 15, text: "Estou satisfeito com o pacote de benefícios que a empresa oferece.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 16, text: "Quando é contratado um funcionário novo, as pessoas fazem com que ele se sinta bem-vindo.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 17, text: "Eu me sinto à vontade na empresa, sem precisar fingir que sou outra pessoa.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 18, text: "As pessoas são encorajadas a equilibrar sua vida profissional e pessoal.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 19, text: "As pessoas aqui na empresa são bem tratadas independentemente da sua idade, cor, religião ou sexo.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 20, text: "Você alguma vez já foi humilhado pelo seu líder ou presenciou alguma humilhação.", pillar: "Gestão do Capital Humano", isNegative: true },
  { id: 21, text: "Nós sempre comemoramos as metas atingidas e os eventos especiais.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 22, text: "Sinto que sou valorizado aqui e que posso fazer a diferença.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 23, text: "Percebo um clima de rivalidade (competição interna) aqui.", pillar: "Gestão do Capital Humano", isNegative: true },
  { id: 24, text: "Pretendo trabalhar aqui ainda por muito tempo.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 25, text: "Existe um bom relacionamento entre as áreas da empresa.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 26, text: "Levando-se tudo em conta, eu diria que este é um excelente lugar para trabalhar.", pillar: "Gestão do Capital Humano", isNegative: false },
  { id: 27, text: "Você sabe com clareza quem é seu líder (superior imediato).", pillar: "Liderança", isNegative: false },
  { id: 28, text: "O seu líder (superior imediato) deixa claro o que ele espera do seu trabalho.", pillar: "Liderança", isNegative: false },
  { id: 29, text: "Seu líder demonstra comprometimento com o negócio, agindo com ética e honestidade na condução das atividades.", pillar: "Liderança", isNegative: false },
  { id: 30, text: "O seu líder demonstra interesse sincero por você como pessoa e não somente como empregado.", pillar: "Liderança", isNegative: false },
  { id: 31, text: "É fácil se aproximar do seu líder e é também fácil de falar com ele.", pillar: "Liderança", isNegative: false },
  { id: 32, text: "O seu líder treina as pessoas com o foco nas suas necessidades.", pillar: "Liderança", isNegative: false },
  { id: 33, text: "O seu líder reconhece os erros como oportunidades de aprendizado.", pillar: "Liderança", isNegative: false },
  { id: 34, text: "O seu líder demonstra interesse nas ideias e sugestões que você e seus companheiros apresentam e toma ações com base nelas.", pillar: "Liderança", isNegative: false },
  { id: 35, text: "O seu líder tem uma visão clara de para onde estamos indo (futuro da empresa) e o que fazer para chegar lá.", pillar: "Liderança", isNegative: false },
  { id: 36, text: "Seu líder confia no trabalho das pessoas e concede autonomia para a execução das atividades.", pillar: "Liderança", isNegative: false },
  { id: 37, text: "O seu líder envolve as pessoas em decisões que afetam atividades e seu ambiente de trabalho.", pillar: "Liderança", isNegative: false },
  { id: 38, text: "O seu líder trata todos da mesma forma, sem proteger ninguém.", pillar: "Liderança", isNegative: false },
  { id: 39, text: "O seu líder sabe coordenar pessoas e distribuir tarefas adequadamente.", pillar: "Liderança", isNegative: false },
  { id: 40, text: "O seu líder age de acordo com o que fala.", pillar: "Liderança", isNegative: false },
  { id: 41, text: "O seu líder dá feedback (crítica construtiva) sobre o desempenho do seu trabalho.", pillar: "Liderança", isNegative: false },
  { id: 42, text: "Pode-se contar com a colaboração das pessoas por aqui.", pillar: "Trabalho em Equipe", isNegative: false },
  { id: 43, text: "Aqui as pessoas se importam umas com as outras.", pillar: "Trabalho em Equipe", isNegative: false },
  { id: 44, text: "Existe um sentimento de equipe por aqui.", pillar: "Trabalho em Equipe", isNegative: false },
  { id: 45, text: "As pessoas fazem 'politicagem' (puxa saco) como forma de obter resultados.", pillar: "Trabalho em Equipe", isNegative: true }
];

const RATING_LABELS = ['Discordo muito', 'Discordo', 'Concordo', 'Concordo muito'];
const RATING_EMOJIS = ['😡', '😟', '😐', '🤩'];
const UNITS = ['Eusebio', 'Fortaleza', 'São Luis', 'Juazeiro do Norte'];
const NEGATIVE_QUESTIONS = [20, 23, 45];

const pillars = [...new Set(questions.map(q => q.pillar))];

function getPillarByQuestionId(qId) {
  const q = questions.find(qu => qu.id === qId);
  return q ? q.pillar : '';
}

// Agrupar perguntas por pilar
function getQuestionsByPillar() {
  const groups = {};
  pillars.forEach(pillar => {
    groups[pillar] = questions.filter(q => q.pillar === pillar);
  });
  return groups;
}

// Tornar variáveis globais para acesso entre scripts
window.questions = questions;
window.UNITS = UNITS;
window.pillars = pillars;
window.RATING_LABELS = RATING_LABELS;
window.RATING_EMOJIS = RATING_EMOJIS;
window.NEGATIVE_QUESTIONS = NEGATIVE_QUESTIONS;
window.getPillarByQuestionId = getPillarByQuestionId;
window.getQuestionsByPillar = getQuestionsByPillar;
