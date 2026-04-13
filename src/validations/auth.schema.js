const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  role: z.enum(['ADMIN', 'MANAGER', 'USER']).optional(),
});

module.exports = {
  loginSchema,
  registerSchema,
};