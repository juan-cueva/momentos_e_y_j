const configuracionFormato = {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
}
let moneda = new Intl.NumberFormat('es-CO', configuracionFormato);
let comidas = [];
let ubicaciones = [];
let eventos = [];
let eventoEstaSeleccionado = false;
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
let detallePrecio = [];
let modalCotizacion = new bootstrap.Modal(document.getElementById("modalCotizacion"));
let modalContacto = new bootstrap.Modal(document.getElementById("modalContacto"));

class Precio {
    constructor(valor, concepto) {
        this.valor = valor;
        this.concepto = concepto;
    }
}

async function obtenerDatos(seccion, url) {
    try {
        const response = await fetch(url);
        const datos = await response.json();
        switch (seccion) {
            case 'datosEventos':
                eventos = datos;
                renderizarEventos();
                break;
            case 'datosComidas':
                comidas = datos;
                renderizarComidas();
                break;
            case 'datosUbicaciones':
                ubicaciones = datos;
                renderizarUbicaciones();
            default:
                break;
        }
        return datos;
    } catch (error) {
        console.error('Error trayendo datos:', error);
    }
}

obtenerDatos('datosEventos', 'https://6424c8169e0a30d92b228961.mockapi.io/momento/eventos');
obtenerDatos('datosComidas', 'https://6424c8169e0a30d92b228961.mockapi.io/momento/comidas');
obtenerDatos('datosUbicaciones', 'https://64387f674660f26eb19da747.mockapi.io/momentos2/ubicaciones');

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
        for (let evento of events) {
            if (evento.id !== tarjetaEvent.id) {
                evento.classList.remove
                    ("tajetaNoClickeable");
            }
        }
        renderizarUbicaciones();
    }
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
            break;
        case 'personaspormesa':
            personasPorMesa = parseInt(e.value);
            break;
        case 'sonido':
            sonido = e.checked;
            break;
        case 'buffet':
            buffet = comidas.find((x) => (x.id === parseInt(e.value)));
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
        modalCotizacion.show();
        sumarPrecioTotal(evento.costoBase, 'Costo base del evento');
        let mesas = Math.ceil(cantidadInvitados / personasPorMesa);
        if (mesas > 6) {
            sumarPrecioTotal((mesas - 6) * 10000, 'Mesas');
        }
        if (sonido) {
            sumarPrecioTotal(150000, 'Sonido');
        }
        let sobrecargoPersonas;
        let haySobrecargoPersonas;
        cantidadInvitados > 30 ? (sobrecargoPersonas = cantidadInvitados - 30, haySobrecargoPersonas = true) : (sobrecargoPersonas = 0, haySobrecargoPersonas = false);
        if (haySobrecargoPersonas) {
            if (cocteleria) {
                sumarPrecioTotal(200000 + (15000 * sobrecargoPersonas), 'Coctelería');
            }
            sumarPrecioTotal(buffet.cargoAdicional * sobrecargoPersonas, 'Comida');
        } else {
            if (cocteleria) {
                sumarPrecioTotal(200000, 'Coctelería');
            }
        }
        sumarPrecioTotal(ubicacion.cargoAdicional, evento.ofreceSede ? 'Costo sede' : 'Transporte a dirección ingresada')
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

function abrirToast() {
    if (!validarInputs()) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        let toastText = document.getElementById("textotoast");
        toastText.innerText = "Debes llenar todos los campos";
        toastBootstrap.show();
    }
}

toastTrigger.addEventListener('click', abrirToast);

function resetDatos() {
    precioTotal = 0;
    seleccionUsuario = [];
    detallePrecio = [];
}

function mostrarModalContacto() {
    modalCotizacion.hide();
    modalContacto.show();
}

function enviarDatos() {
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let telefono = document.getElementById("telefono").value;
    let comentario = document.getElementById("comentario").value;
    let datos = {
        nombre: nombre,
        email: email,
        telefono: telefono,
        comentario: comentario
    };
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    let toastText = document.getElementById("textotoast");
    toastText.innerText = "Te contactaremos tan pronto como sea posible"
    let datosEnviados = false;
    fetch("https://jsonplaceholder.typicode.com/juan-cueva/fake-api/posts", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
        .then(data => data !== null || data !== undefined ? toastBootstrap.show() : toastText.innerText = "");
    modalContacto.hide();
    resetDatos();
}