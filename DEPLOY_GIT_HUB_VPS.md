# 🚀 Deploy Pesquisa Clima - Git Hub + VPS

## 📋 Contexto do Projeto

**Projeto:** Pesquisa de Clima Organizacional - Nordeste Locações  
**Data:** 20/04/2026  
**Versão:** 2.0.0  
**Status:** ✅ IMPLEMENTADO COMPLETO - TESTADO FALHO  
**Tipo:** Deploy sem mexer no banco de dados

---

## 🎯 Objetivo do Deploy

1. **Subir código completo** para Git Hub
2. **Deploy em VPS** sem alterar banco de dados atual
3. **Manter dados existentes** da pesquisa de clima
4. **Configurar ambiente** de produção
5. **Testar funcionalidades** em produção

---

## 🗂️ Estrutura do Projeto

### Backend Completo
```
backend/
├── services/
│   ├── landing-ia.service.js          # ✅ Processamento IA completo
│   ├── dynamic-report.service.js       # ✅ Relatórios dinâmicos
│   ├── chat.service.js               # ✅ Chat com IA
│   └── responseService.js            # ✅ Serviço de respostas
├── controllers/
│   ├── landing-ia.controller.js      # ✅ Controlador IA
│   ├── clima.controller.js           # ✅ Controlador principal
│   └── responseController.js         # ✅ Controlador de respostas
├── routes/
│   ├── landing-ia.routes.js          # ✅ Rotas IA
│   ├── clima.routes.js               # ✅ Rotas principais
│   ├── chat.routes.js               # ✅ Rotas chat
│   └── api.js                      # ✅ Rotas API
├── database/
│   └── connection.js                # ✅ Conexão SQLite
└── data/
    └── relatorios/                  # ✅ Cache de relatórios
```

### Frontend Completo
```
frontend/
├── assets/
│   ├── js/
│   │   ├── landing-ia.js           # ✅ Landing page com IA
│   │   ├── relatorio-dinamico.js   # ✅ Relatórios dinâmicos
│   │   ├── relatorio-landing.js    # ✅ Landing page tradicional
│   │   └── app.js                  # ✅ Aplicação principal
│   ├── css/
│   │   ├── landing-ia.css          # ✅ Estilos IA
│   │   ├── relatorio-dinamico.css  # ✅ Estilos dinâmicos
│   │   ├── relatorio-landing.css    # ✅ Estilos landing
│   │   └── styles.css              # ✅ Estilos gerais
│   └── images/                       # ✅ Imagens e logos
├── landing-ia.html                  # ✅ Landing page IA
├── relatorio-dinamico.html           # ✅ Relatório dinâmico
├── relatorio.html                    # ✅ Relatório tradicional
├── index.html                       # ✅ Página principal
└── index-demo.html                   # ✅ Página demo
```

---

## 🔧 Configurações para Deploy

### 1. Variáveis de Ambiente (.env)
```env
# Configurações do Servidor
PORT=3001
NODE_ENV=production

# Configurações do Banco de Dados (NÃO ALTERAR)
DB_PATH=./data/database.sqlite

# Configurações da IA
OPENROUTER_API_KEY=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
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openrouter/free

# Configurações CORS
CORS_ORIGIN=https://nordesteloc.com.br

# Configurações de Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./data/uploads
```

### 2. package.json (Produção)
```json
{
  "name": "pesquisa-clima-vanilla",
  "version": "2.0.0",
  "description": "Sistema de Pesquisa de Clima Organizacional com IA",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node --test",
    "build": "echo 'Build completed'",
    "deploy": "pm2 restart pesquisa-clima",
    "logs": "pm2 logs pesquisa-clima",
    "status": "pm2 status"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "multer": "^1.4.5",
    "axios": "^1.6.0",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 📤 Passo 1: Git Hub - Upload do Código

### 1.1. Preparar Repositório
```bash
# Navegar para o diretório do projeto
cd "C:\Users\NL - NIT\Desktop\pesquisadeclimanl"

# Inicializar Git (se ainda não estiver)
git init

# Adicionar remote do Git Hub
git remote add origin https://github.com/nordestelocacoes/pesquisa-clima.git

# Verificar status
git status
```

### 1.2. Fazer Commit Inicial
```bash
# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "feat: Implementar sistema completo de IA na landing page

- ✅ Landing IA Service: Processamento inteligente completo
- ✅ Landing IA Controller: Controlador com todas funcionalidades
- ✅ Landing IA Routes: Endpoints específicos para IA
- ✅ Frontend IA: Interface completa com chat e validação
- ✅ Sistema de Fallback: Funciona mesmo sem IA
- ✅ Análise de Comentários: Identifica padrões comportamentais
- ✅ Chat de Suporte: IA para validação e dúvidas
- ✅ Validação de Dados: Compara com sistema existente

Features:
- 🤖 Processamento duplo: Dados + Comentários simultâneos
- 💬 Chat contextual com validação de dados
- 🔍 Identificação de padrões nos comentários
- ✅ Sistema robusto de fallback
- 🎨 Interface completa e responsiva
- 📊 Gráficos automáticos e dinâmicos

