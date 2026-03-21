const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/rpgficha";

const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
});

async function initDatabase() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        usuario TEXT UNIQUE NOT NULL,
        senha TEXT UNIQUE NOT NULL,
        tipo TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS personagens (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        nome TEXT,
        dados JSONB DEFAULT '{}'::jsonb
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS compartilhamentos (
        id SERIAL PRIMARY KEY,
        personagem_id INTEGER REFERENCES personagens(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL
      )
    `);

    const usuarioADM = "Norman_Blue";
    const senhaADM = "ADMBlue";

    const adm = await client.query(
      "SELECT * FROM usuarios WHERE usuario = $1",
      [usuarioADM]
    );

    if (adm.rows.length === 0) {
      const senhaHash = bcrypt.hashSync(senhaADM, 10);

      await client.query(
        "INSERT INTO usuarios (usuario, senha, tipo) VALUES ($1, $2, $3)",
        [usuarioADM, senhaHash, "admin"]
      );

      console.log("ADM criado: Norman_Blue / ADMBlue");
    }
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  initDatabase
};