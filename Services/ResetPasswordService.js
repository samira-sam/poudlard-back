const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Utilisateur = require('../Models/Utilisateur');

class ResetPasswordService {
  // Génère un token, sauvegarde avec expiration dans la BDD
  async genererTokenReset(email) {
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      throw new Error('Utilisateur non trouvé');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiration = Date.now() + 3600000; // 1 heure

    utilisateur.resetPasswordToken = token;
    utilisateur.resetPasswordExpires = expiration;

    await utilisateur.save();

    return token;
  }

  // Vérifie si token est valide (existe et pas expiré)
  async verifierToken(token) {
    const utilisateur = await Utilisateur.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!utilisateur) {
      throw new Error('Token invalide ou expiré');
    }

    return utilisateur;
  }

  // Met à jour le mot de passe (hashé) et supprime token + expiration
  async resetMotDePasse(token, nouveauMotDePasse) {
    const utilisateur = await this.verifierToken(token);

    const hash = await bcrypt.hash(nouveauMotDePasse, 10);
    utilisateur.mot_de_passe = hash;
    utilisateur.resetPasswordToken = null;
    utilisateur.resetPasswordExpires = null;

    await utilisateur.save();
  }
}

module.exports = new ResetPasswordService();
