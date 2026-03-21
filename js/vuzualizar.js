const API = "http://https://rpg-ficha-api.onrender.com";

function pegarToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
}

async function carregarFichaPublica() {
  const token = pegarToken();

  if (!token) {
    document.body.innerHTML = "<h2>Token inválido.</h2>";
    return;
  }

  const resposta = await fetch(`${API}/personagens/publico/${token}`);
  const personagem = await resposta.json();

  if (personagem.erro) {
    document.body.innerHTML = `<h2>${personagem.erro}</h2>`;
    return;
  }

  const dados = personagem.dados || {};

  document.getElementById("nome").innerText = personagem.nome || "Sem nome";
  document.getElementById("classe").innerText = dados.classe || "";

  document.getElementById("identidade").innerHTML = `
    <p><strong>Jogador:</strong> ${dados.jogador || ""}</p>
    <p><strong>Origem:</strong> ${dados.conceito || ""}</p>
    <p><strong>Nux:</strong> ${dados.nux ?? 0}%</p>
    <p><strong>Lux:</strong> ${dados.lux ?? 0}</p>
  `;

  document.getElementById("atributos").innerHTML = `
    <p>DES: ${dados.atributos?.des ?? 0}</p>
    <p>ESS: ${dados.atributos?.ess ?? 0}</p>
    <p>FOR: ${dados.atributos?.forca ?? 0}</p>
    <p>INT: ${dados.atributos?.int ?? 0}</p>
    <p>VIG: ${dados.atributos?.vig ?? 0}</p>
  `;

  document.getElementById("recursos").innerHTML = `
    <p>Vida: ${dados.recursos?.vidaAtual ?? 0}/${dados.recursos?.vidaMax ?? 0}</p>
    <p>PM: ${dados.recursos?.pmAtual ?? 0}/${dados.recursos?.pmMax ?? 0}</p>
    <p>Sanidade: ${dados.recursos?.sanAtual ?? 0}/${dados.recursos?.sanMax ?? 0}</p>
  `;

  const pericias = dados.pericias || {};
  document.getElementById("pericias").innerHTML =
    Object.keys(pericias).length
      ? Object.entries(pericias).map(([nome, p]) =>
          `<p>${nome}: T ${p.treinamento ?? 0} | B ${p.bonus ?? 0}</p>`
        ).join("")
      : "<p>Nenhuma perícia.</p>";

  document.getElementById("habilidades").innerHTML =
    (dados.habilidades || []).length
      ? dados.habilidades.map(h => `<p>${h.nome} (${h.pm} PM)</p>`).join("")
      : "<p>Nenhuma habilidade.</p>";

  document.getElementById("rituais").innerHTML =
    (dados.rituais || []).length
      ? dados.rituais.map(r => `<p>${r.nome} - ${r.elemento} - ${r.categoria}</p>`).join("")
      : "<p>Nenhum ritual.</p>";

  const inv = dados.inventario || {};
  const itens = [
    ...(inv.armas || []),
    ...(inv.municoes || []),
    ...(inv.protecoes || []),
    ...(inv.cura || []),
    ...(inv.geral || []),
    ...(inv.corrompidos || [])
  ];

  document.getElementById("inventario").innerHTML =
    itens.length
      ? itens.map(i => `<p>${i.nome}</p>`).join("")
      : "<p>Inventário vazio.</p>";
}

carregarFichaPublica();