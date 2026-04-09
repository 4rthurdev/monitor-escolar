const express = require("express");
require("./database/db");

const alunoRoutes = require("./routes/alunoRoutes");
const disciplinaRoutes = require("./routes/disciplinaRoutes");
const perfilRoutes = require("./routes/perfilRoutes");
const professorRoutes = require("./routes/professorRoutes");
const tarefaRoutes = require("./routes/tarefaRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(alunoRoutes);
app.use(disciplinaRoutes);
app.use(perfilRoutes);
app.use(authRoutes);
app.use(professorRoutes);
app.use(tarefaRoutes);
app.use(turmaRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
