class Empleado {
    constructor() {
        this.numeroEmpleado = 0;
        this.nombre = '';
        this.sueldosMensuales = new Array(12).fill(0);
        this.sueldoAnual = 0;
        this.porcentajeSueldoMes = new Array(12).fill(0);
    }
}

let empleados = Array.from({ length: 30 }, () => new Empleado());
let totalSueldosMensuales = new Array(12).fill(0);
let maxSueldoMes = new Array(12).fill(0);
let nombreEmpleadoMenorSueldoPrimerSemestre = '';
let mesesSueldosTotalesMenores4Millones = 0;

function leerNomina() {
    const fs = require('fs');
    const file = fs.readFileSync('nomina.txt', 'utf-8');
    const lines = file.split('\n');

    for (let i = 0; i < 30; i++) {
        let datos = lines[i].split(',');
        empleados[i].numeroEmpleado = parseInt(datos[0]);
        empleados[i].nombre = datos[1];
        
        for (let j = 0; j < 12; j++) {
            empleados[i].sueldosMensuales[j] = parseFloat(datos[j + 2]) * parseInt(datos[14 + j]);
        }
    }
    console.log("Empleados cargados correctamente desde archivo nomina");
}

function calcularSueldosAnualesPorEmpleado() {
    empleados.forEach(empleado => {
        empleado.sueldoAnual = empleado.sueldosMensuales.reduce((a, b) => a + b, 0);
        console.log(`Empleado: ${empleado.nombre} sueldo total anual: ${empleado.sueldoAnual}`);
    });
}

function calcularTotalSueldosMensuales() {
    for (let j = 0; j < 12; j++) {
        totalSueldosMensuales[j] = empleados.reduce((sum, empleado) => sum + empleado.sueldosMensuales[j], 0);
        console.log(`Mes: ${j + 1} Total mensual: ${totalSueldosMensuales[j]}`);
    }
}

function calcularMaxSueldoMes() {
    for (let j = 0; j < 12; j++) {
        maxSueldoMes[j] = Math.max(...empleados.map(emp => emp.sueldosMensuales[j]));
        console.log(`Máximo sueldo mes ${j + 1}: ${maxSueldoMes[j]}`);
    }
}

function calcularPorcentajeSueldoMes() {
    empleados.forEach(empleado => {
        for (let j = 0; j < 12; j++) {
            let porcentaje = (empleado.sueldosMensuales[j] / totalSueldosMensuales[j]) * 100;
            empleado.porcentajeSueldoMes[j] = porcentaje;
            console.log(`Empleado: ${empleado.nombre} - Porcentaje: ${porcentaje.toFixed(2)}% - Mes: ${j + 1}`);
        }
    });
}

function determinarEmpleadoMenorSueldoPrimerSemestre() {
    let menorSueldo = empleados[0].sueldosMensuales[0];

    empleados.forEach(empleado => {
        for (let j = 0; j < 6; j++) {
            if (empleado.sueldosMensuales[j] < menorSueldo) {
                menorSueldo = empleado.sueldosMensuales[j];
                nombreEmpleadoMenorSueldoPrimerSemestre = empleado.nombre;
            }
        }
    });

    console.log(`Empleado con menor sueldo en el primer semestre: ${nombreEmpleadoMenorSueldoPrimerSemestre}`);
}

function calcularMesesSueldosTotalesMenores4Millones() {
    for (let j = 0; j < 12; j++) {
       console.log(totalSueldosMensuales[j]) 
        if (totalSueldosMensuales[j] < 4000000) {
            mesesSueldosTotalesMenores4Millones++;
        }
    }
    console.log(`Meses con sueldos totales menores a $4 millones: ${mesesSueldosTotalesMenores4Millones}`);
}

function guardarLiquidacion() {
    const fs = require('fs');
    let fileContent = '';

    empleados.sort((a, b) => b.sueldoAnual - a.sueldoAnual);

    empleados.forEach(empleado => {
        fileContent += `${empleado.nombre}, ${empleado.sueldoAnual}\n`;
    });

    fs.writeFileSync('liquidacion.txt', fileContent);
    console.log("Liquidación guardada correctamente");
}

// Ejecución de funciones
leerNomina();
calcularSueldosAnualesPorEmpleado();
calcularTotalSueldosMensuales();
calcularMaxSueldoMes();
calcularPorcentajeSueldoMes();
determinarEmpleadoMenorSueldoPrimerSemestre();
calcularMesesSueldosTotalesMenores4Millones();
guardarLiquidacion();
