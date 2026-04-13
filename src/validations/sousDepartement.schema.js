// src/validations/sousDepartement.schema.js
const { z } = require('zod');

const createSousDepartementSchema = z.object({
  sousDepartement: z
    .string({ required_error: 'Le sous-département est obligatoire' })
    .trim()
    .min(1, 'Le sous-département ne peut pas être vide')
    .max(50, 'Le sous-département ne doit pas dépasser 50 caractères'),
});

const updateSousDepartementSchema = z.object({
  sousDepartement: z.string().trim().min(1).max(50).optional(),
  archive: z.boolean().optional(),
});

module.exports = { createSousDepartementSchema, updateSousDepartementSchema };

