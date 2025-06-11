const express = require("express");
const RentreeController = require("../Controllers/RentreeController");
const router = express.Router();

//const { authenticate } = require('../Middlewares/Authenticate');
//const authorizeRole = require('../Middlewares/AuthorizeRole');

// Tous les accès sont réservés à l'admin

router.get('/latest',/* authenticate, authorizeRole(['admin']),*/  RentreeController.getLatestRentree);
router.get("/", /*authenticate, authorizeRole(['admin']),*/ RentreeController.getAllRentrees);
router.get("/:id_rentree", /*authenticate, authorizeRole(['admin']),*/ RentreeController.getRentreeById);
router.post("/", /*authenticate, authorizeRole(['admin']),*/ RentreeController.addRentree);
router.put("/:id_rentree", /*authenticate, authorizeRole(['admin']),*/ RentreeController.updateRentree);
router.delete("/:id_rentree", /*authenticate, authorizeRole(['admin']),*/ RentreeController.deleteRentree);

module.exports = router;

