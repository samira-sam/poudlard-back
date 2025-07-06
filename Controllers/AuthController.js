const AuthService = require('../Services/AuthService');

class AuthController {
  // Inscription
  async register(req, res) {
    try {
      const newUser = await AuthService.register(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Connexion
 /* version d'aujourdhui async login(req, res) {
    try {
      const { token, utilisateur } = await AuthService.login(req.body);
      res.json({ token, utilisateur });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }*/ // Connexion
async login(req, res) {
  try {
    const { token, utilisateur } = await AuthService.login(req.body);

    // On vérifie le rôle
    if (utilisateur.role?.name === 'admin') {
      // Cookie HTTP Only sécurisé
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true en prod avec HTTPS
        sameSite: 'Strict',
        maxAge: 3 * 60 * 60 * 1000 // 3 heures
      });

      return res.json({ message: "Connexion admin réussie", utilisateur });
    }

    // Pour tous les autres : token dans la réponse
    res.json({ token, utilisateur });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

  // Récupération de l'utilisateur connecté
  /*async getUser(req, res) {
    try {
      const utilisateur = await AuthService.getUserById(req.user.id);
      res.json(utilisateur);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }*/async getUser(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const utilisateur = await AuthService.getUserById(req.user.id);

    if (!utilisateur) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const { mot_de_passe, ...safeUser } = utilisateur; // si `mot_de_passe` existe
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
}

module.exports = new AuthController();
