import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = new URL('.env', import.meta.url);
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length && !line.startsWith('#')) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'OK' : 'MISSING');
console.log('OPENROUTER_BASE_URL:', process.env.OPENROUTER_BASE_URL);
console.log('OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL);

import apiRoutes from './backend/routes/api.js';
import climaRoutes from './backend/routes/clima.routes.js';
import landingIaRoutes from './backend/routes/landing-ia.routes.js';
import nitaiLocalRoutes from './backend/routes/nitai-local.routes.js';
import { initDatabase } from './backend/database/connection.js';

const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', true);
}

app.use(cors());
app.use(express.json());

// Middleware de logging para debug
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api', apiRoutes);
app.use('/api/clima', climaRoutes);
app.use('/api/landing-ia', landingIaRoutes);
app.use('/api/nitai-local', nitaiLocalRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.get('/relatorio/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/relatorio.html'));
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0-node'
  });
});

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