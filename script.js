// Modelos exibidos na galeria, com o HTML usado em cada spinner.
const spinners = [
    { className: "ring", name: "Anel", html: '<div class="ring"></div>' },
    { className: "dual", name: "Anel duplo", html: '<div class="dual"></div>' },
    { className: "dots", name: "Pontos", html: '<div class="dots"><i></i><i></i><i></i></div>' },
    { className: "bars", name: "Barras", html: '<div class="bars"><i></i><i></i><i></i><i></i><i></i></div>' },
    { className: "pulse", name: "Pulso", html: '<div class="pulse"></div>' },
    { className: "orbit", name: "Órbita", html: '<div class="orbit"><i></i><i></i></div>' },
    { className: "square", name: "Quadrado", html: '<div class="square"></div>' }
];

// Referencias aos controles e a area onde os cards serao inseridos.
const colorInput = document.getElementById("c");
const sizeInput = document.getElementById("s");
const speedInput = document.getElementById("d");
const grid = document.getElementById("grid");

// Seleciona as regras CSS do spinner e as animacoes que ele utiliza.
function getSpinnerStyles(className) {
    const rules = Array.from(document.styleSheets[0].cssRules);
    const spinnerRules = rules.filter(rule =>
        rule.type === CSSRule.STYLE_RULE &&
        rule.selectorText.split(",").some(selector => selector.includes(`.${className}`))
    );
    const animationNames = new Set(
        spinnerRules.flatMap(rule => rule.style.animationName.split(",").map(name => name.trim()))
    );
    const keyframeRules = rules.filter(rule =>
        rule.type === CSSRule.KEYFRAMES_RULE && animationNames.has(rule.name)
    );

    return [...keyframeRules, ...spinnerRules].map(rule => rule.cssText).join("\n");
}

// Monta o trecho pronto para copiar com os valores atuais dos controles.
function createSnippet(spinner) {
    const variables = `:root{--accent:${colorInput.value};--spinner-size:${sizeInput.value}px;--spinner-speed:${speedInput.value / 10}s}`;

    return `${variables}\n${getSpinnerStyles(spinner.className)}\n\n<!-- HTML -->\n${spinner.html}`;
}

// Atualiza as variaveis CSS para refletir as escolhas do usuario na galeria.
function updateSpinners() {
    const root = document.documentElement.style;
    root.setProperty("--accent", colorInput.value);
    root.setProperty("--spinner-size", `${sizeInput.value}px`);
    root.setProperty("--spinner-speed", `${speedInput.value / 10}s`);
}

// Cria um card com a visualizacao, o botao de copia e o codigo do spinner.
function createSpinnerCard(spinner) {
    const card = document.createElement("article");
    const stage = document.createElement("div");
    const row = document.createElement("div");
    const name = document.createElement("strong");
    const button = document.createElement("button");
    const code = document.createElement("pre");

    card.className = "spinner-card";
    stage.className = "spinner-stage";
    stage.innerHTML = spinner.html;
    row.className = "spinner-row";
    name.textContent = spinner.name;
    button.type = "button";
    button.textContent = "Copiar CSS";
    code.className = "spinner-code";

    // Exibe o trecho e tenta copia-lo; se falhar, deixa o codigo selecionavel.
    button.addEventListener("click", async () => {
        const snippet = createSnippet(spinner);
        code.textContent = snippet;
        code.classList.add("is-visible");

        try {
            await navigator.clipboard.writeText(snippet);
            button.textContent = "Copiado";
        } catch {
            button.textContent = "Selecione o código";
        }

        window.setTimeout(() => {
            button.textContent = "Copiar CSS";
        }, 1500);
    });

    row.append(name, button);
    card.append(stage, row, code);
    return card;
}

// Preenche a galeria e conecta os controles a atualizacao dos spinners.
spinners.forEach(spinner => grid.append(createSpinnerCard(spinner)));
[colorInput, sizeInput, speedInput].forEach(input => input.addEventListener("input", updateSpinners));