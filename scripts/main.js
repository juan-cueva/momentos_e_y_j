
function Evento(id, nombre, costoBase, ofreceSede) {
    this.id = id;
    this.nombre = nombre;
    this.costoBase = costoBase;
    this.ofreceSede = ofreceSede;
}

function Sede(id, nombre, direccion, cargoAdicional) {
    this.id = id;
    this.nombre = nombre;
    this.direccion = direccion;
    this.cargoAdicional = cargoAdicional;
}

function Comida(id, nombre, cargoAdicional) {
    this.id = id;
    this.nombre = nombre;
    this.cargoAdicional = cargoAdicional;
}

const configuracionFormato = {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
}
moneda = new Intl.NumberFormat('es-CO', configuracionFormato);

let precioTotal = 0;

const quinceaniero = new Evento(1, "Quinceañero", 450000, true);
const matrimonio = new Evento(2, "Matrimonio", 800000, false);
const cumpleanios = new Evento(3, "Cumpleaños", 200000, true);
const grado = new Evento(4, "Grado", 300000, false);
const babyShower = new Evento(5, "Baby Shower", 250000, true);

const sedePrincipal = new Sede(1, 'Sede Principal', 'Carrera 45 #26-7', 0);
const sedeCampestre = new Sede(2, 'Sede Campestre', 'Carrera 7 #230-23', 200000);
const otro = new Sede(3, 'Otro lugar', '', 200000);

const eventos = [
    quinceaniero,
    matrimonio,
    cumpleanios,
    grado,
    babyShower
]

const eventosConSede = eventos.filter((x)=> x.ofreceSede === true);
let nombresEventosConSede = eventosConSede.map(x=> x.nombre);


function generarPrompt(textoPromt, elementos) {
    let eleccionValida = false;
    let eleccion;
    while (!eleccionValida) {
        let input = parseInt(prompt(textoPromt).trim());
        for (let el of elementos) {
            if (input === el.id) {
                eleccion = el;
                eleccionValida = true;
            }
        }
        if (input === undefined) {
            eleccionValida = false;
        }
    }
    return eleccion;
}

function sumarPrecioTotal(cantidad) {
    precioTotal += cantidad;
}

const eventoElegido = generarPrompt("Ingrese el tipo de evento que quiere cotizar: \n 1. Quinceañero \n 2. Matrimonio \n 3. Cumpleaños \n 4. Grado \n 5. Baby Shower", eventos);
console.log(eventoElegido);

alert(`Usted eligió: ${eventoElegido.nombre}. \nEl costo base para este evento incluyendo 30 invitados (6 mesas) es de: ${moneda.format(eventoElegido.costoBase)} `);

sumarPrecioTotal(eventoElegido.costoBase);

const cantidadPersonas = parseInt(prompt("Ingresa la cantidad de personas que asistiran al evento"));

let sobrecargoPersonas;
let haySobrecargoPersonas;

if (cantidadPersonas > 30) {
    sobrecargoPersonas = cantidadPersonas - 30;
    haySobrecargoPersonas = true;
} else {
    sobrecargoPersonas = 1;
    haySobrecargoPersonas = false;
}
console.log(sobrecargoPersonas)

const personasPorMesa = parseInt(prompt("Ingresa la cantidad de personas que desea por mesa"));

const mesas = Math.ceil(cantidadPersonas/personasPorMesa);

if (mesas > 6) {
    sumarPrecioTotal((mesas - 6) * 10000);
}

let sonido = prompt("¿Desea que proporcionemos el servicio de sonido en el evento?").toUpperCase().trim();
while (sonido !== "SI" && sonido !== "SÍ" && sonido !== "NO") {
    sonido = prompt("¿Desea que proporcionemos el servicio de sonido en el evento?").toUpperCase().trim();
};

if (sonido === "SI" || sonido === "SÍ") {
    sumarPrecioTotal(250000);
} else {
    sonido = "NO";
}

const comidas = [
    new Comida(1, 'Mañana', (haySobrecargoPersonas ? (25000 * sobrecargoPersonas) : 0)),
    new Comida(2, 'Brunch', (haySobrecargoPersonas ? (26000 * sobrecargoPersonas) : 0)),
    new Comida(3, 'Tarde', (haySobrecargoPersonas ? (30000 * sobrecargoPersonas) : 0)),
    new Comida(4, 'Noche', (haySobrecargoPersonas ? (28000 * sobrecargoPersonas) : 0))
]


const comidaElegida = generarPrompt("Seleccione el buffet: \n1. Mañana\n2. Brunch\n3. Tarde\n4. Noche", comidas);

sumarPrecioTotal(comidaElegida.cargoAdicional);

let cocteleria = prompt("¿Desea que proporcionemos el servicio de coctelería?").toUpperCase().trim();
while (cocteleria !== "SI" && cocteleria !== "SÍ" && cocteleria !== "NO") {
    cocteleria = prompt("¿Desea que proporcionemos el servicio de cocteleria en el evento?").toUpperCase().trim();
};

if (cocteleria === "SI" || cocteleria === "SÍ") {
    if (haySobrecargoPersonas) {
        sumarPrecioTotal(15000 * sobrecargoPersonas);
    }
} else {
    cocteleria = "NO";
}

const ubicaciones = [
    sedePrincipal,
    sedeCampestre,
    otro
]

let textoEventosConSede = '';



for (let index = 0; index < nombresEventosConSede.length; index++) {
    if (index === nombresEventosConSede.length-1) {
        textoEventosConSede += nombresEventosConSede[index] + '. ';
    } else if (index === nombresEventosConSede.length-2) {
        textoEventosConSede += nombresEventosConSede[index] + ' y ';
    } else {
        textoEventosConSede += nombresEventosConSede[index] + ', ';
    }
}
alert( `Los eventos que ofrecen sede son los siguientes: ${textoEventosConSede}`);
let ubicacionElegida;

if (eventoElegido.ofreceSede) {
    ubicacionElegida = generarPrompt("Seleccione en donde se llevará a cabo : \n1. Sede principal\n2. Sede campestre\n3. Otro", ubicaciones);
    console.log(ubicacionElegida);

    if (ubicacionElegida.id === 3) {
        ubicacionElegida.direccion = prompt("Ingrese la dirección del lugar");
    }
} else {
    ubicacionElegida = ubicaciones.find(x => x.id === 3);
    console.log(ubicacionElegida);
    ubicacionElegida.direccion = prompt("Ingrese la dirección del lugar");
}
sumarPrecioTotal(ubicacionElegida.cargoAdicional);

Swal.fire({
    title: 'Precio Total',
    text: `Usted ha elegido las siguientes opciones:\nInvitados: ${cantidadPersonas} \nMesas: ${mesas} \nSonido: ${sonido.toUpperCase()} \nBuffet: ${comidaElegida.nombre} \nCoctelería: ${cocteleria.toUpperCase()} \nUbicación: ` + (ubicacionElegida.id == 3 ? `${ubicacionElegida.direccion}` : `${ubicacionElegida.nombre} en la dirección  ${ubicacionElegida.direccion}`) + `\nEl precio total es de: ${moneda.format(precioTotal)}`,
    icon: 'info',
    confirmButtonText: 'Ok'
});