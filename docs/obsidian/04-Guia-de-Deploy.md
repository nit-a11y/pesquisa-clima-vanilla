# Guia de Deploy - Pesquisa de Clima Organizacional

## Overview
Guia completo de deploy do sistema de pesquisa de clima organizacional em ambiente de produção.

## Pré-requisitos

### 1. Requisitos do Servidor
- **SO**: Ubuntu 22.04 LTS (recomendado)
- **CPU**: 2 vCPUs mínimo
- **RAM**: 2GB+ recomendado
- **Storage**: 20GB+ SSD
- **Node.js**: v18.x LTS
- **PM2**: v5.x
- **Nginx**: v1.18+ (opcional)

### 2. Requisitos de Software
```bash
# Verificar Node.js
node --version  # >= 18.0.0
npm --version   # >= 8.0.0

# Verificar PM2
pm2 --version   # >= 5.0.0

# Verificar Git
git --version   # >= 2.30.0
```

### 3. Chaves e Configurações
- **Chave SSH**: Configurada no servidor
- **Chave OpenRouter**: Obtida e configurada
- **Domínio**: Configurado (opcional)
- **SSL/TLS**: Configurado (recomendado)

## Setup Inicial do Servidor

### 1. Acesso ao Servidor
```bash
# SSH para o servidor
ssh root@SEU_IP_SERVIDOR

# Criar usuário dedicado
adduser deploy
usermod -aG sudo deploy
su - deploy
```

### 2. Instalação Node.js
```bash
# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Instalar Node.js
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 3. Instalação PM2
```bash
# Instalar globalmente
sudo npm install -g pm2

# Verificar instalação
pm2 --version
```

### 4. Instalação Nginx (Opcional)
```bash
# Instalar Nginx
sudo apt update
sudo apt install nginx -y

# Iniciar e habilitar
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar status
sudo systemctl status nginx
```

## Configuração do Projeto

### 1. Clonar Repositório
```bash
# Navegar para diretório home
cd /home/deploy

# Clonar projeto
git clone https://github.com/SEU_USER/pesquisa-declima-nitai.git

# Entrar no diretório
cd pesquisadeclima-nitai
```

### 2. Configurar Variáveis de Ambiente
```bash
# Criar arquivo .env
nano .env
```

```env
# Configurações OpenRouter
OPENROUTER_API_KEY=sk-or-v1-SUA_CHAVE_AQUI
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-oss-120b:free

# Configurações do Servidor
PORT=3001
NODE_ENV=production

# Configurações de Segurança
JWT_SECRET=seu_jwt_secret_aqui
SESSION_SECRET=seu_session_secret_aqui

# Configurações de Banco
DB_PATH=./database.db

# Configurações de Log
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### 3. Instalar Dependências
```bash
# Instalar dependências de produção
npm install --production

# Verificar instalação
npm ls --depth=0
```

### 4. Permissões do Banco de Dados
```bash
# Criar diretório para banco se não existir
mkdir -p data

# Permissões corretas
chmod 755 data
chmod 644 database.db

# Criar diretório de logs
mkdir -p logs
chmod 755 logs
```

## Configuração PM2

### 1. Criar Ecosystem Config
```bash
# Criar arquivo de configuração
nano ecosystem.config.js
```

```javascript
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
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    kill_timeout: 5000,
    restart_delay: 5000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### 2. Iniciar Aplicação com PM2
```bash
# Criar diretório de logs se não existir
mkdir -p logs

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Configurar startup automático
pm2 startup

# Executar comando sugerido pelo PM2
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/deploy
```

### 3. Monitoramento PM2
```bash
# Verificar status
pm2 status

# Verificar logs
pm2 logs pesquisa-clima

# Monitoramento em tempo real
pm2 monit

# Reiniciar aplicação
pm2 restart pesquisa-clima

# Parar aplicação
pm2 stop pesquisa-clima

# Remover aplicação
pm2 delete pesquisa-clima
```

## Configuração Nginx (Proxy Reverso)

### 1. Criar Configuração
```bash
# Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/pesquisa-clima
```

```nginx
server {
    listen 80;
    server_name SEU_DOMINIO.com.br www.SEU_DOMINIO.com.br;

    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name SEU_DOMINIO.com.br www.SEU_DOMINIO.com.br;

    # Configuração SSL
    ssl_certificate /etc/letsencrypt/live/SEU_DOMINIO.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/SEU_DOMINIO.com.br/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Headers de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'" always;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Servir arquivos estáticos diretamente
    location /assets/ {
        alias /home/deploy/pesquisadeclima-nitai/frontend/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }

    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ ^/(node_modules|\.env|\.git) {
        deny all;
    }
}
```

### 2. Habilitar Site
```bash
# Remover site default
sudo rm /etc/nginx/sites-enabled/default

# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/pesquisa-clima /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## SSL/TLS (Let's Encrypt)

### 1. Instalar Certbot
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Gerar Certificado
```bash
# Gerar certificado SSL
sudo certbot --nginx -d SEU_DOMINIO.com.br -d www.SEU_DOMINIO.com.br

# Seguir instruções interativas:
# 1. Informar email
# 2. Concordar com termos
# 3. Escolher compartilhar email (opcional)
# 4. Escolher redirecionar HTTP para HTTPS
```

### 3. Testar Renovação Automática
```bash
# Testar renovação automática
sudo certbot renew --dry-run

# Verificar agendamento
sudo systemctl status certbot.timer
```

## Firewall e Segurança

### 1. Configurar UFW
```bash
# Habilitar firewall
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP/HTTPS
sudo ufw allow 'Nginx Full'

# Verificar status
sudo ufw status verbose
```

### 2. Configurar Fail2Ban
```bash
# Instalar Fail2Ban
sudo apt install fail2ban -y

# Configurar para SSH
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Editar configuração
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 600
```

```bash
# Reiniciar Fail2Ban
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

## Backup Automático

### 1. Script de Backup
```bash
# Criar script de backup
nano backup.sh
```

```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/deploy/backups"
PROJECT_DIR="/home/deploy/pesquisadeclima-nitai"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do banco de dados
if [ -f "$PROJECT_DIR/database.db" ]; then
    cp $PROJECT_DIR/database.db $BACKUP_DIR/database_$DATE.db
    echo "Backup do banco: database_$DATE.db"
fi

# Backup dos arquivos do projeto
tar -czf $BACKUP_DIR/project_$DATE.tar.gz \
    --exclude=node_modules \
    --exclude=logs \
    --exclude=backups \
    --exclude=.git \
    -C $PROJECT_DIR .

# Backup das configurações
if [ -f "$PROJECT_DIR/.env" ]; then
    cp $PROJECT_DIR/.env $BACKUP_DIR/env_$DATE.backup
fi

if [ -f "$PROJECT_DIR/ecosystem.config.js" ]; then
    cp $PROJECT_DIR/ecosystem.config.js $BACKUP_DIR/ecosystem_$DATE.config
fi

# Backup dos logs recentes (últimos 7 dias)
find $PROJECT_DIR/logs -name "*.log" -mtime -7 -exec cp {} $BACKUP_DIR/logs_$DATE/ \;

# Compactar logs
if [ -d "$BACKUP_DIR/logs_$DATE" ]; then
    tar -czf $BACKUP_DIR/logs_$DATE.tar.gz -C $BACKUP_DIR logs_$DATE
    rm -rf $BACKUP_DIR/logs_$DATE
fi

# Limpar backups antigos (manter últimos 30 dias)
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.backup" -mtime +30 -delete
find $BACKUP_DIR -name "*.config" -mtime +30 -delete

# Backup externo (opcional - para S3, Google Drive, etc)
# aws s3 cp $BACKUP_DIR/database_$DATE.db s3://seu-bucket/backups/
# rclone copy $BACKUP_DIR/database_$DATE.db remote:backups/

echo "Backup concluído: $DATE"
echo "Espaço usado: $(du -sh $BACKUP_DIR | cut -f1)"
```

### 2. Agendar Backup (Cron)
```bash
# Tornar script executável
chmod +x backup.sh

# Editar crontab
crontab -e
```

```cron
# Backup diário às 2h da manhã
0 2 * * * /home/deploy/pesquisadeclima-nitai/backup.sh >> /home/deploy/backups/backup.log 2>&1

# Backup semanal completo aos domingos 3h
0 3 * * 0 /home/deploy/pesquisadeclima-nitai/backup-full.sh >> /home/deploy/backups/backup-full.log 2>&1

# Limpeza de logs semanal
0 4 * * 0 /home/deploy/pesquisadeclima-nitai/cleanup-logs.sh >> /home/deploy/backups/cleanup.log 2>&1
```

## Deploy Automatizado

### 1. Script de Deploy
```bash
# Criar script de deploy
nano deploy.sh
```

```bash
#!/bin/bash

