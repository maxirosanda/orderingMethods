const fs = require('fs');

// Estructuras de datos
class Carta {
  constructor(nombre, velocidad, fuerza, elemento, peso, altura) {
    this.nombre = nombre;
    this.velocidad = velocidad;
    this.fuerza = fuerza;
    this.elemento = elemento;
    this.peso = peso;
    this.altura = altura;
  }
}

class Nodo {
  constructor(carta) {
    this.carta = carta;
    this.siguiente = null;
  }
}

// Pilas
let pila_uno = null;
let pila_dos = null;
let pila_mesa = null;

let cantidad_cartas_jugador_uno = 0;
let cantidad_cartas_jugador_dos = 0;
let maximo_rondas = 250;
let ronda_actual = 1;

// Lectura de cartas por fragmentos
function leer_cartas() {
  const cartas = [];
  const data = fs.readFileSync('cartas.txt', 'utf8').split('\n');

  for (let i = 0; i < 250; i++) {
    const [nombre, velocidad, fuerza, elemento, peso, altura] = data[i].split(',');
    cartas.push(new Carta(nombre, parseInt(velocidad), parseInt(fuerza), parseInt(elemento), parseFloat(peso), parseFloat(altura)));
  }
  return cartas;
}

// Mezclar cartas sin crear una copia
function mezclar_cartas(cartas) {
  for (let i = cartas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
  }
}

// Operaciones con pilas
function agregar_carta(pila, carta) {
  const nuevoNodo = new Nodo(carta);
  nuevoNodo.siguiente = pila;
  return nuevoNodo;
}

function sacar_carta(pila) {
  if (pila) {
    const carta = pila.carta;
    pila = pila.siguiente;
    return { carta, pila };
  }
  return { carta: null, pila: null };
}

function agregar_carta_final(pilaDestino, pilaFuente) {
  const cartasMesa = [];
  while (pilaFuente) {
    const { carta, pila } = sacar_carta(pilaFuente);
    pilaFuente = pila;
    cartasMesa.push(carta);
  }
  
  while (cartasMesa.length) {
    pilaDestino = agregar_carta(pilaDestino, cartasMesa.pop());
  }
  return pilaDestino;
}

// Jugar una ronda
function jugar_ronda() {
  const atributos = ["velocidad", "fuerza", "elemento", "peso", "altura"];
  const atributo = atributos[Math.floor(Math.random() * atributos.length)];

  const resultUno = sacar_carta(pila_uno);
  const resultDos = sacar_carta(pila_dos);

  pila_uno = resultUno.pila;
  pila_dos = resultDos.pila;

  const cartaUno = resultUno.carta;
  const cartaDos = resultDos.carta;

  if (cartaUno && cartaDos) {
    agregar_carta(pila_mesa, cartaUno);
    agregar_carta(pila_mesa, cartaDos);

    if (cartaUno[atributo] > cartaDos[atributo]) {
      pila_uno = agregar_carta_final(pila_uno, pila_mesa);
      cantidad_cartas_jugador_uno += 2;
      console.log("Jugador uno gana esta ronda.");
    } else if (cartaUno[atributo] < cartaDos[atributo]) {
      pila_dos = agregar_carta_final(pila_dos, pila_mesa);
      cantidad_cartas_jugador_dos += 2;
      console.log("Jugador dos gana esta ronda.");
    } else {
      console.log("Empate en esta ronda.");
    }
    ronda_actual++;
  }
}

// Configuración e inicio del juego
function iniciar_juego() {
  const cartas = leer_cartas();
  mezclar_cartas(cartas);

  for (let i = 0; i < 125; i++) {
    pila_uno = agregar_carta(pila_uno, cartas[i]);
    cantidad_cartas_jugador_uno++;
  }

  for (let i = 125; i < 250; i++) {
    pila_dos = agregar_carta(pila_dos, cartas[i]);
    cantidad_cartas_jugador_dos++;
  }

  while (pila_uno && pila_dos && ronda_actual <= maximo_rondas) {
    jugar_ronda();
  }

  // Resultados finales
  if (ronda_actual === maximo_rondas) {
    console.log("Juego finalizado por límite de rondas");
  }

  if (cantidad_cartas_jugador_uno > cantidad_cartas_jugador_dos) {
    console.log("Ganó el jugador uno");
  } else if (cantidad_cartas_jugador_uno < cantidad_cartas_jugador_dos) {
    console.log("Ganó el jugador dos");
  } else {
    console.log("Empate");
  }
}

// Ejecutar el juego
iniciar_juego();
