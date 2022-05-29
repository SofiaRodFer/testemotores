const inputTensaoFonte = document.querySelector("#tensao-fonte");
const inputImpedanciaMotor = document.querySelector("#impedancia-motor");
const inputImpedanciaCabo = document.querySelector("#impedancia-cabo");
const inputFpParaCorrecao = document.querySelector("#fp-para-correcao");

const spanImpedanciaTotal = document.querySelector(".impedanciaTotal");
const spanCorrenteTotal = document.querySelector(".correnteTotal");
const spanTensaoNoCabo = document.querySelector(".tensaoNoCabo");
const spanTensaoNoMotor = document.querySelector(".tensaoNoMotor");
const spanCorrenteNoMotor = document.querySelector(".correnteNoMotor");
const spanPotenciaDoMotor = document.querySelector(".potenciaDoMotor");
const spanPotenciaReativaDoMotor = document.querySelector(".potenciaReativaDoMotor");
const spanPotenciaAparenteCorrigida = document.querySelector(".potenciaAparenteCorrigida")
const spanPotenciaReativaDoCapacitor = document.querySelector(".potenciaReativaDoCapacitor")

let tensaoFonte;
let impedanciaMotor;
let impedanciaCabo;
let fpParaCorrecao;

inputTensaoFonte.addEventListener("keyup", () => {
    tensaoFonte = inputTensaoFonte.value;
    atualizarDados()
})

