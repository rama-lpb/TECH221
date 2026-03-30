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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Swagger UI
const swaggerDocument = YAML.load(path.join(__dirname, '../openapi.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCss: '.swagger-ui .topbar { display: none }',
}));

// Routes
app.use('/api/v1', routes);

// 404
app.use(notFound);

// Gestion des erreurs globale
app.use(errorHandler);

module.exports = app;
