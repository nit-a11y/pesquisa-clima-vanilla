# Manutenção e Troubleshooting - Pesquisa de Clima Organizacional

## Overview
Guia completo de manutenção do sistema, diagnóstico de problemas e soluções rápidas para o sistema de pesquisa de clima organizacional.

## Manutenção Programada

### 1. Tarefas Diárias

#### Verificação Automática
```bash
#!/bin/bash
# scripts/daily-check.sh

echo "=== Verificação Diária - $(date) ==="

# Verificar status da aplicação
echo "1. Status PM2:"
pm2 status | grep pesquisa-clima

# Verificar se aplicação está respondendo
echo "2. Health Check:"
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "   OK - Aplicação respondendo"
else
    echo "   ERRO - Aplicação não responde"
    pm2 restart pesquisa-clima
fi

# Verificar uso de disco
echo "3. Espaço em disco:"
df -h | grep -E "/$|/home"

# Verificar uso de memória
echo "4. Uso de memória:"
free -h

# Verificar logs de erro recentes
echo "5. Logs de erro (últimas 24h):"
find /home/deploy/pesquisadeclima-nitai/logs -name "*.log" -mtime -1 -exec grep -i error {} \; | tail -5

# Verificar uso da API OpenRouter
echo "6. Status API OpenRouter:"
if grep -q "Rate limit exceeded" /home/deploy/pesquisadeclima-nitai/logs/err.log; then
    echo "   ATENÇÃO - Rate limit detectado recentemente"
else
    echo "   OK - Sem problemas de rate limit"
fi

echo "=== Verificação Diária Concluída ==="
```

#### Limpeza Automática
```bash
#!/bin/bash
# scripts/daily-cleanup.sh

echo "=== Limpeza Diária - $(date) ==="

# Limpar logs antigos (manter últimos 7 dias)
find /home/deploy/pesquisadeclima-nitai/logs -name "*.log" -mtime +7 -delete

# Limpar arquivos temporários
find /tmp -name "node_*" -mtime +1 -delete

# Limpar cache do PM2
pm2 reloadLogs

# Compactar logs grandes
find /home/deploy/pesquisadeclima-nitai/logs -name "*.log" -size +10M -exec gzip {} \;

echo "=== Limpeza Diária Concluída ==="
```

### 2. Tarefas Semanais

#### Manutenção Completa
```bash
#!/bin/bash
# scripts/weekly-maintenance.sh

echo "=== Manutenção Semanal - $(date) ==="

# 1. Backup completo
echo "1. Backup completo:"
./backup-full.sh

# 2. Verificação de segurança
echo "2. Verificação de segurança:"
npm audit

# 3. Atualização de dependências
echo "3. Verificando atualizações:"
npm outdated

# 4. Verificação de certificado SSL
echo "4. Status SSL:"
sudo certbot certificates

# 5. Análise de logs
echo "5. Análise de logs da semana:"
echo "   - Total de erros: $(grep -ci error /home/deploy/pesquisadeclima-nitai/logs/err.log)"
echo "   - Picos de uso: $(grep -c "high memory" /home/deploy/pesquisadeclima-nitai/logs/combined.log)"

# 6. Verificação de performance
echo "6. Performance:"
echo "   - Uptime: $(pm2 jlist | jq '.[0].pm2_env.pm_uptime')"
echo "   - Restart count: $(pm2 jlist | jq '.[0].pm2_env.pm_uptime')"

# 7. Limpeza profunda
echo "7. Limpeza profunda:"
npm cache clean --force
pm2 flush

echo "=== Manutenção Semanal Concluída ==="
```

### 3. Tarefas Mensais

