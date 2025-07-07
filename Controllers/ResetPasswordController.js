/*const resetPasswordService = require('../Services/ResetPasswordService');
// ⭐ Réactiver l'importation de l'EmailService ⭐
const { envoyerEmailReinitialisation } = require('../Services/EmailService');

class ResetPasswordController {
  async demanderReset(req, res) {
    try {
      const { email } = req.body;
      const token = await resetPasswordService.genererTokenReset(email);
      
      // ⭐ MODIFICATION ICI : Appel à l'envoi de l'e-mail avec le token ⭐
      await envoyerEmailReinitialisation(email, token);
      
      // Message de succès indiquant que l'e-mail a été envoyé
      res.json({ message: 'Un e-mail de réinitialisation a été envoyé à votre adresse.' });
    } catch (error) {
      console.error("Erreur lors de la demande de reset:", error.message);
      // Pour des raisons de sécurité, même si l'utilisateur n'existe pas,
      // il est courant de renvoyer un message générique pour ne pas "fuiter"
      // l'existence de comptes.
      if (error.message === 'Utilisateur non trouvé') {
        return res.status(200).json({ message: 'Si un compte correspondant existe, un e-mail de réinitialisation a été envoyé.' });
      }
      res.status(500).json({ message: 'Erreur serveur lors de la demande de réinitialisation.' });
    }
  }

  async resetMotDePasse(req, res) {
    try {
      // ⭐ RE-MODIFICATION ICI : Le token arrive via les paramètres d'URL (grâce au lien de l'e-mail) ⭐
      const { token } = req.params; 
      const { nouveauMotDePasse } = req.body;

      await resetPasswordService.resetMotDePasse(token, nouveauMotDePasse);
      res.json({ message: 'Votre mot de passe a été réinitialisé avec succès.' });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error.message);
      if (error.message.includes('Token invalide ou expiré')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Erreur serveur lors de la réinitialisation du mot de passe.' });
    }
  }
}

module.exports = ResetPasswordController;*/

const resetPasswordService = require('../Services/ResetPasswordService');
const { envoyerEmailReinitialisation } = require('../Services/EmailService');

class ResetPasswordController {
  async demanderReset(req, res) {
    try {
      const { email } = req.body;
      const token = await resetPasswordService.genererTokenReset(email);
      
      await envoyerEmailReinitialisation(email, token);
      
      res.json({ message: 'Un e-mail de réinitialisation a été envoyé à votre adresse.' });
    } catch (error) {
      console.error("Erreur lors de la demande de reset:", error.message);
      if (error.message === 'Utilisateur non trouvé') {
        return res.status(200).json({ message: 'Si un compte correspondant existe, un e-mail de réinitialisation a été envoyé.' });
      }
      res.status(500).json({ message: 'Erreur serveur lors de la demande de réinitialisation.' });
    }
  }

  async resetMotDePasse(req, res) {
    try {
      const { token } = req.params; 
      // ⭐ MODIFICATION ICI : Utilise 'newPassword' au lieu de 'nouveauMotDePasse' ⭐
      const { newPassword } = req.body; 

      // Ajout d'une vérification de base si le mot de passe est manquant
      if (!newPassword) {
        return res.status(400).json({ message: 'Le nouveau mot de passe est requis.' });
      }

      // Le service attend maintenant 'newPassword' grâce à notre précédente correction dans ResetPasswordService.js
      await resetPasswordService.resetMotDePasse(token, newPassword); 
      res.json({ message: 'Votre mot de passe a été réinitialisé avec succès.' });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error.message);
      if (error.message.includes('Token invalide ou expiré')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Erreur serveur lors de la réinitialisation du mot de passe.' });
    }
  }
}

module.exports = ResetPasswordController;