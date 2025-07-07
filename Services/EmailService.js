/*require('dotenv').config(); 

const nodemailer = require('nodemailer');

// Création du transporteur Nodemailer pour Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test  du transporteur
transporter.verify(function(error, success) {
  if (error) {
    console.error('Échec de la connexion au service mail :', error);
  } else {
    console.log(' Transporteur mail prêt à envoyer.');
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
    console.log(` Email de confirmation envoyé à ${emailUtilisateur}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email à ${emailUtilisateur} :`, error);
  }
}


async function envoyerEmailReinitialisation(emailUtilisateur, token) {
  const resetLink = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailUtilisateur,
    subject: '🔐 Réinitialisation de ton mot de passe Poudlard',
    html: `
      <h2>Demande de réinitialisation de mot de passe</h2>
      <p>Nous avons reçu une demande de réinitialisation de ton mot de passe pour ton compte Poudlard.</p>
      <p>Si tu es à l’origine de cette demande, clique sur le lien ci-dessous :</p>
      <a href="${resetLink}" target="_blank">Réinitialiser mon mot de passe</a>
      <p>Ce lien est valable pendant 1 heure.</p>
      <p>Si tu n’es pas à l’origine de cette demande, ignore ce message.</p>
      <p>L’équipe de Poudlard</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de réinitialisation envoyé à ${emailUtilisateur}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'e-mail à ${emailUtilisateur} :`, error);
  }
}

module.exports = {
  envoyerEmailConfirmation,
    envoyerEmailConfirmation,
  envoyerEmailReinitialisation
};*/
require('dotenv').config();

const nodemailer = require('nodemailer');

// Création du transporteur Nodemailer pour Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test du transporteur
transporter.verify(function(error, success) {
  if (error) {
    console.error('Échec de la connexion au service mail :', error);
  } else {
    console.log(' Transporteur mail prêt à envoyer.');
  }
});

// Fonction d'envoi d'email de confirmation
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
    console.log(` Email de confirmation envoyé à ${emailUtilisateur}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email à ${emailUtilisateur} :`, error);
    // ⭐ PROPAGER L'ERREUR POUR QUE LE CONTRÔLEUR PUISSE LA CAPTER ⭐
    throw new Error(`Échec de l'envoi de l'e-mail de confirmation : ${error.message}`);
  }
}

// ⭐ Fonction d'envoi d'email de réinitialisation de mot de passe ⭐
async function envoyerEmailReinitialisation(emailUtilisateur, token) {
  // ⭐ IMPORTANT : Assurez-vous que process.env.FRONTEND_URL est défini dans votre .env ⭐
  
  const resetLink = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe/${token}`; // le /${token} pour Vue Router

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailUtilisateur,
    subject: '🔐 Réinitialisation de ton mot de passe Poudlard',
    html: `
      <h2>Demande de réinitialisation de mot de passe</h2>
      <p>Nous avons reçu une demande de réinitialisation de ton mot de passe pour ton compte Poudlard.</p>
      <p>Si tu es à l’origine de cette demande, clique sur le lien ci-dessous :</p>
      <a href="${resetLink}" target="_blank">Réinitialiser mon mot de passe</a>
      <p>Ce lien est valable pendant 1 heure.</p>
      <p>Si tu n’es pas à l’origine de cette demande, ignore ce message.</p>
      <p>L’équipe de Poudlard</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de réinitialisation envoyé à ${emailUtilisateur}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'e-mail de réinitialisation à ${emailUtilisateur} :`, error);
    // ⭐ PROPAGER L'ERREUR POUR QUE LE CONTRÔLEUR PUISSE LA CAPTER ⭐
    throw new Error(`Échec de l'envoi de l'e-mail de réinitialisation : ${error.message}`);
  }
}

module.exports = {
  envoyerEmailConfirmation,
  envoyerEmailReinitialisation
};