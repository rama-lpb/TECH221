// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const app = express();

// Sécurité & parsing
app.use(helmet());
// Configuration CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? '*'  // Autoriser toutes les origines en production
    : ['http://localhost:3000', 'http://localhost:5173'],  // Origines autorisées en développement
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Swagger UI
const swaggerPath = path.join(__dirname, '../openapi.yaml');
const swaggerUiOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCss: '.swagger-ui .topbar { display: none }',
};

// Recharge le fichier OpenAPI à chaque requête (évite le cache côté serveur / nodemon)
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  try {
    const swaggerDocument = YAML.load(swaggerPath);
    return swaggerUi.setup(swaggerDocument, swaggerUiOptions)(req, res, next);
  } catch (err) {
    return next(err);
  }
});

// Debug: permet de vérifier rapidement le contenu servi
app.get('/openapi.json', (req, res, next) => {
  try {
    const swaggerDocument = YAML.load(swaggerPath);
    res.json(swaggerDocument);
  } catch (err) {
    next(err);
  }
});

// Routes
app.use('/api/v1', routes);

// 404
app.use(notFound);

// Gestion des erreurs globale
app.use(errorHandler);

module.exports = app;
