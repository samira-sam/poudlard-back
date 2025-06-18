const resetPasswordService = require('../Services/ResetPasswordService');
const { envoyerEmailResetMotDePasse } = require('../Services/EmailService'); // ou le chemin correct

class ResetPasswordController {
  async demanderReset(req, res) {
    try {
      const { email } = req.body;
      const token = await resetPasswordService.genererTokenReset(email);
      await envoyerEmailResetMotDePasse(email, token);
      res.json({ message: 'Email de réinitialisation envoyé' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async resetMotDePasse(req, res) {
    try {
      const { token, nouveauMotDePasse } = req.body;
      await resetPasswordService.resetMotDePasse(token, nouveauMotDePasse);
      res.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = ResetPasswordController;
