require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { initDatabase } = require("./database");

const authRoutes = require("./routes/auth");
const personagensRoutes = require("./routes/personagens");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/personagens", personagensRoutes);

app.get("/", (req, res) => {
  res.send("Servidor RPG rodando");
});

const PORT = process.env.PORT || 3000;

initDatabase()
  .then(() => {

    app.listen(PORT, () => {
      console.log("Servidor rodando na porta:", PORT);
    });

  })
  .catch((erro) => {
    console.error("Erro ao iniciar banco:", erro);
  });