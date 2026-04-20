# Arquitetura e Estrutura - Pesquisa de Clima Organizacional

## Overview
Arquitetura completa do sistema de pesquisa de clima organizacional, incluindo estrutura de pastas, padrões de design e fluxos de dados.

## Arquitetura Geral

### 1. Stack Tecnológico
```
Frontend (Vanilla JS)
    |
    | HTTP/REST APIs
    v
Backend (Node.js + Express)
    |
    | SQLite Database
    v
Database (SQLite3)
    |
    | External APIs
    v
OpenRouter AI Services
```

### 2. Camadas da Arquitetura
```
+-------------------+
|   Presentation    |  (Frontend - HTML/CSS/JS)
+-------------------+
|   Application     |  (APIs - Controllers/Routes)
+-------------------+
|    Business       |  (Services - Lógica de Negócio)
+-------------------+
|      Data         |  (Database - SQLite)
+-------------------+
|   External APIs   |  (OpenRouter AI)
+-------------------+
```

## Estrutura de Pastas Detalhada

```
pesquisadeclimanl/
|
|-- .github/                    # Configurações GitHub
|   |-- workflows/              # GitHub Actions
|   |-- ISSUE_TEMPLATE/         # Templates de issues
|   |-- PULL_REQUEST_TEMPLATE.md
|
|-- backend/                     # Backend Node.js
|   |-- controllers/            # Controladores de API
|   |   |-- clima.controller.js     # Clima organizacional
|   |   |-- chat.controller.js      # Chat IA
|   |   |-- survey.controller.js    # Pesquisa
|   |
|   |-- services/               # Serviços de negócio
|   |   |-- ai.service.js           # Integração IA
|   |   |-- chat.service.js         # Lógica do chat
|   |   |-- responseService.js      # Processamento de dados
|   |
|   |-- routes/                 # Definição de rotas
|   |   |-- clima.routes.js         # Rotas de clima
|   |   |-- chat.routes.js          # Rotas do chat
|   |   |-- survey.routes.js       # Rotas da pesquisa
|   |
|   |-- database/               # Configurações do banco
|   |   |-- connection.js            # Conexão SQLite
|   |   |-- schema.sql               # Estrutura do banco
|   |
|   |-- middleware/             # Middlewares
|   |   |-- auth.js                  # Autenticação
|   |   |-- validation.js            # Validação
|   |   |-- errorHandler.js          # Tratamento de erros
|   |
|   |-- utils/                  # Utilitários
|   |   |-- logger.js                # Logging
|   |   |-- helpers.js               # Funções auxiliares
|   |   |-- constants.js              # Constantes do backend
|
|-- frontend/                   # Frontend Vanilla JS
|   |-- assets/                 # Recursos estáticos
|   |   |-- css/                     # Estilos
|   |   |   |-- styles.css            # CSS principal
|   |   |   |-- components.css        # CSS de componentes
|   |   |   |-- responsive.css        # CSS responsivo
|   |
|   |   |-- js/                      # JavaScript
|   |   |   |-- app.js                 # Aplicação principal
|   |   |   |-- views/                 # Views do sistema
|   |   |   |   |-- AdminView.js       # Dashboard admin
|   |   |   |   |-- SurveyView.js      # Formulário pesquisa
|   |   |   |   |-- LoginView.js       # Login
|   |   |   |-- components/            # Componentes JS
|   |   |   |   |-- ChatWidget.js      # Chat flutuante
|   |   |   |   |-- ReportCard.js      # Cards de relatório
|   |   |   |   |-- StatsDashboard.js  # Dashboard de stats
|   |   |   |   |-- Modal.js           # Modais
|   |   |   |-- utils/                 # Utilitários frontend
|   |   |   |   |-- api.js              # Cliente API
|   |   |   |   |-- validators.js       # Validação frontend
|   |   |   |   |-- helpers.js          # Helpers
|   |
|   |   |-- images/                  # Imagens e ícones
|   |   |   |-- logo.png               # Logo da empresa
|   |   |   |-- icons/                 # Ícones do sistema
|   |   |   |-- backgrounds/           # Imagens de fundo
|   |
|   |-- index.html               # Página principal
|   |-- login.html               # Página de login
|   |-- survey.html              # Página da pesquisa
|
|-- shared/                      # Recursos compartilhados
|   |-- constants.js             # Constantes globais
|   |-- types.js                 # Tipos/interfaces
|   |-- utils.js                 # Utilitários compartilhados
|
|-- docs/                        # Documentação
|   |-- GUIA_DEPLOY_VPS.md       # Guia de deploy
|   |-- API.md                   # Documentação da API
|   |-- CHANGELOG.md             # Histórico de mudanças
|
|-- tests/                       # Testes
|   |-- unit/                    # Testes unitários
|   |-- integration/             # Testes de integração
|   |-- e2e/                     # Testes end-to-end
|
|-- scripts/                     # Scripts de automação
|   |-- deploy.sh                # Script de deploy
|   |-- backup.sh                # Script de backup
|   |-- setup.sh                 # Script de setup inicial
|
|-- .env                         # Variáveis de ambiente
|-- .env.example                 # Exemplo de .env
|-- .gitignore                   # Arquivos ignorados pelo Git
|-- package.json                 # Dependências do projeto
|-- server.js                    # Servidor principal
|-- ecosystem.config.js          # Configuração PM2
|-- README.md                    # Documentação do projeto
|
|-- database.db                  # Banco de dados SQLite
|-- logs/                        # Logs da aplicação
|   |-- app.log                  # Logs gerais
|   |-- error.log                # Logs de erro
|   |-- access.log               # Logs de acesso
```

