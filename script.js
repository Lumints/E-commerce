// Obtener referencias a elementos importantes del DOM
const productosContainer = document.getElementById('productos-container');
const carritoContainer = document.getElementById('carrito-container');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const descripcionAmpliada = document.getElementById('descripcion-ampliada');

// Array de productos de ejemplo
const productos = [
    { id: 1, nombre: 'Comisiones de arte', precio: 50, descripcion: 'Consiste en dar una descripción detallada de lo que quiere plasmar en arte, con actualizaciones y un buen proceso de elaboración.', imagen: 'img/908467e4-f8e0-4763-a375-72366da212c8.gif' },
    { id: 2, nombre: 'Arte manual', precio: 75, descripcion: 'Arte hecho a mano en hoja y lápiz, color y esquema según lo desee.', imagen: 'img/https___i_pinimg.com_originals_2b_2a_9a_2b2a9ac309670dcad09e293561e531ab.gif' },
    { id: 3, nombre: 'Cómic designer', precio: 100, descripcion: 'Cómic o manga estilizado con un storyboard a pedido o hecho por el cliente.', imagen: 'img/descarga.gif' }
];

// Carrito de compras
let carrito = [];

// Renderizar productos dinámicamente
function renderizarProductos() {
    productosContainer.innerHTML = ''; // Limpiar el contenedor antes de volver a renderizar
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'card col-md-4 text-center producto-card';
        card.dataset.id = producto.id; // Añadir un atributo data-id al card
        card.innerHTML = `
            <div class="card-body">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${producto.descripcion.split(' ').slice(0, 5).join(' ')}...</p> <!-- Mostrar una vista previa -->
                <p class="card-text">Precio: $${producto.precio}</p>
                <button class="btn btn-primary add-to-cart" data-id="${producto.id}">Añadir al Carrito</button>
            </div>
        `;
        productosContainer.appendChild(card);

        // Añadir event listener para mostrar descripción ampliada
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) return; // Evitar que se active el evento al hacer clic en el botón de añadir al carrito
            mostrarDescripcionAmpliada(producto);
        });
    });
}

// Función para mostrar descripción ampliada
function mostrarDescripcionAmpliada(producto) {
    descripcionAmpliada.innerHTML = `
        <h3>${producto.nombre}</h3>
        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid">
        <p>${producto.descripcion}</p>
        <p>Precio: $${producto.precio}</p>
    `;
    descripcionAmpliada.style.display = 'block';
}

// Añadir producto al carrito
function añadirAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        const itemEnCarrito = carrito.find(item => item.id === id);
        if (itemEnCarrito) {
            itemEnCarrito.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        guardarCarrito();
        renderizarCarrito();
    }
}

// Renderizar carrito
function renderizarCarrito() {
    carritoContainer.innerHTML = '';
    carrito.forEach(item => {
        const div = document.createElement('div');
        div.className = 'carrito-item';
        div.innerHTML = `
            <p>${item.nombre} - Precio: $${item.precio * item.cantidad}</p>
            <div>
                <button class="btn btn-secondary btn-sm disminuir-cantidad" data-id="${item.id}">-</button>
                <span class="mx-2">${item.cantidad}</span>
                <button class="btn btn-secondary btn-sm aumentar-cantidad" data-id="${item.id}">+</button>
                <button class="btn btn-danger btn-sm eliminar-item" data-id="${item.id}">Eliminar</button>
            </div>
        `;
        carritoContainer.appendChild(div);
    });

    // Añadir event listeners para los botones de aumentar, disminuir y eliminar
    document.querySelectorAll('.aumentar-cantidad').forEach(button => {
        button.addEventListener('click', aumentarCantidad);
    });

    document.querySelectorAll('.disminuir-cantidad').forEach(button => {
        button.addEventListener('click', disminuirCantidad);
    });

    document.querySelectorAll('.eliminar-item').forEach(button => {
        button.addEventListener('click', eliminarItemDelCarrito);
    });
}

// Función para aumentar la cantidad
function aumentarCantidad(event) {
    const id = parseInt(event.target.getAttribute('data-id'));
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        producto.cantidad++;
        guardarCarrito();
        renderizarCarrito();
    }
}

// Función para disminuir la cantidad
function disminuirCantidad(event) {
    const id = parseInt(event.target.getAttribute('data-id'));
    const producto = carrito.find(item => item.id === id);
    if (producto && producto.cantidad > 1) {
        producto.cantidad--;
        guardarCarrito();
        renderizarCarrito();
    } else if (producto && producto.cantidad === 1) {
        eliminarItemDelCarrito(event);
    }
}

// Eliminar producto del carrito
function eliminarItemDelCarrito(event) {
    const id = parseInt(event.target.getAttribute('data-id'));
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    renderizarCarrito();
}

// Vaciar carrito
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Cargar carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

// Event listeners
productosContainer.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        const id = parseInt(e.target.getAttribute('data-id'));
        añadirAlCarrito(id);
    }
});

vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

// Inicializar la aplicación
function inicializar() {
    cargarCarrito();
    renderizarProductos();
    renderizarCarrito();
}

inicializar();
