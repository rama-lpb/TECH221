// src/validations/employe.schema.js
const { z } = require('zod');

const createEmployeSchema = z.object({
  prenom: z.string({ required_error: 'Le prénom est obligatoire' }).min(1),
  nom: z.string({ required_error: 'Le nom est obligatoire' }).min(1),
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email('Email invalide'),
  telephone: z
    .string({ required_error: 'Le téléphone est obligatoire' })
    .regex(/^\+?\d{6,15}$/, 'Numéro de téléphone invalide (min 6 chiffres)'),
  departementId: z
    .number({ required_error: 'Le département est obligatoire' })
    .int()
    .positive(),
  photoUrl: z.string().url('URL de photo invalide').optional(),
});

const updateEmployeSchema = z.object({
  prenom: z.string().min(1).optional(),
  nom: z.string().min(1).optional(),
  email: z.string().email('Email invalide').optional(),
  telephone: z
    .string()
    .regex(/^\+?\d{6,15}$/, 'Numéro de téléphone invalide')
    .optional(),
  departementId: z.number().int().positive().optional(),
  photoUrl: z.string().url('URL de photo invalide').optional().nullable(),
});

module.exports = { createEmployeSchema, updateEmployeSchema };
