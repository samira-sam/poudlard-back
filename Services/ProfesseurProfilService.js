// backend/services/professeurProfil.service.js
const Utilisateur = require('../Models/Utilisateur');
const Professeur = require('../Models/Professeur');
// const EleveMatiere = require('../Models/EleveMatiere'); // Si cette table n'est pas utilisée pour les inscriptions, tu peux la commenter ou la supprimer.
const Matiere = require('../Models/Matiere');
const Note = require('../Models/Note');
const Eleve = require('../Models/Eleve');
const AnneeEtude = require('../Models/AnneeEtude'); // ⭐ IMPORTANT : Ajout de l'import pour AnneeEtude
const AnneeEtudeMatiere = require('../Models/AnneeEtudeMatiere'); // ⭐ IMPORTANT : Ajout de l'import pour AnneeEtudeMatiere (ta table de jonction)


const professeurProfilService = {

    /**
     * Récupère le profil complet d'un professeur, y compris les informations de l'utilisateur
     * et la matière qu'il enseigne. Cette fonction est laissée telle quelle.
     * @param {number} userId - L'ID de l'utilisateur qui est un professeur.
     * @returns {Promise<object>} Les données du professeur avec sa matière et son utilisateur.
     */
    async getProfesseurProfile(userId) {
        try {
            const professeur = await Professeur.findOne({
                where: {
                    id_professeur: userId
                },
                include: [{
                    model: Utilisateur,
                    as: 'utilisateur',
                    attributes: ['nom', 'prenom', 'email', 'photo']
                }, {
                    model: Matiere,
                    as: 'matiereEnseignee', // L'alias défini dans tes associations
                    attributes: ['id_matiere', 'nom'] // Récupère l'ID et le nom de la matière
                }],
            });

            if (!professeur) {
                throw new Error('Professeur non trouvé.');
            }

            // Aplatir l'objet pour un envoi plus simple au frontend
            const profil = {
                id_professeur: professeur.id_professeur,
                description: professeur.description,
                fonction: professeur.fonction,
                nom: professeur.utilisateur.nom,
                prenom: professeur.utilisateur.prenom,
                email: professeur.utilisateur.email,
                photo: professeur.utilisateur.photo,
                matiere: professeur.matiereEnseignee, // Contient id_matiere et nom
            };

            return profil;
        } catch (error) {
            console.error("Erreur lors de la récupération du profil du professeur :", error);
            throw error;
        }
    },

    /**
     * Récupère la liste des élèves qui suivent la matière enseignée par un professeur donné.
     * Inclut les informations de l'utilisateur pour chaque élève.
     * ⭐ MODIFICATION MAJEURE ICI pour utiliser ta structure de données. ⭐
     * @param {number} professeurId - L'ID du professeur.
     * @returns {Promise<Array<object>>} Une liste d'objets élèves.
     */
    async getStudentsForProfesseur(professeurId) {
        try {
            // 1. Récupérer la matière enseignée par le professeur
            const professeur = await Professeur.findByPk(professeurId, {
                include: [{
                    model: Matiere,
                    as: 'matiereEnseignee',
                    attributes: ['id_matiere','nom']
                }]
            });

            if (!professeur || !professeur.matiereEnseignee) {
                // Retourne un tableau vide si le professeur n'enseigne pas de matière ou n'existe pas
                return [];
            }

            const matiereId = professeur.matiereEnseignee.id_matiere;

            // 2. Trouver les élèves qui suivent cette matière via la chaîne : Matière -> Année d'Études -> Élève
            const matiereAvecEleves = await Matiere.findByPk(matiereId, {
                attributes: [], // On n'a pas besoin des attributs de la matière ici, juste de ses relations
                include: [
                    {
                        model: AnneeEtude, // Inclut les Années d'Études associées à cette Matière
                        as: 'anneesEtude', // ⭐ L'alias de la relation Many-to-Many entre Matiere et AnneeEtude
                        attributes: ['id_annee_etude', 'nom'], // Récupère les IDs et noms des Années d'Études
                        through: { attributes: [] }, // N'inclut pas les colonnes de la table de jonction AnneeEtudeMatiere
                        include: [
                            {
                                model: Eleve, // Inclut les Élèves de chaque Année d'Études
                                as: 'eleves', // ⭐ L'alias de la relation AnneeEtude.hasMany(Eleve)
                                attributes: ['id_eleve'], // Récupère les IDs des élèves
                                include: [
                                    {
                                        model: Utilisateur, // Inclut les détails de l'utilisateur pour chaque Élève
                                        as: 'utilisateur',
                                        attributes: ['nom', 'prenom', 'email', 'photo']
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            if (!matiereAvecEleves || !matiereAvecEleves.anneesEtude) {
                return []; // Aucun élève n'est trouvé via cette matière et ses années d'études
            }

            const elevesDuProfesseur = new Map(); // Utilise une Map pour gérer les doublons d'élèves (si un élève apparaît via plusieurs chemins)

            matiereAvecEleves.anneesEtude.forEach(annee => {
                annee.eleves.forEach(eleve => {
                    if (!elevesDuProfesseur.has(eleve.id_eleve)) {
                        elevesDuProfesseur.set(eleve.id_eleve, {
                            id_eleve: eleve.id_eleve,
                            nom: eleve.utilisateur ? eleve.utilisateur.nom : null,
                            prenom: eleve.utilisateur ? eleve.utilisateur.prenom : null,
                            email: eleve.utilisateur ? eleve.utilisateur.email : null,
                            photo: eleve.utilisateur ? eleve.utilisateur.photo : null,
                            annee_etude_nom: annee.nom // Ajoute le nom de l'année d'étude pour contexte
                        });
                    }
                });
            });

            return Array.from(elevesDuProfesseur.values()); // Convertit la Map en tableau d'objets

        } catch (error) {
            console.error("Erreur lors de la récupération des élèves pour le professeur :", error);
            throw error;
        }
    },

    /**
     * Enregistre une note pour un élève dans une matière donnée par un professeur.
     * ⭐ MODIFICATION MAJEURE ICI pour utiliser ta structure de données. ⭐
     * @param {number} professeurId - L'ID du professeur qui attribue la note.
     * @param {number} eleveId - L'ID de l'élève qui reçoit la note.
     * @param {number} matiereId - L'ID de la matière concernée.
     * @param {number} valeur - La valeur de la note.
     * @param {string} commentaire - Le commentaire associé à la note.
     * @returns {Promise<object>} L'objet Note créé.
     */
    async gradeStudent(professeurId, eleveId, matiereId, valeur, commentaire) {
        try {
            // 1. Vérifier que le professeur est bien celui qui enseigne cette matière
            const professeur = await Professeur.findByPk(professeurId, {
                include: [{
                    model: Matiere,
                    as: 'matiereEnseignee',
                    attributes: ['id_matiere','nom']
                }]
            });

            if (!professeur || professeur.matiereEnseignee.id_matiere !== matiereId) {
                throw new Error("Professeur non autorisé à noter dans cette matière.");
            }

            // 2. Vérifier que l'élève est bien inscrit à cette matière via son Année d'Étude
            // et la relation Année d'Étude <-> Matière
            const eleveEstInscrit = await Eleve.findOne({
                where: { id_eleve: eleveId },
                include: [{
                    model: AnneeEtude,
                    as: 'anneeEtude', // ⭐ L'alias de la relation Eleve.belongsTo(AnneeEtude)
                    include: [{
                        model: Matiere,
                        as: 'matieresEnseignees', // ⭐ L'alias de la relation AnneeEtude.belongsToMany(Matiere)
                        where: { id_matiere: matiereId }, // Vérifie si cette matière est associée à l'année de l'élève
                        through: { attributes: [] },
                        required: true // S'assure que la matière doit être trouvée pour cette année
                    }]
                }],
                required: true // S'assure que l'élève a bien une année d'étude et que l'association avec la matière existe
            });

            if (!eleveEstInscrit) {
                throw new Error("L'élève n'est pas inscrit à cette matière via son année d'étude.");
            }

            // 3. Enregistrer la note
            const newNote = await Note.create({
                id_professeur: professeurId,
                id_eleve: eleveId,
                id_matiere: matiereId,
                valeur: valeur, // Correction ici, il y avait "valor" au lieu de "valeur"
                commentaire: commentaire,
            });

            return newNote;
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de la note :", error);
            throw error;
        }
    },

    // Méthode pour mettre à jour le profil du professeur (similaire à EleveService)
    // Cette fonction est laissée telle quelle.
    async updateProfesseurProfile(userId, updateData) {
        try {
            const professeur = await Professeur.findByPk(userId);
            if (!professeur) {
                throw new Error('Professeur non trouvé.');
            }

            // Mettre à jour les champs spécifiques au professeur (description, fonction)
            if (updateData.description !== undefined) {
                professeur.description = updateData.description;
            }
            if (updateData.fonction !== undefined) {
                professeur.fonction = updateData.fonction;
            }
            await professeur.save();

            // Mettre à jour les champs de l'utilisateur associé (nom, prenom, email, photo)
            const utilisateur = await Utilisateur.findByPk(userId);
            if (!utilisateur) {
                throw new Error('Utilisateur associé non trouvé.');
            }

            if (updateData.nom !== undefined) {
                utilisateur.nom = updateData.nom;
            }
            if (updateData.prenom !== undefined) {
                utilisateur.prenom = updateData.prenom;
            }
            if (updateData.email !== undefined) {
                utilisateur.email = updateData.email;
            }
            if (updateData.photo !== undefined) {
                utilisateur.photo = updateData.photo;
            }
            await utilisateur.save();

            // Retourner le profil mis à jour (utilise la fonction de récupération existante)
            return this.getProfesseurProfile(userId);

        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil professeur :", error);
            throw error;
        }
    }
};

module.exports = professeurProfilService;