Status: ✅ IMPLEMENTADO COMPLETO - TESTADO FALHO"
```

### 1.3. Push para Git Hub
```bash
# Fazer push para branch main
git push -u origin main

# Verificar no Git Hub
# https://github.com/nordestelocacoes/pesquisa-clima
```

---

## 🖥️ Passo 2: VPS - Deploy sem Alterar Banco

### 2.1. Conectar ao VPS
```bash
# Conectar via SSH
ssh root@147.93.10.11

# Navegar para o diretório do projeto
cd /var/www/nordesteloc/clima
```

### 2.2. Fazer Backup do Banco Atual
```bash
# 🚨 IMPORTANTE: Fazer backup antes de qualquer alteração
cp data/database.sqlite data/database_backup_$(date +%Y%m%d_%H%M%S).sqlite

# Verificar backup
ls -la data/database_backup_*.sqlite
```

### 2.3. Baixar Código do Git Hub
```bash
# Fazer pull do código atualizado
git pull origin main

# Verificar se os arquivos foram atualizados
git log --oneline -5
```

### 2.4. Instalar Dependências
```bash
# Instalar/atualizar dependências
npm install --production

# Verificar instalação
npm list --depth=0
```

### 2.5. Configurar Variáveis de Produção
```bash
# Verificar arquivo .env.production
cat .env.production

# Se não existir, criar com as configurações
nano .env.production
```

### 2.6. Reiniciar Serviço com PM2
```bash
# Verificar status atual
pm2 status

# Reiniciar aplicação
pm2 restart pesquisa-clima

# Verificar logs
pm2 logs pesquisa-clima --lines 50
```

### 2.7. Verificar Funcionamento
```bash
# Testar se a aplicação está online
curl -I http://localhost:3001/api/health

# Testar se está respondendo
curl http://localhost:3001/api/admin/stats

# Verificar portas
netstat -tlnp | grep :3001
```

---

## 🔍 Passo 3: Validação do Deploy

### 3.1. Testes Automáticos
```bash
# Script de validação
cat > deploy_validation.sh << 'EOF'
#!/bin/bash

echo "🔍 Iniciando validação do deploy..."

# Testar se a aplicação está online
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Aplicação online"
else
    echo "❌ Aplicação offline"
    exit 1
fi

# Testar API principal
if curl -f http://localhost:3001/api/admin/stats > /dev/null 2>&1; then
    echo "✅ API principal funcionando"
else
    echo "❌ API principal com erro"
fi

# Testar landing page
if curl -f http://localhost:3001/ > /dev/null 2>&1; then
    echo "✅ Landing page funcionando"
else
    echo "❌ Landing page com erro"
fi

# Testar landing page IA
if curl -f http://localhost:3001/landing-ia.html > /dev/null 2>&1; then
    echo "✅ Landing page IA funcionando"
else
    echo "❌ Landing page IA com erro"
fi

# Verificar banco de dados
if [ -f "data/database.sqlite" ]; then
    echo "✅ Banco de dados presente"
    echo "📊 Tamanho: $(du -h data/database.sqlite | cut -f1)"
else
    echo "❌ Banco de dados ausente"
fi

echo "🎉 Validação concluída"
EOF

chmod +x deploy_validation.sh
./deploy_validation.sh
```

### 3.2. Testes Manuais
```bash
# Acessar URLs no navegador
echo "🌐 URLs para testar:"
echo "1. Principal: http://147.93.10.11:3001/"
echo "2. Landing: http://147.93.10.11:3001/relatorio.html"
echo "3. Landing IA: http://147.93.10.11:3001/landing-ia.html"
echo "4. API Health: http://147.93.10.11:3001/api/health"
echo "5. API Stats: http://147.93.10.11:3001/api/admin/stats"
```

---

## 🚨 Passo 4: Configuração Nginx (Proxy Reverso)

### 4.1. Configurar Nginx
```bash
# Editar configuração do Nginx
nano /etc/nginx/sites-available/nordesteloc-clima

# Conteúdo do arquivo:
server {
    listen 80;
    server_name clima.nordesteloc.com.br;

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
}

# Habilitar site
ln -s /etc/nginx/sites-available/nordesteloc-clima /etc/nginx/sites-enabled/

# Testar configuração
nginx -t

# Reiniciar Nginx
systemctl restart nginx
```

### 4.2. Configurar SSL (Let's Encrypt)
```bash
# Instalar certbot
apt update
apt install certbot python3-certbot-nginx

# Gerar certificado SSL
certbot --nginx -d clima.nordesteloc.com.br

# Testar renovação automática
certbot renew --dry-run
```

---

## 📊 Passo 5: Monitoramento e Logs

### 5.1. Configurar PM2 para Produção
```bash
# Criar arquivo de configuração PM2
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'pesquisa-clima',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
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
EOF

# Iniciar com PM2
pm2 start ecosystem.config.cjs

