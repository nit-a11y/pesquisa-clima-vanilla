# Chaves e APIs de IA - Pesquisa de Clima Organizacional

## Overview
Configuração completa das chaves de API, serviços de IA e integrações utilizadas no sistema de pesquisa de clima organizacional.

## Serviços de IA Utilizados

### 1. OpenRouter API
**Provedor principal de modelos de linguagem**

#### Configuração
```env
# Variáveis de ambiente
OPENROUTER_API_KEY=sk-or-v1-SUA_CHAVE_AQUI
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-oss-120b:free
```

#### Modelos Disponíveis
```javascript
const MODELOS = {
  // Modelo principal (gratuito)
  principal: "openai/gpt-oss-120b:free",
  
  // Alternativas pagas
  claude: "anthropic/claude-3-haiku",
  gpt4: "openai/gpt-4-turbo",
  gemini: "google/gemini-pro",
  
  // Modelos especializados
  code: "openai/gpt-4-turbo-preview",
  analysis: "anthropic/claude-3-sonnet"
};
```

#### Rate Limits
```javascript
// Limites do plano gratuito
const RATE_LIMITS = {
  requests_per_day: 1000,
  requests_per_minute: 60,
  tokens_per_minute: 40000,
  concurrent_requests: 5
};
```

### 2. Configuração do Cliente
```javascript
// backend/services/ai.service.js
class OpenRouterClient {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseUrl = process.env.OPENROUTER_BASE_URL;
    this.model = process.env.OPENROUTER_MODEL;
    
    this.config = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://nordeste-locacoes.com.br',
        'X-Title': 'Pesquisa de Clima Organizacional'
      }
    };
  }
  
  async chatCompletion(messages, options = {}) {
    const payload = {
      model: options.model || this.model,
      messages: messages,
      max_tokens: options.maxTokens || 800,
      temperature: options.temperature || 0.7,
      ...options
    };
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        payload,
        this.config
      );
      
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
  
  handleError(error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Aguarde um momento.');
    } else if (error.response?.status === 401) {
      throw new Error('Chave API inválida. Verifique configuração.');
    } else if (error.response?.status >= 500) {
      throw new Error('Serviço temporariamente indisponível.');
    } else {
      throw new Error(`Erro na API: ${error.message}`);
    }
  }
}
```

## Segurança das Chaves

### 1. Gerenciamento de Chaves
```bash
# NUNCA commitar chaves no repositório
# Usar sempre variáveis de ambiente

# Verificar se chave está configurada
echo $OPENROUTER_API_KEY

# Testar configuração
curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"openai/gpt-oss-120b:free","messages":[{"role":"user","content":"Hello"}]}'
```

### 2. Rotacionamento de Chaves
```bash
#!/bin/bash
# scripts/rotate-api-key.sh

NEW_KEY="sk-or-v1-NOVA_CHAVE_AQUI"
BACKUP_KEY_FILE="/path/to/backups/api_keys.txt"

# Backup da chave atual
echo "$(date): $OPENROUTER_API_KEY" >> $BACKUP_KEY_FILE

# Atualizar variável de ambiente
export OPENROUTER_API_KEY=$NEW_KEY

# Atualizar arquivo .env
sed -i "s/OPENROUTER_API_KEY=.*/OPENROUTER_API_KEY=$NEW_KEY/" .env

# Reiniciar aplicação
pm2 restart pesquisa-clima

echo "Chave API rotacionada com sucesso"
```

### 3. Monitoramento de Uso
```javascript
// backend/utils/apiMonitor.js
class APIMonitor {
  constructor() {
    this.dailyRequests = 0;
    this.hourlyRequests = 0;
    this.lastReset = new Date();
  }
  
  trackRequest() {
    this.dailyRequests++;
    this.hourlyRequests++;
    
    // Reset contadores
    const now = new Date();
    if (now.getDate() !== this.lastReset.getDate()) {
      this.dailyRequests = 0;
      this.lastReset = now;
    }
    
    // Verificar limites
    if (this.dailyRequests > 900) { // 90% do limite
      console.warn('Aproximando do rate limit diário');
    }
    
    if (this.hourlyRequests > 50) { // Aviso de uso alto
      console.warn('Alta taxa de requisições por hora');
    }
  }
  
  getStats() {
    return {
      daily: this.dailyRequests,
      hourly: this.hourlyRequests,
      limit: 1000,
      remaining: 1000 - this.dailyRequests
    };
  }
}
```

