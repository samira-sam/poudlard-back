// backend/Services/UtilisateurService.js

/*const Utilisateur = require("../Models/Utilisateur");
const Admin = require("../Models/Admin");
const Professeur = require("../Models/Professeur");
const Eleve = require("../Models/Eleve");
const Role = require("../Models/Role");

class UtilisateurService {
  // Gardons cette fonction cohérente si 'nomRole' est bien le nom du rôle
  async getUtilisateursByRole(nomRole) {
    try {
      // Trouve le rôle (id) correspondant au nom (colonne 'name' dans la table Role)
      const role = await Role.findOne({ where: { name: nomRole } });
      if (!role) {
        return [];
      }
      const utilisateurs = await Utilisateur.findAll({
        where: { id_role: role.id_role }, // Ici, on utilise bien l'id_role numérique
        include: [
          { model: Admin, as: 'admin', required: false },
          { model: Professeur, as: 'professeur', required: false },
          { model: Eleve, as: 'eleve', required: false }
        ]
      });
      return utilisateurs;
    } catch (error) {
      console.error("Erreur getUtilisateursByRole:", error);
      throw error;
    }
  }

  async getAllUtilisateur() {
    return await Utilisateur.findAll({
      // Vous aviez ceci commenté, je le laisse tel quel. ici les model en include on était décommenté
     //include: [
      //  { model: Admin, as: 'admin', required: false },
      //  { model: Professeur, as: 'professeur', required: false },
      //  { model: Eleve, as: 'eleve', required: false },
       // { model: Role, as: 'role' }
     // ]
    });
  }

  async getUtilisateurById(id) {
    return await Utilisateur.findByPk(id, {
      include: [
        { model: Admin, as: 'admin' },
        { model: Professeur, as: 'professeur' },
        { model: Eleve, as: 'eleve' },
        { model: Role, as: 'role' }
      ]
    });
  }

  async addUtilisateur(data) {
    console.log("Données reçues dans addUtilisateur (Service):", data);
    console.log("Valeur de data.id_role (avant recherche):", data.id_role); // Ajouté pour confirmation

    let nouvelUtilisateur = null;
    try {
      // ÉTAPE CLÉ : Récupérer l'objet Role en utilisant data.id_role comme NOM du rôle
      // La requête entrante { id_role: 'admin' } signifie que 'admin' est le NOM du rôle.
      const role = await Role.findOne({ where: { name: data.id_role } }); // <--- CORRECTION ICI
      if (!role) {
        // Le message d'erreur sera plus précis si le rôle n'est pas trouvé
        throw new Error(`Rôle "${data.id_role}" invalide ou non trouvé dans la base de données.`);
      }

      // Crée utilisateur avec l'ID NUMÉRIQUE du rôle
      nouvelUtilisateur = await Utilisateur.create({
        ...data,
        id_role: role.id_role, // Utilise l'ID numérique récupéré de l'objet 'role'
      });

      if (nouvelUtilisateur) {
        const nouvelId = nouvelUtilisateur.id_utilisateur;
        // En fonction du NOM du rôle (stocké dans role.name), crée aussi dans les tables spécifiques
        if (role.name === 'admin') {
          await Admin.create({ id_admin: nouvelId });
        } else if (role.name === 'professeur') {
          if (!data.id_matiere) {
            console.warn("id_matiere manquant pour professeur");
          }
          await Professeur.create({
            id_professeur: nouvelId,
            id_matiere: data.id_matiere,
            description: data.description || null,
          });
        } else if (role.name === 'eleve') {
          if (!data.id_annee_etude || !data.id_maison) {
            console.warn("id_annee_etude ou id_maison manquant pour élève");
          }
          await Eleve.create({
            id_eleve: nouvelId,
            id_annee_etude: data.id_annee_etude,
            id_maison: data.id_maison,
            contact_parent: data.contact_parent || null,
          });
        }
      }
    } catch (error) {
      console.error("Erreur addUtilisateur:", error);
      throw error;
    }
    return nouvelUtilisateur;
  }

  async updateUtilisateur(id, data) {
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) return null;

    // Si data.id_role est présent et contient le nom du rôle (ex: "admin")
    if (data.id_role) {
      // Cherche le rôle par son nom dans la table Role
      const role = await Role.findOne({ where: { name: data.id_role } }); // <--- CORRECTION ICI
      if (!role) {
        throw new Error(`Rôle "${data.id_role}" invalide.`);
      }
      data.id_role = role.id_role; // Remplace le nom par l'ID numérique du rôle
    }

    return await utilisateur.update(data);
  }

  async deleteUtilisateur(id) {
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) return null;
    await utilisateur.destroy();
    return true;
  }
}

module.exports = new UtilisateurService();*/

