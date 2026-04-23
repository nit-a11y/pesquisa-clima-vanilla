# Como 2026 Calcula Satisfação - Metodologia de Cálculo

## Visão Geral

Este documento detalha a metodologia utilizada pelo sistema de Pesquisa de Clima Organizacional 2026 para calcular os índices de **satisfação** e **favorabilidade**.

---

## Conceitos Fundamentais

### Satisfação vs Favorabilidade

| Métrica | Definição | Cálculo |
|---------|-----------|---------|
| **Satisfação** | % de respostas positivas (Concordo + Concordo Muito) | `(Concordo + Concordo Muito) / Total × 100` |
| **Favorabilidade** | % de respostas positivas (Concordo + Concordo Muito) | `(score 3 + score 4) / Total × 100` |

> **Nota:** A partir de 23/04/2026, satisfação e favorabilidade usam a mesma fórmula (% de concordância), alinhando-se com a metodologia de 2025.

---

## Escala de Resposta

O sistema utiliza uma **escala Likert de 4 pontos**:

| Score | Label | Classificação |
|-------|-------|---------------|
| 4 | Concordo Muito | Positivo |
| 3 | Concordo | Positivo |
| 2 | Discordo | Negativo |
| 1 | Discordo Muito | Negativo |

### Lógica de Inversão

Para perguntas negativas (onde concordar é ruim), o sistema **inverte automaticamente** o score:

```javascript
// Pergunta negativa (ex: Q38 - Você já presenciou situações de assédio?)
if (isNegativeQuestion) {
  score = invertScore(score); // 1→4, 2→3, 3→2, 4→1
}
```

---

## Cálculo Detalhado

### 1. Favorabilidade por Pergunta

```javascript
// Fórmula
favorabilidade = ((count(3) + count(4)) / total_respostas) × 100

// Exemplo prático
// Respostas: 4,4,4,3,3,2,1,4,3,3 (10 respostas)
// Concordo Muito (4): 3
// Concordo (3): 4
// Discordo (2): 1
// Discordo Muito (1): 2

favorabilidade = ((3 + 4) / 10) × 100 = 70%
```

### 2. Satisfação por Pergunta (Média)

```javascript
// Fórmula
media = (soma_dos_scores) / total_respostas

// Exemplo
// Scores: 4,4,4,3,3,2,1,4,3,3
media = (4+4+4+3+3+2+1+4+3+3) / 10 = 3.1 / 10 = 3.1
```

### 3. Favorabilidade Global (Média dos Pilares)

```javascript
// Fórmula
globalFavorability = (favorabilidade_pilar_1 + favorabilidade_pilar_2 + ... + favorabilidade_pilar_N) / N

// Atual: 2026 = 88.4% de satisfação (ambos usam % de concordância)
```

### 4. Cálculo por Pilar

Cada pilar é calculado separadamente:

```javascript
// Para cada pilar:
const perguntasDoPilar = getQuestionsByPillar(pilar);
const mediaPilar = perguntasDoPilar.reduce((sum, q) => sum + q.media, 0) / perguntasDoPilar.length;
const favorabilidadePilar = perguntasDoPilar.reduce((sum, q) => sum + q.favorabilidade, 0) / perguntasDoPilar.length;
```

---

## Status por Faixa de Percentual

| Faixa | Status | Cor |
|-------|--------|-----|
| ≥ 75% | Excelente | 🟢 Verde |
| 50-74% | Bom/Atenção | 🟡 Amarelo |
| < 50% | Crítico | 🔴 Vermelho |

---

## Pilares Analisados (2026)

| Pilar | Satisfação | Status |
|-------|-----------|--------|
| Liderança | 93.3% | Excelente |
| Comprometimento | 93.0% | Excelente |
| Ambiente de Trabalho | 91.7% | Excelente |
| Gestão do Capital Humano | 84.6% | Bom |
| Trabalho em Equipe | 84.1% | Bom |
| Comunicação | 80.9% | Bom |

> **Nota:** Valores usam % de concordância (scores 3+4)

---

## Dados Globais 2026

| Métrica | Valor |
|---------|-------|
| Total Respondentes | 96 |
| Satisfação Geral | 88.4% |
| Favorabilidade Global | 88.4% |
| Total de Perguntas | 45 |

---

## Comparativo 2025 vs 2026 (Mesma Metodologia)

| Métrica | 2025 | 2026 | Variação |
|---------|------|------|----------|
| Satisfação | 82.83% | 88.4% | +5.57pp ✅ |
| Respondentes | 92 | 96 | +4.3% |

### Interpretação

- **Satisfação subiu** (+5.57pp): Melhoria real usando mesma metodologia
- **Conclusão**: Evolução positiva confirmeda com cálculo comparável

---

## Validação Matemática

### Verificação de Integridade

```javascript
// Cada pergunta:
concordo_muito + concordo + discordo + discordo_sempre = total_respostas

// Percentuais:
favorabilidade + desfavorabilidade = 100%
```

### Script de Verificação

```javascript
function verifyCalculation(pergunta) {
  const total = pergunta.concordo_muito + pergunta.concordo + 
                pergunta.discordo + pergunta.discordo_sempre;
  
  const favorabilidade = ((pergunta.concordo_muito + pergunta.concordo) / total) * 100;
  const desfavorabilidade = ((pergunta.discordo + pergunta.discordo_sempre) / total) * 100;
  
  return {
    valido: total === pergunta.total && Math.abs(favorabilidade + desfavorabilidade - 100) < 0.01,
    favorabilidade: favorabilidade.toFixed(2),
    desfavorabilidade: desfavorabilidade.toFixed(2)
  };
}
```

---

## Fontes de Dados

| Fonte | Descrição |
|-------|-----------|
| `backend/services/responseService.js` | Cálculo das estatísticas |
| `frontend/assets/js/dashboard-comparativo.js` | Exibição no dashboard |
| `pesquisa de clima/docs/methodologia-calculos.md` | Documentação original |

---

## Conclusão

O sistema de pesquisa de clima 2026 utiliza uma metodologia robusta e validada matematicamente para calcular:

1. **Satisfação/Favorabilidade**: Percentual de respostas positivas (escala 1-4: 3+4 = positivo)
2. **Global**: Média de todos os pilares

A partir de 23/04/2026, satisfação e favorabilidade são calculadas com a **mesma fórmula** (% de concordância), permitindo comparação direta com a pesquisa 2025.

---

**Última atualização:** 23/04/2026
**Versão:** 2.0.0