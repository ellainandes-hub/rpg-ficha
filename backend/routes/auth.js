const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { pool } = require("../database");

const SECRET = process.env.JWT_SECRET || "RPG_SECRET_KEY";

router.post("/register", async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ erro: "Preencha tudo" });
    }

    const hash = bcrypt.hashSync(senha, 10);

    await pool.query(
      "INSERT INTO usuarios (usuario, senha, tipo) VALUES ($1, $2, $3)",
      [usuario, hash, "jogador"]
    );

    res.json({ sucesso: true });
  } catch (err) {
    res.status(400).json({ erro: "Usuário ou senha já existe" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1",
      [usuario]
    );

    const user = resultado.rows[0];

    if (!user) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    const valido = bcrypt.compareSync(senha, user.senha);

    if (!valido) {
      return res.status(401).json({ erro: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: user.id, tipo: user.tipo },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      tipo: user.tipo
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro no login" });
  }
});

module.exports = router;