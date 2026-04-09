const authConfig = {
  jwtSecret: "jwt_professor_secreto",
  professorCredentials: {
    cpf: "12345678900",
    senha: "professor123",
  },
};

module.exports = authConfig;
//Rota exclusiva do prof.
//Usar as credenciais no post, passar no body as credenciais, usar o token que retornar nas rotas de prof.