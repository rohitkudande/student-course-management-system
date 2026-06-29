const express = require("express");
const router = express.Router();
const authCntrl = require("../controllers/authCntrl");

// Public routes
router.post("/register", authCntrl.register);
router.post("/login", authCntrl.login);

module.exports = router;