#### Atualização do Sistema
```bash
#!/bin/bash
# scripts/monthly-update.sh

echo "=== Atualização Mensal - $(date) ==="

# 1. Backup antes de atualizar
echo "1. Backup pré-atualização:"
./backup-full.sh

# 2. Atualizar sistema operacional
echo "2. Atualizando sistema:"
sudo apt update
sudo apt upgrade -y

# 3. Atualizar Node.js (se necessário)
echo "3. Verificando Node.js:"
CURRENT_NODE=$(node -v | cut -d'v' -f2)
LATEST_NODE=$(curl -s https://nodejs.org/dist/index.json | jq -r '.[0].version' | cut -d'v' -f2)
echo "   Atual: $CURRENT_NODE"
echo "   Latest: $LATEST_NODE"

# 4. Atualizar dependências npm
echo "4. Atualizando dependências:"
cd /home/deploy/pesquisadeclima-nitai
npm update
npm audit fix

# 5. Verificar compatibilidade
echo "5. Testando compatibilidade:"
npm test 2>/dev/null || echo "   ATENÇÃO: Alguns testes falharam"

# 6. Reiniciar serviços
echo "6. Reiniciando serviços:"
pm2 restart pesquisa-clima
sudo systemctl restart nginx

# 7. Verificação pós-atualização
echo "7. Verificação pós-atualização:"
sleep 10
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "   OK - Sistema funcionando após atualização"
else
    echo "   ERRO - Problema após atualização"
    pm2 logs pesquisa-clima --lines 20
fi

echo "=== Atualização Mensal Concluída ==="
```

## Troubleshooting Comum

### 1. Problemas de Aplicação

#### Aplicação Não Inicia
```bash
# Diagnóstico
echo "=== Diagnóstico: Aplicação não inicia ==="

# 1. Verificar logs PM2
pm2 logs pesquisa-clima --lines 50

# 2. Verificar variáveis de ambiente
echo "Variáveis de ambiente:"
printenv | grep -E "(OPENROUTER|NODE_ENV|PORT)"

# 3. Verificar permissões
echo "Permissões:"
ls -la /home/deploy/pesquisadeclima-nitai/
ls -la /home/deploy/pesquisadeclima-nitai/database.db

# 4. Testar inicialização manual
echo "Teste manual:"
cd /home/deploy/pesquisadeclima-nitai
NODE_ENV=production PORT=3001 node server.js

# 5. Verificar dependências
echo "Dependências:"
npm ls --depth=0
```

#### Erro de Porta em Uso
```bash
# Diagnóstico
echo "=== Diagnóstico: Porta em uso ==="

# 1. Verificar processo na porta
sudo lsof -i :3001
sudo netstat -tulpn | grep :3001

# 2. Matar processo se necessário
PID=$(sudo lsof -t -i :3001)
if [ ! -z "$PID" ]; then
    echo "Matando processo $PID..."
    sudo kill -9 $PID
fi

# 3. Reiniciar PM2
pm2 restart pesquisa-clima

# 4. Verificar se porta foi liberada
sleep 5
sudo lsof -i :3001
```

#### Erro de Banco de Dados
```bash
# Diagnóstico
echo "=== Diagnóstico: Banco de dados ==="

# 1. Verificar se banco existe
if [ -f "/home/deploy/pesquisadeclima-nitai/database.db" ]; then
    echo "Banco encontrado"
    ls -la database.db
else
    echo "Banco não encontrado"
fi

# 2. Verificar integridade do banco
sqlite3 database.db "PRAGMA integrity_check;"

# 3. Verificar se banco está bloqueado
sudo lsof database.db

# 4. Restaurar backup se necessário
LATEST_BACKUP=$(ls -t /home/deploy/pesquisadeclima-nitai/backups/database_*.db | head -1)
if [ ! -z "$LATEST_BACKUP" ]; then
    echo "Restaurando backup: $LATEST_BACKUP"
    cp "$LATEST_BACKUP" database.db
    pm2 restart pesquisa-clima
fi
```

### 2. Problemas de API

#### Erro 500 Internal Server Error
```bash
# Diagnóstico
echo "=== Diagnóstico: Erro 500 ==="

# 1. Verificar logs de erro
tail -50 /home/deploy/pesquisadeclima-nitai/logs/err.log

# 2. Verificar logs PM2
pm2 logs pesquisa-clima --err --lines 20

# 3. Testar endpoints individualmente
echo "Testando endpoints:"
curl -w "%{http_code}\n" http://localhost:3001/health
curl -w "%{http_code}\n" http://localhost:3001/api/clima/stats
curl -w "%{http_code}\n" http://localhost:3001/api/survey/questions

# 4. Verificar se há exceções não tratadas
grep -i "exception\|error\|fatal" /home/deploy/pesquisadeclima-nitai/logs/combined.log | tail -10
```

