const API = "http://localhost:3000"



// LOGIN
async function login() {

    const usuario = document.getElementById("usuario").value
    const senha = document.getElementById("senha").value

    const resposta = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario,
            senha
        })
    })

    const dados = await resposta.json()

    if (dados.erro) {
        alert(dados.erro)
        return
    }

    localStorage.setItem("token", dados.token)
    localStorage.setItem("tipo", dados.tipo)

    if (dados.tipo === "admin") {
        window.location.href = "pages/admin.html"
    } else {
        window.location.href = "pages/personagens.html"
    }

}




// CRIAR CONTA
async function criarConta() {

    const usuario = document.getElementById("novoUsuario").value
    const senha = document.getElementById("novaSenha").value

    const resposta = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario,
            senha
        })
    })

    const dados = await resposta.json()

    if (dados.erro) {
        alert(dados.erro)
        return
    }

    alert("Conta criada com sucesso!")

}