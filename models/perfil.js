let mongoose = require("mongoose");

let perfilSchema = new mongoose.Schema({
  matricula: String,
  telefone: String,
  endereco: String,
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: "Aluno" }, // Relação de 1 Perfil - tem 1 Aluno
});

module.exports = mongoose.model("Perfil", perfilSchema);