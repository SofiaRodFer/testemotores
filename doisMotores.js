const inputTensaoFonte = document.querySelector("#tensao-fonte");
const inputImpedanciaMotor1 = document.querySelector("#impedancia-motor-1");
const inputImpedanciaMotor2 = document.querySelector("#impedancia-motor-2");
const inputImpedanciaCabo = document.querySelector("#impedancia-cabo");
const inputFpParaCorrecao = document.querySelector("#fp-para-correcao");

const spanImpedanciaEquivalente = document.querySelector(".impedanciaEquivalente");
const spanImpedanciaTotal = document.querySelector(".impedanciaTotal");
const spanCorrenteTotal = document.querySelector(".correnteTotal");
const spanTensaoNoCabo = document.querySelector(".tensaoNoCabo");
const spanTensaoNosMotores = document.querySelector(".tensaoNosMotores");
const spanCorrenteNoMotor1 = document.querySelector(".correnteNoMotor1");
const spanCorrenteNoMotor2 = document.querySelector(".correnteNoMotor2");
const spanPotenciaDoMotor1 = document.querySelector(".potenciaDoMotor1");
const spanPotenciaDoMotor2 = document.querySelector(".potenciaDoMotor2");
const spanPotenciaAparenteTotal = document.querySelector(".potenciaAparenteTotal");
const spanPotenciaReativaDosMotores = document.querySelector(".potenciaReativaDosMotores");
const spanPotenciaAparenteCorrigida = document.querySelector(".potenciaAparenteCorrigida")
const spanPotenciaReativaDoCapacitor = document.querySelector(".potenciaReativaDoCapacitor")

let tensaoFonte;
let impedanciaMotor1;
let impedanciaMotor2;
let impedanciaCabo;
let fpParaCorrecao;

inputTensaoFonte.addEventListener("keyup", () => {
    tensaoFonte = inputTensaoFonte.value;
    atualizarDados()
})

inputImpedanciaMotor1.addEventListener("keyup", () => {
    impedanciaMotor1 = inputImpedanciaMotor1.value;
    atualizarDados()
})

inputImpedanciaMotor2.addEventListener("keyup", () => {
    impedanciaMotor2 = inputImpedanciaMotor2.value;
    atualizarDados()
})

inputImpedanciaCabo.addEventListener("keyup", () => {
    impedanciaCabo = inputImpedanciaCabo.value;
    atualizarDados()
})

inputFpParaCorrecao.addEventListener("keyup", () => {
    fpParaCorrecao = inputFpParaCorrecao.value;
    atualizarDados()
})

const converterParaRadianos = (num) => {
    return num * (Math.PI / 180);
}

const converterParaGraus = (num) => {
    return num * (180 / Math.PI);
}

const converterParaPolar = (x, y) => {
    const z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const theta = Math.atan((y/x)) * (180 / Math.PI);

    const numeroPolar = [z, theta];

    return numeroPolar;
}

const converterParaRetangular = (z, theta) => {
    const thetaEmRad = converterParaRadianos(theta);

    const real = z * (Math.cos(thetaEmRad));
    const imaginario = z * (Math.sin(thetaEmRad));

    const numeroRetangular = [real, imaginario];

    return numeroRetangular;
}

const calcularImpedanciaEquivalenteDosMotores = () => {
    const valoresImpMotor1 = impedanciaMotor1.split("<");
    const valoresImpMotor2 = impedanciaMotor2.split("<");

    valoresImpMotor1[0] = parseFloat(valoresImpMotor1[0]);
    valoresImpMotor1[1] = parseFloat(valoresImpMotor1[1]);
    valoresImpMotor2[0] = parseFloat(valoresImpMotor2[0]);
    valoresImpMotor2[1] = parseFloat(valoresImpMotor2[1]);

    const imp1Ret = converterParaRetangular(valoresImpMotor1[0], valoresImpMotor1[1]);
    const imp2Ret = converterParaRetangular(valoresImpMotor2[0], valoresImpMotor2[1]);
    
    const somaImpedanciasRet = [(imp1Ret[0] + imp2Ret[0]), (imp1Ret[1] + imp2Ret[1])];
    const somaImpedanciasPol = converterParaPolar(somaImpedanciasRet[0], somaImpedanciasRet[1]);
    const multiplicacaoImpedancias = [(valoresImpMotor1[0] * valoresImpMotor2[0]), (valoresImpMotor1[1] + valoresImpMotor2[1])];

    const impedanciaEquivalente = [(multiplicacaoImpedancias[0] / somaImpedanciasPol[0]), (multiplicacaoImpedancias[1] - somaImpedanciasPol[1])];

    return impedanciaEquivalente;
}

