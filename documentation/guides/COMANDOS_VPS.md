# 🖥️ Comandos Úteis para VPS

## 📋 Lista de Arquivos e Pastas

### Listar conteúdo do diretório atual
```bash
ls -la
```

### Listar arquivos específicos
```bash
# Listar todos os arquivos .js
find . -name "*.js" -type f

# Listar todos os arquivos .css
find . -name "*.css" -type f

# Listar todos os arquivos .html
find . -name "*.html" -type f
```

### Listar estrutura de diretórios
```bash
# Ver estrutura completa
tree -L 3

# Listar apenas diretórios
find . -type d

# Listar com detalhes
ls -laR
```

## 🗂️ Estrutura do Projeto

### Verificar estrutura completa
```bash
# Estrutura em árvore
tree -a

# Estrutura compacta
find . -type f | head -20

# Estrutura por tamanho
du -sh *
```

### Listar arquivos por data
```bash
# Arquivos modificados recentemente
find . -type f -mtime -7 -ls

# Arquivos por ordem de modificação
ls -lt

# Arquivos criados hoje
find . -type f -daystart -ls
```

## 📊 Verificar Banco de Dados

### Procurar banco de dados
```bash
# Procurar arquivo database.sqlite
find /var/www -name "database.sqlite" 2>/dev/null

# Procurar qualquer arquivo .sqlite
find /var/www -name "*.sqlite" 2>/dev/null

# Verificar se existe no projeto atual
ls -la data/
```

### Verificar tamanho e informações
```bash
# Tamanho do banco se existir
du -h data/database.sqlite

# Informações detalhadas
stat data/database.sqlite

# Verificar se está sendo usado
lsof | grep database.sqlite
```

## 🔍 Verificar Processos e Portas

### Processos rodando
```bash
# Verificar processos Node.js
ps aux | grep node

# Verificar PM2
pm2 status

# Verificar processos na porta 3001
lsof -i :3001

# Verificar todas as portas
netstat -tlnp
```

### Logs do sistema
```bash
# Logs do PM2
pm2 logs pesquisa-clima --lines 50

# Logs do Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs da aplicação
tail -f logs/app.log
```

## 📁 Gerenciar Arquivos e Diretórios

### Criar diretórios
```bash
# Criar diretório de dados
mkdir -p data

# Criar diretório de logs
mkdir -p logs

# Criar diretório de uploads
mkdir -p data/uploads
```

### Copiar e mover arquivos
```bash
# Copiar banco de backup
cp database_backup_*.sqlite data/

# Mover arquivos
mv arquivo_antigo.js novo_arquivo.js

# Copiar com permissões
cp -r source/ destination/
```

### Permissões
```bash
# Dar permissão de execução
chmod +x script.sh

# Dar permissão de leitura/escrita
chmod 644 arquivo.js
chmod 755 diretório/

# Mudar dono
chown www-data:www-data data/
```

## 🌐 Testar Conectividade

### Testar localmente
```bash
# Testar API
curl http://localhost:3001/api/health

# Testar com headers
curl -H "Content-Type: application/json" http://localhost:3001/api/admin/stats

# Testar POST
curl -X POST -d '{"test": "data"}' http://localhost:3001/api/test
```

### Testar externamente
```bash
# Testar do VPS
curl -I http://147.93.10.11:3001/

# Testar HTTPS
curl -I https://clima.nordesteloc.com.br/

# Verificar resposta
curl -s -o /dev/null -w "%{http_code}" http://147.93.10.11:3001/api/health
```

## 🔧 Gerenciamento do PM2

### Comandos básicos
```bash
# Status dos processos
pm2 status

# Listar todos os processos
pm2 list

# Reiniciar aplicação
pm2 restart pesquisa-clima

# Parar aplicação
pm2 stop pesquisa-clima

# Iniciar aplicação
pm2 start pesquisa-clima
```

### Logs e monitoramento
```bash
# Logs em tempo real
pm2 logs pesquisa-clima

# Logs das últimas 100 linhas
pm2 logs pesquisa-clima --lines 100

# Logs com timestamp
pm2 logs pesquisa-clima --timestamp

# Monitoramento
pm2 monit
```

### Configuração
```bash
# Verificar configuração
pm2 show pesquisa-clima

# Salvar configuração
pm2 save

# Limpar processos mortos
pm2 delete all
```

## 📝️ Comandos de Git