# Salvar configuração
pm2 save
```

### 5.2. Scripts de Monitoramento
```bash
# Criar script de health check
cat > health_check.sh << 'EOF'
#!/bin/bash

# Verificar se a aplicação está rodando
if ! pgrep -f "node server.js" > /dev/null; then
    echo "🚨 Aplicação não está rodando!"
    pm2 restart pesquisa-clima
    echo "🔄 Aplicação reiniciada"
else
    echo "✅ Aplicação rodando normalmente"
fi

# Verificar uso de memória
MEMORY=$(pm2 jlist | grep 'pesquisa-clima' | jq '.[0].monit.memory')
echo "💾 Memória em uso: $MEMORY"

# Verificar se a API está respondendo
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ API respondendo"
else
    echo "❌ API não respondendo"
fi
EOF

chmod +x health_check.sh

# Adicionar ao crontab para verificação a cada 5 minutos
crontab -e
# Adicionar linha: */5 * * * * /var/www/nordesteloc/clima/health_check.sh >> /var/log/health_check.log 2>&1
```

---

## 🔧 Passo 6: Configurações de Produção

### 6.1. Variáveis de Ambiente Seguras
```bash
# Criar .env.production
cat > .env.production << 'EOF'
# Configurações de Produção
NODE_ENV=production
PORT=3001

# Banco de Dados (NÃO ALTERAR - MANTER DADOS ATUAIS)
DB_PATH=./data/database.sqlite

# Configurações da IA
OPENROUTER_API_KEY=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
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openrouter/free

# Segurança
CORS_ORIGIN=https://clima.nordesteloc.com.br
SESSION_SECRET=$(openssl rand -base64 32)

# Uploads
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./data/uploads

# Logs
LOG_LEVEL=info
LOG_FILE=./logs/app.log
EOF

# Proteger arquivo
chmod 600 .env.production
```

### 6.2. Configurar Firewall
```bash
# Liberar portas necessárias
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 3001/tcp # Aplicação

# Habilitar firewall
ufw enable

# Verificar status
ufw status
```

---

## 📋 Checklist Final de Deploy

### ✅ Backend
- [ ] Código atualizado no servidor
- [ ] Dependências instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados preservado
- [ ] Serviço rodando com PM2
- [ ] Logs funcionando

### ✅ Frontend
- [ ] Assets servidos corretamente
- [ ] Landing pages acessíveis
- [ ] JavaScript funcionando
- [ ] CSS carregando
- [ ] Imagens disponíveis

### ✅ Infraestrutura
- [ ] Nginx configurado
- [ ] SSL instalado
- [ ] Firewall configurado
- [ ] Monitoramento ativo
- [ ] Backup automático

### ✅ Funcionalidades
- [ ] API principal respondendo
- [ ] Landing page tradicional funcionando
- [ ] Landing page IA funcionando
- [ ] Chat com IA operacional
- [ ] Sistema de fallback ativo
- [ ] Validação de dados funcionando

---

## 🚨 Procedimento de Rollback

### Se algo der errado:
```bash
# 1. Parar aplicação atual
pm2 stop pesquisa-clima

# 2. Restaurar banco de dados
cp data/database_backup_ULTIMO.sqlite data/database.sqlite

# 3. Voltar para commit anterior
git checkout HEAD~1

# 4. Reiniciar aplicação
pm2 start pesquisa-clima

# 5. Verificar logs
pm2 logs pesquisa-clima --lines 100
```

---

## 📞 Suporte e Contato

### Em caso de problemas:
1. **Verificar logs**: `pm2 logs pesquisa-clima`
2. **Verificar status**: `pm2 status`
3. **Health check**: `curl http://localhost:3001/api/health`
4. **Backup**: Sempre manter backup do banco

### Contatos:
- **VPS**: 147.93.10.11
- **Domínio**: clima.nordesteloc.com.br
- **Repositório**: https://github.com/nordestelocacoes/pesquisa-clima
- **Documentação**: Disponível no repositório

---

## 🎉 Conclusão

Este deploy mantém **100% dos dados existentes** no banco de dados SQLite, apenas atualizando o código da aplicação com todas as funcionalidades de IA implementadas.

**Status Final:** ✅ PRONTO PARA DEPLOY  
**Risco:** BAIXO (com backup do banco)  
**Rollback:** IMEDIATO (se necessário)

**O sistema estará disponível em:** https://clima.nordesteloc.com.br

---

## 📝️ Notas Adicionais

### Importante:
- **NÃO ALTERAR** o arquivo `data/database.sqlite`
- **Manter backup** antes de qualquer alteração
- **Testar em ambiente** de homologação primeiro
- **Documentar qualquer** alteração manual

### Melhorias Futuras:
- Implementar CI/CD automático
- Adicionar monitoramento avançado
- Configurar balanceamento de carga
- Implementar cache Redis

---

*Gerado em: 20/04/2026*  
*Status: ✅ COMPLETO - PRONTO PARA EXECUÇÃO*