const calcularImpedanciaTotal = () => {
    const valoresImpedanciaEquivalente = calcularImpedanciaEquivalenteDosMotores();
    const valoresImpedanciaDoCabo = impedanciaCabo.split("<");

    const impEquivalenteRet = converterParaRetangular(valoresImpedanciaEquivalente[0], valoresImpedanciaEquivalente[1]);
    const impCaboRet = converterParaRetangular(parseFloat(valoresImpedanciaDoCabo[0]), parseFloat(valoresImpedanciaDoCabo[1]));
    
    const impTotalRet = [(impEquivalenteRet[0] + impCaboRet[0]), (impEquivalenteRet[1] + impCaboRet[1])];

    const impedanciaTotal = converterParaPolar(impTotalRet[0], impTotalRet[1]);

    return impedanciaTotal;
}

const calcularCorrenteTotal = () => {
    const valoresImpTotal = calcularImpedanciaTotal();
    const valoresTensaoTotal = tensaoFonte.split("<");

    const inteiro = valoresTensaoTotal[0] / valoresImpTotal[0];
    const theta = parseFloat(valoresTensaoTotal[1]) - parseFloat(valoresImpTotal[1]);

    const correnteTotal = [inteiro, theta];

    return correnteTotal;
}

const calcularTensaoNoCabo = () => {
    const valoresImpCabo = impedanciaCabo.split("<");
    const valoresCorrenteTotal = calcularCorrenteTotal();

    const inteiro = valoresCorrenteTotal[0] * valoresImpCabo[0];
    const theta = parseFloat(valoresCorrenteTotal[1]) + parseFloat(valoresImpCabo[1]);

    const tensaoNoCabo = [inteiro, theta];

    return tensaoNoCabo;
}

const calcularTensaoNosMotores = () => {
    const valoresImpMotores = calcularImpedanciaEquivalenteDosMotores();
    const valoresCorrenteTotal = calcularCorrenteTotal();

    const inteiro = valoresCorrenteTotal[0] * valoresImpMotores[0];
    const theta = parseFloat(valoresCorrenteTotal[1]) + parseFloat(valoresImpMotores[1]);

    const tensaoNosMotores = [inteiro, theta];

    return tensaoNosMotores;
}

const calcularCorrenteNoMotor = (impMotor) => {
    const valoresTensaoMotores = calcularTensaoNosMotores();
    const valoresImpedanciaMotor = impMotor.split("<");

    const correnteNoMotor = [(valoresTensaoMotores[0] / valoresImpedanciaMotor[0]), (valoresTensaoMotores[1] - valoresImpedanciaMotor[1])];

    return correnteNoMotor;
}

const calcularCorrenteEquivalente = () => {
    const valoresImpedanciaEquivalente = calcularImpedanciaEquivalenteDosMotores();
    const valoresTensaoNosMotores = calcularTensaoNosMotores();

    const correnteEquivalente = [(valoresTensaoNosMotores[0] / valoresImpedanciaEquivalente[0]), (valoresTensaoNosMotores[1] - valoresImpedanciaEquivalente[1])]

    return correnteEquivalente;
}

const calcularPotenciaAparenteDoMotor = (impMotor) => {
    const valoresTensaoMotores = calcularTensaoNosMotores();
    const valoresCorrenteMotor = calcularCorrenteNoMotor(impMotor);

    const inteiro = valoresTensaoMotores[0] * valoresCorrenteMotor[0];
    const theta = parseFloat(valoresTensaoMotores[1]) + (parseFloat(valoresCorrenteMotor[1]) * -1);

    const potenciaDoMotor = [inteiro, theta];

    return potenciaDoMotor;
}

const calcularPotenciaAparenteTotalDosMotores = () => {
    const valoresCorrenteMotores = calcularCorrenteEquivalente();
    const valoresTensaoMotores = calcularTensaoNosMotores();

    const inteiro = valoresTensaoMotores[0] * valoresCorrenteMotores[0];
    const theta = parseFloat(valoresTensaoMotores[1]) + (parseFloat(valoresCorrenteMotores[1]) * -1);

    const potenciaDosMotores = [inteiro, theta];

    return potenciaDosMotores;
}

const calcularPotenciaAtivaDosMotores = () => {
    const valoresPotenciaAparente = calcularPotenciaAparenteTotalDosMotores();

    const potenciaAtiva = (valoresPotenciaAparente[0] * Math.cos(converterParaRadianos(parseFloat(valoresPotenciaAparente[1]))));

    return potenciaAtiva;
}

