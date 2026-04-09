const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

const loginProfessor = async (req, res) => {
  try {
    const { cpf, senha } = req.body;

    if (
      cpf !== authConfig.professorCredentials.cpf ||
      senha !== authConfig.professorCredentials.senha
    ) {
      return res.status(401).json({
        message: "CPF ou senha inválidos.",
      });
    }

    const token = jwt.sign(
      {
        tipo: "professor",
        cpf,
      },
      authConfig.jwtSecret,
      { expiresIn: "2d" }
    );

    res.status(200).json({
      message: "Login realizado com sucesso.",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao fazer o login do professor.",
      erro: error.message,
    });
  }
};

module.exports = {
  loginProfessor,
};