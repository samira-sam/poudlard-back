const express = require("express");
const UtilisateurController = require("../Controllers/UtilisateurController");
const router = express.Router();

router.get("/", UtilisateurController.getAllUtilisateur);
router.get("/:id", UtilisateurController.getUtilisateurById);
router.post("/", UtilisateurController.addUtilisateur);
router.put("/:id", UtilisateurController.updateUtilisateur);
router.delete("/:id", UtilisateurController.deleteUtilisateur);
router.get('/role/:roleName', UtilisateurController.findUsersByRole);

module.exports = router;