const calcularPotenciaReativaDosMotores = () => {
    const valoresPotenciaDosMotores = calcularPotenciaAparenteTotalDosMotores();

    const potenciaReativa = (valoresPotenciaDosMotores[0] * Math.sin(converterParaRadianos(parseFloat(valoresPotenciaDosMotores[1]))));

    return potenciaReativa;
}

const calcularPotenciaAparenteCorrigidaDosMotores = () => {
    const valorespotenciaAtiva = calcularPotenciaAtivaDosMotores();

    const inteiro = valorespotenciaAtiva / fpParaCorrecao;
    const theta = converterParaGraus(Math.acos(fpParaCorrecao));

    const potenciaAparenteCorrigida = [inteiro, theta];

    return potenciaAparenteCorrigida;
}

const calcularPotenciaReativaCorrigidaDosMotores = () => {
    const valoresPotenciaAparenteCorrigida = calcularPotenciaAparenteCorrigidaDosMotores();

    const potenciaReativa = valoresPotenciaAparenteCorrigida[0] * Math.sin(converterParaRadianos(valoresPotenciaAparenteCorrigida[1]));

    return potenciaReativa;
}

const calcularPotenciaReativaDoCapacitor = () => {
    const potenciaReativaInicial = calcularPotenciaReativaDosMotores();
    const potenciaReativaFinal = calcularPotenciaReativaCorrigidaDosMotores();

    const potenciaReativaDoCapacitor = potenciaReativaInicial - potenciaReativaFinal;

    return potenciaReativaDoCapacitor;
}

const atualizarDados = () => {
    const impedanciaEquivalente = calcularImpedanciaEquivalenteDosMotores();
    const impedanciaTotal = calcularImpedanciaTotal();
    const correnteTotal = calcularCorrenteTotal();
    const tensaoNoCabo = calcularTensaoNoCabo();
    const tensaoNosMotores = calcularTensaoNosMotores();
    const correnteMotor1 = calcularCorrenteNoMotor(impedanciaMotor1);
    const correnteMotor2 = calcularCorrenteNoMotor(impedanciaMotor2);
    const potenciaAparenteDoMotor1 = calcularPotenciaAparenteDoMotor(impedanciaMotor1);
    const potenciaAparenteDoMotor2 = calcularPotenciaAparenteDoMotor(impedanciaMotor2);
    const potenciaAparenteTotalDosMotores = calcularPotenciaAparenteTotalDosMotores();
    const potenciaAparenteCorrigida = calcularPotenciaAparenteCorrigidaDosMotores();
    const potenciaReativaDoCapacitor = calcularPotenciaReativaDoCapacitor();

    spanImpedanciaEquivalente.innerHTML = `${impedanciaEquivalente[0].toFixed(2)}<${impedanciaEquivalente[1].toFixed(2)}° &#8486;`;
    spanImpedanciaTotal.innerHTML = `${impedanciaTotal[0].toFixed(2)}<${impedanciaTotal[1].toFixed(2)}° &#8486;`;
    spanCorrenteTotal.innerHTML = `${correnteTotal[0].toFixed(2)}<${correnteTotal[1].toFixed(2)}° A`;
    spanTensaoNoCabo.innerHTML = `${tensaoNoCabo[0].toFixed(2)}<${tensaoNoCabo[1].toFixed(2)}° V`;
    spanTensaoNosMotores.innerHTML = `${tensaoNosMotores[0].toFixed(2)}<${tensaoNosMotores[1].toFixed(2)}° V`;
    spanCorrenteNoMotor1.innerHTML = `${correnteMotor1[0].toFixed(2)}<${correnteMotor1[1].toFixed(2)}° A`;
    spanCorrenteNoMotor2.innerHTML = `${correnteMotor2[0].toFixed(2)}<${correnteMotor2[1].toFixed(2)}° A`;
    spanPotenciaDoMotor1.innerHTML = `${potenciaAparenteDoMotor1[0].toFixed(2)}<${potenciaAparenteDoMotor1[1].toFixed(2)}° VA`;
    spanPotenciaDoMotor2.innerHTML = `${potenciaAparenteDoMotor2[0].toFixed(2)}<${potenciaAparenteDoMotor2[1].toFixed(2)}° VA`;
    spanPotenciaAparenteTotal.innerHTML = `${potenciaAparenteTotalDosMotores[0].toFixed(2)}<${potenciaAparenteTotalDosMotores[1].toFixed(2)}° VA`
    spanPotenciaReativaDoCapacitor.innerHTML = `${potenciaReativaDoCapacitor.toFixed(2)} VAr`;
    spanPotenciaAparenteCorrigida.innerHTML = `${potenciaAparenteCorrigida[0].toFixed(2)}<${potenciaAparenteCorrigida[1].toFixed(2)} VA`;
}