#### Rate Limit Exceeded (OpenRouter)
```bash
# Diagnóstico
echo "=== Diagnóstico: Rate Limit ==="

# 1. Verificar logs de rate limit
grep -i "rate limit\|429" /home/deploy/pesquisadeclima-nitai/logs/err.log | tail -10

# 2. Verificar uso da API
echo "Uso da API hoje:"
grep -c "$(date +%Y-%m-%d)" /home/deploy/pesquisadeclima-nitai/logs/combined.log

# 3. Testar chave API
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
     https://openrouter.ai/api/v1/auth/key

# 4. Aguardar reset diário (se necessário)
echo "Horário de reset da API: 00:00 UTC"
echo "Horário local: $(date)"
```

#### Timeout de API
```bash
# Diagnóstico
echo "=== Diagnóstico: Timeout API ==="

# 1. Verificar latência de rede
ping -c 3 openrouter.ai

# 2. Testar timeout com curl
timeout 30 curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"openai/gpt-oss-120b:free","messages":[{"role":"user","content":"test"}]}'

# 3. Verificar se há congestionamento
echo "Processos Node.js:"
ps aux | grep node | wc -l

# 4. Implementar retry automático se necessário
echo "Configurando retry automático..."
# Adicionar lógica de retry no código
```

### 3. Problemas de Infraestrutura

#### Alto Uso de CPU
```bash
# Diagnóstico
echo "=== Diagnóstico: Alto uso de CPU ==="

# 1. Verificar uso atual
top -b -n1 | head -10

# 2. Verificar processos Node.js
ps aux | grep node | sort -k3 -nr

# 3. Verificar PM2 status
pm2 monit

# 4. Identificar gargalos
echo "Análise de performance:"
node --inspect=0.0.0.0:9229 server.js &
# Usar Chrome DevTools para analisar

# 5. Otimizar se necessário
echo "Sugestões de otimização:"
echo "- Adicionar cache para respostas da IA"
echo "- Implementar lazy loading"
echo "- Otimizar queries do banco"
echo "- Usar clustering se necessário"
```

#### Alto Uso de Memória
```bash
# Diagnóstico
echo "=== Diagnóstico: Alto uso de memória ==="

# 1. Verificar uso de memória
free -h
ps aux --sort=-%mem | head -10

# 2. Verificar leaks de memória
echo "Monitoramento de memória PM2:"
pm2 show pesquisa-clima | grep -A 5 "memory usage"

# 3. Analisar heap dump
echo "Gerando heap dump..."
pm2 show pesquisa-clima | grep "pid" | awk '{print $2}' | xargs kill -USR2

# 4. Reiniciar se necessário
echo "Memória usada: $(ps aux | grep node | awk '{sum+=$6} END {print sum/1024}')MB"
if [ $(ps aux | grep node | awk '{sum+=$6} END {print sum/1024}') -gt 1024 ]; then
    echo "Reiniciando devido a alto uso de memória..."
    pm2 restart pesquisa-clima
fi
```

#### Espaço em Disco Esgotado
```bash
# Diagnóstico
echo "=== Diagnóstico: Espaço em disco ==="

# 1. Verificar espaço
df -h

# 2. Encontrar arquivos grandes
find /home/deploy -type f -size +100M -exec ls -lh {} \;

# 3. Limpar logs antigos
echo "Limpando logs antigos:"
find /home/deploy/pesquisadeclima-nitai/logs -name "*.log" -mtime +30 -delete
find /home/deploy/pesquisadeclima-nitai/logs -name "*.gz" -mtime +90 -delete

# 4. Limpar cache npm
npm cache clean --force

# 5. Compactar logs grandes
find /home/deploy/pesquisadeclima-nitai/logs -name "*.log" -size +50M -exec gzip {} \;

# 6. Verificar espaço após limpeza
df -h
```

## Scripts de Emergência

