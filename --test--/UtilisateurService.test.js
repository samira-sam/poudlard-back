// utilisateurService.test.js

// Importe le service à tester.
// Assure-toi que le chemin d'accès est correct par rapport à l'emplacement de ton fichier de test.
const UtilisateurService = require('../Services/UtilisateurService');

// Importe les modèles et la bibliothèque bcrypt que le service utilise.
// Nous allons les moquer pour isoler le service.
const Utilisateur = require('../Models/Utilisateur');
const Role = require('../Models/Role');
const bcrypt = require('bcrypt');

/**
 * Configure les mocks pour les modèles Sequelize et bcrypt.
 * Cela permet de contrôler le comportement de ces dépendances
 * sans interagir avec la base de données réelle ou exécuter de vrais hachages.
 */

// Mock du modèle Utilisateur
jest.mock('../Models/Utilisateur', () => ({
  // findByPk: Simule la recherche d'un utilisateur par sa clé primaire (ID).
  findByPk: jest.fn(),
  // create: Simule la création d'un nouvel utilisateur.
  create: jest.fn(),
  // findAll: Simule la récupération de tous les utilisateurs.
  findAll: jest.fn(),
  // Mock des méthodes d'instance (comme .update() ou .destroy())
  // car elles sont appelées sur une instance d'utilisateur trouvée par findByPk.
  prototype: {
    update: jest.fn(), // Simule la mise à jour d'un utilisateur existant.
    destroy: jest.fn(), // Simule la suppression d'un utilisateur existant.
  },
}));

// Mock du modèle Role
jest.mock('../Models/Role', () => ({
  // findByPk: Simule la recherche d'un rôle par son ID.
  findByPk: jest.fn(),
  // findOne: Simule la recherche d'un rôle par d'autres critères (comme le nom).
  findOne: jest.fn(),
}));

// Mock de la bibliothèque bcrypt
jest.mock('bcrypt', () => ({
  // hash: Simule le hachage d'un mot de passe.
  // Pour les tests, nous pouvons simplement renvoyer un "faux" hash.
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  // compare: Simule la comparaison d'un mot de passe en clair avec un hash.
  // Pour les tests, nous devons contrôler si cela renvoie true ou false.
  compare: jest.fn(),
}));

/**
 * Groupe de tests pour la classe UtilisateurService.
 * Chaque 'describe' interne représente une méthode spécifique du service.
 */
