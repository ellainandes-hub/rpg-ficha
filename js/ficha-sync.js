const API_FICHA = "http://localhost:3000";

let timeoutSalvarBanco = null;

function salvarFichaNoBanco(personagem) {
  const idBanco = personagem?.idBanco || Number(localStorage.getItem("personagemAtual"));

  if (idBanco === undefined || idBanco === null || Number.isNaN(Number(idBanco))) {
    console.warn("Sem idBanco para salvar.");
    return;
  }

  clearTimeout(timeoutSalvarBanco);

  timeoutSalvarBanco = setTimeout(async () => {
    try {
      const resposta = await fetch(`${API_FICHA}/personagens/ficha/${idBanco}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: personagem?.nome || "Sem nome",
          dados: personagem || {}
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        console.error("Erro ao salvar ficha no banco:", dados);
        return;
      }

      console.log("Ficha salva no banco com sucesso:", dados);
    } catch (erro) {
      console.error("Erro ao salvar ficha no banco:", erro);
    }
  }, 500);
}