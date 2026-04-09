const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController.js");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/professor", authMiddleware, professorController.obterTodosProfessores);
router.post("/professor", authMiddleware, professorController.criarProfessor);
router.delete("/professor/:id", authMiddleware, professorController.deletarProfessor);
router.put("/professor/:id", authMiddleware, professorController.editarProfessor);

module.exports = router;
