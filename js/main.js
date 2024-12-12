// Clase Servicio
class Servicio {
    constructor(nombre, precio, cantidad) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
    }

    obtenerSubtotal() {
        return this.precio * this.cantidad;
    }
}

// Guardar servicios en localStorage
function guardarEnLS() {
    const serviciosJSON = JSON.stringify(servicios);
    localStorage.setItem("servicios", serviciosJSON);
}

// Transformar los datos de localStorage a objetos de tipo Servicio
function transformarServiciosLocalStorage(serviciosJSON) {
    if (serviciosJSON === null) {
        return [];
    }

    const serviciosLiteral = JSON.parse(serviciosJSON);
    return serviciosLiteral.map(
        (servicio) =>
            new Servicio(servicio.nombre, servicio.precio, servicio.cantidad)
    );
}

// Cargar servicios desde un archivo JSON usando fetch
function cargarServiciosDesdeJSON() {
    fetch('./datos.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON');
            }
            return response.json();
        })
        .then((data) => {
            // Convertir los datos JSON a objetos de tipo Servicio
            const serviciosCargados = data.map(
                (servicio) => new Servicio(servicio.nombre, servicio.precio, servicio.cantidad)
            );

            // Sincronizar con los servicios actuales
            servicios = serviciosCargados;
            guardarEnLS(); // Guardar los servicios en localStorage
            actualizarTabla(); // Actualizar la tabla en la página
            mostrarNotificacion('Servicios cargados exitosamente desde JSON', 'success');
        })
        .catch((error) => {
            console.error(error);
            mostrarNotificacion('Error al cargar servicios desde JSON', 'danger');
        });
}

// Variables globales
let servicios = transformarServiciosLocalStorage(localStorage.getItem("servicios"));

// Si no hay servicios en localStorage, inicializar con un valor predeterminado
if (servicios.length === 0) {
    servicios = [new Servicio("Página web", 2900, 1)];
    guardarEnLS();
}

// Referencias del DOM
const tablaServicios = document.getElementById("tablaServicios").querySelector("tbody");
const btnCrearServicio = document.getElementById("btnCrearServicio");
const btnMostrarTotal = document.getElementById("btnMostrarTotal");
const btnModificarServicio = document.getElementById("btnModificarServicio");
const formularioServicio = document.getElementById("formularioServicio");
const btnGuardarServicio = document.getElementById("btnGuardarServicio");
const btnCancelar = document.getElementById("btnCancelar");
const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputCantidad = document.getElementById("cantidad");

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = "info") {
    const notificaciones = document.getElementById("notificaciones");

    const notificacion = document.createElement("div");
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;

    notificaciones.appendChild(notificacion);

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Actualizar la tabla de servicios
function actualizarTabla() {
    tablaServicios.innerHTML = ""; // Limpiar la tabla
    servicios.forEach((servicio, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${servicio.nombre}</td>
            <td>${servicio.precio}</td>
            <td>${servicio.cantidad}</td>
            <td>${servicio.obtenerSubtotal()}</td>
            <td>
                <button class="btnEliminar" data-index="${index}">Eliminar</button>
            </td>
        `;
        tablaServicios.appendChild(fila);
    });

    // Añadir eventos a los botones de eliminar
    const botonesEliminar = document.querySelectorAll(".btnEliminar");
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", eliminarServicio);
    });
}

// Eliminar un servicio
function eliminarServicio(event) {
    const index = event.target.dataset.index; // Obtener el índice del servicio
    servicios.splice(index, 1); // Eliminar el servicio del array
    guardarEnLS(); // Actualizar localStorage
    actualizarTabla(); // Actualizar la tabla
    mostrarNotificacion("Servicio eliminado exitosamente", "success");
}

// Crear un nuevo servicio
btnCrearServicio.addEventListener("click", () => {
    formularioServicio.style.display = "block";
    limpiarFormulario();
});

btnCancelar.addEventListener("click", () => {
    formularioServicio.style.display = "none";
});

btnGuardarServicio.addEventListener("click", () => {
    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const cantidad = parseInt(inputCantidad.value);

    if (!nombre || isNaN(precio) || isNaN(cantidad)) {
        mostrarNotificacion("Datos inválidos", "danger");
        return;
    }

    servicios.push(new Servicio(nombre, precio, cantidad));
    guardarEnLS();
    actualizarTabla();
    mostrarNotificacion("Servicio agregado exitosamente", "success");
    formularioServicio.style.display = "none";
});

// Mostrar el total de los servicios
btnMostrarTotal.addEventListener("click", () => {
    const total = servicios.reduce((acc, el) => acc + el.obtenerSubtotal(), 0);
    mostrarNotificacion(`El total de los servicios contratados es $${total}`, "info");
});

// Referencias de los botones de contratar
const btnContratarSitioWeb = document.querySelectorAll(".contratar")[0];
const btnContratarTiendaOnline = document.querySelectorAll(".contratar")[1];

// Evento para el botón "Contratar" de "Sitio web"
btnContratarSitioWeb.addEventListener("click", () => {
    const servicio = new Servicio("Sitio web", 2900, 1);
    servicios.push(servicio);
    guardarEnLS();
    actualizarTabla();
    mostrarNotificacion("Servicio 'Sitio web' agregado exitosamente", "success");
});

// Evento para el botón "Contratar" de "Tienda Online"
btnContratarTiendaOnline.addEventListener("click", () => {
    const servicio = new Servicio("Tienda Online", 4500, 1);
    servicios.push(servicio);
    guardarEnLS();
    actualizarTabla();
    mostrarNotificacion("Servicio 'Tienda Online' agregado exitosamente", "success");
});

// Inicializar la tabla al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Intenta cargar servicios desde el archivo JSON
    cargarServiciosDesdeJSON();

    // Inicializar tabla con datos locales si no hay JSON disponible
    if (servicios.length === 0) {
        actualizarTabla();
    }
});
