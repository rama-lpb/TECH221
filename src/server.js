// src/server.js
require('./config/env');
const app = require('./app');
const { PORT } = require('./config/env');
const prisma = require('./config/db');

const start = async () => {
  try {
    await prisma.$connect();
    console.log('[OK] Connexion a la base de donnees etablie');

    app.listen(PORT, () => {
      console.log(`Serveur TECH 221 demarre sur http://localhost:${PORT}`);
      console.log(`API disponible sur http://localhost:${PORT}/docs`);
    });
  } catch (err) {
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