## Componentes Principais

### 1. Backend - Controllers

#### clima.controller.js
```javascript
// Responsável por: Estatísticas de clima, relatórios, análises
// Principais funções:
- getAdminStats()           // Estatísticas completas
- gerarRelatorioCompleto()  // Relatório com IA
- exportarDados()          // Exportação CSV/PDF
- getHeatmapData()         // Dados para heatmap
```

#### chat.controller.js
```javascript
// Responsável por: Chat IA, contexto, mensagens
// Principais funções:
- iniciarChat()             // Iniciar sessão
- inicializarContexto()     // Carregar contexto
- enviarMensagem()         // Enviar mensagem para IA
- gerarAnaliseVisual()     // Gerar SVG
- limparContexto()          // Limpar contexto
```

#### survey.controller.js
```javascript
// Responsável por: Formulário de pesquisa, validação
// Principais funções:
- getQuestions()           // Obter perguntas
- submitResponse()         // Enviar resposta
- validateResponse()        // Validar resposta
- getSurveyProgress()       // Progresso da pesquisa
```

### 2. Backend - Services

#### ai.service.js
```javascript
// Responsável por: Integração com OpenRouter API
// Principais funções:
- gerarAnaliseClima()       // Análise com IA
- gerarRespostaChat()       // Resposta do chat
- estruturarDadosParaIA()   // Formatar dados para IA
- handleRateLimit()         // Tratar rate limits
```

#### chat.service.js
```javascript
// Responsável por: Lógica do chat, contexto
// Principais funções:
- sendMessageToAI()         // Enviar mensagem
- processAIResponse()       // Processar resposta
- initializeChatContext()   // Inicializar contexto
- getDashboardCompleteData() // Obter dados completos
```

#### responseService.js
```javascript
// Responsável por: Processamento de respostas
// Principais funções:
- getAllResponses()         // Obter todas respostas
- getAdminStats()           // Calcular estatísticas
- calculateStats()          // Calcular métricas
- calculateFavorability()   // Calcular favorabilidade
```

### 3. Frontend - Views

#### AdminView.js
```javascript
// Responsável por: Dashboard administrativo
// Principais componentes:
- Estatísticas gerais
- Heatmap por pilar
- Rankings de perguntas
- Cards de relatório
- Exportação de dados
```

#### SurveyView.js
```javascript
// Responsável por: Formulário de pesquisa
// Principais componentes:
- Formulário de 45 perguntas
- Barra de progresso
- Validação em tempo real
- Salvar rascunho
- Submissão de resposta
```

#### ChatWidget.js
```javascript
// Responsável por: Chat flutuante IA
// Principais componentes:
- Widget redimensionável
- Contexto automático
- Histórico de conversa
- Geração de SVG
- Indicadores visuais
```

## Fluxos de Dados

### 1. Fluxo de Pesquisa
```
Usuário preenche formulário
    |
    v
Frontend valida dados
    |
    v
POST /api/survey/submit
    |
    v
survey.controller.js
    |
    v
responseService.js
    |
    v
SQLite Database
```

