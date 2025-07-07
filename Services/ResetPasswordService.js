const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Utilisateur = require('../Models/Utilisateur');

class ResetPasswordService {
  // Génère un token, sauvegarde avec expiration dans la BDD
  async genererTokenReset(email) {
    console.log(`[genererTokenReset] Recherche utilisateur avec email: ${email}`);
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      console.error(`[genererTokenReset] Utilisateur non trouvé pour email: ${email}`);
      throw new Error('Utilisateur non trouvé');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiration = Date.now() + 3600000; // 1 heure

    console.log(`[genererTokenReset] Token généré: ${token}, expiration: ${new Date(expiration).toISOString()}`);

    utilisateur.resetPasswordToken = token;
    utilisateur.resetPasswordExpires = expiration;

    await utilisateur.save();
console.log(`[resetMotDePasse] utilisateur sauvegardé :`, utilisateur.toJSON());
    console.log('[genererTokenReset] Token et expiration sauvegardés en base');

    return token;
  }

  // Vérifie si token est valide (existe et pas expiré)
  async verifierToken(token) {
    console.log(`[verifierToken] Vérification du token: ${token}`);
    const utilisateur = await Utilisateur.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!utilisateur) {
      console.error('[verifierToken] Token invalide ou expiré');
      throw new Error("Ce lien de réinitialisation n'est plus valide. Veuillez refaire une demande.");
    }

    console.log(`[verifierToken] Token valide pour utilisateur ID: ${utilisateur.id_utilisateur}`);
    return utilisateur;
  }

  // Met à jour le mot de passe (hashé) et supprime token + expiration
  async resetMotDePasse(token, nouveauMotDePasse) {
    console.log(`[resetMotDePasse] Début reset mot de passe pour token: ${token}`);
    const utilisateur = await this.verifierToken(token);

    console.log(`[resetMotDePasse] Utilisateur trouvé: ID ${utilisateur.id_utilisateur}, email: ${utilisateur.email}`);
    const hash = await bcrypt.hash(nouveauMotDePasse, 10);
    console.log(`[resetMotDePasse] Mot de passe hashé: ${hash}`);

    utilisateur.mot_de_passe = hash;
    utilisateur.resetPasswordToken = null;
    utilisateur.resetPasswordExpires = null;

    await utilisateur.save();
    console.log(`[resetMotDePasse] Mot de passe mis à jour et token supprimé pour utilisateur ID: ${utilisateur.id_utilisateur}`);
  }
}

module.exports = new ResetPasswordService();
