let listaDeQuizzes = [];
let listaDeQuizzesDoUsuario;
obterQuizzes()
function obterQuizzes() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes")
    promessa.then(renderizarQuizzesNaTela)
}
function renderizarQuizzesNaTela(resposta) {
    listaDeQuizzes = resposta.data
    verificarSeusQuizzes()
    renderizarTodosQuizzes()
    window.scrollTo(0, 0);
}
const criarQuiz = document.querySelector(".criarQuizz");
const seusQuizzes = document.querySelector(".seusQuizzes");
const seusQuizzesTitulo = document.querySelector(".seusQuizzesTitulo");
const todosQuizzesTitulo = document.querySelector(".todosQuizzesTitulo");
const ulTodosQuizzes = document.querySelector(".todosQuizzes");
function renderizarTodosQuizzes() {
    ulTodosQuizzes.innerHTML = "";
    for(let i = 0; i < listaDeQuizzes.length; i++) {
        ulTodosQuizzes.innerHTML += `
        <li class="quizz" onclick="escolherQuizz(this)" id="${listaDeQuizzes[i].id}">
            <img src=${listaDeQuizzes[i].image}>
            <div class="nomeDoQuiz">${listaDeQuizzes[i].title}</div>
        </li>`;
    }
}
function verificarSeusQuizzes() {
    if(listaDeQuizzesDoUsuario===undefined) {
        seusQuizzes.classList.add("oculto");
        seusQuizzesTitulo.classList.add("oculto")
    } else {
        renderizarSeusQuizzes ()
    }
}
function renderizarSeusQuizzes () {
    // usar find aqui
        criarQuiz.classList.add("oculto");
        seusQuizzes.innerHTML = "";
        for(let i = 0; i < listaDeQuizzesDoUsuario.length; i++) {
            seusQuizzes.innerHTML += `
            <li class="quizz">
                <img src=${listaDeQuizzesDoUsuario[i].image}>
                <div class="nomeDoQuiz">${listaDeQuizzesDoUsuario[i].title}</div>
            </li>
            `;
        }
}
let quizSelecionado;
function escolherQuizz(selecionado) {
    for(let i = 0; i < listaDeQuizzes.length; i++) {
        if(listaDeQuizzes[i].id == selecionado.id) {
            quizSelecionado = listaDeQuizzes[i];
        }
    }
    atualizarContadoresDaPagina()
    guardarResultados(quizSelecionado.levels);
    paginaDoQuizz()
    adicionarCapaDoQuizz();
    adicionarPergunta()
    adicionarButaoVoltar()
}
function guardarResultados(Niveis) {
    const dadosDoResultado = {titulosResultado: [],imagensResultado: [],textosResultado: [],acertoMinimoResultado: []}
    for(let i=0; i<Niveis.length; i++) {
        dadosDoResultado.titulosResultado.push(Niveis[i].title)
        dadosDoResultado.imagensResultado.push(Niveis[i].image)
        dadosDoResultado.textosResultado.push(Niveis[i].text)
        dadosDoResultado.acertoMinimoResultado.push(Niveis[i].minValue)
    }
    return dadosDoResultado;
}
const paginaInicial = document.querySelector(".pagina-inicial");
const paginaQuizz = document.querySelector(".pagina-Quizz");
const paginaCriarQuizz = document.querySelector(".pagina-criar-Quizz");
function paginaDoQuizz() {
    paginaInicial.classList.add("oculto");
    paginaQuizz.classList.remove("oculto");
}
function adicionarCapaDoQuizz() {
    paginaQuizz.innerHTML = `
    <div class="Quizz-titulo"><img src=${quizSelecionado.image}>
        <div class="titulo">${quizSelecionado.title}</div>
    </div>
    `;
}
let perguntas;
function adicionarPergunta() {
    perguntas = quizSelecionado.questions;
    for(let i = 0; i < perguntas.length; i++) {
        paginaQuizz.innerHTML += `
        <article class="container-pergunta">
            <div class="pergunta" style="background-color:${perguntas[i].color};">
            ${perguntas[i].title}
            </div>
            <article class="respostas naoRespondida"></article>
        </article>
        `;
    }
    renderizarRespostas(perguntas)
}

