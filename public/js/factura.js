

let productos = [];
let carrito = [];

const contenedorProductos = document.getElementById("productos");
const contenedorFactura = document.getElementById("facturaItems");
const totalSpan = document.getElementById("total");
const recibeInput = document.getElementById("recibe");
const cambioSpan = document.getElementById("cambio");
const buscador = document.getElementById("buscador");

async function cargarProductos() {
  try {
    const res = await fetch('/PRODUCTOS');
    productos = await res.json();
    renderProductos();
  } catch (err) {
    alert("Error al cargar productos");
    console.error(err);
  }
}

function renderProductos() {
  contenedorProductos.innerHTML = "";
  productos.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    
    const imagenUrl = prod.imagen ? prod.imagen : './assets/placeholder.png';
    
    div.innerHTML = `
      <div class="img-container">
        <img src="${imagenUrl}" alt="Imagen de ${prod.nombre}">
      </div>
      <strong>${prod.nombre}</strong>
      <div style="margin: 0.5rem 0;">
        <span style="color:var(--accent-success);font-weight:600;">C$ ${prod.precio.toFixed(2)}</span>
        <br>
        <span style="font-size:0.85rem;color:var(--text-secondary);">Stock: ${prod.cantidad || 0}</span>
      </div>
      <button style="margin-top:auto;" onclick="agregarProducto('${prod._id}')">🛒 Agregar</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

function agregarProducto(id) {
  const item = carrito.find(p => p._id === id);
  if (item) {
    item.cantidad++;
  } else {
    const prod = productos.find(p => p._id === id);
    carrito.push({ ...prod, cantidad: 1 });
  }
  renderFactura();
}

function renderFactura() {
  contenedorFactura.innerHTML = "";
  let total = 0;

  carrito.forEach(item => {
    total += item.precio * item.cantidad;

    const div = document.createElement("div");
    div.className = "item-factura";
    div.innerHTML = `
      <div class="item-header">
        <strong>${item.nombre}</strong>
        <button onclick="eliminarProducto('${item._id}')">❌</button>
      </div>
      <div class="item-controles">
        <button onclick="cambiarCantidad('${item._id}', 1)">➕</button>
        <span>${item.cantidad}</span>
        <button onclick="cambiarCantidad('${item._id}', -1)">➖</button>
      </div>
      <p>Precio: C$${item.precio} | Subtotal: C$${item.precio * item.cantidad}</p>
    `;
    contenedorFactura.appendChild(div);
  });

  totalSpan.textContent = total;
  calcularCambio();
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(p => p._id === id);
  if (!item) return;
  item.cantidad += cambio;
  if (item.cantidad <= 0) {
    carrito = carrito.filter(p => p._id !== id);
  }
  renderFactura();
}

function eliminarProducto(id) {
  carrito = carrito.filter(p => p._id !== id);
  renderFactura();
}

recibeInput.addEventListener("input", calcularCambio);

function calcularCambio() {
  const total = parseFloat(totalSpan.textContent);
  const recibe = parseFloat(recibeInput.value);
  if (!isNaN(recibe) && recibe >= total) {
    cambioSpan.textContent = (recibe - total).toFixed(2);
  } else {
    cambioSpan.textContent = "0";
  }
  
}

const confirmarFactura = async () => {
  if (carrito.length === 0) {
    alert("No hay productos en el carrito");
    return;
  }

  const compras = carrito.map(p => ({
    id: p.id || p._id,
    cantidad: p.cantidad
  }));

  const res = await fetch('/facturar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ compras })
  });

  if (res.ok) {
    alert("Compra realizada exitosamente");
    carrito = [];
    renderFactura();
    cargarProductos(); // actualiza la lista
  } else {
    alert("Error al procesar la compra");
  }
};


// Búsqueda dinámica
buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();
  const tarjetas = document.querySelectorAll(".producto");
  tarjetas.forEach(tarjeta => {
    const nombreElement = tarjeta.querySelector("strong");
    if (nombreElement) {
      const nombre = nombreElement.textContent.toLowerCase();
      tarjeta.style.display = nombre.includes(texto) ? "flex" : "none";
    }
  });
});

// Al iniciar
cargarProductos();