## Configurações Avançadas

### 1. Cache de Respostas
```javascript
// backend/services/cacheService.js
class CacheService {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
    this.ttl = 3600000; // 1 hora
  }
  
  set(key, value) {
    // Limpar cache se estiver cheio
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Verificar TTL
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  // Gerar chave de cache baseada no prompt
  generateKey(prompt, options = {}) {
    const hash = require('crypto')
      .createHash('md5')
      .update(JSON.stringify({ prompt, options }))
      .digest('hex');
    
    return hash;
  }
}
```

### 2. Retry com Exponential Backoff
```javascript
// backend/utils/retryService.js
class RetryService {
  static async executeWithRetry(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Não retry em erros de autenticação
        if (error.response?.status === 401) {
          throw error;
        }
        
        // Calcular delay com exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        
        console.warn(`Tentativa ${attempt + 1} falhou. Retentando em ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}
```

### 3. Fallback de Modelos
```javascript
// backend/services/modelFallback.js
class ModelFallback {
  constructor() {
    this.models = [
      'openai/gpt-oss-120b:free',
      'anthropic/claude-3-haiku',
      'google/gemini-pro'
    ];
  }
  
  async executeWithFallback(prompt, options = {}) {
    let lastError;
    
    for (const model of this.models) {
      try {
        const response = await this.client.chatCompletion(prompt, {
          ...options,
          model
        });
        
        return response;
      } catch (error) {
        lastError = error;
        console.warn(`Modelo ${model} falhou: ${error.message}`);
      }
    }
    
    throw new Error(`Todos os modelos falharam. Último erro: ${lastError.message}`);
  }
}
```

## Prompts e Templates

### 1. Prompt de Relatório Executivo
```javascript
const EXECUTIVE_REPORT_PROMPT = `
Você é um PhD em Psicologia Organizacional com 15+ anos de experiência em consultoria para empresas de locação.

CONTEXTO:
Empresa: Nordeste Locações
Setor: Locação de veículos
Total de respostas: ${totalResponses}
Favorabilidade global: ${globalFavorability}%

DADOS COMPLETOS:
${JSON.stringify(dashboardData, null, 2)}

TAREFA:
Gerar um relatório executivo de altíssimo nível seguindo padrão McKinsey/BCG.

ESTRUTURA OBRIGATÓRIA:
1. RESUMO ESTRATÉGICO (3-4 parágrafos)
2. INDICADORES CHAVE (NPS, Retenção, Maturidade)
3. ANÁLISE POR DIMENSÃO (métricas, metas, desvios)
4. INSIGHTS ESTRATÉGICOS (quantitativos e qualitativos)
5. RECOMENDAÇÕES ACIONÁVEIS (cronograma com KPIs)
6. PESQUISAS E REFERÊNCIAS (2-3 estudos acadêmicos)

REQUISITOS:
- Linguagem C-level executiva
- Dados quantitativos específicos
- Recomendações com ROI mensurável
- Formato Markdown profissional
- Análise profunda de TODAS as respostas

Gere o relatório completo agora.
`;
```

### 2. Prompt de Análise de Chat
```javascript
const CHAT_ANALYSIS_PROMPT = `
Você é Nitai, analista especialista em clima organizacional da Nordeste Locações.

DADOS ATUAIS DA PESQUISA:
${JSON.stringify(contextData, null, 2)}

PERGUNTA DO USUÁRIO: ${userMessage}

INSTRUÇÕES:
1. Analise TODOS os dados disponíveis
2. Baseie respostas em dados concretos
3. Seja específico e acionável
4. Forneça insights estratégicos
5. Mantenha contexto profissional

Responda de forma clara, estruturada e útil.
`;
```

### 3. Prompt de Geração Visual
```javascript
const VISUAL_ANALYSIS_PROMPT = `
Gere análise visual completa em SVG baseada nos dados:

DADOS: ${JSON.stringify(data, null, 2)}

REQUISITOS SVG:
- Gráfico de barras para favorabilidade por pilar
- Gráfico de pizza para distribuição Likert
- Indicadores visuais para status
- Cores corporativas da Nordeste Locações
- Design moderno e profissional

FORMATO:
\`\`\`svg
[código SVG aqui]
\`\`\`

ANÁLISE TEXTUAL:
[análise detalhada dos dados]
`;
```

## Monitoramento e Alertas

### 1. Sistema de Alertas
```javascript
// backend/services/alertService.js
class AlertService {
  constructor() {
    this.thresholds = {
      dailyUsage: 0.9,      // 90% do limite diário
      errorRate: 0.1,       // 10% de erro
      responseTime: 5000,   // 5 segundos
      consecutiveErrors: 5   // 5 erros consecutivos
    };
    
    this.metrics = {
      dailyRequests: 0,
      errors: 0,
      totalRequests: 0,
      consecutiveErrors: 0,
      lastErrorTime: null
    };
  }
  
