const jwt = require('jsonwebtoken');

module.exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decoded);
    req.user = decoded; // Ajouter les informations de l'utilisateur décodées dans la requête
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};
