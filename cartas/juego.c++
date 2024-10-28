#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <cstdlib>
#include <ctime>

struct Carta {
    std::string nombre;
    int velocidad;
    int fuerza;
    int elemento; // 1: agua, 2: tierra, 3: aire, 4: fuego, 5: electricidad
    float peso;
    float altura;
};

struct Nodo {
    Carta carta;
    Nodo* siguiente;
};

Nodo* pila_uno = nullptr;
Nodo* pila_dos = nullptr;
Nodo* pila_mesa = nullptr;

int cantidad_cartas_jugador_uno = 0;
int cantidad_cartas_jugador_dos = 0;

void leer_cartas(std::vector<Carta>& cartas) {
    std::ifstream file("cartas.txt");
    std::string line;

    for (int i = 0; i < 250 && std::getline(file, line); i++) {
        std::stringstream ss(line);
        std::string token;
        getline(ss, cartas[i].nombre, ',');
        getline(ss, token, ',');
        cartas[i].velocidad = std::stoi(token);
        getline(ss, token, ',');
        cartas[i].fuerza = std::stoi(token);
        getline(ss, token, ',');
        cartas[i].elemento = std::stoi(token);
        getline(ss, token, ',');
        cartas[i].peso = std::stof(token);
        getline(ss, token);
        cartas[i].altura = std::stof(token);
    }
    file.close();
}

void agregar_carta(Carta carta, Nodo*& nodo_superior) {
    Nodo* nuevo_nodo = new Nodo;
    nuevo_nodo->carta = carta;
    nuevo_nodo->siguiente = nodo_superior;
    nodo_superior = nuevo_nodo;
}

Carta sacar_carta(Nodo*& nodo_superior) {
    if (nodo_superior != nullptr) {
        Carta carta_actual = nodo_superior->carta;
        Nodo* temp = nodo_superior;
        nodo_superior = nodo_superior->siguiente;
        delete temp; // Liberar la memoria del nodo
        return carta_actual;
    } else {
        return Carta{}; // Retorna una carta vacía si no hay más cartas
    }
}

void mezclar_cartas(std::vector<Carta>& cartas) {
    for (int i = 0; i < 250; i++) {
        int posicion_aleatoria = rand() % 250; // Generar número aleatorio
        std::swap(cartas[i], cartas[posicion_aleatoria]); // Intercambiar cartas
    }
}

int agregar_carta_final(Nodo*& nodo_superior) {
    Nodo* pila_auxiliar = nullptr;
    int contador_cartas_nuevas = 0;

    while (nodo_superior != nullptr) {
        Carta carta = sacar_carta(nodo_superior);
        agregar_carta(carta, pila_auxiliar);
    }

    while (pila_mesa != nullptr) {
        Carta carta = sacar_carta(pila_mesa);
        agregar_carta(carta, nodo_superior);
        contador_cartas_nuevas++;
    }

    while (pila_auxiliar != nullptr) {
        Carta carta = sacar_carta(pila_auxiliar);
        agregar_carta(carta, nodo_superior);
    }

    return contador_cartas_nuevas;
}

int main() {
    srand(static_cast<unsigned int>(time(nullptr))); // Inicializa la semilla para números aleatorios

    std::string nombre_jugador_uno, nombre_jugador_dos;
    std::cout << "Ingrese nombre del jugador 1: ";
    std::getline(std::cin, nombre_jugador_uno);
    std::cout << "Ingrese nombre del jugador 2 o no completar si quiere jugar contra la pc: ";
    std::getline(std::cin, nombre_jugador_dos);

    std::vector<Carta> cartas(250);
    leer_cartas(cartas);
    mezclar_cartas(cartas);

    for (int i = 0; i < 125; i++) {
        agregar_carta(cartas[i], pila_uno);
        cantidad_cartas_jugador_uno++;
    }

    for (int i = 125; i < 250; i++) {
        agregar_carta(cartas[i], pila_dos);
        cantidad_cartas_jugador_dos++;
    }

    int maximo_rondas = 250;
    int ronda_actual = 1;

    while (pila_uno != nullptr && pila_dos != nullptr && ronda_actual <= maximo_rondas) {
        int atributo_sorteado = rand() % 5 + 2; // Generar un número aleatorio entre 2 y 6
        Carta carta_jugador_uno = sacar_carta(pila_uno);
        Carta carta_jugador_dos = sacar_carta(pila_dos);
        cantidad_cartas_jugador_uno--;
        cantidad_cartas_jugador_dos--;

        if (carta_jugador_uno.*(&carta_jugador_uno.velocidad + atributo_sorteado - 2) > carta_jugador_dos.*(&carta_jugador_dos.velocidad + atributo_sorteado - 2)) {
            agregar_carta(carta_jugador_uno, pila_mesa);
            agregar_carta(carta_jugador_dos, pila_mesa);
            cantidad_cartas_jugador_uno += agregar_carta_final(pila_uno);
            std::cout << "Esta mano la ganó el jugador uno" << std::endl;

        } else if (carta_jugador_uno.*(&carta_jugador_uno.velocidad + atributo_sorteado - 2) < carta_jugador_dos.*(&carta_jugador_dos.velocidad + atributo_sorteado - 2)) {
            agregar_carta(carta_jugador_uno, pila_mesa);
            agregar_carta(carta_jugador_dos, pila_mesa);
            cantidad_cartas_jugador_dos += agregar_carta_final(pila_dos);
            std::cout << "Esta mano la ganó el jugador dos" << std::endl;

        } else {
            agregar_carta(carta_jugador_uno, pila_mesa);
            agregar_carta(carta_jugador_dos, pila_mesa);
            std::cout << "Esta mano fue empate" << std::endl;
        }

        ronda_actual++;
    }

    if (ronda_actual == maximo_rondas) {
        std::cout << "Juego finalizado por límite de rondas" << std::endl;
    }

    if (cantidad_cartas_jugador_uno > cantidad_cartas_jugador_dos) {
        std::cout << "Ganó jugador: " << nombre_jugador_uno << std::endl;
    } else if (cantidad_cartas_jugador_uno < cantidad_cartas_jugador_dos) {
        if (!nombre_jugador_dos.empty()) {
            std::cout << "Ganó jugador: " << nombre_jugador_dos << std::endl;
        } else {
            std::cout << "Ganó la máquina" << std::endl;
        }
    } else {
        std::cout << "Empate" << std::endl;
    }

    return 0;
}
