const eventos = [
    {
        "id": 1,
        "nombre": "Quinceañero",
        "costoBase": 450000,
        "img": "https://images.pexels.com/photos/5845460/pexels-photo-5845460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "texto": "¡Celebra tus 15 años como una verdadera princesa! Déjanos hacer realidad tus sueños y transformar tu quinceañera en un cuento de hadas.",
        "ofreceSede": true
    },
    {
        "id": 2,
        "nombre": "Matrimonio",
        "costoBase": 800000,
        "img": "https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "texto": "El día de tu boda es uno de los momentos más importantes de tu vida. Déjanos ser parte de tu historia de amor y hacer de tu boda un día mágico y lleno de emociones.",
        "ofreceSede": false
    },
    {
        "id": 3,
        "nombre": "Cumpleaños",
        "costoBase": 200000,
        "img": "https://images.pexels.com/photos/587739/pexels-photo-587739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "texto": "¡Celebra tu cumpleaños con nosotros y vive una fiesta inolvidable! Déjanos ser parte de tu celebración y hacer de tu cumpleaños un día inolvidable.",
        "ofreceSede": true
    },
    {
        "id": 4,
        "nombre": "Grado",
        "costoBase": 300000,
        "img": "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "texto": "¡Felicitaciones por tu graduación! Este es un momento importante y emocionante en tu vida. Déjanos hacer realidad tus sueños y celebrar juntos este logro tan importante.",
        "ofreceSede": false
    },
    {
        "id": 5,
        "nombre": "Baby Shower",
        "costoBase": 250000,
        "img": "https://images.pexels.com/photos/3593437/pexels-photo-3593437.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "texto": "¡Celebra la llegada de tu bebé con una fiesta inolvidable! Déjanos ser parte de este momento tan especial en tu vida y hacer de tu baby shower o fiesta de revelación un día inolvidable.",
        "ofreceSede": true
    }
];

const ubicaciones = [
    {
        "id": 1,
        "nombre": "Sede Principal",
        "direccion": "Carrera 45 #26-7",
        "cargoAdicional": 0
    },
    {
        "id": 2,
        "nombre": "Sede Campestre",
        "direccion": "Carrera 7 #230-23",
        "cargoAdicional": 200000
    },
    {
        "id": 3,
        "nombre": "Otro lugar",
        "direccion": "",
        "cargoAdicional": 300000
    }
]

const comidas = [
    {
        "id": 1,
        "nombre": "Mañana",
        "cargoAdicional": 25000
    },
    {
        "id": 2,
        "nombre": "Brunch",
        "cargoAdicional": 26000
    },
    {
        "id": 3,
        "nombre": "Tarde",
        "cargoAdicional": 30000
    },
    {
        "id": 4,
        "nombre": "Noche",
        "cargoAdicional": 28000
    }
]

const configuracionFormato = {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
}
moneda = new Intl.NumberFormat('es-CO', configuracionFormato);

let clicked = false;
let evento;
let seleccionUsuario = [];
let precioTotal = 0;
let cantidadInvitados;
let personasPorMesa;
let sonido = false;
let buffet;
let cocteleria = false;
let ubicacion;
let direccion;
let eventoEstaSeleccionado = false;
let detallePrecio = [];
class Precio {
    constructor(valor, concepto) {
        this.valor = valor;
        this.concepto = concepto;
    }
}


function renderizarEventos() {
    let events = document.getElementById("eventos");
    let html = '';
    for (const evento of eventos) {
        html += `
        <article class="tarjetaEvento" id="evento${evento.id}" onclick=renderizarEventosBack(this)>
        <h3>${evento.nombre}</h3>
        <img src="${evento.img}"
            alt="foto de ${evento.nombre}">
        </article>
        `
    }
    events.innerHTML = html;
    renderizarUbicaciones()
}


function habilitarInputDireccion(habilita) {
    let inputDireccion = document.getElementById("inputdireccion");
    let html = "";
    if (habilita) {
        html = `
        <label class="form-label"  for="direccion">Ingresa la dirección: </label>
        <input id="direccion" class="form-control" type="text" onchange="guardaDatosInput(this)">`
    }
    inputDireccion.innerHTML = html;
}

