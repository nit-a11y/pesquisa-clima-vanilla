// Configuração PM2 para múltiplos sistemas na VPS
module.exports = {
  apps: [
    {
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
      autorestart: true,
      max_restarts: 10
    },
    // Exemplo: adicionar novo sistema
    // {
    //   name: 'sistema-rh',
    //   cwd: '/var/www/sistemas/sistema-rh',
    //   script: 'npm',
    //   args: 'start',
    //   env: {
    //     NODE_ENV: 'production',
    //     PORT: 3001,
    //     DB_PATH: '/var/data/databases/sistema-rh.db',
    //     PUBLIC_URL: 'https://rh.nordesteloc.cloud',
    //     TRUST_PROXY: 'loopback, linklocal, uniquelocal'
    //   },
    //   log_file: '/var/log/pm2/sistema-rh.log',
    //   autorestart: true
    // }
  ]
};