describe('UtilisateurService', () => {
  // Avant chaque test, réinitialise tous les mocks.
  // Cela garantit que chaque test s'exécute dans un environnement propre et isolé.
  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialise les compteurs d'appels et les valeurs de retour des mocks.
  });

  /**
   * Tests pour la méthode addUtilisateur.
   */
  describe('addUtilisateur', () => {
    test('devrait hacher le mot de passe et créer un utilisateur', async () => {
      // Données d'entrée pour le test.
      const userData = { email: 'test@example.com', mot_de_passe: 'password123' };
      // La valeur que notre mock de `Utilisateur.create` devrait retourner.
      const createdUser = { id_utilisateur: 1, email: 'test@example.com', mot_de_passe: 'hashed_password123' };

      // Configure le mock de bcrypt.hash pour renvoyer le hachage attendu.
      bcrypt.hash.mockResolvedValue('hashed_password123');
      // Configure le mock de Utilisateur.create pour renvoyer l'utilisateur créé.
      Utilisateur.create.mockResolvedValue(createdUser);

      // Appelle la méthode du service.
      const result = await UtilisateurService.addUtilisateur(userData);

      // Vérifie que bcrypt.hash a été appelé avec le bon mot de passe.
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      // Vérifie que Utilisateur.create a été appelé avec le mot de passe haché.
      expect(Utilisateur.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        mot_de_passe: 'hashed_password123',
      });
      // Vérifie que la méthode a renvoyé l'utilisateur créé.
      expect(result).toEqual(createdUser);
    });

    test('ne devrait pas hacher le mot de passe si non fourni', async () => {
      const userData = { email: 'test@example.com' };
      const createdUser = { id_utilisateur: 1, email: 'test@example.com' };

      Utilisateur.create.mockResolvedValue(createdUser);

      const result = await UtilisateurService.addUtilisateur(userData);

      // Vérifie que bcrypt.hash n'a pas été appelé.
      expect(bcrypt.hash).not.toHaveBeenCalled();
      // Vérifie que Utilisateur.create a été appelé avec les données originales.
      expect(Utilisateur.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(createdUser);
    });
  });

  /**
   * Tests pour la méthode getUtilisateurById.
   */
  describe('getUtilisateurById', () => {
    test('devrait retourner un utilisateur si trouvé', async () => {
      const userId = 1;
      const foundUser = { id_utilisateur: userId, email: 'test@example.com' };

      // Configure le mock de Utilisateur.findByPk pour renvoyer un utilisateur.
      Utilisateur.findByPk.mockResolvedValue(foundUser);

      const result = await UtilisateurService.getUtilisateurById(userId);

      // Vérifie que findByPk a été appelé avec le bon ID.
      expect(Utilisateur.findByPk).toHaveBeenCalledWith(userId);
      // Vérifie que le résultat est l'utilisateur trouvé.
      expect(result).toEqual(foundUser);
    });

    test('devrait retourner null si utilisateur non trouvé', async () => {
      const userId = 99;

      // Configure le mock de Utilisateur.findByPk pour renvoyer null.
      Utilisateur.findByPk.mockResolvedValue(null);

      const result = await UtilisateurService.getUtilisateurById(userId);

      expect(Utilisateur.findByPk).toHaveBeenCalledWith(userId);
      // Vérifie que le résultat est null.
      expect(result).toBeNull();
    });
  });

  /**
   * Tests pour la méthode updateUtilisateur.
   */
  describe('updateUtilisateur', () => {
    const existingUser = {
      id_utilisateur: 1,
      email: 'old@example.com',
      mot_de_passe: 'hashed_old_password',
      id_role: 1,
      update: Utilisateur.prototype.update, // Important: Associe le mock de l'instance update
    };

    const mockRoleAdmin = { id_role: 2, name: 'Admin' };
    const mockRoleEleve = { id_role: 3, name: 'Eleve' };

    test('devrait retourner null si utilisateur non trouvé', async () => {
      Utilisateur.findByPk.mockResolvedValue(null); // Simule l'utilisateur non trouvé

      const result = await UtilisateurService.updateUtilisateur(1, { email: 'new@example.com' });

      expect(Utilisateur.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
      // Vérifie que la méthode update sur l'instance n'a pas été appelée
      expect(Utilisateur.prototype.update).not.toHaveBeenCalled();
    });

    test('devrait mettre à jour l\'email sans modifier le mot de passe ou le rôle', async () => {
      Utilisateur.findByPk.mockResolvedValue(existingUser);
      // Simule le succès de la mise à jour de l'instance
      Utilisateur.prototype.update.mockResolvedValue({ ...existingUser, email: 'new@example.com' });

      const updateData = { email: 'new@example.com' };
      const result = await UtilisateurService.updateUtilisateur(1, updateData);

      expect(Utilisateur.findByPk).toHaveBeenCalledWith(1);
      // Vérifie que le mot de passe et le rôle ne sont pas traités
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(Role.findByPk).not.toHaveBeenCalled();
      expect(Role.findOne).not.toHaveBeenCalled();
      // Vérifie que la méthode update de l'instance a été appelée avec les bonnes données.
      expect(Utilisateur.prototype.update).toHaveBeenCalledWith({ email: 'new@example.com' });
      expect(result.email).toBe('new@example.com');
    });

    test('devrait hacher et mettre à jour un NOUVEAU mot de passe', async () => {
      Utilisateur.findByPk.mockResolvedValue(existingUser);
      // Simule que le nouveau mot de passe est différent de l'ancien haché
      bcrypt.compare.mockResolvedValue(false);
      // Simule le hachage du nouveau mot de passe
      bcrypt.hash.mockResolvedValue('hashed_new_password');
      Utilisateur.prototype.update.mockResolvedValue({ ...existingUser, mot_de_passe: 'hashed_new_password' });

      const updateData = { mot_de_passe: 'new_password123' };
      const result = await UtilisateurService.updateUtilisateur(1, updateData);

      expect(Utilisateur.findByPk).toHaveBeenCalledWith(1);
      // Vérifie que la comparaison a été tentée
      expect(bcrypt.compare).toHaveBeenCalledWith('new_password123', 'hashed_old_password');
      // Vérifie que le nouveau mot de passe a été haché
      expect(bcrypt.hash).toHaveBeenCalledWith('new_password123', 10);
      // Vérifie que la méthode update de l'instance a été appelée avec le nouveau hash
      expect(Utilisateur.prototype.update).toHaveBeenCalledWith({ mot_de_passe: 'hashed_new_password' });
      expect(result.mot_de_passe).toBe('hashed_new_password');
    });

    test('ne devrait PAS hacher et mettre à jour si le mot de passe fourni est le MÊME que l\'ancien hash', async () => {
      Utilisateur.findByPk.mockResolvedValue(existingUser);
      // Simule que le mot de passe fourni est le même que l'ancien hashé
      bcrypt.compare.mockResolvedValue(true);
      Utilisateur.prototype.update.mockResolvedValue(existingUser); // La DB ne change pas le mot de passe

      const updateData = { mot_de_passe: 'plain_old_password' }; // On simule que 'plain_old_password' correspondrait à 'hashed_old_password'
      const result = await UtilisateurService.updateUtilisateur(1, updateData);

      expect(Utilisateur.findByPk).toHaveBeenCalledWith(1);
      expect(bcrypt.compare).toHaveBeenCalledWith('plain_old_password', 'hashed_old_password');
      // Vérifie que bcrypt.hash N'A PAS été appelé
      expect(bcrypt.hash).not.toHaveBeenCalled();
      // Vérifie que la méthode update de l'instance n'a PAS le champ mot_de_passe
      expect(Utilisateur.prototype.update).toHaveBeenCalledWith({}); // Ou avec d'autres champs si fournis, mais pas le mot_de_passe
      expect(result.mot_de_passe).toBe('hashed_old_password'); // Le mot de passe ne change pas
    });

    test('devrait mettre à jour le rôle par ID', async () => {
      Utilisateur.findByPk.mockResolvedValue(existingUser);
      Role.findByPk.mockResolvedValue(mockRoleAdmin); // Rôle trouvé par ID
      Utilisateur.prototype.update.mockResolvedValue({ ...existingUser, id_role: mockRoleAdmin.id_role });

      const updateData = { id_role: mockRoleAdmin.id_role }; // Fournir l'ID numérique
      const result = await UtilisateurService.updateUtilisateur(1, updateData);

      expect(Utilisateur.findByPk).toHaveBeenCalledWith(1);
      expect(Role.findByPk).toHaveBeenCalledWith(mockRoleAdmin.id_role); // Vérifie l'appel par ID
      expect(Role.findOne).not.toHaveBeenCalled(); // findOne ne devrait pas être appelé
      expect(Utilisateur.prototype.update).toHaveBeenCalledWith({ id_role: mockRoleAdmin.id_role });
      expect(result.id_role).toBe(mockRoleAdmin.id_role);
    });

    test('devrait mettre à jour le rôle par NOM', async () => {
      Utilisateur.findByPk.mockResolvedValue(existingUser);
   
      Role.findByPk.mockResolvedValue(null); // Simule que findByPk ne trouve rien
      Role.findOne.mockResolvedValue(mockRoleEleve); // findOne réussit avec le nom
      Utilisateur.prototype.update.mockResolvedValue({ ...existingUser, id_role: mockRoleEleve.id_role });

      const updateData = { id_role: 'Eleve' }; // Fournir le nom du rôle
      const result = await UtilisateurService.updateUtilisateur(1, updateData);

      expect(Utilisateur.findByPk).toHaveBeenCalledWith(1);

      expect(Role.findByPk).not.toHaveBeenCalled();
      expect(Role.findOne).toHaveBeenCalledWith({ where: { name: 'Eleve' } }); // Ensuite tente avec le nom
      expect(Utilisateur.prototype.update).toHaveBeenCalledWith({ id_role: mockRoleEleve.id_role });
      expect(result.id_role).toBe(mockRoleEleve.id_role);
    });

    test('devrait lancer une erreur si le rôle est invalide', async () => {
      Utilisateur.findByPk.mockResolvedValue(existingUser);
    
      Role.findByPk.mockResolvedValue(null); // Simule que findByPk ne trouve rien
      Role.findOne.mockResolvedValue(null); // Aucun rôle trouvé par findOne non plus

      const updateData = { id_role: 'RoleInvalide' };

      // Vérifie que la promesse est rejetée avec l'erreur attendue
      await expect(UtilisateurService.updateUtilisateur(1, updateData))
        .rejects
        .toThrow('Rôle "RoleInvalide" invalide.');

      expect(Utilisateur.findByPk).toHaveBeenCalledWith(1);
    
      expect(Role.findByPk).not.toHaveBeenCalled();
      expect(Role.findOne).toHaveBeenCalledWith({ where: { name: 'RoleInvalide' } });
      // Vérifie que la méthode update de l'instance n'a pas été appelée
      expect(Utilisateur.prototype.update).not.toHaveBeenCalled();
    });
  });

  /**
   * Tests pour la méthode deleteUtilisateur.
   */
  describe('deleteUtilisateur', () => {
    test('devrait supprimer un utilisateur si trouvé', async () => {
      const userId = 1;
      // Mock de l'utilisateur trouvé avec une méthode destroy mockée
      const userToDelete = {
        id_utilisateur: userId,
        email: 'to_delete@example.com',
        destroy: Utilisateur.prototype.destroy,
      };

      Utilisateur.findByPk.mockResolvedValue(userToDelete);
      // Simule que la suppression est réussie (retourne void ou true selon l'implémentation Sequelize)
      Utilisateur.prototype.destroy.mockResolvedValue(1); // 1 pour indiquer 1 ligne supprimée

      const result = await UtilisateurService.deleteUtilisateur(userId);

      expect(Utilisateur.findByPk).toHaveBeenCalledWith(userId);
      // Vérifie que la méthode destroy de l'instance a été appelée
      expect(Utilisateur.prototype.destroy).toHaveBeenCalled();
      // Le résultat peut varier selon ce que .destroy() renvoie (souvent le nombre de lignes supprimées)
      expect(result).toBe(1);
    });

    test('devrait retourner null si utilisateur non trouvé', async () => {
      const userId = 99;

      Utilisateur.findByPk.mockResolvedValue(null);

      const result = await UtilisateurService.deleteUtilisateur(userId);

      expect(Utilisateur.findByPk).toHaveBeenCalledWith(userId);
      // Vérifie que la méthode destroy de l'instance n'a pas été appelée
      expect(Utilisateur.prototype.destroy).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  /**
   * Tests pour la méthode getAllUtilisateur.
   */
  describe('getAllUtilisateur', () => {
    test('devrait retourner tous les utilisateurs', async () => {
      const allUsers = [
        { id_utilisateur: 1, email: 'user1@example.com' },
        { id_utilisateur: 2, email: 'user2@example.com' },
      ];

      Utilisateur.findAll.mockResolvedValue(allUsers);

      const result = await UtilisateurService.getAllUtilisateur();

      expect(Utilisateur.findAll).toHaveBeenCalledTimes(1); // Vérifie que findAll a été appelé
      expect(result).toEqual(allUsers);
    });

    test('devrait retourner un tableau vide si aucun utilisateur', async () => {
      Utilisateur.findAll.mockResolvedValue([]);

      const result = await UtilisateurService.getAllUtilisateur();

      expect(Utilisateur.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});