### 1. Recovery Completo
```bash
#!/bin/bash
# scripts/emergency-recovery.sh

echo "=== RECUPERAÇÃO DE EMERGÊNCIA ==="

# 1. Parar tudo
echo "1. Parando serviços..."
pm2 stop all
sudo systemctl stop nginx

# 2. Backup do estado atual
echo "2. Backup do estado atual..."
mkdir -p /tmp/emergency_backup
cp -r /home/deploy/pesquisadeclima-nitai /tmp/emergency_backup/

# 3. Restaurar último backup bom
echo "3. Restaurando backup..."
LATEST_BACKUP=$(ls -t /home/deploy/backups/database_*.db | head -1)
if [ ! -z "$LATEST_BACKUP" ]; then
    cp "$LATEST_BACKUP" /home/deploy/pesquisadeclima-nitai/database.db
    echo "Banco restaurado: $LATEST_BACKUP"
fi

# 4. Verificar configurações
echo "4. Verificando configurações..."
cd /home/deploy/pesquisadeclima-nitai
git status
git checkout main
git pull origin main

# 5. Reinstalar dependências
echo "5. Reinstalando dependências..."
rm -rf node_modules
npm install --production

# 6. Iniciar serviços
echo "6. Iniciando serviços..."
pm2 start ecosystem.config.js
sudo systemctl start nginx

# 7. Verificar funcionamento
echo "7. Verificando funcionamento..."
sleep 10
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "OK - Sistema recuperado"
else
    echo "ERRO - Problema na recuperação"
    pm2 logs pesquisa-clima --lines 50
fi

echo "=== RECUPERAÇÃO CONCLUÍDA ==="
```

### 2. Modo Seguro (Safe Mode)
```bash
#!/bin/bash
# scripts/safe-mode.sh

echo "=== MODO SEGURO ==="

# 1. Parar aplicação normal
pm2 stop pesquisa-clima

# 2. Iniciar em modo seguro (sem IA)
echo "Iniciando em modo seguro..."
NODE_ENV=production DISABLE_AI=true pm2 start server.js --name "pesquisa-clima-safe"

# 3. Verificar funcionamento básico
echo "Verificando funcionamento básico..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "OK - Modo seguro funcionando"
    echo "Funcionalidades disponíveis:"
    echo "- Formulário de pesquisa"
    echo "- Dashboard básico"
    echo "- Exportação de dados"
    echo "- Chat IA desativado"
else
    echo "ERRO - Nem modo seguro funciona"
fi
```

### 3. Rollback Rápido
```bash
#!/bin/bash
# scripts/quick-rollback.sh

echo "=== ROLLBACK RÁPIDO ==="

# 1. Identificar último commit funcional
echo "1. Identificando último commit funcional..."
cd /home/deploy/pesquisadeclima-nitai
git log --oneline -10

# 2. Rollback para commit anterior
echo "2. Fazendo rollback..."
git checkout HEAD~1

# 3. Reiniciar aplicação
echo "3. Reiniciando aplicação..."
pm2 restart pesquisa-clima

# 4. Verificar funcionamento
echo "4. Verificando funcionamento..."
sleep 5
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "OK - Rollback bem-sucedido"
    echo "Commit atual: $(git rev-parse --short HEAD)"
else
    echo "ERRO - Rollback falhou"
    echo "Tentando rollback adicional..."
    git checkout HEAD~1
    pm2 restart pesquisa-clima
fi
```

## Monitoramento Avançado

### 1. Dashboard de Monitoramento
```javascript
// backend/controllers/monitoring.controller.js
async function getSystemStats(req, res) {
  try {
    const stats = {
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        loadAvg: require('os').loadavg()
      },
      application: {
        pm2Status: await getPM2Status(),
        databaseSize: await getDatabaseSize(),
        logSize: await getLogSize(),
        errorRate: await getErrorRate()
      },
      external: {
        openRouterStatus: await checkOpenRouterStatus(),
        sslStatus: await checkSSLStatus(),
        domainStatus: await checkDomainStatus()
      },
      performance: {
        responseTime: await getAverageResponseTime(),
        requestsPerMinute: await getRequestsPerMinute(),
        activeConnections: await getActiveConnections()
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 2. Alertas Automáticos
```javascript
// backend/services/alertService.js
class AlertService {
  constructor() {
    this.thresholds = {
      memoryUsage: 0.8,      // 80% da memória
      cpuUsage: 0.8,         // 80% da CPU
      diskUsage: 0.9,        // 90% do disco
      errorRate: 0.05,       // 5% de erro
      responseTime: 5000,    // 5 segundos
      consecutiveErrors: 3   // 3 erros consecutivos
    };
  }
  
