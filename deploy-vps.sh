#!/bin/bash
# Script de deploy na VPS - Executar na VPS Hostinger

echo "🚀 Iniciando deploy do Pesquisa Clima..."

# ETAPA 1: Preparar ambiente
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "📦 Instalando PM2 e Nginx..."
npm install -g pm2
apt install -y nginx git

# ETAPA 2: Criar estrutura de pastas
echo "📁 Criando estrutura..."
mkdir -p /var/www/sistemas
mkdir -p /var/data/databases
mkdir -p /var/data/uploads/pesquisa-clima
mkdir -p /var/log/pm2

# ETAPA 3: Clonar projeto
echo "⬇️ Clonando projeto do GitHub..."
cd /var/www/sistemas
git clone https://github.com/nit-a11y/pesquisa-clima-vanilla.git pesquisa-clima
cd pesquisa-clima

# ETAPA 4: Instalar dependências
echo "📦 Instalando dependências..."
npm install

# ETAPA 5: Iniciar com PM2
echo "▶️ Iniciando com PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd

# ETAPA 6: Configurar Nginx
echo "🔧 Configurando Nginx..."
rm /etc/nginx/sites-enabled/default

cat > /etc/nginx/sites-available/pesquisadeclima.nordesteloc.cloud << 'EOF'
server {
    listen 80;
    server_name pesquisadeclima.nordesteloc.cloud;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pesquisadeclima.nordesteloc.cloud;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -s /etc/nginx/sites-available/pesquisadeclima.nordesteloc.cloud /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# ETAPA 7: SSL
echo "🔒 Instalando SSL..."
apt install -y certbot python3-certbot-nginx
certbot --nginx -d pesquisadeclima.nordesteloc.cloud --agree-tos --non-interactive --email admin@nordesteloc.cloud

# ETAPA 8: Firewall
echo "🔥 Configurando firewall..."
apt install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://pesquisadeclima.nordesteloc.cloud"
