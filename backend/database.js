const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não definida no ambiente.");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        usuario VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        tipo VARCHAR(20) DEFAULT 'jogador'
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS personagens (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        nome VARCHAR(150) NOT NULL,
        dados JSONB NOT NULL DEFAULT '{}'::jsonb
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