class Carta {
    constructor(nombre, velocidad, fuerza, elemento, peso, altura) {
        this.nombre = nombre;
        this.velocidad = velocidad;
        this.fuerza = fuerza;
        this.elemento = elemento; // 1: agua, 2: tierra, 3: aire, 4: fuego, 5: electricidad
        this.peso = peso;
        this.altura = altura;
    }
}

class Nodo {
    constructor(carta = null, siguiente = null) {
        this.carta = carta;
        this.siguiente = siguiente;
    }
}

let pilaUno = null;
let pilaDos = null;
let pilaMesa = null;

let cantidadCartasJugadorUno = 0;
let cantidadCartasJugadorDos = 0;

let nombreJugadorUno = "maxi";
let nombreJugadorDos = "ia";

let cartas = new Array(250).fill(null);

function leerCartas() {
    const fs = require('fs');
    const file = fs.readFileSync('cartas.txt', 'utf-8');
    const lines = file.split('\n');

    for (let i = 0; i < 250; i++) {
        let datos = lines[i].split(',');
        cartas[i] = new Carta(
            datos[0],
            parseInt(datos[1]),
            parseInt(datos[2]),
            parseInt(datos[3]),
            parseFloat(datos[4]),
            parseFloat(datos[5])
        );
    }
}

function agregarCarta(carta, nodoSuperior) {
    let nuevoNodo = new Nodo(carta, nodoSuperior);
    return nuevoNodo;
}

function agregarCartaFinal(nodoSuperior) {
    let pilaAuxiliar = null;
    let contadorCartasNuevas = 0;

    while (nodoSuperior) {
        let carta = sacarCarta(nodoSuperior);
        pilaAuxiliar = agregarCarta(carta, pilaAuxiliar);
    }

    while (pilaMesa) {
        let carta = sacarCarta(pilaMesa);
        nodoSuperior = agregarCarta(carta, nodoSuperior);
        contadorCartasNuevas++;
    }

    while (pilaAuxiliar) {
        let carta = sacarCarta(pilaAuxiliar);
        nodoSuperior = agregarCarta(carta, nodoSuperior);
    }

    return contadorCartasNuevas;
}

function sacarCarta(nodoSuperior) {
    if (nodoSuperior) {
        let cartaActual = nodoSuperior.carta;
        nodoSuperior = nodoSuperior.siguiente;
        return cartaActual;
    }
    return null;
}

function mezclarCartas() {
    for (let i = 0; i < 250; i++) {
        let posicionAleatoria = Math.floor(Math.random() * 250);
        [cartas[i], cartas[posicionAleatoria]] = [cartas[posicionAleatoria], cartas[i]];
    }
}

// Cargar las cartas en las pilas de los jugadores
leerCartas();
mezclarCartas();

for (let i = 0; i < 125; i++) {
    pilaUno = agregarCarta(cartas[i], pilaUno);
    cantidadCartasJugadorUno++;
}

for (let i = 125; i < 250; i++) {
    pilaDos = agregarCarta(cartas[i], pilaDos);
    cantidadCartasJugadorDos++;
}
let maximoRondas = 250;
let rondaActual = 1;

while (pilaUno && pilaDos && rondaActual <= maximoRondas) {
    let atributoSorteado = Math.floor(Math.random() * 5) + 1; // Valor entre 2 y 6 para el atributo
    let cartaJugadorUno = sacarCarta(pilaUno);
    let cartaJugadorDos = sacarCarta(pilaDos);
    cantidadCartasJugadorUno--;
    cantidadCartasJugadorDos--;
    if (Object.values(cartaJugadorUno)[atributoSorteado] > Object.values(cartaJugadorDos)[atributoSorteado]) {
        pilaMesa = agregarCarta(cartaJugadorUno, pilaMesa);
        pilaMesa = agregarCarta(cartaJugadorDos, pilaMesa);
        cantidadCartasJugadorUno += agregarCartaFinal(pilaUno);
        //console.log("Esta mano la ganó el jugador uno");
    } else if (Object.values(cartaJugadorUno)[atributoSorteado] <  Object.values(cartaJugadorDos)[atributoSorteado]) {
        pilaMesa = agregarCarta(cartaJugadorUno, pilaMesa);
        pilaMesa = agregarCarta(cartaJugadorDos, pilaMesa);
        cantidadCartasJugadorDos += agregarCartaFinal(pilaDos);
        //console.log("Esta mano la ganó el jugador dos");
    } else {
        pilaMesa = agregarCarta(cartaJugadorUno, pilaMesa);
        pilaMesa = agregarCarta(cartaJugadorDos, pilaMesa);
        //console.log("Esta mano fue empate");
    }

    rondaActual++;
}

if (rondaActual === maximoRondas) {
    console.log("Juego finalizado por límite de rondas");
}

if (cantidadCartasJugadorUno > cantidadCartasJugadorDos) {
    console.log(`Ganó el jugador: ${nombreJugadorUno}`);
} else if (cantidadCartasJugadorUno < cantidadCartasJugadorDos) {
    console.log(`Ganó el jugador: ${nombreJugadorDos}`);
} else {
    console.log("Empate");
}
