// src/server.js
require('./config/env');
const app = require('./app');
const { PORT } = require('./config/env');
const prisma = require('./config/db');

const validateDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL manquant dans .env');
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('DATABASE_URL invalide (URL PostgreSQL attendue)');
  }

  const hostname = parsed.hostname;
  // Sur Render, l'hostname "dpg-xxxx-a" (sans domaine) est l'URL interne, non accessible depuis ta machine.
  if (hostname && hostname.startsWith('dpg-') && !hostname.includes('.')) {
    throw new Error(
      `DATABASE_URL pointe vers un host Render interne (${hostname}). Utilise l'External Database URL (avec un domaine), souvent avec ?sslmode=require.`
    );
  }
};

const start = async () => {
  try {
    validateDatabaseUrl();

    await prisma.$connect();
    console.log('[OK] Connexion a la base de donnees etablie');

    app.listen(PORT, () => {
      console.log(`Serveur TECH 221 demarre sur http://localhost:${PORT}`);
      console.log(`Swagger sur http://localhost:${PORT}/docs`);
      console.log(`OpenAPI JSON sur http://localhost:${PORT}/openapi.json`);
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production' && process.env.ALLOW_NO_DB === 'true') {
      console.error('[WARN] Base de donnees inaccessible, demarrage en mode degrade (Swagger OK):', err?.message || err);
      app.listen(PORT, () => {
        console.log(`Serveur TECH 221 demarre sur http://localhost:${PORT}`);
        console.log(`Swagger sur http://localhost:${PORT}/docs`);
        console.log(`OpenAPI JSON sur http://localhost:${PORT}/openapi.json`);
      });
      return;
    }

    console.error('[ERREUR] Erreur de demarrage :', err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('\n[ARRET] Serveur arrete proprement');
  process.exit(0);
});

start();
