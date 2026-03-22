const API_PRELOAD = "https://rpg-ficha-api.onrender.com";

(function carregarPersonagemDoBancoAntesDaFicha() {
    const personagemId = Number(localStorage.getItem("personagemAtual"));

    if (!personagemId && personagemId !== 0) {
        return;
    }

    function criarPericiasPadrao() {
        return {
            "Acrobacia": { atributo: "des", treinamento: 0, bonus: 0 },
            "Adestramento": { atributo: "ess", treinamento: 0, bonus: 0 },
            "Artes": { atributo: "ess", treinamento: 0, bonus: 0 },
            "Atletismo": { atributo: "forca", treinamento: 0, bonus: 0 },
            "Charme": { atributo: "ess", treinamento: 0, bonus: 0 },
            "Ciência": { atributo: "int", treinamento: 0, bonus: 0 },
            "Conhecimentos Gerais": { atributo: "int", treinamento: 0, bonus: 0 },
            "Crime": { atributo: "des", treinamento: 0, bonus: 0 },
            "Enganação": { atributo: "ess", treinamento: 0, bonus: 0 },
            "Fortitude": { atributo: "vig", treinamento: 0, bonus: 0 },
            "Furtividade": { atributo: "des", treinamento: 0, bonus: 0 },
            "Iniciativa": { atributo: "des", treinamento: 0, bonus: 0 },
            "Instinto": { atributo: "ess", treinamento: 0, bonus: 0 },
            "Intimidação": { atributo: "ess", treinamento: 0, bonus: 0 },
            "Investigação": { atributo: "int", treinamento: 0, bonus: 0 },
            "Luta": { atributo: "forca", treinamento: 0, bonus: 0 },
            "Medicina": { atributo: "int", treinamento: 0, bonus: 0 },
            "Persuasão": { atributo: "ess", treinamento: 0, bonus: 0 },
            "Pilotagem": { atributo: "des", treinamento: 0, bonus: 0 },
            "Pontaria": { atributo: "des", treinamento: 0, bonus: 0 },
            "Profissão": { atributo: "int", treinamento: 0, bonus: 0 },
            "Reflexo": { atributo: "des", treinamento: 0, bonus: 0 },
            "Saber Oculto": { atributo: "int", treinamento: 0, bonus: 0 },
            "Sobrevivência": { atributo: "int", treinamento: 0, bonus: 0 },
            "Tática": { atributo: "int", treinamento: 0, bonus: 0 },
            "Tecnológica": { atributo: "int", treinamento: 0, bonus: 0 },
            "Vontade": { atributo: "ess", treinamento: 0, bonus: 0 }
        };
    }

    function mergeProfundo(base, extra) {
        if (!extra || typeof extra !== "object") return base;

        const resultado = Array.isArray(base) ? [...base] : { ...base };

        for (const chave in extra) {
            const valorExtra = extra[chave];
            const valorBase = resultado[chave];

            if (
                valorExtra &&
                typeof valorExtra === "object" &&
                !Array.isArray(valorExtra) &&
                valorBase &&
                typeof valorBase === "object" &&
                !Array.isArray(valorBase)
            ) {
                resultado[chave] = mergeProfundo(valorBase, valorExtra);
            } else {
                resultado[chave] = valorExtra;
            }
        }

        return resultado;
    }

    function criarPersonagemPadrao(nomeBanco) {
        return {
            nome: nomeBanco || "Sem nome",
            jogador: "",
            conceito: "",
            classe: "Combatente",
            imagem: "",
            nux: 0,
            lux: 0,
            poderSublimeManual: "",
            atributos: {
                des: 1,
                ess: 1,
                forca: 1,
                int: 1,
                vig: 1
            },
            recursos: {
                vidaAtual: 20,
                vidaMax: 20,
                pmAtual: 6,
                pmMax: 6,
                sanAtual: 12,
                sanMax: 12
            },
            combate: {
                defesa: "",
                esquiva: "",
                protecaoNome: "",
                protecaoValor: 0,
                outroDefesa: 0
            },
            resistencias: "",
            proficiencias: "",
            pericias: criarPericiasPadrao(),
            habilidades: [],
            rituais: [],
            inventario: {
                categorias: { I: 0, II: 0, III: 0, IV: 0 },
                armas: [],
                municoes: [],
                protecoes: [],
                cura: [],
                geral: [],
                corrompidos: []
            },
            ritualInfo: {
                categorias: { I: 0, II: 0, III: 0, IV: 0 },
                dtManual: "",
                dtrManual: ""
            },
            pesoAtual: 0
        };
    }

    try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${API_PRELOAD}/personagens/ficha/${personagemId}`, false);
        xhr.send(null);

        if (xhr.status < 200 || xhr.status >= 300) {
            console.error("Erro ao buscar personagem no banco:", xhr.responseText);
            return;
        }

        const registro = JSON.parse(xhr.responseText);
        const dadosBanco = registro.dados || {};
        const personagemFinal = mergeProfundo(criarPersonagemPadrao(registro.nome), dadosBanco);

        personagemFinal.nome = personagemFinal.nome || registro.nome || "Sem nome";
        personagemFinal.idBanco = registro.id;

        let personagens = JSON.parse(localStorage.getItem("personagens")) || {};
        personagens[personagemId] = personagemFinal;

        localStorage.setItem("personagens", JSON.stringify(personagens));
        localStorage.setItem("personagemAtual", String(personagemId));
    } catch (erro) {
        console.error("Erro no preload da ficha:", erro);
    }
})();