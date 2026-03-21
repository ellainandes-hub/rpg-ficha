const API = "https://rpg-ficha-api.onrender.com";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../index.html";
}

function pegarUsuarioId() {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
}

async function carregarPersonagens() {

    const usuarioId = pegarUsuarioId();

    const resposta = await fetch(`${API}/personagens/${usuarioId}`);

    const personagens = await resposta.json();

    const lista = document.getElementById("listaPersonagens");

    lista.innerHTML = "";

    personagens.forEach(p => {

        lista.innerHTML += `
        
        <div class="card-personagem">

            <h3>${p.nome}</h3>

            <button onclick="abrirFicha(${p.id})">
            Abrir
            </button>

            <button onclick="excluirPersonagem(${p.id})">
            Excluir
            </button>

        </div>
        
        `;

    });

}

async function criarPersonagem() {

    const nome = prompt("Nome do personagem");

    if (!nome) return;

    const usuario_id = pegarUsuarioId();

    const dados = {};

    await fetch(`${API}/personagens/criar`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            usuario_id,
            nome,
            dados
        })

    });

    carregarPersonagens();

}

async function excluirPersonagem(id) {

    await fetch(`${API}/personagens/${id}`, {
        method: "DELETE"
    });

    carregarPersonagens();

}

function abrirFicha(id) {

    localStorage.setItem("personagemAtual", id);

    window.location.href = "ficha.html";

}

carregarPersonagens();