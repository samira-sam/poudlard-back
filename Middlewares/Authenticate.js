/*const jwt = require('jsonwebtoken');

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
};*/




const jwt = require('jsonwebtoken');

module.exports.authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : req.cookies.admin_token;

  if (!token) {
    console.warn('Aucun token fourni');

    // Vérifier si la requête attend une page HTML (navigateur)
    const acceptHeader = req.headers.accept || '';
    if (acceptHeader.includes('text/html')) {
      // Redirection vers la page de connexion
      return res.redirect('http://localhost:5175/connexion');
    }

    // Sinon, requête API -> réponse JSON 401
    return res.status(401).json({ error: 'Accès non autorisé : token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé avec succès:', decoded);

    if (!decoded.role) {
      console.warn("Le token ne contient pas de rôle. Token :", decoded);
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Erreur de vérification du token :', err.message);

    const acceptHeader = req.headers.accept || '';
    if (acceptHeader.includes('text/html')) {
      return res.redirect('/connexion');
    }

    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};
