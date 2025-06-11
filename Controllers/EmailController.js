const { envoyerEmailConfirmation } = require('../Services/EmailService');

// ... après l'ajout dans la DB :
await envoyerEmailConfirmation(nouvelUtilisateur.email, nouvelUtilisateur.prenom);