const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'tomate',
  max: 10, // máximo de conexiones simultáneas en el pool
  idleTimeoutMillis: 30000, // cierra conexiones inactivas después de 30s
  connectionTimeoutMillis: 5000, // si no hay conexión libre en 5s, lanza error (en vez de colgarse para siempre)
});

pool.on('error', (error) => {
  console.error('PostgreSQL connection pool error:', error);
});

module.exports = pool;