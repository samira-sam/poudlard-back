const fs = require('fs').promises; // For asynchronous file operations
const path = require('path');

// Import all models that can have an image here
const Utilisateur = require('../Models/Utilisateur');
const Matiere = require('../Models/Matiere');
const Article = require('../Models/Article');
const Maison = require('../Models/Maison'); // <--- AJOUTE CETTE LIGNE

// Map AdminJS resource names to Sequelize models and their primary keys
// This is crucial for generality!
const modelMap = {
  'utilisateur': { model: Utilisateur, primaryKey: 'id_utilisateur' },
  'matiere': { model: Matiere, primaryKey: 'id_matiere' },
  'article': { model: Article, primaryKey: 'id_article' },
  'maison': { model: Maison, primaryKey: 'id_maison' }, // <--- AJOUTE CETTE LIGNE (Assure-toi que 'id_maison' est bien la clé primaire)
  // Add other mappings here if needed:
  // 'professeur': { model: Professeur, primaryKey: 'id_professeur' }, // Si tu utilises 'professeur' comme resourceId dans AdminJS
  // 'eleve': { model: Eleve, primaryKey: 'id_eleve' }, // Si tu utilises 'eleve' comme resourceId dans AdminJS
};

// Process the image upload request
exports.uploadPhoto = async (req, res) => {
    try {
      if (!req.file) {
        console.error('No file received by the controller.');
        return res.status(400).json({ success: false, message: 'No file selected or Multer processing error.' });
      }

      const itemId = req.body.itemId;
      // Il est possible que 'resourceId' soit envoyé au pluriel ('maisons') par AdminJS,
      // ou au singulier ('maison'). Assure-toi que le nom ici correspond à la clé dans `modelMap`.
      // Si AdminJS envoie 'maisons', change resourceId.toLowerCase() ou la clé du modelMap.
      const resourceId = req.body.resourceId.toLowerCase(); // Pour s'assurer que ça matche les clés du modelMap

      if (!itemId || !resourceId) {
        if (req.file && req.file.path) {
            await fs.unlink(req.file.path);
        }
        return res.status(400).json({ success: false, message: 'Record ID or resource type missing.' });
      }

      const modelEntry = modelMap[resourceId];
      if (!modelEntry) {
        if (req.file && req.file.path) {
            await fs.unlink(req.file.path);
        }
        return res.status(400).json({ success: false, message: `Resource type '${resourceId}' unknown or not handled for upload.` });
      }

      const Model = modelEntry.model;
      const primaryKeyName = modelEntry.primaryKey;

      const tempFilePath = req.file.path;
      const originalFilename = req.file.originalname;

      const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'images'); // Chemin vers public/uploads/images

      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = path.extname(originalFilename);
      const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
      const targetPath = path.join(uploadDir, uniqueFilename);

      await fs.rename(tempFilePath, targetPath);

      const finalPhotoUrl = `/uploads/images/${uniqueFilename}`;

      let whereClause = {};
      whereClause[primaryKeyName] = itemId;

      const [rowsAffected] = await Model.update(
        { photo: finalPhotoUrl },
        { where: whereClause }
      );

      if (rowsAffected === 0) {
        await fs.unlink(targetPath);
        return res.status(404).json({ success: false, message: 'Record not found or no modification made.' });
      }

      res.json({ success: true, message: 'Photo uploaded and updated successfully!', imageUrl: finalPhotoUrl });

    } catch (error) {
      console.error('Internal server error during upload:', error);
      if (req.file && req.file.path && typeof req.file.path === 'string' && req.file.path !== path.join(__dirname, '..', 'public', 'uploads', 'images', path.basename(req.file.path))) {
          try {
              await fs.unlink(req.file.path);
          } catch (unlinkError) {
              console.error('Error deleting temporary file after failure:', unlinkError);
          }
      }
      res.status(500).json({ success: false, message: 'Internal server error during upload: ' + error.message });
    }
};