function renderizarRespostas(perguntas) {
    let todasAsRespostas = [];
    for(let i =0; i < perguntas.length; i++) {
        todasAsRespostas.push(perguntas[i].answers)
    }
    todasAsRespostas.forEach(adicionarResposta)
}
function adicionarResposta(elemento, i) {
    const elementoRespostas = document.querySelector(`article:nth-of-type(${i+1}) .respostas`)
    elemento.sort(() => Math.random() - 0.5)
        for(let j = 0; j < elemento.length; j++) {
            elementoRespostas.innerHTML += `
            <div class="resposta" onclick="selecionarResposta(this)">
                <img src=${elemento[j].image}>
                <p>${elemento[j].text}</p>
            </div>
            `;
            if(elemento[j].isCorrectAnswer) {
                const respostaCorreta = elementoRespostas.children[j];
                respostaCorreta.setAttribute("id", "certa")
            }
        }
}
let elementoResultado;
function adicionarButaoVoltar() {
    paginaQuizz.innerHTML += `
        <article class="container-resultado oculto"></article>
        <button class="reinicia-quizz" onclick="resetarQuizz()">Reiniciar Quizz</button>
        <button onclick="irParaPaginaInicial()" class="retorna-inicio">Voltar pra home</button>
    `
    elementoResultado = document.querySelector(".container-resultado")
}
let contadorDeJogadas=0;
let contadorDeAcertos=0;
function selecionarResposta(respostaSelecionada) {
    contadorDeJogadas+=1;
    const selecionado = document.querySelector(".selecionado");
    if (selecionado !== null) {
        respostaSelecionada.classList.remove('selecionado');
    } 
    respostaSelecionada.classList.add('selecionado');
    respostaSelecionada.removeAttribute("onclick");
    destacarImagemSelecionada(respostaSelecionada);
    renderizarResultado();
    setTimeout(scrollarProximaPergunta, 2000);
}
function destacarImagemSelecionada(respostaSelecionada) {
    const perguntaRespondida = respostaSelecionada.parentNode;
    const respostasDaPergunta = perguntaRespondida.children;
    for(let i = 0; i < respostasDaPergunta.length; i++) {
        if(!(respostasDaPergunta[i].classList.contains("selecionado"))) {
            respostasDaPergunta[i].classList.add("opacidade")
            respostasDaPergunta[i].removeAttribute("onclick");
        }
    }
    verificarRespostaCerta(respostasDaPergunta)
}
function verificarRespostaCerta(respostasDaPergunta) {
    for(let i = 0; i < respostasDaPergunta.length; i++) {
        if(respostasDaPergunta[i].id==="certa" && respostasDaPergunta[i].classList.contains("selecionado")) {
            respostasDaPergunta[i].classList.add("correta")
            contadorDeAcertos+=1;
        } else if(respostasDaPergunta[i].id==="certa") {
            respostasDaPergunta[i].classList.add("correta")
        } else {
            respostasDaPergunta[i].classList.add("errada")
        }
    }
    atualizarPerguntaRespondida()
}
let perguntaNaorespondida;
function atualizarPerguntaRespondida() {
    perguntaNaorespondida = document.querySelector(".naoRespondida");
    perguntaNaorespondida.classList.remove('naoRespondida');
    perguntaNaorespondida.classList.add('respondida');
}
function scrollarProximaPergunta() {
    perguntaNaorespondida = document.querySelector(".naoRespondida");
    if(perguntaNaorespondida!==null) {
        perguntaNaorespondida.scrollIntoView({block: "center", behavior: "smooth"});
    } else {
        elementoResultado.scrollIntoView({block: "center", behavior: "smooth"});
    }
}
function resultadoCalculado() {
    const porcentagemAcerto = Number(100*contadorDeAcertos/contadorDeJogadas).toFixed(0);
    const dadosDoResultado = guardarResultados(quizSelecionado.levels);
    let textoDoNivel;
    let imagemDoNivel;
    let descriçãoDoNivel;
    for(let j=0; j < dadosDoResultado.acertoMinimoResultado.length; j++){
        if (porcentagemAcerto >= dadosDoResultado.acertoMinimoResultado[j]){
            const indiceResultado = j;
            descriçãoDoNivel = dadosDoResultado.titulosResultado[j]
            textoDoNivel = dadosDoResultado.textosResultado[j]
            imagemDoNivel = dadosDoResultado.imagensResultado[j]
        }
    }
    const calculado = [porcentagemAcerto, descriçãoDoNivel, imagemDoNivel, textoDoNivel]
    return calculado;
}
function renderizarResultado() {
    if(contadorDeJogadas===perguntas.length) {
        elementoResultado.classList.remove('oculto')
        elementoResultado.innerHTML = `
        <div class="resultado" style="background-color:#EC362D">
            ${resultadoCalculado()[0]}% de acerto: ${resultadoCalculado()[1]}
        </div>
        <article class="resultados">
            <div class="imagem-resultado">
                <img src=${resultadoCalculado()[2]} alt="">
            </div>
            <div class="mensagem-resultado">
                ${resultadoCalculado()[3]}
            </div>
        </article>`;
    }
}
function irParaPaginaInicial() {
    document.querySelector('.pagina-inicial').classList.remove('oculto');
    document.querySelector('.pagina-Quizz').classList.add('oculto');
    document.querySelector('.pagina-criar-Quizz').classList.add('oculto');
    atualizarContadoresDaPagina()
}
function resetarQuizz() {
    adicionarCapaDoQuizz();
    adicionarPergunta()
    adicionarButaoVoltar()
    atualizarContadoresDaPagina()
}
function atualizarContadoresDaPagina() {
    contadorDeJogadas=0;
    contadorDeAcertos=0;
    window.scrollTo(0, 0);
}
const comecePeloComeco = document.querySelector('.tela-3-1');
const crieSuasPerguntas = document.querySelector('.tela-3-2');
const decidaOsNiveis = document.querySelector('.tela-3-3');
const quizzPronto = document.querySelector('.tela-3-4');

