const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const { pool } = require("../database");

// LISTAR PERSONAGENS DO USUÁRIO
router.get("/:usuarioId", async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;

    const resultado = await pool.query(
      "SELECT * FROM personagens WHERE usuario_id = $1 ORDER BY id ASC",
      [usuarioId]
    );

    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message || err });
  }
});

// CRIAR PERSONAGEM
router.post("/criar", async (req, res) => {
  try {
    const { usuario_id, nome, dados } = req.body;

    const resultado = await pool.query(
      "INSERT INTO personagens (usuario_id, nome, dados) VALUES ($1, $2, $3) RETURNING id",
      [usuario_id, nome, dados || {}]
    );

    res.json({ id: resultado.rows[0].id });
  } catch (err) {
    res.status(500).json({ erro: err.message || err });
  }
});

// BUSCAR PERSONAGEM PARA A FICHA
router.get("/ficha/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const resultado = await pool.query(
      "SELECT * FROM personagens WHERE id = $1",
      [id]
    );

    const row = resultado.rows[0];

    if (!row) {
      return res.status(404).json({ erro: "Personagem não encontrado" });
    }

    res.json(row);
  } catch (err) {
    res.status(500).json({ erro: err.message || err });
  }
});

// ATUALIZAR DADOS DA FICHA
router.put("/ficha/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, dados } = req.body;

    const resultado = await pool.query(
      "UPDATE personagens SET nome = $1, dados = $2 WHERE id = $3",
      [nome || "Sem nome", dados || {}, id]
    );

    res.json({
      sucesso: true,
      alteradas: resultado.rowCount
    });
  } catch (err) {
    res.status(500).json({ erro: err.message || err });
  }
});

// COMPARTILHAR
router.post("/compartilhar/:id", async (req, res) => {
  try {
    const personagemId = req.params.id;
    const token = crypto.randomBytes(16).toString("hex");

    await pool.query(
      "INSERT INTO compartilhamentos (personagem_id, token) VALUES ($1, $2)",
      [personagemId, token]
    );

    res.json({
      sucesso: true,
      link: `http://127.0.0.1:5500/rpg-ficha/pages/visualizar.html?token=${token}`
    });
  } catch (err) {
    res.status(500).json({ erro: err.message || err });
  }
});

// PÚBLICO
router.get("/publico/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const resultado = await pool.query(
      `SELECT p.*
       FROM compartilhamentos c
       JOIN personagens p ON p.id = c.personagem_id
       WHERE c.token = $1`,
      [token]
    );

    const row = resultado.rows[0];

    if (!row) {
      return res.status(404).json({ erro: "Ficha não encontrada" });
    }

    res.json(row);
  } catch (err) {
    res.status(500).json({ erro: err.message || err });
  }
});

// EXCLUIR PERSONAGEM
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query(
      "DELETE FROM personagens WHERE id = $1",
      [id]
    );

    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: err.message || err });
  }
});

module.exports = router;