const success = (res, data, message = 'Succès', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const created = (res, data, message = 'Ressource créée avec succès') => {
  return success(res, data, message, 201);
};

const error = (res, message = 'Erreur serveur', statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

module.exports = { success, created, error };