function criarQuizz() {
    paginaInicial.classList.add("oculto");
    paginaCriarQuizz.classList.remove("oculto");
    renderizarTela_3_1()
    renderizarInputsDaTela_3_1()
}
function renderizarTela_3_1() {
    paginaCriarQuizz.innerHTML =`
    <div class="tela-3-1">
        <div class="container-comeco">
            <h1>Comece pelo Começo</h1> 
            <article class="dados-entrada-criar">
            </article>
            <button onclick="validacaoDeDados()">Prosseguir pra criar perguntas</button>
        </div>
    </div>`
}
function inputsDaTela_3_1() {
    const placeholderDosInputs = ["Título do seu quizz", "URL da imagem do seu quizz", "Quantidade de perguntas do quizz", "Quantidade de níveis do quizz"];
    const tituloDosInputs = ["O título deve possuir entre 20 e 65 caracteres.", "A imagem deve possuir uma URL válida!", "O Quizz deve possuir no mínimo 3 perguntas", "O Quizz deve possuir no mínimo 2 Níveis"];
    let atributoDosInputs = [];
    for(let i =0;i < 4; i++) {
        atributoDosInputs[i] = {placeholder: `"${placeholderDosInputs[i]}"`, title: `"${tituloDosInputs[i]}"`};
    }
    return atributoDosInputs;
}
function renderizarInputsDaTela_3_1() {
    const caixaDeInputsTela_3_1 = document.querySelector(".dados-entrada-criar");
    for(let i = 0; i< inputsDaTela_3_1().length; i++) {
        caixaDeInputsTela_3_1.innerHTML+= `
        <input type="text" placeholder=${inputsDaTela_3_1()[i].placeholder}  title=${inputsDaTela_3_1()[i].title}>`
    }
    const inputDaURL = document.querySelector(".dados-entrada-criar input:nth-of-type(2)");
    inputDaURL.setAttribute("class", "utl-Img")
}
let objNovoQuizz = {}
const armazenarDados_3_1 = [];
function dadosInseridos_3_1() {
    for(let i = 0; i < inputsDaTela_3_1().length; i++) {
        armazenarDados_3_1[i] = (document.querySelector(`.dados-entrada-criar input:nth-of-type(${i+1})`).value);
    }
    armazenarDados_3_1[2] = Number(armazenarDados_3_1[2]);
    armazenarDados_3_1[3] = Number(armazenarDados_3_1[3])
}
function validacaoDeDados() {
    dadosInseridos_3_1()
    const okTitulo = validarTitulo(armazenarDados_3_1[0])
    const okUrl = validarUrl(armazenarDados_3_1[1])
    const okQtdPerguntas = validarQtdPerguntas(armazenarDados_3_1[2])
    const okQtdNiveis = validarQtdNiveis(armazenarDados_3_1[3])
    if (okTitulo && okUrl && okQtdNiveis && okQtdPerguntas) {
        criarPerguntas()
        objNovoQuizz.title.push(armazenarDados_3_1[0])
        objNovoQuizz.image.push(armazenarDados_3_1[1])
    } else {
        alert('preencha corretamente os dados!')
    };
}
let quantidadeDePerguntas;
let quantidaDeDeNiveis;
function criarPerguntas() {
    paginaCriarQuizz.innerHTML = `
        <div class="tela-3-2">
            <div class="container-comeco">
                <h1>Crie suas perguntas</h1>
            </div>
        </div>
        `;
    quantidadeDePerguntas = armazenarDados_3_1[2];
    quantidaDeDeNiveis = armazenarDados_3_1[3];
    const paginaPerguntas = document.querySelector('.tela-3-2 .container-comeco');
    for (let i=1; i < quantidadeDePerguntas+1; i++){
        paginaPerguntas.innerHTML += `
            <article class="dados-entrada-criar" id="Pergunta ${i}">
                <div class="pergunta-minimizada">
                    <h2>Pergunta ${i}</h2>
                    <img onclick="alternarPergunta(this.parentNode)" src="img/create.svg" alt="expandir pergunta">
                </div>
            </article>
        `;
    }
    paginaPerguntas.innerHTML += `<button  onclick="CriarNiveis()">Prosseguir pra criar níveis</button>`
    if(elementoPerguntaAnterior===undefined) {
        const iniciarComPrimeiraPerguntaExpandida = document.querySelector(`.container-comeco article:first-of-type`)
        expandirPergunta(iniciarComPrimeiraPerguntaExpandida, "Pergunta 1")
        elementoPerguntaAnterior = iniciarComPrimeiraPerguntaExpandida;
        identificadorPerguntaAnterior = "Pergunta 1";
    }
}
let elementoPerguntaAnterior;
let identificadorPerguntaAnterior;
function alternarPergunta(elementoSelecionado) {
    dadosInseridos_3_2()
    if (elementoPerguntaAnterior!==undefined) {
        minimizarPergunta(elementoPerguntaAnterior, identificadorPerguntaAnterior)
    } 
    const elementoPerguntaAtual = elementoSelecionado.parentNode;
    const identificadorDaPergunta = elementoPerguntaAtual.id;
    expandirPergunta(elementoPerguntaAtual, identificadorDaPergunta);
    elementoPerguntaAnterior = elementoPerguntaAtual
    identificadorPerguntaAnterior = identificadorDaPergunta
}
function expandirPergunta(elementoPergunta, identificadorDaPergunta) {
        elementoPergunta.innerHTML = `
        <div class="pergunta-expandida">
            <h2>${identificadorDaPergunta}</h2>
        </div>`
        renderizarInputsDaTela_3_2()
}
function minimizarPergunta(elementoPergunta, identificadorDaPergunta) {
            elementoPergunta.innerHTML = `
            <div class="pergunta-minimizada">
                <h2>${identificadorDaPergunta}</h2>
                <img onclick="alternarPergunta(this.parentNode)" src="img/create.svg" alt="expandir pergunta">
            </div>`;
}
function renderizarInputsDaTela_3_2() {
    const caixaDeInputsTela_3_2 = document.querySelector(".pergunta-expandida");
    caixaDeInputsTela_3_2.innerHTML+= `
    <input type="text" placeholder="Texto da pergunta">
    <input class="corHex" type="text" placeholder="Cor de fundo da pergunta (Hexadecimal)">
    <h2>Resposta correta</h2>
    <input type="text" placeholder="Resposta correta">
    <input class="utl-Img" type="text" title="A imagem deve possuir uma URL válida!" placeholder="URL da imagem">
    <h2>Respostas incorretas</h2>`
    for(let i = 0; i< 3; i++) {
        caixaDeInputsTela_3_2.innerHTML+= `
        <input type="text" placeholder="Resposta incorreta ${i+1}">
        <input class="utl-Img" type="text" placeholder="URL da imagem ${i+1}"  title="A imagem deve possuir uma URL válida!">`
    }
}
let armazenarDados_3_2 = [];
function dadosInseridos_3_2() {
    const qntDeInputsNoFormulario_3_2 = 10;
    const dados_3_2 = []
    for(let i = 0; i < qntDeInputsNoFormulario_3_2; i++) {
        dados_3_2[i] = (document.querySelector(`.pergunta-expandida input:nth-of-type(${i+1})`).value);
    }
    const dadosDoFormulario_3_2 = {textoDaPergunta: `${dados_3_2[0]}`, CorDeFundo: `${dados_3_2[1]}`, RespostaCerta: `${dados_3_2[2]}`, URLdaImagemCerta: `${dados_3_2[3]}`, RespostaErrada1: `${dados_3_2[4]}`, URLdaImagemErrada1: `${dados_3_2[5]}`, RespostaErrada2: `${dados_3_2[6]}`, URLdaImagemErrada2: `${dados_3_2[7]}`, RespostaErrada3: `${dados_3_2[8]}`, URLdaImagemErrada3: `${dados_3_2[9]}`}
    armazenarDados_3_2.push(dadosDoFormulario_3_2)
}
function CriarNiveis() {
    dadosInseridos_3_2()
    for (let i=0; i<armazenarDados_3_2.textoDaPergunta.length; i++){
        let criterio = validarTextoPergunta(armazenarDados_3_2[i].textoDaPergunta)
        if (criterio === false){
            return alert('Preencha a pagina corretamente!')
        }
    }
    for (let i=0; i<armazenarDados_3_2.CorDeFundo.length; i++){
        let criterio = validarCorHex(armazenarDados_3_2[i].CorDeFundo)
        if (criterio === false){
            return alert('Preencha a pagina corretamente!')
        }
    }
    for (let i=0; i<armazenarDados_3_2.RespostaCerta.length; i++){
        let criterioTexto = validarTextoRespostas(armazenarDados_3_2[i].RespostaCerta)
        let criterioUrl = validarTextoRespostas(armazenarDados_3_2[i].URLdaImagemCerta)
        if (criterioTexto === false || criterioUrl === false){
            return alert('Preencha a pagina corretamente!')
        }
    }
    for (let i=0; i<armazenarDados_3_2.RespostaErrada1.length; i++){
        let criterioTexto = validarTextoRespostas(armazenarDados_3_2[i].RespostaErrada1)
        let criterioUrl = validarTextoRespostas(armazenarDados_3_2[i].URLdaImagemErrada1)
        if (criterioTexto === false || criterioUrl === false){
            return alert('Preencha a pagina corretamente!')
        }
        } else if (armazenarDados_3_2[i].RespostaErrada2 !== ""){
            criterioTexto = validarTextoRespostas(armazenarDados_3_2[i].RespostaErrada2)
            criterioUrl = validarTextoRespostas(armazenarDados_3_2[i].URLdaImagemErrada2)
            if (criterioTexto === false || criterioUrl === false){
                return alert('Preencha a pagina corretamente!')
            }
        } else if (armazenarDados_3_2[i].RespostaErrada3 !== ""){
            criterioTexto = validarTextoRespostas(armazenarDados_3_2[i].RespostaErrada2)
            criterioUrl = validarTextoRespostas(armazenarDados_3_2[i].URLdaImagemErrada2)
            if (criterioTexto === false || criterioUrl === false){
                return alert('Preencha a pagina corretamente!')
            }
        }
    }
    armazenarDados_3_2.forEach((item)=>{
        const title = item.textoDaPergunta;
        const color = item.CorDeFundo;
        const answers = [];
        answers.push({
            text: item.RespostaCerta;
            image: item.URLdaImagemCerta;
            isCorrectAnswer: true;
        });
        answers.push({
            text: item.RespostaErrada1;
            image: item.URLdaRespostaErrada1;
            isCorrectAnswer: false;
        });
        answers.push({
            text: item.RespostaErrada2;
            image: item.URLdaRespostaErrada2;
            isCorrectAnswer: false;
        });
        answers.push({
            text: item.RespostaErrada3;
            image: item.URLdaRespostaErrada3;
            isCorrectAnswer: false;
        });
        const pergunta = {title, color, answers};
        objNovoQuizz.questions.push(pergunta);
    });

}
function validarTextoRespostas(texto) {
    if (texto.length > 0){
        return true;
    } else{
        return false;
    }
}
function validarTituloNivel(texto) {
    if (texto.length >= 10){
        return true;
    } else{
        return false;
    }
}
function validarTextoNivel(texto) {
    if (texto.length >= 30){
        return true;
    } else{
        return false;
    }
}
function validarTextoPergunta(texto) {
    if (texto.length >= 20){
        return true;
    } else{
        return false;
    }
}
function validarQtdNiveis(quantidade) {
    let qtd = parseInt(quantidade);
    if (qtd >= 2) {
        return true;
    } else{
        return false;
    }
}
function validarQtdPerguntas(quantidade) {
    let qtd = parseInt(quantidade);
    if (qtd >= 3) {
        return true;
    } else{
        return false;
    }
}
function validarTitulo(titulo) {
    if (titulo.length > 20 && titulo.length < 65){
        return true;
    } else{
        return false;
    }
}
function validarUrl(url) {
    try {
        new URL(url);
    } catch (e) {
        console.error(e);
        return false;
    } return true;
}
function validarCorHex(corHexadecimal) {
    return corHexadecimal.match(/^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i) !== null;
}