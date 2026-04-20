# Documentação Completa - Pesquisa de Clima Organizacional

## Visão Geral

Este documento contém toda a documentação do projeto de Pesquisa de Clima Organizacional da Nordeste Locações, incluindo configurações, arquitetura, deploy e manutenção.

## Estrutura da Documentação

### 1. **Configurações de Infraestrutura**
- [Configuração VPS](#configuração-vps)
- [Configuração GitHub](#configuração-github)
- [Chaves e APIs de IA](#chaves-e-apis-de-ia)

### 2. **Arquitetura do Sistema**
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [APIs e Endpoints](#apis-e-endpoints)
- [Frontend](#frontend)

### 3. **Funcionalidades**
- [Sistema de Pesquisa](#sistema-de-pesquisa)
- [Dashboard Administrativo](#dashboard-administrativo)
- [Chat IA Inteligente](#chat-ia-inteligente)
- [Relatórios Avançados](#relatórios-avançados)

### 4. **Deploy e Manutenção**
- [Guia de Deploy](#guia-de-deploy)
- [Manutenção do Sistema](#manutenção-do-sistema)
- [Backup e Recuperação](#backup-e-recuperação)

### 5. **Troubleshooting**
- [Erros Comuns](#erros-comuns)
- [Soluções Rápidas](#soluções-rápidas)
- [Logs e Monitoramento](#logs-e-monitoramento)

---

## Configuração VPS

### Servidor Ubuntu
- **Provedor**: DigitalOcean / AWS / Outro
- **SO**: Ubuntu 22.04 LTS
- **RAM**: 2GB+ recomendado
- **Storage**: 20GB+ SSD
- **Node.js**: v18+
- **PM2**: Gerenciador de processos

### Configuração Básica
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx (opcional)
sudo apt install nginx -y
```

### Variáveis de Ambiente
```bash
# .env
OPENROUTER_API_KEY=sk-or-v1-SUA_CHAVE_AQUI
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-oss-120b:free
PORT=3001
NODE_ENV=production
```

### Configuração PM2
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'pesquisa-clima',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

---

## Configuração GitHub

### Repositório
- **Nome**: `pesquisa-declima-nitai`
- **Branch Principal**: `main`
- **Branch de Desenvolvimento**: `develop`

### Fluxo de Trabalho Git
```bash
# Clonar repositório
git clone https://github.com/SEU_USER/pesquisa-declima-nitai.git
cd pesquisa-declima-nitai

# Criar branch de feature
git checkout -b feature/nova-funcionalidade

# Commit e push
git add .
git commit -m "feat: adicionar nova funcionalidade"
git push origin feature/nova-funcionalidade

# Merge para main
git checkout main
git merge feature/nova-funcionalidade
git push origin main
```

### GitHub Actions (Opcional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.4
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/project
          git pull origin main
          npm install
          pm2 restart pesquisa-clima
```

---

## Chaves e APIs de IA

### OpenRouter API
- **URL Base**: https://openrouter.ai/api/v1
- **Modelo Principal**: `openai/gpt-oss-120b:free`
- **Modelo Alternativo**: `anthropic/claude-3-haiku`
- **Rate Limit**: 1000 requests/dia (free tier)

### Configuração das Chaves
```javascript
// backend/services/ai.service.js
const openRouterConfig = {
  apiKey: process.env.OPENROUTER_API_KEY,
  baseUrl: process.env.OPENROUTER_BASE_URL,
  model: process.env.OPENROUTER_MODEL,
  headers: {
    'HTTP-Referer': 'https://nordeste-locacoes.com.br',
    'X-Title': 'Pesquisa de Clima Organizacional'
  }
};
```

### Segurança das Chaves
- Nunca commitar chaves no repositório
- Usar variáveis de ambiente
- Rotacionar chaves periodicamente
- Monitorar uso e rate limits

---

## Estrutura do Projeto

```
pesquisadeclimanl/
|-- backend/
|   |-- controllers/
|   |   |-- clima.controller.js
|   |   |-- chat.controller.js
|   |   |-- survey.controller.js
|   |-- services/
|   |   |-- ai.service.js
|   |   |-- chat.service.js
|   |   |-- responseService.js
|   |-- routes/
|   |   |-- clima.routes.js
|   |   |-- chat.routes.js
|   |   |-- survey.routes.js
|   |-- database/
|   |   |-- connection.js
|   |   |-- schema.sql
|   |-- middleware/
|   |-- utils/
|-- frontend/
|   |-- assets/
|   |   |-- css/
|   |   |   |-- styles.css
|   |   |-- js/
|   |   |   |-- app.js
|   |   |   |-- views/
|   |   |-- images/
|   |-- index.html
|-- shared/
|   |-- constants.js
|   |-- types.js
|-- docs/
|   |-- GUIA_DEPLOY_VPS.md
|   |-- OBSIDIAN_DOCUMENTATION.md
|-- .env
|-- package.json
|-- server.js
|-- ecosystem.config.js
```

---

## Banco de Dados

### SQLite Schema
```sql
-- survey_responses
CREATE TABLE survey_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unidade TEXT NOT NULL,
    answers TEXT NOT NULL, -- JSON
    comments TEXT, -- JSON
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Estrutura de Dados
```javascript
// answers JSON structure
{
  "1": { "score": 4, "comment": "Comentário opcional" },
  "2": { "score": 3, "comment": "" },
  // ... 45 perguntas
}

// comments JSON structure
{
  "1": "Comentário da pergunta 1",
  "5": "Comentário da pergunta 5"
}
```

---

## APIs e Endpoints

### Endpoints Principais
```javascript
// Pesquisa
POST /api/survey/submit          // Enviar resposta
GET  /api/survey/questions       // Obter perguntas
GET  /api/survey/stats          // Estatísticas básicas

// Clima Organizacional
GET  /api/clima/stats           // Estatísticas completas
POST /api/clima/relatorio       // Gerar relatório IA
GET  /api/clima/export          // Exportar dados

// Chat IA
POST /api/chat/iniciar          // Iniciar sessão
POST /api/chat/inicializar-contexto  // Carregar contexto
POST /api/chat/enviar           // Enviar mensagem
POST /api/chat/analise-visual   // Gerar análise visual
GET  /api/chat/estatisticas     // Estatísticas do chat
DELETE /api/chat/contexto       // Limpar contexto
```

---

## Frontend

### Tecnologias
- **HTML5**: Semântico e acessível
- **CSS3**: Moderno com Grid e Flexbox
- **JavaScript ES6+**: Vanilla, modular
- **Design System**: Cores da Nordeste Locações

### Componentes Principais
```javascript
// Views
- AdminView.js          // Dashboard administrativo
- SurveyView.js         // Formulário de pesquisa
- LoginView.js          // Autenticação

// Componentes
- ChatWidget.js         // Chat flutuante IA
- ReportCard.js         // Cards de relatórios
- StatsDashboard.js     // Dashboard de estatísticas
```

### Estilos CSS
```css
/* Cores Principais */
--primary-red: #dc2626;
--primary-dark: #991b1b;
--secondary-blue: #3b82f6;
--success-green: #10b981;
--warning-yellow: #f59e0b;
```

---

## Sistema de Pesquisa

### Estrutura das Perguntas
```javascript
// 45 perguntas divididas em 6 pilares
const pillars = {
  'Ambiente de Trabalho': [1, 2, 3],
  'Comprometimento Organizacional': [4, 5, 6, 7],
  'Comunicação': [8, 9],
  'Gestão de Pessoas': [10, 11, 12, 13, 14, 15],
  'Liderança': [16, 17, 18, 19, 20, 21, 22, 23, 24],
  'Trabalho em Equipe': [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
};
```

### Perguntas Invertidas
```javascript
// Perguntas que precisam de inversão de score
const NEGATIVE_QUESTIONS = [20, 23, 45];

// Função de inversão
function invertScore(score) {
  return 5 - score; // 1->4, 2->3, 3->2, 4->1
}
```

---

## Dashboard Administrativo

### Funcionalidades
- **Estatísticas em Tempo Real**: Favorabilidade, médias, distribuições
- **Heatmap por Pilar**: Visualização colorida por dimensão
- **Rankings**: Top melhores e piores perguntas
- **Comentários Qualitativos**: Análise de feedbacks
- **Exportação**: CSV, PDF, JSON

### Cálculos de Métricas
```javascript
// Favorabilidade
const favorabilidade = ((concordo_muito + concordo) / total) * 100;

// Média Geral
const media = soma_scores / total_respostas;

// Distribuição Likert
const distribuicao = {
  1: (discordo_totalmente / total) * 100,
  2: (discordo / total) * 100,
  3: (concordo / total) * 100,
  4: (concordo_totalmente / total) * 100
};
```

---

## Chat IA Inteligente

### Funcionalidades Avançadas
- **Contexto Completo**: Acesso a todos os dados do dashboard
- **Análise Inteligente**: Insights baseados em dados reais
- **Geração de Relatórios**: Relatórios executivos com IA
- **Análise Visual**: Geração de SVGs e gráficos
- **Memória de Contexto**: Conversação contínua

### Estrutura do Contexto
```javascript
const contextData = {
  dados_gerais: {
    clima_geral: 85.5,
    total_respostas: 150,
    data_analise: "20/04/2026"
  },
  dimensoes: [
    { nome: "Liderança", favorabilidade: 88.2, media: 3.8 },
    // ... outras dimensões
  ],
  dashboard_completo: {
    estatisticas_gerais: { ... },
    heatmap_pilares: [ ... ],
    rankings: { ... },
    comentarios_qualitativos: [ ... ]
  }
};
```

---

## Relatórios Avançados

### Tipos de Relatórios
- **Relatório Executivo**: Resumo estratégico para diretoria
- **Relatório Detalhado**: Análise completa por dimensão
- **Relatório de Ações**: Recomendações acionáveis
- **Relatório Visual**: Gráficos e infográficos

### Estrutura do Relatório IA
```markdown
# Relatório de Clima Organizacional

## Resumo Estratégico
[Análise de 3-4 parágrafos com visão holística]

## Indicadores Chave
- NPS: [valor]
- Índice de Retenção: [valor]
- Maturidade Organizacional: [valor]

## Análise por Dimensão
### Liderança
- Favorabilidade: [valor]%
- Status: [Ótimo/Atenção/Crítico]
- Insights: [análise detalhada]

## Recomendações Estratégicas
### Imediato (0-30 dias)
1. [ação específica com KPI]

### Curto Prazo (1-3 meses)
1. [ação estruturante]

### Médio Prazo (3-6 meses)
1. [projeto transformador]

## Pesquisas e Referências
[2-3 estudos acadêmicos relevantes]
```

---

## Guia de Deploy

### Deploy Automatizado
```bash
#!/bin/bash
# deploy.sh

echo "Iniciando deploy..."

# 1. Backup do banco
cp database.db database_backup_$(date +%Y%m%d_%H%M%S).db

# 2. Pull do código
git pull origin main

# 3. Instalar dependências
npm install --production

# 4. Reiniciar aplicação
pm2 restart pesquisa-clima

# 5. Verificar status
pm2 status

echo "Deploy concluído!"
```

### Deploy Manual
```bash
# 1. Acessar servidor
ssh usuario@servidor

# 2. Navegar até o projeto
cd /path/to/pesquisadeclimanl

# 3. Atualizar código
git pull origin main

# 4. Instalar dependências
npm install --production

# 5. Reiniciar PM2
pm2 restart pesquisa-clima

# 6. Verificar logs
pm2 logs pesquisa-clima
```

---

## Manutenção do Sistema

### Tarefas Semanais
- [ ] Verificar logs de erros
- [ ] Monitorar uso de API da IA
- [ ] Backup automático do banco
- [ ] Verificar performance do sistema

### Tarefas Mensais
- [ ] Atualizar dependências
- [ ] Rotacionar chaves de API
- [ ] Analisar métricas de uso
- [ ] Otimizar performance

### Tarefas Trimestrais
- [ ] Backup completo do sistema
- [ ] Revisão de segurança
- [ ] Atualização de documentação
- [ ] Planejamento de melhorias

---

## Backup e Recuperação

### Backup Automático
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups"

# Backup do banco
cp database.db $BACKUP_DIR/database_$DATE.db

# Backup dos arquivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  .

# Limpar backups antigos (manter últimos 30 dias)
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### Recuperação
```bash
# Restaurar banco
cp backup/database_20260420_120000.db database.db

# Restaurar arquivos
tar -xzf backup/files_20260420_120000.tar.gz

# Reiniciar sistema
pm2 restart pesquisa-clima
```

---

## Erros Comuns

### Erro 500 Internal Server Error
**Causa**: Problema de importação ou configuração
**Solução**:
```bash
# Verificar logs
pm2 logs pesquisa-clima

# Verificar variáveis de ambiente
printenv | grep OPENROUTER

# Reiniciar sistema
pm2 restart pesquisa-clima
```

### Rate Limit Exceeded
**Causa**: Limite diário da API da IA atingido
**Solução**:
- Aguardar reset diário (meia-noite UTC)
- Upgrade plano OpenRouter
- Implementar cache de respostas

### Conexão Banco Dados
**Causa**: Permissões ou caminho incorreto
**Solução**:
```bash
# Verificar permissões
ls -la database.db

# Verificar caminho
pwd && find . -name "*.db"
```

---

## Soluções Rápidas

### Reset do Sistema
```bash
# Reset completo
pm2 delete pesquisa-clima
pm2 start ecosystem.config.js
```

### Limpeza de Cache
```bash
# Limpar cache Node.js
rm -rf node_modules
npm install

# Limpar cache PM2
pm2 reloadLogs
```

### Debug Mode
```bash
# Iniciar modo debug
DEBUG=* npm start

# Verificar variáveis
node -e "console.log(process.env)"
```

---

## Logs e Monitoramento

### Logs PM2
```bash
# Ver todos os logs
pm2 logs

# Logs específicos
pm2 logs pesquisa-clima

# Logs em tempo real
pm2 logs --lines 100
```

### Monitoramento de Performance
```bash
# Status dos processos
pm2 status

# Monitoramento em tempo real
pm2 monit

# Restart automático
pm2 startup
pm2 save
```

### Métricas Importantes
- Uso de CPU: < 70%
- Uso de RAM: < 80%
- Response time: < 2s
- Uptime: > 99%

---

## Contatos e Suporte

### Equipe Técnica
- **Desenvolvedor**: [Nome/Contato]
- **DevOps**: [Nome/Contato]
- **Suporte**: [Nome/Contato]

### Links Úteis
- [Repositório GitHub](https://github.com/SEU_USER/pesquisa-declima-nitai)
- [Documentação OpenRouter](https://openrouter.ai/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Node.js Docs](https://nodejs.org/docs/)

### Emergências
- **Servidor Down**: Verificar PM2 status
- **API IA Error**: Verificar chave e rate limit
- **Banco Corrompido**: Restaurar backup mais recente

---

*Última atualização: 20/04/2026*
*Versão: 2.0.0*