echo "Iniciando deploy do sistema..."

# Variáveis
PROJECT_DIR="/home/deploy/pesquisadeclima-nitai"
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Função de rollback
rollback() {
    echo "Erro no deploy. Fazendo rollback..."
    cd $PROJECT_DIR
    git checkout HEAD~1
    pm2 restart pesquisa-clima
    echo "Rollback concluído"
    exit 1
}

# Criar backup antes do deploy
echo "Criando backup..."
if [ -f "$PROJECT_DIR/database.db" ]; then
    cp $PROJECT_DIR/database.db $BACKUP_DIR/database_pre_deploy_$DATE.db
fi

# Navegar para o projeto
cd $PROJECT_DIR

# Verificar se há mudanças
git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "Nenhuma mudança encontrada. Deploy não necessário."
    exit 0
fi

# Pull das mudanças
echo "Atualizando código..."
git pull origin main || rollback

# Verificar se há mudanças no package.json
if git diff HEAD~1 HEAD --name-only | grep -q "package.json"; then
    echo "Mudanças detectadas em dependências. Instalando..."
    npm install --production || rollback
fi

# Verificar se há mudanças no .env
if git diff HEAD~1 HEAD --name-only | grep -q ".env"; then
    echo "AVISO: Mudanças detectadas no .env. Verifique manualmente."
fi

# Reiniciar aplicação
echo "Reiniciando aplicação..."
pm2 restart pesquisa-clima || rollback

# Aguardar aplicação iniciar
sleep 5

# Verificar status
if pm2 list | grep pesquisa-clima | grep -q "online"; then
    echo "Deploy concluído com sucesso!"
    
    # Verificar health check
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo "Health check passou. Sistema funcionando corretamente."
    else
        echo "AVISO: Health check falhou. Verifique manualmente."
    fi
else
    echo "ERRO: Aplicação não iniciou corretamente."
    rollback
fi

# Limpar logs antigos
find $PROJECT_DIR/logs -name "*.log" -mtime +7 -delete

echo "Deploy finalizado!"
```

### 2. GitHub Actions (Opcional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /home/deploy/pesquisadeclima-nitai
          chmod +x deploy.sh
          ./deploy.sh
```

## Monitoramento e Logs

### 1. Configurar Log Rotation
```bash
# Criar configuração
sudo nano /etc/logrotate.d/pesquisa-clima
```

```
/home/deploy/pesquisadeclima-nitai/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 deploy deploy
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 2. Monitoramento de Recursos
```bash
# Instalar htop
sudo apt install htop -y

# Monitorar CPU e RAM
htop

# Monitorar disco
df -h

# Monitorar processos Node.js
ps aux | grep node

# Monitorar PM2
pm2 monit
```

### 3. Health Check Automatizado
```bash
# Criar script de health check
nano health-check.sh
```

```bash
#!/bin/bash

# Verificar se a aplicação está respondendo
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "$(date): Health check OK"
    exit 0
else
    echo "$(date): Health check FAILED"
    
    # Tentar reiniciar
    pm2 restart pesquisa-clima
    
    # Aguardar 10 segundos
    sleep 10
    
    # Verificar novamente
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo "$(date): Aplicação reiniciada com sucesso"
    else
        echo "$(date): FALHA CRÍTICA - Aplicação não respondeu ao restart"
        # Enviar notificação (email, Slack, etc.)
        # mail -s "CRITICAL: Pesquisa Clima Down" admin@empresa.com
    fi
    
    exit 1
fi
```

```bash
# Agendar health check (a cada 5 minutos)
*/5 * * * * /home/deploy/pesquisadeclima-nitai/health-check.sh >> /home/deploy/backups/health.log 2>&1
```

## Troubleshooting

### 1. Problemas Comuns

#### Aplicação não inicia
```bash
# Verificar logs
pm2 logs pesquisa-clima --lines 50

# Verificar variáveis de ambiente
printenv | grep OPENROUTER

# Verificar permissões
ls -la /home/deploy/pesquisadeclima-nitai/

# Reiniciar manualmente
node server.js
```

#### Erro de porta em uso
```bash
# Verificar processo na porta
sudo lsof -i :3001

# Matar processo
sudo kill -9 PID_DO_PROCESSO

# Reiniciar PM2
pm2 restart pesquisa-clima
```

#### Erro de banco de dados
```bash
# Verificar permissões do banco
ls -la database.db