  trackRequest(success, responseTime) {
    this.metrics.totalRequests++;
    this.metrics.dailyRequests++;
    
    if (!success) {
      this.metrics.errors++;
      this.metrics.consecutiveErrors++;
      this.metrics.lastErrorTime = Date.now();
    } else {
      this.metrics.consecutiveErrors = 0;
    }
    
    this.checkAlerts();
  }
  
  checkAlerts() {
    // Alerta de uso diário
    if (this.metrics.dailyRequests / 1000 > this.thresholds.dailyUsage) {
      this.sendAlert('ALERTA: Uso diário próximo do limite');
    }
    
    // Alerta de taxa de erro
    const errorRate = this.metrics.errors / this.metrics.totalRequests;
    if (errorRate > this.thresholds.errorRate) {
      this.sendAlert('ALERTA: Alta taxa de erro na API');
    }
    
    // Alerta de erros consecutivos
    if (this.metrics.consecutiveErrors >= this.thresholds.consecutiveErrors) {
      this.sendAlert('ALERTA: Múltiplos erros consecutivos');
    }
  }
  
  sendAlert(message) {
    console.error(message);
    // Implementar notificação por email, Slack, etc.
  }
}
```

### 2. Dashboard de Monitoramento
```javascript
// backend/controllers/monitoring.controller.js
async function getAPIStats(req, res) {
  try {
    const stats = {
      openrouter: {
        dailyRequests: apiMonitor.dailyRequests,
        hourlyRequests: apiMonitor.hourlyRequests,
        limit: 1000,
        remaining: 1000 - apiMonitor.dailyRequests,
        usagePercentage: (apiMonitor.dailyRequests / 1000) * 100
      },
      system: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        lastRestart: new Date(process.uptime() * 1000)
      },
      alerts: {
        errorRate: alertService.getErrorRate(),
        consecutiveErrors: alertService.getConsecutiveErrors(),
        lastAlert: alertService.getLastAlert()
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Backup e Recuperação

### 1. Backup de Configurações
```bash
#!/bin/bash
# scripts/backup-api-configs.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups/api-configs"

mkdir -p $BACKUP_DIR

# Backup de variáveis de ambiente
printenv | grep OPENROUTER > $BACKUP_DIR/env_$DATE.backup

# Backup de arquivos de configuração
cp .env $BACKUP_DIR/env_file_$DATE.backup

# Backup de scripts de API
cp -r backend/services $BACKUP_DIR/services_$DATE/

echo "Backup das configurações de API concluído: $BACKUP_DIR"
```

### 2. Recuperação Automática
```javascript
// backend/services/recoveryService.js
class RecoveryService {
  static async handleAPIFailure(error) {
    console.error('Falha na API detectada:', error.message);
    
    // Tentar modelo fallback
    if (error.response?.status >= 500) {
      try {
        return await modelFallback.executeWithFallback(prompt, options);
      } catch (fallbackError) {
        console.error('Fallback também falhou:', fallbackError.message);
      }
    }
    
    // Retornar resposta cacheada se disponível
    const cachedResponse = cacheService.get(cacheKey);
    if (cachedResponse) {
      console.warn('Usando resposta cacheada devido a falha da API');
      return cachedResponse;
    }
    
    // Resposta de emergência
    return {
      choices: [{
        message: {
          content: 'Desculpe, estou enfrentando dificuldades técnicas. Por favor, tente novamente em alguns minutos.'
        }
      }]
    };
  }
}
```

## Testes e Validação

### 1. Teste de Conectividade
```javascript
// tests/api.test.js
describe('API Integration Tests', () => {
  test('OpenRouter API connectivity', async () => {
    const client = new OpenRouterClient();
    
    const response = await client.chatCompletion([
      { role: 'user', content: 'Hello, test message' }
    ], { maxTokens: 10 });
    
    expect(response.choices).toBeDefined();
    expect(response.choices[0].message.content).toBeDefined();
  });
  
  test('Rate limit handling', async () => {
    // Simular múltiplas requisições rápidas
    const promises = Array(70).fill().map(() => 
      client.chatCompletion([{ role: 'user', content: 'test' }])
    );
    
    const results = await Promise.allSettled(promises);
    const failures = results.filter(r => r.status === 'rejected');
    
    expect(failures.length).toBeGreaterThan(0);
    expect(failures[0].reason.message).toContain('rate limit');
  });
});
```

### 2. Teste de Load
```bash
#!/bin/bash
# scripts/load-test.sh

echo "Iniciando teste de carga da API..."

for i in {1..100}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST "http://localhost:3001/api/chat/enviar" \
    -H "Content-Type: application/json" \
    -d '{"mensagem": "Mensagem de teste $i"}' &
  
  # Controlar rate
  if [ $((i % 10)) -eq 0 ]; then
    wait
    sleep 1
  fi
done

wait
echo "Teste de carga concluído"
```

## Documentação de Referência

### 1. OpenRouter API Docs
- **Base URL**: https://openrouter.ai/api/v1
- **Authentication**: Bearer token
- **Rate Limits**: Varia por modelo
- **Pricing**: Pay-per-use com free tier

### 2. Modelos Disponíveis
```javascript
const MODEL_INFO = {
  'openai/gpt-oss-120b:free': {
    context_length: 120000,
    pricing: 'free',
    rate_limit: '1000/day'
  },
  'anthropic/claude-3-haiku': {
    context_length: 200000,
    pricing: '$0.25/1M tokens',
    rate_limit: '4000/hour'
  },
  'google/gemini-pro': {
    context_length: 32768,
    pricing: '$0.25/1M tokens',
    rate_limit: '60/minute'
  }
};
```

### 3. Códigos de Erro
```javascript
const ERROR_CODES = {
  400: 'Bad Request - Parâmetros inválidos',
  401: 'Unauthorized - Chave API inválida',
  429: 'Too Many Requests - Rate limit exceeded',
  500: 'Internal Server Error - Problema no serviço',
  502: 'Bad Gateway - Serviço indisponível',
  503: 'Service Unavailable - Manutenção'
};
```

---

## Contatos de Suporte

### OpenRouter
- **Documentation**: https://openrouter.ai/docs
- **Support**: support@openrouter.ai
- **Status**: https://status.openrouter.ai

### Alternativas
- **Anthropic Claude**: https://docs.anthropic.com
- **OpenAI API**: https://platform.openai.com/docs
- **Google AI**: https://ai.google.dev/docs

---

## Checklist de Configuração

- [ ] Chave API configurada em variáveis de ambiente
- [ ] Teste de conectividade realizado
- [ ] Rate limits configurados
- [ ] Sistema de cache implementado
- [ ] Retry com exponential backoff
- [ ] Modelos fallback configurados
- [ ] Monitoramento de uso ativo
- [ ] Alertas configurados
- [ ] Backup de configurações
- [ ] Documentação atualizada

---

*Última atualização: 20/04/2026*
*Responsável: [Seu Nome]*
