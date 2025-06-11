const bcrypt = require('bcrypt');
const Utilisateur = require('../Models/Utilisateur');
const jwt = require('jsonwebtoken');
const EmailService = require('./EmailService'); // Vérifie le chemin !
const Role = require('../Models/Role');

class AuthService {
  // Inscription d'un utilisateur
  async register(data) {
    const { email, mot_de_passe, nom, prenom } = data;

    // Vérifier si l'email existe déjà
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) throw new Error("L'email est déjà pris");

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Créer un nouvel utilisateur
    const newUser = await Utilisateur.create({
      email,
      mot_de_passe: hashedPassword,
      nom,
      prenom,
    });

    // Envoi de l'email de confirmation (non bloquant)
    if (newUser?.email && newUser?.nom) {
      try {
        await EmailService.envoyerEmailConfirmation(newUser.email, newUser.nom);
      } catch (emailError) {
        console.error("L'inscription a réussi, mais l'email de confirmation n'a pas pu être envoyé :", emailError);
      }
    }

    // Ne jamais retourner le mot de passe
    const { mot_de_passe: _, ...safeUser } = newUser.toJSON();
    return safeUser;
  }

  // Connexion d'un utilisateur
  async login(data) {
    const { email, mot_de_passe } = data;

    // Trouver l'utilisateur par email, avec son rôle
    const utilisateur = await Utilisateur.findOne({
      where: { email },
      include: {
        model: Role,
        as: 'role',
        attributes: ['id_role', 'name']
      }
    });

    if (!utilisateur) throw new Error("Email ou mot de passe incorrect");

    if (!utilisateur.role) {
      throw new Error("Votre compte n’a pas encore été validé par un administrateur.");
    }

    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    if (!isMatch) throw new Error("Email ou mot de passe incorrect");

    // Créer le token JWT avec id + rôle minimal
    const tokenPayload = {
      id: utilisateur.id_utilisateur,
      role: {
        id: utilisateur.role.id_role,
        name: utilisateur.role.name
      }
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Ne pas renvoyer le mot de passe
    const { mot_de_passe: _, ...userWithoutPassword } = utilisateur.toJSON();

    return { token, utilisateur: userWithoutPassword };
  }

  // Récupérer un utilisateur par son id (avec son rôle)
  async getUserById(id) {
    const utilisateur = await Utilisateur.findByPk(id, {
      attributes: { exclude: ['mot_de_passe'] },
      include: {
        model: Role,
        as: 'role',
        attributes: ['id_role', 'name']
      }
    });

    if (!utilisateur) throw new Error("Utilisateur non trouvé");
    
    return utilisateur.get({ plain: true });
  }
}

module.exports = new AuthService();