# Verificar se banco está corrompido
sqlite3 database.db ".schema"

# Restaurar backup
cp /home/deploy/backups/database_YYYYMMDD_HHMMSS.db database.db
```

#### Erro de API OpenRouter
```bash
# Testar chave API
curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"openai/gpt-oss-120b:free","messages":[{"role":"user","content":"test"}]}'

# Verificar rate limit
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  https://openrouter.ai/api/v1/auth/key
```

### 2. Logs Importantes

#### PM2 Logs
```bash
# Logs completos
pm2 logs pesquisa-clima

# Logs de erro
pm2 logs pesquisa-clima --err

# Logs recentes
pm2 logs pesquisa-clima --lines 100

# Logs em tempo real
pm2 logs pesquisa-clima --watch
```

#### Nginx Logs
```bash
# Logs de acesso
sudo tail -f /var/log/nginx/access.log

# Logs de erro
sudo tail -f /var/log/nginx/error.log

# Logs específicos do site
sudo tail -f /var/log/nginx/pesquisa-clima.access.log
```

#### System Logs
```bash
# Logs do sistema
sudo journalctl -u nginx -f

# Logs de autenticação
sudo tail -f /var/log/auth.log

# Logs do kernel
sudo dmesg | tail -f
```

## Manutenção Programada

### 1. Tarefas Semanais
```bash
#!/bin/bash
# weekly-maintenance.sh

echo "Iniciando manutenção semanal..."

# Verificar espaço em disco
echo "Espaço em disco:"
df -h

# Verificar uso de memória
echo "Uso de memória:"
free -h

# Verificar logs de erros
echo "Logs de erros recentes:"
grep -i error /home/deploy/pesquisadeclima-nitai/logs/err.log | tail -10

# Verificar status do PM2
echo "Status PM2:"
pm2 status

# Verificar certificado SSL
echo "Status SSL:"
sudo certbot certificates

# Limpar logs antigos
find /home/deploy/pesquisadeclima-nitai/logs -name "*.log" -mtime +7 -delete

echo "Manutenção semanal concluída"
```

### 2. Tarefas Mensais
```bash
#!/bin/bash
# monthly-maintenance.sh

echo "Iniciando manutenção mensal..."

# Atualizar sistema
echo "Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Atualizar dependências npm
echo "Atualizando dependências..."
cd /home/deploy/pesquisadeclima-nitai
npm audit fix
npm update

# Verificar segurança
echo "Verificando segurança..."
npm audit

# Backup completo
echo "Backup completo..."
./backup-full.sh

# Verificar performance
echo "Verificando performance..."
pm2 monit

echo "Manutenção mensal concluída"
```

## Contatos e Suporte

### 1. Contatos de Emergência
- **Hospedagem**: [Contato da provedora]
- **Domínio**: [Contato do registrador]
- **API OpenRouter**: [Documentação de suporte]
- **Equipe Técnica**: [Contatos internos]

### 2. Links Úteis
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Guide](https://www.nginx.com/resources/wiki/)
- [Let's Encrypt](https://letsencrypt.org/docs/)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs/)

### 3. Comandos Rápidos
```bash
# Reiniciar tudo
pm2 restart all && sudo systemctl restart nginx

# Verificar status completo
pm2 status && sudo systemctl status nginx

# Logs completos
pm2 logs && sudo tail -f /var/log/nginx/error.log

# Backup rápido
cp database.db backups/database_$(date +%Y%m%d_%H%M%S).db
```

---

## Checklist de Deploy

### Pré-Deploy
- [ ] Servidor configurado e atualizado
- [ ] Node.js e PM2 instalados
- [ ] Chave SSH configurada
- [ ] Domínio configurado (opcional)
- [ ] SSL/TLS configurado (recomendado)
- [ ] Firewall configurado
- [ ] Backup atualizado

### Deploy
- [ ] Código clonado do GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Dependências instaladas
- [ ] PM2 configurado e iniciado
- [ ] Nginx configurado (opcional)
- [ ] Health check funcionando
- [ ] Logs monitorando

### Pós-Deploy
- [ ] Testar todas as funcionalidades
- [ ] Verificar performance
- [ ] Configurar backup automático
- [ ] Configurar monitoramento
- [ ] Documentar procedimentos
- [ ] Treinar equipe de suporte

---

*Última atualização: 20/04/2026*
*Responsável: [Seu Nome]*
