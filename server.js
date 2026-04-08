import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './backend/routes/api.js';
import { initDatabase } from './backend/database/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Confia no proxy (Nginx) para obter IP real do cliente
if (process.env.TRUST_PROXY) {
  app.set('trust proxy', process.env.TRUST_PROXY);
}

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Rotas da API
app.use('/api', apiRoutes);

// Rota principal - serve o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0-node'
  });
});

// Inicialização
async function startServer() {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      const publicUrl = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
      console.log(`🚀 Servidor rodando em ${publicUrl}`);
      console.log(`📊 API disponível em ${publicUrl}/api`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