/*
const bcrypt = require('bcrypt');
const Utilisateur = require('../Models/Utilisateur');
const Role = require('../Models/Role'); // <- à importer pour inclure les rôles
const jwt = require('jsonwebtoken');
const EmailService = require('./EmailService');

class AuthService {
  // Inscription d'un utilisateur
  async register(data) {
    const { email, mot_de_passe, nom, prenom } = data;

    // Vérifier si l'email existe déjà
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) throw new Error("L'email est déjà pris");

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Créer un nouvel utilisateur (sans rôle, il sera attribué par un admin)
    const newUser = await Utilisateur.create({
      email,
      mot_de_passe: hashedPassword,
      nom,
      prenom,
      id_role: null // ou tu peux omettre, Sequelize le mettra null par défaut
    });

    // Envoi de l'email de confirmation (non bloquant)
    if (newUser?.email && newUser?.nom) {
      try {
        await EmailService.envoyerEmailConfirmation(newUser.email, newUser.nom);
      } catch (emailError) {
        console.error("Inscription OK, mais email non envoyé :", emailError);
      }
    }

    return newUser;
  }

  // Connexion d'un utilisateur
  async login(data) {
  const { email, mot_de_passe } = data;

  console.log('Login: données reçues ->', { email, mot_de_passe: `${mot_de_passe}`, length: mot_de_passe?.length });

  // Trouver l'utilisateur avec son rôle associé
  const utilisateur = await Utilisateur.findOne({
    where: { email },
    include: {
      model: Role,
      as: 'role',
      attributes: ['name']
    }
  });

  if (!utilisateur) {
    console.error('Login error: utilisateur non trouvé pour email:', email);
    throw new Error("Email ou mot de passe incorrect");
  }

  console.log('Utilisateur trouvé:', utilisateur.toJSON());

  // Vérifie si un rôle a été attribué (i.e. validé par un admin)
  if (!utilisateur.id_role) {
    console.error('Login error: utilisateur sans rôle validé:', utilisateur.id_utilisateur);
    throw new Error("Votre compte n’a pas encore été validé par un administrateur.");
  }

  // Ajout d’un log sur le hash stocké en base (uniquement début pour éviter trop de data)
  console.log('Hash stocké (début):', utilisateur.mot_de_passe.substring(0, 20));

  // Vérifie le mot de passe
  // Vérifie aussi que mot_de_passe reçu n’a pas d’espaces, trim pour test
  const motDePasseTrim = mot_de_passe.trim();
  if (mot_de_passe !== motDePasseTrim) {
    console.warn(`Mot de passe reçu contient des espaces aux extrémités : "${mot_de_passe}" -> "${motDePasseTrim}"`);
  }

  const isMatch = await bcrypt.compare(motDePasseTrim, utilisateur.mot_de_passe);
  console.log('Mot de passe correspond:', isMatch);

  if (!isMatch) {
    console.error('Login error: mot de passe incorrect pour utilisateur:', email);
    throw new Error("Email ou mot de passe incorrect");
  }

  // Génère le token JWT
  const token = jwt.sign(
    {
      id: utilisateur.id_utilisateur,
      role: utilisateur.role?.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const { mot_de_passe: _, ...userWithoutPassword } = utilisateur.toJSON();

  return { token, utilisateur: userWithoutPassword };
}
 
  // Récupérer un utilisateur par son ID
  async getUserById(id) {
    const utilisateur = await Utilisateur.findByPk(id, {
      attributes: { exclude: ['mot_de_passe'] },
      include: {
        model: Role,
        as: 'role',
        attributes: ['name']
      }
    });

    if (!utilisateur) throw new Error("Utilisateur non trouvé");
    return utilisateur;
  }
}

module.exports = new AuthService();
*/






// Services/AuthService.js// good

