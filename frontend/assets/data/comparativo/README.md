# Análises Comparativas - Pesquisa de Clima 2025 vs 2026

## Estrutura de Arquivos

Esta pasta contém as análises comparativas detalhadas entre os dados da pesquisa de clima de 2025 e 2026.

### 📁 Arquivos Disponíveis

#### 1. `analise-2025.json`
- **Período:** Fevereiro/2025
- **Fonte:** `pesquisa de clima (dados de 2025 + analises)`
- **Respondentes:** 92 colaboradores
- **Satisfação Geral:** 82,83%
- **Status:** Positivo com áreas de melhoria

#### 2. `analise-2026.json`
- **Período:** Abril/2026
- **Fonte:** `frontend/assets/data/interface-ia`
- **Respondentes:** 96 colaboradores
- **Satisfação Geral:** 88.4%
- **Status:** Positivo com pontos críticos identificados

#### 3. `comparativo-2025-2026.json`
- **Tipo:** Análise comparativa completa
- **Conteúdo:** Variações, melhorias, pioras e insights estratégicos
- **Formato:** Estrutura detalhada para fácil interpretação
- **Nota:** A partir de 23/04/2026, satisfação usa % de concordância (mesma metodologia que 2025)

## 📊 Principais Descobertas

### 🚀 Melhorias Significativas (2025 → 2026)

1. **Liderança:** 85% → 93.3% (+8.3pp)
   - Tornou-se o pilar mais forte da organização
   - Clareza sobre líder (99.0%)
   - Ética e honestidade (97.9%)

2. **Comunicação:** 68% → 80.9% (+12.9pp)
   - Saiu da zona crítica
   - Canais mais definidos (67.7% vs 55.43%)
   - Maior transparência

3. **Comprometimento:** 85% → 93.0% (+8.0pp)
   - Engajamento mantido e fortalecido
   - Segundo pilar mais forte

4. **Satisfação Geral:** 82.83% → 88.4% (+5.57pp)
   - Usando mesma metodologia de 2025 (% de concordância)
   - Evolução real confirmada

### ⚠️ Novos Problemas Críticos (2026)

1. **Benefícios:** 58.3% (CRÍTICO)
   - 64 comentários negativos
   - Principal fonte de insatisfação
   - Impacto direto no turnover

2. **Remuneração:** 59.4% (ALTA)
   - Abaixo do mercado
   - Risco de perda de talentos

3. **Assédio:** 9.38% (CRÍTICO)
   - ~9 pessoas afetadas
   - Risco legal e cultural
   - Requer ação imediata

### 📈 Insights Estratégicos

1. **Maturidade Organizacional:**
   - 2025: Problemas genéricos ("comunicação ruim")
   - 2026: Problemas específicos ("benefícios insuficientes")
   - Maior precisão no diagnóstico

2. **Evolução Positiva Confirmada:**
   - Satisfação: 82.83% → 88.4% (+5.57pp)
   - Mesma metodologia de cálculo
   - Colaboradores mais engajados

3. **Força da Liderança:**
   - Evoluiu de Bom para Excelente
   - Base sólida para implementação de mudanças
   - Principal ativo da organização

## 🎯 Plano de Ação Integrado

### Ações Imediatas (0-30 dias)
1. **Assédio:** Investigação imediata dos casos reportados
2. **Benefícios:** Revisão completa considerando inflação

### Ações Curto Prazo (30-90 dias)
1. **Remuneração:** Análise salarial de mercado
2. **Politicagem:** Programa cultural anti-politicagem

### Ações Médio Prazo (90-180 dias)
1. **Manutenção:** Fortalecer pilares que melhoraram
2. **Monitoramento:** Acompanhamento contínuo

## 🔍 Como Usar os Dados

### Para Análise Detalhada:
```javascript
// Carregar dados comparativos
const comparativo = await fetch('/assets/data/comparativo/comparativo-2025-2026.json');
const dados = await comparativo.json();

// Acessar melhorias
console.log(dados.analise_melhorias);

// Acessar pioras
console.log(dados.analise_pioras);

// Acessar plano de ação
console.log(dados.plano_acao_integrado);
```

### Para Relatórios:
- Use `analise-2025.json` para contexto histórico
- Use `analise-2026.json` para situação atual
- Use `comparativo-2025-2026.json` para análise completa

## 📋 Estrutura dos Dados

### Metadados Padronizados:
```json
{
  "metadata": {
    "ano": "2025|2026",
    "fonte": "caminho/do/arquivo",
    "data_analise": "DD/MM/YYYY",
    "total_respondentes": 0,
    "versao": "1.0.0"
  }
}
```

### Pilares:
```json
{
  "nome": "Nome do Pilar",
  "satisfacao": "XX.X%",
  "status": "Excelente|Bom|Atenção|Crítico",
  "variacao_vs_2025": "+X.Xpp",
  "destaques": ["ponto 1", "ponto 2"]
}
```

## 🚨 Alertas Críticos

1. **Assédio (9.38%):** Requer ação imediata
2. **Benefícios (58.3%):** Principal fonte de insatisfação
3. **Remuneração (59.4%):** Risco competitivo

## 📈 Projeções Futuras

### Cenários Possíveis (12 meses):
- **Otimista:** Satisfação > 85%, Benefícios > 80%
- **Realista:** Satisfação ~80%, Benefícios ~70%
- **Pessimista:** Satisfação < 75%, Turnover > 15%

## 🔄 Atualizações

### Versão 1.0.0 (23/04/2026)
- Criação das análises separadas
- Geração do comparativo completo
- Identificação de insights estratégicos

### Próximas Versões:
- Inclusão de dados qualitativos detalhados
- Análise de tendências por setor
- Projeções mais precisas baseadas em ações

## 💡 Dicas para Uso

1. **Foco no Presente:** Dados de 2026 são mais relevantes para ações imediatas
2. **Contexto Histórico:** Use 2025 para entender evolução
3. **Comparativo:** Use arquivo comparativo para análise completa
4. **Ações Priorizadas:** Foco em Assédio e Benefícios primeiro

## 📞 Suporte

Para dúvidas sobre os dados ou análises:
- Verificar estrutura dos arquivos JSON
- Consultar documentação de cada período
- Usar insights estratégicos para tomada de decisão