### 2. Fluxo de Relatório IA
```
Usuário clica em "Gerar Relatório"
    |
    v
POST /api/clima/relatorio
    |
    v
clima.controller.js
    |
    v
responseService.js (getAdminStats)
    |
    v
ai.service.js (gerarAnaliseClima)
    |
    v
OpenRouter API
    |
    v
Resposta processada
    |
    v
Frontend exibe relatório
```

### 3. Fluxo do Chat IA
```
Usuário abre chat
    |
    v
POST /api/chat/inicializar-contexto
    |
    v
chat.controller.js
    |
    v
chat.service.js (getDashboardCompleteData)
    |
    v
Contexto carregado com dados completos
    |
    v
Usuário envia mensagem
    |
    v
POST /api/chat/enviar
    |
    v
chat.service.js (sendMessageToAI)
    |
    v
OpenRouter API
    |
    v
Resposta com contexto completo
```

## Padrões de Design

### 1. MVC Pattern
```javascript
// Model (Services + Database)
class ResponseService {
  async getAdminStats() { /* lógica de negócio */ }
}

// View (Frontend)
function renderAdminView(data) { /* renderização */ }

// Controller (Controllers)
class ClimaController {
  async getStats(req, res) { /* orquestração */ }
}
```

### 2. Repository Pattern
```javascript
// Abstração do banco de dados
class SurveyRepository {
  async save(response) {
    return new Promise((resolve, reject) => {
      db.run(/* SQL */, params, (err) => {
        if (err) reject(err);
        else resolve(/* result */);
      });
    });
  }
}
```

### 3. Service Layer Pattern
```javascript
// Camada de serviço com lógica de negócio
class ClimaService {
  constructor(repository) {
    this.repository = repository;
  }
  
  async generateReport() {
    const data = await this.repository.getStats();
    return this.processData(data);
  }
}
```

### 4. Factory Pattern
```javascript
// Fábrica de respostas da IA
class ResponseFactory {
  static create(type, data) {
    switch(type) {
      case 'report':
        return new ReportResponse(data);
      case 'chat':
        return new ChatResponse(data);
      case 'visual':
        return new VisualResponse(data);
    }
  }
}
```

## Configurações de Ambiente

### 1. Desenvolvimento
```env
NODE_ENV=development
PORT=3001
OPENROUTER_API_KEY=sk-or-v1-dev-key
OPENROUTER_MODEL=openai/gpt-oss-120b:free
DB_PATH=./database_dev.db
LOG_LEVEL=debug
```

### 2. Produção
```env
NODE_ENV=production
PORT=3001
OPENROUTER_API_KEY=sk-or-v1-prod-key
OPENROUTER_MODEL=openai/gpt-oss-120b:free
DB_PATH=./database.db
LOG_LEVEL=info
```

### 3. Testes
```env
NODE_ENV=test
PORT=3002
OPENROUTER_API_KEY=test-key
OPENROUTER_MODEL=test-model
DB_PATH=./database_test.db
LOG_LEVEL=error
```

## Segurança

### 1. Autenticação
```javascript
// Middleware de autenticação
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
}
```

### 2. Validação de Input
```javascript
// Middleware de validação
function validateSurvey(req, res, next) {
  const { answers, unit } = req.body;
  
  if (!answers || !unit) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  
  if (Object.keys(answers).length !== 45) {
    return res.status(400).json({ error: 'Resposta incompleta' });
  }
  
  next();
}
```

### 3. Rate Limiting
```javascript
// Rate limiting para APIs
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests
  message: 'Muitas requisições, tente novamente mais tarde'
});

app.use('/api/', limiter);
```

## Performance

### 1. Caching
```javascript
// Cache de respostas da IA
const cache = new Map();

function getCachedResponse(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < 3600000) {
    return cached.value;
  }
  return null;
}
```

### 2. Database Optimization
```sql
-- Índices para performance
CREATE INDEX idx_survey_timestamp ON survey_responses(timestamp);
CREATE INDEX idx_survey_unit ON survey_responses(unidade);
CREATE INDEX idx_answers_question_id ON survey_responses(json_extract(answers, '$.*'));
```

### 3. Lazy Loading
```javascript
// Carregar componentes sob demanda
async function loadComponent(componentName) {
  const module = await import(`./views/${componentName}.js`);
  return module.default;
}
```

## Monitoramento

