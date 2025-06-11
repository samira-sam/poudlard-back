/**
 * Middleware pour vérifier que l'utilisateur connecté possède un rôle autorisé.
 * Il empêche également explicitement l'accès aux utilisateurs dont le rôle est nul ou non défini,
 * ce qui correspond aux comptes en attente de validation par un administrateur.
 *
 * @param {Array<string>} rolesAutorises - Liste des rôles autorisés à accéder à la route.
 */
/*const authorizeRole = (rolesAutorises) => {
  return (req, res, next) => {
    // Vérifie que les infos de l'utilisateur sont présentes et que le rôle est défini
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Accès interdit : votre compte est en attente de validation par un administrateur." });
    }

    const { role } = req.user;

    // Vérifie si le rôle de l'utilisateur est dans la liste autorisée
    if (rolesAutorises.includes(role)) {
      return next();
    }

    // Rôle non autorisé
    return res.status(403).json({ message: "Accès interdit : vous n'avez pas les droits nécessaires." });
  };
};

module.exports = authorizeRole;*/

// backend/middlewares/authorizeRole.js (ou un nom similaire)

/**
 * Middleware d'autorisation qui vérifie si l'utilisateur a l'un des rôles autorisés.
 * @param {string[]} rolesAutorises - Un tableau de noms de rôles (chaînes de caractères) autorisés pour cette route.
 * Ex: ['admin', 'professeur', 'eleve']
 */
const authorizeRole = (rolesAutorises) => {
  return (req, res, next) => {
    // Vérifie que les informations de l'utilisateur (issues du token JWT) sont présentes
    // et que l'objet rôle avec sa propriété 'name' est défini.
    if (!req.user || !req.user.role || !req.user.role.name) {
      // Si l'utilisateur n'est pas authentifié (req.user absent) ou si le rôle n'est pas dans le token.
      // Cela indique un problème d'authentification ou de structure du token,
      // non pas une validation en attente. Le message doit être plus générique.
      return res.status(403).json({ message: "Accès interdit : Rôle utilisateur non identifié ou token invalide." });
    }

    // ⭐ POINT CLÉ : Accéder au NOM du rôle ⭐
    const userRoleName = req.user.role.name; // Ex: 'eleve', 'professeur', 'admin'

    // Vérifie si le nom du rôle de l'utilisateur est inclus dans la liste des rôles autorisés
    if (rolesAutorises.includes(userRoleName)) {
      return next(); // L'utilisateur a un rôle autorisé, on continue
    }

    // Si le rôle de l'utilisateur n'est pas dans la liste des rôles autorisés
    return res.status(403).json({ message: "Accès interdit : Vous n'avez pas les droits nécessaires." });
  };
};

module.exports = authorizeRole;

