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
  async login(req, res) {
    try {
      const { token, utilisateur } = await AuthService.login(req.body);
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
