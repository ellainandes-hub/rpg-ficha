const API = "https://rpg-ficha-api.onrender.com";

const token = localStorage.getItem("token");
const personagemId = localStorage.getItem("personagemAtual");

async function carregarFicha() {
    if (!token) {
        window.location.href = "../index.html";
        return;
    }

    if (!personagemId) {
        alert("Nenhum personagem selecionado");
        window.location.href = "personagens.html";
        return;
    }

    try {
        const resposta = await fetch(`${API}/personagens/ficha/${personagemId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const personagem = await resposta.json();

        if (!resposta.ok || personagem.erro) {
            alert(personagem.erro || "Nenhum personagem encontrado.");
            window.location.href = "personagens.html";
            return;
        }

        if (document.getElementById("nomePersonagem")) {
            document.getElementById("nomePersonagem").innerText = personagem.nome || "";
        }

        if (document.getElementById("debug")) {
            document.getElementById("debug").innerText =
                JSON.stringify(personagem.dados || {}, null, 2);
        }

        console.log("Personagem carregado:", personagem);
    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar personagem");
        window.location.href = "personagens.html";
    }
}

carregarFicha();