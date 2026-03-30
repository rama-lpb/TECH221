// src/middlewares/validate.js

/**
 * Middleware de validation Zod
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'params' | 'query'} target
 */
const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return res.status(422).json({
        success: false,
        message: 'Données invalides',
        details: result.error.errors.map((e) => ({
          champ: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    req[target] = result.data;
    next();
  };
};

module.exports = validate;