// backend/Services/UtilisateurService.js
/*
const Utilisateur = require("../Models/Utilisateur");
const Admin = require("../Models/Admin");
const Professeur = require("../Models/Professeur");
const Eleve = require("../Models/Eleve");
const Role = require("../Models/Role");
const bcrypt = require('bcrypt'); // ⭐ ASSUREZ-VOUS QUE CELA EST PRÉSENT EN HAUT DU FICHIER ⭐

class UtilisateurService {
  // ... (fonctions précédentes : getUtilisateursByRole, getAllUtilisateur, getUtilisateurById, addUtilisateur)

  async updateUtilisateur(id, data) {
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) return null;

    // Crée une copie des données pour ne pas modifier l'objet original `data`
    const updateData = { ...data };

    // --- Gestion du rôle (ceci est déjà correct) ---
    if (updateData.id_role) {
      const role = await Role.findOne({ where: { name: updateData.id_role } });
      if (!role) {
        throw new Error(`Rôle "${updateData.id_role}" invalide.`);
      }
      updateData.id_role = role.id_role;
    }

    // ⭐⭐ DÉBUT DE LA CORRECTION POUR LE MOT DE PASSE ⭐⭐

    // 1. Vérifie si un champ 'mot_de_passe' est présent dans les données de mise à jour.
    //    Si l'admin n'a pas tapé de nouveau mot de passe, ce champ ne devrait pas être là
    //    ou devrait être vide/null selon comment votre UI (AdminJS) envoie les données.
    if (updateData.mot_de_passe) {
      // 2. IMPORTANT : On suppose ici que si 'mot_de_passe' est présent, c'est un NOUVEAU mot de passe
      //    NON HACHÉ, qui a été explicitement saisi par l'administrateur.
      //    On le hache avant de le mettre à jour.
      updateData.mot_de_passe = await bcrypt.hash(updateData.mot_de_passe, 10);
    } else {
      // 3. SI 'mot_de_passe' n'est PAS présent dans les données de mise à jour (ce qui est le cas
      //    le plus probable lors d'une simple attribution de rôle),
      //    OU si l'interface d'admin renvoie l'ancien mot de passe haché sans intention de le changer,
      //    ALORS on s'assure qu'il n'est PAS mis à jour par Sequelize.
      //    On le supprime de l'objet updateData pour qu'il ne soit pas passé à la DB.
      delete updateData.mot_de_passe;
    }

    // ⭐⭐ FIN DE LA CORRECTION POUR LE MOT DE PASSE ⭐⭐

    // Effectue la mise à jour avec les données modifiées (updateData)
    return await utilisateur.update(updateData);
  }

  // ... (fonction deleteUtilisateur)
}

module.exports = new UtilisateurService();*/

// backend/Services/UtilisateurService.js

// backend/Services/UtilisateurService.js
/*
const Utilisateur = require("../Models/Utilisateur");
const Admin = require("../Models/Admin");
const Professeur = require("../Models/Professeur");
const Eleve = require("../Models/Eleve");
const Role = require("../Models/Role");
const bcrypt = require('bcrypt'); // ⭐ Assurez-vous que ceci est en haut du fichier

console.log("🔥 CE FICHIER UTILISATEUR SERVICE EST BIEN EXÉCUTÉ ! 🔥");

class UtilisateurService {
  // Exemple d'autres méthodes possibles (à adapter à ton projet)
  async getAllUtilisateur() {
    return await Utilisateur.findAll();
  }

  async getUtilisateurById(id) {
    return await Utilisateur.findByPk(id);
  }

  async addUtilisateur(data) {
    if (data.mot_de_passe) {
      data.mot_de_passe = await bcrypt.hash(data.mot_de_passe, 10);
    }
    return await Utilisateur.create(data);
  }

  async updateUtilisateur(id, data) {
    console.log("⚡️ LA FONCTION updateUtilisateur EST APPELÉE ! ⚡️");
    console.log("--- Début updateUtilisateur ---");
    console.log("ID utilisateur à mettre à jour :", id);
    console.log("Données 'data' reçues :", data);

    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      console.log("Utilisateur non trouvé pour l'ID :", id);
      return null;
    }

    console.log("Utilisateur trouvé (avant update) :", {
      id: utilisateur.id_utilisateur,
      email: utilisateur.email,
      mot_de_passe_actuel_db: utilisateur.mot_de_passe,
      id_role_actuel_db: utilisateur.id_role,
    });

    // Copie des données reçues pour éviter mutation
    const updateData = { ...data };

    // --- Gestion du rôle ---
    if (updateData.id_role) {
      let role = null;

      // Si id_role est un nombre (ex : "2" ou 2), on tente la recherche par id_role
      if (!isNaN(updateData.id_role)) {
        role = await Role.findByPk(updateData.id_role);
      }

      // Sinon, on tente la recherche par nom de rôle
      if (!role) {
        role = await Role.findOne({ where: { name: updateData.id_role } });
      }

      if (!role) {
        console.error(`Erreur : Rôle "${updateData.id_role}" invalide ou non trouvé.`);
        throw new Error(`Rôle "${updateData.id_role}" invalide.`);
      }

      console.log(`Rôle '${data.id_role}' converti en ID numérique : ${role.id_role}`);
      updateData.id_role = role.id_role;
    }

    // ⭐⭐ Gestion du mot de passe ⭐⭐
    console.log("Vérification du champ 'mot_de_passe' dans 'updateData' :", updateData.mot_de_passe);

    if (updateData.mot_de_passe) {
      let isSameHashedPassword = false;
      try {
        // Vérifie si le mot_de_passe fourni est identique au hash en base
        isSameHashedPassword = await bcrypt.compare(updateData.mot_de_passe, utilisateur.mot_de_passe);
        console.log("Résultat de bcrypt.compare (updateData.mot_de_passe vs utilisateur.mot_de_passe) :", isSameHashedPassword);
      } catch (e) {
        console.warn("Avertissement : Erreur lors de la comparaison du mot de passe fourni (probablement pas un hash) :", e.message);
        isSameHashedPassword = false;
      }

      if (isSameHashedPassword) {
        console.log("Le mot de passe fourni est l'ancien hash, suppression du champ pour ne pas modifier.");
        delete updateData.mot_de_passe;
      } else {
        console.log("Nouveau mot de passe détecté, hashage en cours...");
        try {
          updateData.mot_de_passe = await bcrypt.hash(updateData.mot_de_passe, 10);
          console.log("Mot de passe haché avec succès.");
        } catch (e) {
          console.error("Erreur lors du hachage du nouveau mot de passe :", e.message);
          delete updateData.mot_de_passe;
        }
      }
    } else {
      console.log("Aucun mot de passe fourni, on ne le met pas à jour.");
      delete updateData.mot_de_passe;
    }

    console.log("Données finales envoyées à Sequelize pour la mise à jour :", updateData);
    const result = await utilisateur.update(updateData);
    console.log("--- Fin updateUtilisateur ---");
    return result;
  }

  async deleteUtilisateur(id) {
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      console.log("Utilisateur non trouvé pour suppression :", id);
      return null;
    }
    return await utilisateur.destroy();
  }
}

module.exports = new UtilisateurService();
*/

