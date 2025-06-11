require('dotenv').config(); // ← À AJOUTER ABSOLUMENT pour EMAIL_USER, EMAIL_PASS

const nodemailer = require('nodemailer');

// Création du transporteur Nodemailer pour Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test immédiat du transporteur
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Échec de la connexion au service mail :', error);
  } else {
    console.log('✅ Transporteur mail prêt à envoyer.');
  }
});

// Fonction d'envoi d'email
async function envoyerEmailConfirmation(emailUtilisateur, nomUtilisateur) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailUtilisateur,
    subject: 'Bienvenue à Poudlard ! 🦉 Ton inscription est confirmée.',
    html: `
      <h1>Bienvenue à Poudlard, ${nomUtilisateur} !</h1>
      <p>Ta chouette est bien arrivée avec ton inscription !</p>
      <p>Ton compte a été créé avec succès.</p>
      <p>Un administrateur de l'école examinera bientôt ta demande et t'attribuera ton rôle (Élève, Professeur, ou peut-être même une autre surprise !).</p>
      <p>En attendant, tu peux rêver à ta future maison : Gryffondor, Serpentard, Poufsouffle ou Serdaigle ?</p>
      <p>À très bientôt dans les couloirs de Poudlard !</p>
      <p>L'équipe d'admission de Poudlard</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📨 Email de confirmation envoyé à ${emailUtilisateur}`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi de l'email à ${emailUtilisateur} :`, error);
  }
}

module.exports = {
  envoyerEmailConfirmation
};
