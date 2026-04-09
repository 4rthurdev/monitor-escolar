const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token não informado.",
      });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Token inválido.",
      });
    }

    const decoded = jwt.verify(token, authConfig.jwtSecret);

    req.professorAuth = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido ou expirado.",
    });
  }
};

module.exports = authMiddleware;
