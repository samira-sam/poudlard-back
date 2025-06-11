const express = require('express');
const router = express.Router();
const BuseController = require('../Controllers/BuseController');

//const { authenticate } = require('../Middlewares/Authenticate');
//const authorizeRole = require('../Middlewares/AuthorizeRole');

router.get(
    "/latest", /* authenticate, authorizeRole(['admin']),*/  
    BuseController.getLatestBuse);

router.get(
    "/",
    //authenticate,
    //authorizeRole(['admin']),
    BuseController.getAllBuse
);

router.get(
    "/:id",
    //authenticate,
    //authorizeRole(['admin']),
    BuseController.getBuseById
);

router.post(
    "/",
    //authenticate,
    //authorizeRole(['admin']),
    BuseController.addBuse
);

router.put(
    "/:id",
    //authenticate,
    //authorizeRole(['admin']),
    BuseController.updateBuse
);

router.delete(
    "/:id",
    //authenticate,
    //authorizeRole(['admin']),
    BuseController.deleteBuse
);

module.exports = router;