function renderizarUbicaciones() {
    let locacion = document.getElementById("ubicacion");
    let html = "";
    if (!eventoEstaSeleccionado || (evento !== undefined && evento.ofreceSede)) {
        for (let ubi of ubicaciones) {
            html += `<div class="form-check form-check-inline">
                    <label class="form-check-label">${ubi.nombre}</label>
                    <input class="form-check-input ubicacionesradio" type="radio" name="inlineRadioOptions" id="ubicacion${ubi.id}"
                    value="${ubi.id}">
                </div>`
        }
        habilitarInputDireccion(false);
    } else {
        ubicacion = ubicaciones[2];
        habilitarInputDireccion(true);
    }
    locacion.innerHTML = html;
}

function renderizarEventosBack(tarjetaEvent) {
    if (!clicked) {
        clicked = true;
        eventoEstaSeleccionado = true;
        let event = document.querySelector(`#${tarjetaEvent.id}`);
        let events = document.getElementsByClassName("tarjetaEvento");
        event.classList.toggle("tarjetaHighlighter");
        let tarjeta = parseInt(tarjetaEvent.id.slice(-1)) - 1;
        event.style.fontSize = "15px";
        let html = ""
        if (eventos[tarjeta].ofreceSede) {
            html = `
        <h3>${eventos[tarjeta].nombre}</h3>
        <p>${eventos[tarjeta].texto}
        <br> 
        <br>
        El paquete inicial para 30 personas que incluye 6 mesas, comida y ubicación sin costo adicional(solo sede principal) es de: ${moneda.format(eventos[tarjeta].costoBase)}</p>
        `
        } else {
            html = `
        <h3>${eventos[tarjeta].nombre}</h3>
        <p>${eventos[tarjeta].texto}
        <br> 
        <br>
        El paquete inicial para 30 personas que incluye 6 mesas y comida es de: ${moneda.format(eventos[tarjeta].costoBase)}</p>
        `
        }
        event.innerHTML = html;
        for (let evento of events) {
            if (evento.id !== tarjetaEvent.id) {
                evento.classList.add("tajetaNoClickeable");
            }
        }
        evento = eventos[tarjeta];
        console.log(evento);
        renderizarUbicaciones();
    }
    else {
        clicked = false;
        eventoEstaSeleccionado = false;
        let event = document.querySelector(`#${tarjetaEvent.id}`);
        let events = document.getElementsByClassName("tarjetaEvento");
        let tarjeta = parseInt(tarjetaEvent.id.slice(-1)) - 1;
        let html = `
        <h3>${eventos[tarjeta].nombre}</h3>
        <img src="${eventos[tarjeta].img}"
            alt="foto de ${eventos[tarjeta].nombre}">
        `
        evento = undefined;
        event.innerHTML = html;
        event.classList.toggle("tarjetaHighlighter");
        console.log(events)
        for (let evento of events) {
            if (evento.id !== tarjetaEvent.id) {
                evento.classList.remove
                    ("tajetaNoClickeable");
            }
        }
        renderizarUbicaciones();
    }
    console.log(clicked)
}

function renderizarComidas() {
    let buffet = document.getElementById("buffet");
    let html = `<option value=""></option>`;
    for (const comida of comidas) {
        html += `<option value="${comida.id}">${comida.nombre}</option>`
    }
    buffet.innerHTML = html;
}

function guardaDatosInput(e) {
    switch (e.id) {
        case 'cantidadinvitados':
            cantidadInvitados = parseInt(e.value);
            console.log(cantidadInvitados)
            break;
        case 'personaspormesa':
            personasPorMesa = parseInt(e.value);
            break;
        case 'sonido':
            sonido = e.checked;
            break;
        case 'buffet':
            buffet = comidas.find((x) => (x.id === parseInt(e.value)));
            console.log(buffet)
            break;
        case 'cocteleria':
            cocteleria = e.checked;
            break;
        case 'direccion':
            direccion = e.value;
            ubicacion.direccion = direccion;
            break;
        default:
            let radiosUbicaciones = document.querySelectorAll('input[type="radio"]');
            for (let ub of radiosUbicaciones) {
                if (ub.checked) {
                    ubicacion = ubicaciones.find((x) => x.id === parseInt(ub.value));
                    habilitarInputDireccion(true);
                } else {
                    habilitarInputDireccion(false);
                }
            }
            break;
    }
}

function sumarPrecioTotal(cantidad, concepto) {
    precioTotal += cantidad;
    let precio = new Precio(cantidad, concepto)
    detallePrecio.push(precio);
}

const toastTrigger = document.getElementById('btncotizar')
const toastLiveExample = document.getElementById('liveToast')

function validarInputs() {
    let valido = false
    if (seleccionUsuario.length > 0) {
        valido = seleccionUsuario.every(x => x !== undefined);
    }
    return valido;
}

