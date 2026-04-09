const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/auth/professor/login", authController.loginProfessor);

module.exports = router;