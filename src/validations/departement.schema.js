// src/validations/departement.schema.js
const { z } = require('zod');

const createDepartementSchema = z.object({
  code: z
    .string({ required_error: 'Le code est obligatoire' })
    .min(2, 'Le code doit contenir au moins 2 caractères')
    .max(10, 'Le code ne doit pas dépasser 10 caractères')
    .toUpperCase(),
  libelle: z
    .string({ required_error: 'Le libellé est obligatoire' })
    .min(1, 'Le libellé ne peut pas être vide'),
});

const updateDepartementSchema = z.object({
  code: z.string().min(2).max(10).toUpperCase().optional(),
  libelle: z.string().min(1).optional(),
  archive: z.boolean().optional(),
});

module.exports = { createDepartementSchema, updateDepartementSchema };