function cotizarEvento() {
    precioTotal = 0;
    seleccionUsuario = [evento, cantidadInvitados, personasPorMesa, sonido, buffet, cocteleria, ubicacion];
    if (validarInputs()) {
        let prueba = new bootstrap.Modal(document.getElementById("modalCotizacion"));
        prueba.show();
        sumarPrecioTotal(evento.costoBase, 'Costo base del evento');
        let mesas = Math.ceil(cantidadInvitados / personasPorMesa);
        console.log(mesas);
        if (mesas > 6) {
            sumarPrecioTotal((mesas - 6) * 10000, 'Mesas');
            console.log(precioTotal + 'mesas')
        }
        if (sonido) {
            sumarPrecioTotal(150000, 'Sonido');
            console.log(precioTotal + 'sonido')
        }
        let sobrecargoPersonas;
        let haySobrecargoPersonas;
        cantidadInvitados > 30 ? (sobrecargoPersonas = cantidadInvitados - 30, haySobrecargoPersonas = true) : (sobrecargoPersonas = 0, haySobrecargoPersonas = false);
        if (haySobrecargoPersonas) {
            if (cocteleria) {
                sumarPrecioTotal(200000 + (15000 * sobrecargoPersonas), 'Coctelería');
                console.log(precioTotal + 'cocteles')
            }
            sumarPrecioTotal(buffet.cargoAdicional * sobrecargoPersonas, 'Comida');
            console.log(precioTotal + 'comida')
        } else {
            if (cocteleria) {
                sumarPrecioTotal(200000, 'Coctelería');
                console.log(precioTotal + 'cocteles')
            }
        }
        sumarPrecioTotal(ubicacion.cargoAdicional, evento.ofreceSede ? 'Costo sede' : 'Transporte a dirección ingresada')
        console.log(precioTotal + 'ubicacion')
        localStorage.setItem('totalPrecio', precioTotal);
        localStorage.setItem('seleccionesUsuario', JSON.stringify(seleccionUsuario));
        let tituloModal = document.getElementById("tituloModal");
        tituloModal.textContent = `Cotización para ${evento.nombre}`;
        let tbodyModal = document.getElementById("tbodyModal");
        html = '';
        for (let precios of detallePrecio) {
            html += `
        <tr>
            <td>${precios.concepto}</td>
            <td style="text-align:right">${moneda.format(precios.valor)}</td>
        </tr>
        `
        }
        html += `
    <tr>
        <td><b>Total</b></td>
        <td style="text-align:right"><b>${moneda.format(precioTotal)}</b></td>
    </tr>
    `
        tbodyModal.innerHTML = html;
    }
}

function abrirToast(){
    console.log('eventos')
    if(!validarInputs()){
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    }
}
renderizarEventos();
renderizarComidas();
toastTrigger.addEventListener('click', abrirToast);

function resetDatos() {
    precioTotal = 0;
    seleccionUsuario = [];
    detallePrecio = [];
}
// const eventosConSede = eventos.filter((x) => x.ofreceSede === true);
// let nombresEventosConSede = eventosConSede.map(x => x.nombre);

// function generarPrompt(textoPromt, elementos) {
//     let eleccionValida = false;
//     let eleccion;
//     while (!eleccionValida) {
//         let input = parseInt(prompt(textoPromt).trim());
//         for (let el of elementos) {
//             if (input === el.id) {
//                 eleccion = el;
//                 eleccionValida = true;
//             }
//         }
//         if (input === undefined) {
//             eleccionValida = false;
//         }
//     }
//     return eleccion;
// }

// function sumarPrecioTotal(cantidad) {
//     precioTotal += cantidad;
// }

// const eventoElegido = generarPrompt("Ingrese el tipo de evento que quiere cotizar: \n 1. Quinceañero \n 2. Matrimonio \n 3. Cumpleaños \n 4. Grado \n 5. Baby Shower", eventos);
// console.log(eventoElegido);

// alert(`Usted eligió: ${eventoElegido.nombre}. \nEl costo base para este evento incluyendo 30 invitados (6 mesas) es de: ${moneda.format(eventoElegido.costoBase)} `);

// sumarPrecioTotal(eventoElegido.costoBase);

// const cantidadPersonas = parseInt(prompt("Ingresa la cantidad de personas que asistiran al evento"));

// let sobrecargoPersonas;
// let haySobrecargoPersonas;

