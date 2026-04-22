# 🖥️ VPS Pesquisa Clima - Estrutura Atualizada

**Data:** 20/04/2026  
**VPS:** srv1566743 (147.93.10.11)  
**Status:** ✅ VERIFICADO E ATUALIZADO

---

## 📂 Estrutura de Diretórios Confirmada

```
/var/www/
├── html/                    # Padrão Nginx (não usado)
└── sistemas/               # 🎯 PROJETOS AQUI
    └── pesquisa-clima/      # 🚀 PROJETO PRINCIPAL

/var/data/
└── databases/              # 🗄️ BANCOS DE DADOS
    └── pesquisa-clima.db   # 📊 BANCO SQLITE DO PROJETO

/home/
└── ubuntu/                 # Usuário ubuntu (se existir)
```

---

## 🔧 Comandos de Deploy Atualizados

### 📍 Caminho Correto do Projeto
**Localização:** `/var/www/sistemas/pesquisa-clima`

### 🚀 Script de Atualização (SEM mexer no banco)
```bash
# Conectar à VPS
ssh root@147.93.10.11

# Navegar para o projeto
cd /var/www/sistemas/pesquisa-clima

# Atualizar código
git pull origin main

# Instalar dependências
npm install --production

# Reiniciar aplicação
pm2 restart pesquisa-clima

# Verificar status
pm2 status
```

### 🗄️ Configuração do Banco de Dados
- **Caminho:** `/var/data/databases/pesquisa-clima.db`
- **Configuração .env:** `DB_PATH=/var/data/databases/pesquisa-clima.db`
- **⚠️ NUNCA ALTERAR** sem backup prévio

---

## 🚀 Comandos Úteis do Dia a Dia

### 📋 Verificação de Estrutura
```bash
# Ver projetos
ls -la /var/www/sistemas/

# Ver bancos de dados
ls -la /var/data/databases/

# Ver projeto atual
pwd
ls -la
```

### 📊 Monitoramento
```bash
# Status dos processos
pm2 status

# Logs da aplicação
pm2 logs pesquisa-clima --lines 20

# Health check
curl http://localhost:3001/api/health
```

### 🔍 Diagnóstico Rápido
```bash
# Comando completo de diagnóstico
echo "=== Projeto ===" && \
cd /var/www/sistemas/pesquisa-clima && \
pwd && \
ls -la && \
echo -e "\n=== Banco ===" && \
ls -la /var/data/databases/ && \
echo -e "\n=== PM2 ===" && \
pm2 status
```

---

## 📋 Fluxo de Deploy Correto

### ✅ Passo a Passo
1. **Fazer push** das mudanças para GitHub
2. **Conectar** à VPS: `ssh root@147.93.10.11`
3. **Navegar**: `cd /var/www/sistemas/pesquisa-clima`
4. **Atualizar**: `git pull origin main`
5. **Dependências**: `npm install --production`
6. **Reiniciar**: `pm2 restart pesquisa-clima`
7. **Verificar**: `pm2 status` e `pm2 logs`

### 🚨 Regras de Ouro
- ✅ **SEMPRE** usar `/var/www/sistemas/pesquisa-clima` como base
- ✅ **NUNCA** mexer em `/var/data/databases/` sem backup
- ✅ **SEMPRE** verificar logs após atualização
- ✅ **MANTER** estrutura separada (código vs dados)

---

## 🔧 Configurações Importantes

### Variáveis de Ambiente (.env)
```env
# Servidor
PORT=3001
NODE_ENV=production

# Banco de Dados (CRÍTICO)
DB_PATH=/var/data/databases/pesquisa-clima.db

# OpenRouter API
OPENROUTER_API_KEY=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
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openrouter/free
```

### PM2 Configuration
```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [{
    name: 'pesquisa-clima',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

---

## 📞 Contatos e Acesso

- **VPS IP:** 147.93.10.11
- **Projeto:** `/var/www/sistemas/pesquisa-clima`
- **Banco:** `/var/data/databases/pesquisa-clima.db`
- **GitHub:** https://github.com/nit-a11y/pesquisa-clima-vanilla

---

## 🎉 Resumo

**Estrutura Confirmada:** ✅  
**Comandos Atualizados:** ✅  
**Deploy Testado:** ✅  
**Banco Seguro:** ✅  

**Status:** PRONTO PARA USO PRODUÇÃO

---

*Atualizado em: 20/04/2026*  
*Status: ✅ VERIFICADO E TESTADO*
