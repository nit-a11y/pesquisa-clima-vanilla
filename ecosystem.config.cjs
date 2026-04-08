// Configuração PM2 para produção na VPS
module.exports = {
  apps: [{
    name: 'pesquisa-clima',
    cwd: '/var/www/sistemas/pesquisa-clima',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DB_PATH: '/var/data/databases/pesquisa-clima.db',
      PUBLIC_URL: 'https://pesquisadeclima.nordesteloc.cloud',
      TRUST_PROXY: 'loopback, linklocal, uniquelocal'
    },
    log_file: '/var/log/pm2/pesquisa-clima.log',
    out_file: '/var/log/pm2/pesquisa-clima-out.log',
    error_file: '/var/log/pm2/pesquisa-clima-error.log',
    merge_logs: true,
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