// if (cantidadPersonas > 30) {
//     sobrecargoPersonas = cantidadPersonas - 30;
//     haySobrecargoPersonas = true;
// } else {
//     sobrecargoPersonas = 1;
//     haySobrecargoPersonas = false;
// }
// console.log(sobrecargoPersonas)

// // const personasPorMesa = parseInt(prompt("Ingresa la cantidad de personas que desea por mesa"));

// const mesas = Math.ceil(cantidadPersonas / personasPorMesa);

// if (mesas > 6) {
//     sumarPrecioTotal((mesas - 6) * 10000);
// }

// // let sonido = prompt("¿Desea que proporcionemos el servicio de sonido en el evento?").toUpperCase().trim();
// while (sonido !== "SI" && sonido !== "SÍ" && sonido !== "NO") {
//     sonido = prompt("¿Desea que proporcionemos el servicio de sonido en el evento?").toUpperCase().trim();
// };

// if (sonido === "SI" || sonido === "SÍ") {
//     sumarPrecioTotal(250000);
// } else {
//     sonido = "NO";
// }

// // const comidas = [
// //     new Comida(1, 'Mañana', (haySobrecargoPersonas ? (25000 * sobrecargoPersonas) : 0)),
// //     new Comida(2, 'Brunch', (haySobrecargoPersonas ? (26000 * sobrecargoPersonas) : 0)),
// //     new Comida(3, 'Tarde', (haySobrecargoPersonas ? (30000 * sobrecargoPersonas) : 0)),
// //     new Comida(4, 'Noche', (haySobrecargoPersonas ? (28000 * sobrecargoPersonas) : 0))
// // ]


// const comidaElegida = generarPrompt("Seleccione el buffet: \n1. Mañana\n2. Brunch\n3. Tarde\n4. Noche", comidas);

// sumarPrecioTotal(comidaElegida.cargoAdicional);

// // let cocteleria = prompt("¿Desea que proporcionemos el servicio de coctelería?").toUpperCase().trim();
// while (cocteleria !== "SI" && cocteleria !== "SÍ" && cocteleria !== "NO") {
//     cocteleria = prompt("¿Desea que proporcionemos el servicio de cocteleria en el evento?").toUpperCase().trim();
// };

// if (cocteleria === "SI" || cocteleria === "SÍ") {
//     if (haySobrecargoPersonas) {
//         sumarPrecioTotal(15000 * sobrecargoPersonas);
//     }
// } else {
//     cocteleria = "NO";
// }

// let textoEventosConSede = '';



// for (let index = 0; index < nombresEventosConSede.length; index++) {
//     if (index === nombresEventosConSede.length - 1) {
//         textoEventosConSede += nombresEventosConSede[index] + '. ';
//     } else if (index === nombresEventosConSede.length - 2) {
//         textoEventosConSede += nombresEventosConSede[index] + ' y ';
//     } else {
//         textoEventosConSede += nombresEventosConSede[index] + ', ';
//     }
// }
// alert(`Los eventos que ofrecen sede son los siguientes: ${textoEventosConSede}`);
// let ubicacionElegida;

// if (eventoElegido.ofreceSede) {
//     ubicacionElegida = generarPrompt("Seleccione en donde se llevará a cabo : \n1. Sede principal\n2. Sede campestre\n3. Otro", ubicaciones);
//     console.log(ubicacionElegida);

//     if (ubicacionElegida.id === 3) {
//         ubicacionElegida.direccion = prompt("Ingrese la dirección del lugar");
//     }
// } else {
//     ubicacionElegida = ubicaciones.find(x => x.id === 3);
//     console.log(ubicacionElegida);
//     ubicacionElegida.direccion = prompt("Ingrese la dirección del lugar");
// }
// sumarPrecioTotal(ubicacionElegida.cargoAdicional);

// Swal.fire({
//     title: 'Precio Total',
//     text: `Usted ha elegido las siguientes opciones:\nInvitados: ${cantidadPersonas} \nMesas: ${mesas} \nSonido: ${sonido.toUpperCase()} \nBuffet: ${comidaElegida.nombre} \nCoctelería: ${cocteleria.toUpperCase()} \nUbicación: ` + (ubicacionElegida.id == 3 ? `${ubicacionElegida.direccion}` : `${ubicacionElegida.nombre} en la dirección  ${ubicacionElegida.direccion}`) + `\nEl precio total es de: ${moneda.format(precioTotal)}`,
//     icon: 'info',
//     confirmButtonText: 'Ok'
// });