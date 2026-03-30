// src/validations/affectation.schema.js
const { z } = require('zod');

const createAffectationSchema = z.object({
  employeId: z.number({ required_error: "L'employé est obligatoire" }).int().positive(),
  projetId: z.number({ required_error: 'Le projet est obligatoire' }).int().positive(),
  role: z.string({ required_error: 'Le rôle est obligatoire' }).min(1),
  dateAffectation: z.coerce.date({ required_error: "La date d'affectation est obligatoire" }),
});

const updateAffectationSchema = z.object({
  role: z.string().min(1).optional(),
  dateAffectation: z.coerce.date().optional(),
});

module.exports = { createAffectationSchema, updateAffectationSchema };
