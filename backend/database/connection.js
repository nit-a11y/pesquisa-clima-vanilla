import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Usa variável de ambiente ou fallback para desenvolvimento
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../pesquisa-clima.db');

// Conexão com banco de dados SQLite
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err.message);
  } else {
    console.log('Conectado ao banco SQLite');
  }
});

// Inicialização das tabelas
export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS survey_responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT NOT NULL,
          answers TEXT NOT NULL,
          comments TEXT NOT NULL,
          unidade TEXT
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

export { db };