### 1. Logging
```javascript
// Sistema de logging
const logger = {
  info: (message, meta) => console.log(`[INFO] ${message}`, meta),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
  warn: (message, meta) => console.warn(`[WARN] ${message}`, meta)
};
```

### 2. Metrics
```javascript
// Coleta de métricas
const metrics = {
  requests: 0,
  errors: 0,
  responseTime: [],
  
  trackRequest(duration) {
    this.requests++;
    this.responseTime.push(duration);
  },
  
  trackError() {
    this.errors++;
  }
};
```

### 3. Health Check
```javascript
// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});
```

## Escalabilidade

### 1. Horizontal Scaling
```javascript
// Configuração PM2 para múltiplas instâncias
module.exports = {
  apps: [{
    name: 'pesquisa-clima',
    script: 'server.js',
    instances: 'max', // Usa todos os CPUs
    exec_mode: 'cluster',
    max_memory_restart: '1G'
  }]
};
```

### 2. Load Balancing
```nginx
# Configuração Nginx para load balancing
upstream pesquisa_clima {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    location / {
        proxy_pass http://pesquisa_clima;
    }
}
```

## Documentação de API

### 1. OpenAPI/Swagger
```yaml
# swagger.yaml
openapi: 3.0.0
info:
  title: Pesquisa de Clima API
  version: 2.0.0
paths:
  /api/clima/stats:
    get:
      summary: Obter estatísticas do clima
      responses:
        200:
          description: Estatísticas completas
```

### 2. Postman Collection
```json
{
  "info": {
    "name": "Pesquisa de Clima API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Stats",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/clima/stats"
      }
    }
  ]
}
```

## Testes

### 1. Unit Tests
```javascript
// tests/unit/responseService.test.js
describe('ResponseService', () => {
  test('deve calcular favorabilidade corretamente', () => {
    const result = calculateFavorability(mockResponses, 1);
    expect(result.favorabilidade).toBe('75.0');
  });
});
```

### 2. Integration Tests
```javascript
// tests/integration/api.test.js
describe('API Integration', () => {
  test('POST /api/survey/submit', async () => {
    const response = await request(app)
      .post('/api/survey/submit')
      .send(mockSurveyData)
      .expect(200);
  });
});
```

### 3. E2E Tests
```javascript
// tests/e2e/survey.test.js
describe('Survey Flow', () => {
  test('usuário deve completar pesquisa', async () => {
    await page.goto('/survey');
    await page.fill('#q1', '4');
    await page.click('#submit');
    await expect(page.locator('.success')).toBeVisible();
  });
});
```

---

## Diagramas

### 1. Arquitetura do Sistema
```
+----------------+     +----------------+     +----------------+
|   Frontend     | --> |   Backend API  | --> |   Database     |
|   (Browser)    |     |  (Node.js)     |     |   (SQLite)     |
+----------------+     +----------------+     +----------------+
         |                     |                     |
         |                     |                     |
         v                     v                     v
+----------------+     +----------------+     +----------------+
|   User Interface|     |  Business Logic|     |   Data Storage  |
+----------------+     +----------------+     +----------------+
```

### 2. Fluxo de Dados
```
User Input --> Frontend Validation --> API Request --> Business Logic --> Database --> Response --> Frontend Update
```

### 3. Integração IA
```
Dashboard Data --> Context Builder --> AI Service --> OpenRouter API --> AI Response --> Processed Response --> User Display
```

---

## Padrões de Código

### 1. JavaScript Standards
- Usar ES6+ features
- Funções puras quando possível
- Async/await para operações assíncronas
- JSDoc para documentação

### 2. CSS Standards
- BEM methodology para classes
- CSS Grid e Flexbox para layouts
- Variáveis CSS para cores
- Mobile-first approach

### 3. HTML Standards
- Semântica HTML5
- ARIA labels para acessibilidade
- Meta tags para SEO
- Structured data

---

## Ferramentas e DevOps

### 1. Development Tools
- ESLint para linting
- Prettier para formatação
- Husky para git hooks
- Jest para testes

### 2. Build Tools
- Webpack para bundling
- Babel para transpilação
- PostCSS para CSS
- Imagemin para otimização

### 3. Deployment Tools
- PM2 para process management
- Nginx para proxy reverso
- Docker para containerização
- GitHub Actions para CI/CD

---

*Última atualização: 20/04/2026*
*Responsável: [Seu Nome]*