inputImpedanciaMotor.addEventListener("keyup", () => {
    impedanciaMotor = inputImpedanciaMotor.value;
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
    const theta = converterParaGraus(Math.atan((y/x)));

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

const calcularImpedanciaTotal = () => {
    const valoresImpCabo = impedanciaCabo.split("<");
    const valoresImpMotor = impedanciaMotor.split("<");

    const impedanciaCaboRet = converterParaRetangular(valoresImpCabo[0], valoresImpCabo[1]);
    const impedanciaMotorRet = converterParaRetangular(valoresImpMotor[0], valoresImpMotor[1]);

    const impedanciaTotalRet = [(impedanciaCaboRet[0] + impedanciaMotorRet[0]), (impedanciaCaboRet[1] + impedanciaMotorRet[1])];

    const impedanciaTotalPol = converterParaPolar(impedanciaTotalRet[0], impedanciaTotalRet[1]);

    return impedanciaTotalPol;
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

const calcularTensaoNoMotor = () => {
    const valoresImpMotor = impedanciaMotor.split("<");
    const valoresCorrenteTotal = calcularCorrenteTotal();

    const inteiro = valoresCorrenteTotal[0] * valoresImpMotor[0];
    const theta = parseFloat(valoresCorrenteTotal[1]) + parseFloat(valoresImpMotor[1]);

    const tensaoNoMotor = [inteiro, theta];

    return tensaoNoMotor;
}

const calcularCorrenteNoMotor = () => {
    const valoresImpMotor = impedanciaMotor.split("<");
    const valoresTensaoMotor = calcularTensaoNoMotor();

    const inteiro = valoresTensaoMotor[0] / valoresImpMotor[0];
    const theta = parseFloat(valoresTensaoMotor[1]) - parseFloat(valoresImpMotor[1]);

    const correnteNoMotor = [inteiro, theta];

    return correnteNoMotor;
}

const calcularPotenciaAparenteDoMotor = () => {
    const valoresTensaoMotor = calcularTensaoNoMotor();
    const valoresCorrenteMotor = calcularCorrenteNoMotor();

    const inteiro = valoresTensaoMotor[0] * valoresCorrenteMotor[0];
    const theta = parseFloat(valoresTensaoMotor[1]) + (parseFloat(valoresCorrenteMotor[1]) * -1);

    const potenciaDoMotor = [inteiro, theta];

    return potenciaDoMotor;
}

const calcularPotenciaAtivaDoMotor = () => {
    const valoresPotenciaAparente = calcularPotenciaAparenteDoMotor();

    const potenciaAtiva = (valoresPotenciaAparente[0] * Math.cos(converterParaRadianos(parseFloat(valoresPotenciaAparente[1]))));

    return potenciaAtiva;
}

const calcularPotenciaReativaDoMotor = () => {
    const valoresPotenciaDoMotor = calcularPotenciaAparenteDoMotor();

    const potenciaReativa = (valoresPotenciaDoMotor[0] * Math.sin(converterParaRadianos(parseFloat(valoresPotenciaDoMotor[1]))));

    return potenciaReativa;
}

const calcularPotenciaAparenteCorrigidaDoMotor = () => {
    const valorespotenciaAtiva = calcularPotenciaAtivaDoMotor();

    const inteiro = valorespotenciaAtiva / fpParaCorrecao;
    const theta = converterParaGraus(Math.acos(fpParaCorrecao));

    const potenciaAparenteCorrigida = [inteiro, theta];

    return potenciaAparenteCorrigida;
}

const calcularPotenciaReativaCorrigidaDoMotor = () => {
    const valoresPotenciaAparenteCorrigida = calcularPotenciaAparenteCorrigidaDoMotor();

    const potenciaReativa = valoresPotenciaAparenteCorrigida[0] * Math.sin(converterParaRadianos(valoresPotenciaAparenteCorrigida[1]));

    return potenciaReativa;
}

const calcularPotenciaReativaDoCapacitor = () => {
    const potenciaReativaInicial = calcularPotenciaReativaDoMotor();
    const potenciaReativaFinal = calcularPotenciaReativaCorrigidaDoMotor();

    const potenciaReativaDoCapacitor = potenciaReativaInicial - potenciaReativaFinal;

    return potenciaReativaDoCapacitor;
}

const atualizarDados = () => {
    const impedanciaTotal = calcularImpedanciaTotal();
    const correnteTotal = calcularCorrenteTotal();
    const tensaoNoCabo = calcularTensaoNoCabo();
    const tensaoNoMotor = calcularTensaoNoMotor();
    const correnteNoMotor = calcularCorrenteNoMotor();
    const potenciaAparenteDoMotor = calcularPotenciaAparenteDoMotor();
    const potenciaReativaDoMotor = calcularPotenciaReativaDoMotor();
    const potenciaAparenteCorrigida = calcularPotenciaAparenteCorrigidaDoMotor();
    const potenciaReativaDoCapacitor = calcularPotenciaReativaDoCapacitor();

    spanImpedanciaTotal.innerHTML = `${impedanciaTotal[0].toFixed(2)}<${impedanciaTotal[1].toFixed(2)}° &#8486;`;;
    spanCorrenteTotal.innerHTML = `${correnteTotal[0].toFixed(2)}<${correnteTotal[1].toFixed(2)}° A`;
    spanTensaoNoCabo.innerHTML = `${tensaoNoCabo[0].toFixed(2)}<${tensaoNoCabo[1].toFixed(2)}° V`;
    spanTensaoNoMotor.innerHTML = `${tensaoNoMotor[0].toFixed(2)}<${tensaoNoMotor[1].toFixed(2)}° V`;
    spanCorrenteNoMotor.innerHTML = `${correnteNoMotor[0].toFixed(2)}<${correnteNoMotor[1].toFixed(2)}° A`;
    spanPotenciaDoMotor.innerHTML = `${potenciaAparenteDoMotor[0].toFixed(2)}<${potenciaAparenteDoMotor[1].toFixed(2)}° VA`;
    spanPotenciaReativaDoMotor.innerHTML = `${potenciaReativaDoMotor.toFixed(2)} VAr`;
    spanPotenciaAparenteCorrigida.innerHTML = `${potenciaAparenteCorrigida[0].toFixed(2)}<${potenciaAparenteCorrigida[1].toFixed(2)} VA`;
    spanPotenciaReativaDoCapacitor.innerHTML = `${potenciaReativaDoCapacitor.toFixed(2)} VAr`;
}