const Utilisateur = require("../Models/Utilisateur");
const Admin = require("../Models/Admin");
const Professeur = require("../Models/Professeur");
const Eleve = require("../Models/Eleve");
const Role = require("../Models/Role");
const bcrypt = require('bcrypt'); // ⭐ Assurez-vous que ceci est en haut du fichier

class UtilisateurService {
  async getAllUtilisateur() {
    return await Utilisateur.findAll();
  }

  async getUtilisateurById(id) {
    return await Utilisateur.findByPk(id);
  }

  async addUtilisateur(data) {
    if (data.mot_de_passe) {
      data.mot_de_passe = await bcrypt.hash(data.mot_de_passe, 10);
    }
    return await Utilisateur.create(data);
  }

  async updateUtilisateur(id, data) {
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      return null;
    }

    // Copie des données reçues pour éviter mutation
    const updateData = { ...data };

    // --- Gestion du rôle ---
    if (updateData.id_role) {
      let role = null;

      // Si id_role est un nombre (ex : "2" ou 2), on tente la recherche par id_role
      if (!isNaN(updateData.id_role)) {
        role = await Role.findByPk(updateData.id_role);
      }

      // Sinon, on tente la recherche par nom de rôle
      if (!role) {
        role = await Role.findOne({ where: { name: updateData.id_role } });
      }

      if (!role) {
        throw new Error(`Rôle "${updateData.id_role}" invalide.`);
      }

      updateData.id_role = role.id_role;
    }

    // ⭐⭐ Gestion du mot de passe ⭐⭐
    if (updateData.mot_de_passe) {
      let isSameHashedPassword = false;
      try {
        // Vérifie si le mot_de_passe fourni est identique au hash en base
        isSameHashedPassword = await bcrypt.compare(updateData.mot_de_passe, utilisateur.mot_de_passe);
      } catch (e) {
        // Ici, on pourrait logger l'erreur via un système de log externe si nécessaire,
        // mais pas avec console.warn directement dans le service.
        isSameHashedPassword = false;
      }

      if (isSameHashedPassword) {
        delete updateData.mot_de_passe;
      } else {
        try {
          updateData.mot_de_passe = await bcrypt.hash(updateData.mot_de_passe, 10);
        } catch (e) {
          // Gérer l'erreur de hachage, par exemple en la supprimant ou en la propageant
          delete updateData.mot_de_passe;
        }
      }
    } else {
      delete updateData.mot_de_passe;
    }

    const result = await utilisateur.update(updateData);
    return result;
  }

  async deleteUtilisateur(id) {
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      return null;
    }
    return await utilisateur.destroy();
  }
}

module.exports = new UtilisateurService();
