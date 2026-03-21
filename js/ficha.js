const API = "http://https://rpg-ficha-api.onrender.com"

const personagemId = localStorage.getItem("personagemAtual")

async function carregarFicha() {

    if (!personagemId) {
        alert("Nenhum personagem selecionado")
        return
    }

    try {

        const resposta = await fetch(`${API}/personagens/ficha/${personagemId}`)

        const personagem = await resposta.json()

        if (personagem.erro) {
            alert(personagem.erro)
            return
        }

        document.getElementById("nomePersonagem").innerText = personagem.nome

        document.getElementById("debug").innerText =
            JSON.stringify(personagem.dados, null, 2)

        console.log("Personagem carregado:", personagem)

    }
    catch (erro) {

        console.error(erro)
        alert("Erro ao carregar personagem")

    }

}

carregarFicha()