// src/validations/projet.schema.js
const { z } = require('zod');

const STATUTS_VALIDES = ['BROUILLON', 'EN_COURS', 'TERMINE', 'ANNULE'];

const createProjetSchema = z
  .object({
    nom: z.string({ required_error: 'Le nom est obligatoire' }).min(1),
    description: z.string().optional(),
    dateDebut: z.coerce.date({ required_error: 'La date de début est obligatoire' }),
    dateFin: z.coerce.date().optional(),
    statut: z.enum(['BROUILLON', 'EN_COURS', 'TERMINE', 'ANNULE']).default('BROUILLON'),
  })
  .refine(
    (data) => !data.dateFin || data.dateFin >= data.dateDebut,
    { message: 'La date de fin doit être >= date de début', path: ['dateFin'] }
  );

const updateProjetSchema = z
  .object({
    nom: z.string().min(1).optional(),
    description: z.string().optional(),
    dateDebut: z.coerce.date().optional(),
    dateFin: z.coerce.date().optional().nullable(),
    statut: z.enum(['BROUILLON', 'EN_COURS', 'TERMINE', 'ANNULE']).optional(),
  })
  .refine(
    (data) => {
      if (data.dateFin && data.dateDebut) return data.dateFin >= data.dateDebut;
      return true;
    },
    { message: 'La date de fin doit être >= date de début', path: ['dateFin'] }
  );

module.exports = { createProjetSchema, updateProjetSchema };