### Status e informações
```bash
# Status do repositório
git status

# Verificar branch atual
git branch

# Verificar commits recentes
git log --oneline -10

# Verificar remotos
git remote -v
```

### Operações básicas
```bash
# Adicionar arquivos
git add .

# Fazer commit
git commit -m "mensagem do commit"

# Enviar para repositório
git push origin main

# Puxar atualizações
git pull origin main
```

### Limpeza
```bash
# Limpar arquivos não rastreados
git clean -fd

# Resetar para último commit
git reset --hard HEAD

# Verificar diferenças
git diff
```

## 🗂️ Busca de Arquivos

### Buscar por nome
```bash
# Buscar arquivos JavaScript
find . -name "*.js" -type f

# Buscar arquivos com padrão
find . -name "*landing*" -type f

# Buscar arquivo específico
find . -name "server.js" -type f
```

### Buscar por conteúdo
```bash
# Buscar texto em arquivos
grep -r "function" --include="*.js"

# Buscar com case insensitive
grep -ri "error" --include="*.log"

# Buscar em arquivos específicos
grep "landing" frontend/*.html
```

### Buscar recentes
```bash
# Arquivos modificados nas últimas 24h
find . -mtime -1 -type f

# Arquivos acessados recentemente
find . -atime -7 -type f

# Arquivos por tamanho
find . -size +1M -type f
```

## 🔍 Depuração

### Verificar variáveis de ambiente
```bash
# Verificar todas as variáveis
env | grep NODE

# Verificar variável específica
echo $NODE_ENV
echo $PORT

# Verificar arquivo .env
cat .env
```

### Verificar rede
```bash
# Verificar interfaces
ip addr show

# Verificar rotas
ip route

# Testar DNS
nslookup clima.nordesteloc.com.br

# Verificar firewall
ufw status
```

## 📊 Monitoramento de Recursos

### Uso de memória e CPU
```bash
# Uso de memória
free -h

# Uso de CPU
top -n 1

# Uso de disco
df -h

# Processos por uso de CPU
ps aux --sort=-%cpu | head -10
```

### Monitoramento em tempo real
```bash
# Monitoramento contínuo
watch -n 1 'free -h'

# Monitoramento de processos
watch -n 1 'ps aux | grep node'

# Monitoramento de portas
watch -n 1 'netstat -tlnp | grep :3001'
```

## 🚀 Scripts Úteis

### Script de verificação rápida
```bash
#!/bin/bash
echo "🔍 Verificação rápida do sistema..."

echo "📁 Estrutura do projeto:"
ls -la

echo "📊 Status do PM2:"
pm2 status

echo "🌐 Teste de API:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3001/api/health

echo "💾 Uso de disco:"
df -h | grep -E "(/$|/var)"

echo "🔥 Uso de CPU:"
top -bn1 | grep "Cpu(s)" | awk '{print $2}'
```

### Script de backup rápido
```bash
#!/bin/bash
DATA=$(date +%Y%m%d_%H%M%S)
echo "💾 Criando backup..."

# Backup do banco
cp data/database.sqlite data/database_backup_$DATA.sqlite

# Backup dos uploads
tar -czf uploads_backup_$DATA.tar.gz data/uploads/

echo "✅ Backup concluído: $DATA"
```

## 📋 Comandos Rápidos

### Navegação
```bash
# Voltar diretório
cd ..

# Ir para diretório home
cd ~

# Ir para diretório raiz
cd /

# Histórico de comandos
history
```

### Informações do sistema
```bash
# Informações do sistema
uname -a

# Versão do Ubuntu
lsb_release -a

# Espaço em disco
du -sh *

# Usuários logados
who
```

---

## 🎯 Como Usar

### Para verificação rápida:
```bash
# Copiar e colar os comandos necessários
# Exemplo: ls -la data/
```

### Para depuração:
```bash
# Verificar logs em tempo real
pm2 logs pesquisa-clima --lines 50

# Testar endpoints específicos
curl -X POST http://localhost:3001/api/landing-ia/processar-completo -H "Content-Type: application/json" -d '{"unidade": "all"}'
```

### Para monitoramento:
```bash
# Monitoramento contínuo
watch -n 5 'pm2 status && curl -s -o /dev/null -w "API: %{http_code}" http://localhost:3001/api/health'
```

---

*Salvo em 20/04/2026*  
*Comandos úteis para VPS e depuração*
