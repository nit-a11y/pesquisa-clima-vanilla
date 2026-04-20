# Configuração VPS - Pesquisa de Clima Organizacional

## Overview
Configuração completa do servidor VPS para hospedar o sistema de pesquisa de clima organizacional.

## Especificações do Servidor

### Hardware Recomendado
- **CPU**: 2 vCPUs mínimo
- **RAM**: 2GB+ recomendado
- **Storage**: 20GB+ SSD
- **Banda**: 1TB+ mensal

### Software
- **SO**: Ubuntu 22.04 LTS
- **Node.js**: v18.x LTS
- **PM2**: v5.x
- **Nginx**: v1.18+ (opcional)
- **SQLite**: v3.x

## Setup Inicial

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

### 2. Instalar Dependências
```bash
# Instalar dependências de produção
npm install --production

# Verificar instalação
npm ls --depth=0
```

### 3. Configurar Variáveis de Ambiente
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
```

### 4. Permissões do Banco de Dados
```bash
# Criar diretório para banco se não existir
mkdir -p data

# Permissões corretas
chmod 755 data
chmod 644 database.db
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
    time: true
  }]
};
```

### 2. Iniciar Aplicação com PM2
```bash
# Criar diretório de logs
mkdir -p logs

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Configurar startup automático
pm2 startup
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
    server_name SEU_DOMINIO.com.br;

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
    }

    # Servir arquivos estáticos diretamente
    location /assets/ {
        alias /home/deploy/pesquisadeclima-nitai/frontend/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### 2. Habilitar Site
```bash
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
sudo certbot --nginx -d SEU_DOMINIO.com.br

# Testar renovação automática
sudo certbot renew --dry-run
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
sudo ufw status
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
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
```

```bash
# Reiniciar Fail2Ban
sudo systemctl restart fail2ban
```

## Backup Automático

### 1. Script de Backup
```bash
# Criar script
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
cp $PROJECT_DIR/database.db $BACKUP_DIR/database_$DATE.db

# Backup dos arquivos do projeto
tar -czf $BACKUP_DIR/project_$DATE.tar.gz \
    --exclude=node_modules \
    --exclude=logs \
    --exclude=backups \
    -C $PROJECT_DIR .

# Backup das configurações
cp $PROJECT_DIR/.env $BACKUP_DIR/env_$DATE.backup
cp $PROJECT_DIR/ecosystem.config.js $BACKUP_DIR/ecosystem_$DATE.config

# Limpar backups antigos (manter últimos 30 dias)
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.backup" -mtime +30 -delete
find $BACKUP_DIR -name "*.config" -mtime +30 -delete

echo "Backup concluído: $DATE"
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

# Monitorar processos
ps aux | grep node
```

## Troubleshooting Comum

### Erro: "Port already in use"
```bash
# Verificar processo na porta
sudo lsof -i :3001

# Matar processo
sudo kill -9 PID_DO_PROCESSO

# Reiniciar PM2
pm2 restart pesquisa-clima
```

### Erro: "Permission denied"
```bash
# Verificar permissões
ls -la /home/deploy/pesquisadeclima-nitai/

# Corrigir permissões
sudo chown -R deploy:deploy /home/deploy/pesquisadeclima-nitai/
chmod -R 755 /home/deploy/pesquisadeclima-nitai/
```

### Erro: "Database locked"
```bash
# Verificar processo usando banco
sudo lsof database.db

# Reiniciar aplicação
pm2 restart pesquisa-clima
```

## Manutenção Programada

### Semanal
- [ ] Verificar logs de erros
- [ ] Monitorar uso de API OpenRouter
- [ ] Verificar espaço em disco
- [ ] Testar backup

### Mensal
- [ ] Atualizar dependências npm
- [ ] Verificar certificado SSL
- [ ] Analisar métricas de performance
- [ ] Revisar logs de segurança

### Trimestral
- [ ] Atualizar sistema Ubuntu
- [ ] Rotacionar chaves de API
- [ ] Backup completo externo
- [ ] Revisar configurações de segurança

## Comandos Úteis

### PM2
```bash
pm2 list                    # Listar aplicações
pm2 monit                   # Monitoramento
pm2 logs pesquisa-clima    # Ver logs
pm2 restart pesquisa-clima # Reiniciar
pm2 stop pesquisa-clima    # Parar
pm2 delete pesquisa-clima  # Remover
pm2 reloadLogs              # Recarregar logs
```

### Git
```bash
git status                  # Ver status
git pull origin main        # Atualizar código
git log --oneline -10       # Ver últimos commits
```

### Sistema
```bash
sudo systemctl status nginx     # Status Nginx
sudo ufw status                # Status firewall
df -h                          # Espaço em disco
free -h                        # Memória RAM
```

---

## Contatos de Emergência

- **Hospedagem**: [Contato da provedora]
- **Domínio**: [Contato do registrador]
- **API OpenRouter**: [Documentação de suporte]
- **Equipe Técnica**: [Contatos internos]

---

*Última atualização: 20/04/2026*
*Responsável: [Seu Nome]*
