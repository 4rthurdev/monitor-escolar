let mongoose = require("mongoose");

let turmaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  alunos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Aluno" }], //Relação de 1 turma - tem N alunos
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "Professor" } //Relação de 1 turma - tem 1 professor
});

module.exports = mongoose.model("Turma", turmaSchema);