  async checkAllMetrics() {
    const alerts = [];
    
    // Verificar memória
    const memUsage = process.memoryUsage();
    const memPercent = memUsage.heapUsed / memUsage.heapTotal;
    if (memPercent > this.thresholds.memoryUsage) {
      alerts.push({
        type: 'memory',
        severity: 'high',
        message: `Uso de memória: ${(memPercent * 100).toFixed(1)}%`
      });
    }
    
    // Verificar CPU
    const cpuUsage = process.cpuUsage();
    if (cpuUsage > this.thresholds.cpuUsage) {
      alerts.push({
        type: 'cpu',
        severity: 'medium',
        message: `Uso de CPU alto: ${cpuUsage}%`
      });
    }
    
    // Verificar disco
    const diskUsage = await this.getDiskUsage();
    if (diskUsage > this.thresholds.diskUsage) {
      alerts.push({
        type: 'disk',
        severity: 'critical',
        message: `Uso de disco: ${(diskUsage * 100).toFixed(1)}%`
      });
    }
    
    // Enviar alertas
    if (alerts.length > 0) {
      await this.sendAlerts(alerts);
    }
    
    return alerts;
  }
  
  async sendAlerts(alerts) {
    for (const alert of alerts) {
      console.error(`ALERT: ${alert.type} - ${alert.message}`);
      
      // Implementar notificações:
      // - Email
      // - Slack
      // - SMS
      // - Webhook
    }
  }
}
```

### 3. Health Check Avançado
```javascript
// backend/routes/health.js
async function comprehensiveHealthCheck(req, res) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {}
  };
  
  try {
    // Verificar banco de dados
    health.checks.database = await checkDatabase();
    
    // Verificar API OpenRouter
    health.checks.openrouter = await checkOpenRouter();
    
    // Verificar sistema de arquivos
    health.checks.filesystem = await checkFileSystem();
    
    // Verificar memória
    health.checks.memory = checkMemory();
    
    // Verificar conexões ativas
    health.checks.connections = checkConnections();
    
    // Determinar status geral
    const failedChecks = Object.values(health.checks)
      .filter(check => check.status !== 'healthy');
    
    if (failedChecks.length > 0) {
      health.status = 'unhealthy';
      health.issues = failedChecks;
    }
    
    res.status(health.status === 'healthy' ? 200 : 503).json(health);
    
  } catch (error) {
    health.status = 'unhealthy';
    health.error = error.message;
    res.status(503).json(health);
  }
}
```

## Debugging Avançado

### 1. Debug Mode
```bash
# Iniciar aplicação em modo debug
NODE_ENV=development DEBUG=* node server.js

# Debug específico
DEBUG=app:* node server.js

# Debug com Chrome DevTools
node --inspect=0.0.0.0:9229 server.js
```

### 2. Profile de Performance
```bash
# Profile de CPU
node --prof server.js

# Analisar profile
node --prof-process isolate-*.log > processed.txt

# Profile de memória
node --inspect --heap-prof server.js
```

### 3. Log Detalhado
```javascript
// backend/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'pesquisa-clima' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Middleware de logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});
```

## Checklist de Manutenção

### Diário
- [ ] Verificar status PM2
- [ ] Verificar health check
- [ ] Monitorar uso de recursos
- [ ] Verificar logs de erro
- [ ] Limpar logs temporários

### Semanal
- [ ] Backup completo
- [ ] Verificar segurança
- [ ] Atualizar dependências
- [ ] Analisar performance
- [ ] Revisar alertas

### Mensal
- [ ] Atualizar sistema
- [ ] Rotacionar chaves API
- [ ] Backup externo
- [ ] Revisar documentação
- [ ] Testar recovery

### Trimestral
- [ ] Teste de disaster recovery
- [ ] Análise de segurança
- [ ] Otimização de performance
- [ ] Planejamento de capacidade
- [ ] Treinamento da equipe

## Contatos de Suporte

### Emergência 24/7
- **DevOps**: [Telefone/Email]
- **Desenvolvedor**: [Telefone/Email]
- **Hospedagem**: [Suporte da provedora]

### Horário Comercial
- **Equipe Técnica**: [Email/Slack]
- **Gerente de Projeto**: [Email]
- **Stakeholders**: [Email]

### Links Úteis
- [Documentação](https://docs.nordeste-locacoes.com.br)
- [Status Page](https://status.nordeste-locacoes.com.br)
- [Monitoring Dashboard](https://monitor.nordeste-locacoes.com.br)

---

*Última atualização: 20/04/2026*
*Responsável: [Seu Nome]*