/*const bcrypt = require('bcrypt');
const Utilisateur = require('../Models/Utilisateur');
const jwt = require('jsonwebtoken');
const EmailService = require('./EmailService'); // Vérifie le chemin !
const Role = require('../Models/Role');

console.log("--- Fichier AuthService.js est bien chargé ! ---"); // Log au chargement du fichier

class AuthService {
  // Inscription d'un utilisateur
  async register(data) {
    console.log("--- Début register ---");
    const { email, mot_de_passe, nom, prenom } = data;
    console.log(`Tentative d'inscription pour l'email: ${email}`);

    // Vérifier si l'email existe déjà
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      console.log(`Erreur register: L'email ${email} est déjà pris.`);
      throw new Error("L'email est déjà pris");
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    console.log("Mot de passe haché pour l'inscription. Longueur du hachage:", hashedPassword.length);

    // Créer un nouvel utilisateur
    const newUser = await Utilisateur.create({
      email,
      mot_de_passe: hashedPassword,
      nom,
      prenom,
    });
    console.log("Nouvel utilisateur créé avec succès:", newUser.email);

    // Envoi de l'email de confirmation (sans bloquer l'inscription)
    if (newUser && newUser.email && newUser.nom) {
      try {
        await EmailService.envoyerEmailConfirmation(newUser.email, newUser.nom);
        console.log(`Email de confirmation envoyé à ${newUser.email}`);
      } catch (emailError) {
        console.error("L'inscription a réussi, mais l'email de confirmation n'a pas pu être envoyé :", emailError);
      }
    }
    console.log("--- Fin register ---");
    return newUser;
  }

  // Connexion d'un utilisateur
  async login(data) {
    const { email, mot_de_passe } = data;
    console.log("--- Début login ---");
    console.log("Tentative de connexion pour l'email:", email);
    // ATTENTION : Ne JAMAIS logger le mot de passe en clair !

    const utilisateur = await Utilisateur.findOne({
      where: { email },
      include: {
        model: Role,
        as: 'role',
        attributes: ['id_role', 'name']
      }
    });

    if (!utilisateur) {
      console.log("Login échoué: Utilisateur non trouvé pour l'email:", email);
      throw new Error("Email ou mot de passe incorrect");
    }
    console.log("Utilisateur trouvé en DB:", {
      id: utilisateur.id_utilisateur,
      email: utilisateur.email,
      id_role: utilisateur.id_role,
      role_name: utilisateur.role ? utilisateur.role.name : 'Aucun',
      // Afficher une partie du hachage pour debug, PAS le hachage complet
      mot_de_passe_db_preview: utilisateur.mot_de_passe ? utilisateur.mot_de_passe.substring(0, 10) + '...' : 'N/A',
      mot_de_passe_db_length: utilisateur.mot_de_passe ? utilisateur.mot_de_passe.length : 'N/A'
    });

    if (!utilisateur.role) {
      console.log("Login échoué: Rôle non attribué pour l'utilisateur.");
      throw new Error("Votre compte n’a pas encore été validé par un administrateur.");
    }

    // ⭐⭐ LOG CRUCIAL POUR LA COMPARAISON DU MOT DE PASSE ⭐⭐
    console.log("Préparation de la comparaison du mot de passe...");
    console.log("Longueur du mot de passe fourni par l'utilisateur:", mot_de_passe.length); // Ne pas logger la valeur du MDP

    const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    console.log("Résultat de bcrypt.compare (mot_de_passe fourni vs mot_de_passe DB) :", isMatch);

    if (!isMatch) {
      console.log("Login échoué: Mot de passe incorrect.");
      throw new Error("Email ou mot de passe incorrect");
    }

    console.log("Login réussi ! Génération du token JWT...");
    // Créer le token JWT (id et rôle)
    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log("Token JWT généré.");

    // Ne pas renvoyer le mot de passe côté client
    const { mot_de_passe: _, ...userWithoutPassword } = utilisateur.toJSON();
    console.log("--- Fin login ---");
    return { token, utilisateur: userWithoutPassword };
  }

  // Récupérer un utilisateur par son id
  async getUserById(id) {
    console.log("--- Début getUserById ---");
    const utilisateur = await Utilisateur.findByPk(id, {
      attributes: { exclude: ['mot_de_passe'] }
    });
    if (!utilisateur) {
      console.log("getUserById échoué: Utilisateur non trouvé pour l'ID:", id);
      throw new Error("Utilisateur non trouvé");
    }
    console.log("Utilisateur trouvé par ID:", utilisateur.email);
    console.log("--- Fin getUserById ---");
    return utilisateur;
  }
}

module.exports = new AuthService();/*const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const EmailService = require('./EmailService'); // Vérifie le chemin !
const { Utilisateur, Role, Eleve, Professeur } = require('../Models'); // <-- Modifié : Importe tous les modèles nécessaires ici

console.log("--- Fichier AuthService.js est bien chargé ! ---"); // Log au chargement du fichier

class AuthService {
  // Inscription d'un utilisateur
  async register(data) {
    console.log("--- Début register ---");
    const { email, mot_de_passe, nom, prenom } = data;
    console.log(`Tentative d'inscription pour l'email: ${email}`);

    // Vérifier si l'email existe déjà
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      console.log(`Erreur register: L'email ${email} est déjà pris.`);
      throw new Error("L'email est déjà pris");
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    console.log("Mot de passe haché pour l'inscription. Longueur du hachage:", hashedPassword.length);

    // Créer un nouvel utilisateur
    const newUser = await Utilisateur.create({
      email,
      mot_de_passe: hashedPassword,
      nom,
      prenom,
    });
    console.log("Nouvel utilisateur créé avec succès:", newUser.email);

    // Envoi de l'email de confirmation (sans bloquer l'inscription)
    if (newUser && newUser.email && newUser.nom) {
      try {
        await EmailService.envoyerEmailConfirmation(newUser.email, newUser.nom);
        console.log(`Email de confirmation envoyé à ${newUser.email}`);
      } catch (emailError) {
        console.error("L'inscription a réussi, mais l'email de confirmation n'a pas pu être envoyé :", emailError);
      }
    }
    console.log("--- Fin register ---");
    return newUser;
  }

  // Connexion d'un utilisateur
  async login(data) {
    const { email, mot_de_passe } = data;
    console.log("--- Début login ---");
    console.log("Tentative de connexion pour l'email:", email);

    const utilisateur = await Utilisateur.findOne({
      where: { email },
      include: {
        model: Role,
        as: 'role', // Assurez-vous que cet alias correspond à votre association
        attributes: ['id_role', 'name']
      }
    });

    if (!utilisateur) {
      console.log("Login échoué: Utilisateur non trouvé pour l'email:", email);
      throw new Error("Email ou mot de passe incorrect");
    }
    console.log("Utilisateur trouvé en DB:", {
      id: utilisateur.id_utilisateur, // Utilisation de id_utilisateur
      email: utilisateur.email,
      id_role: utilisateur.id_role,
      role_name: utilisateur.role ? utilisateur.role.name : 'Aucun',
      mot_de_passe_db_preview: utilisateur.mot_de_passe ? utilisateur.mot_de_passe.substring(0, 10) + '...' : 'N/A',
      mot_de_passe_db_length: utilisateur.mot_de_passe ? utilisateur.mot_de_passe.length : 'N/A'
    });

    if (!utilisateur.role) {
      console.log("Login échoué: Rôle non attribué pour l'utilisateur.");
      throw new Error("Votre compte n’a pas encore été validé par un administrateur.");
    }

    console.log("Préparation de la comparaison du mot de passe...");
    console.log("Longueur du mot de passe fourni par l'utilisateur:", mot_de_passe.length);

    const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    console.log("Résultat de bcrypt.compare (mot_de_passe fourni vs mot_de_passe DB) :", isMatch);

    if (!isMatch) {
      console.log("Login échoué: Mot de passe incorrect.");
      throw new Error("Email ou mot de passe incorrect");
    }

    console.log("Login réussi ! Génération du token JWT...");
    // Créer le token JWT avec id_utilisateur et le nom du rôle
    const token = jwt.sign(
      {
        id: utilisateur.id_utilisateur, // <-- CORRECTION ICI : Utilise l'ID correct de l'utilisateur
        roleName: utilisateur.role.name // <-- AJOUTÉ : Le nom du rôle pour une vérification facile
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log("Token JWT généré.");

    // Ne pas renvoyer le mot de passe côté client
    const { mot_de_passe: _, ...userWithoutPassword } = utilisateur.toJSON();
    console.log("--- Fin login ---");
    return { token, utilisateur: userWithoutPassword };
  }

  // Récupérer un utilisateur par son id avec ses détails spécifiques (élève/professeur)
  async getUserById(userId) { // Renommé 'id' en 'userId' pour plus de clarté
    console.log("--- Début getUserById ---");
    console.log("Tentative de récupération de l'utilisateur pour l'ID:", userId);

    const utilisateur = await Utilisateur.findByPk(userId, {
      attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'id_role'], // Assurez-vous que 'id_utilisateur' est inclus
      include: [
        {
          model: Role,
          as: 'role', // L'alias défini dans vos associations
          attributes: ['name'],
        },
        {
          model: Eleve,
          as: 'eleveDetails', // L'alias défini dans vos associations (ex: Utilisateur.hasOne(Eleve, { as: 'eleveDetails' }))
          required: false, // LEFT JOIN : Ne pas exiger que l'utilisateur soit un élève
          attributes: ['id_eleve', 'classe', 'niveau', 'dateInscription'], // Attributs spécifiques à l'élève
        },
        {
          model: Professeur,
          as: 'professeurDetails', // L'alias défini dans vos associations (ex: Utilisateur.hasOne(Professeur, { as: 'professeurDetails' }))
          required: false, // LEFT JOIN : Ne pas exiger que l'utilisateur soit un professeur
          attributes: ['id_professeur', 'specialite'], // Attributs spécifiques au professeur
        }
      ]
    });

    if (!utilisateur) {
      console.log("getUserById échoué: Utilisateur non trouvé pour l'ID:", userId);
      throw new Error("Utilisateur non trouvé");
    }

    console.log("Utilisateur trouvé par ID:", utilisateur.email);

    // Transforme l'objet Sequelize en un objet JS simple et plat pour la réponse
    const userJSON = utilisateur.toJSON();
    
    const responseData = {
      id: userJSON.id_utilisateur, // Utilisez id_utilisateur pour l'ID principal
      nom: userJSON.nom,
      prenom: userJSON.prenom,
      email: userJSON.email,
      role: userJSON.role ? userJSON.role.name : null, // Le nom du rôle
    };

    // Ajoute les détails spécifiques si présents
    if (userJSON.eleveDetails) {
      responseData.eleveDetails = userJSON.eleveDetails;
    }
    if (userJSON.professeurDetails) {
      responseData.professeurDetails = userJSON.professeurDetails;
    }

    console.log("--- Fin getUserById ---");
    return responseData; // Retourne l'objet avec les détails spécifiques
  }
}

module.exports = new AuthService();
*/


