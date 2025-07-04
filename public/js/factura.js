// const productos = [
//   { id: 1, nombre: "Bimboletes", precio: 26, imagen: "./assets/Imagenes/Bimbo/Bimboletes.png" },
//   { id: 2, nombre: 'Rufles Limón', precio: 18, imagen: 'https://via.placeholder.com/100' },
//   { id: 3, nombre: 'Choco Wow', precio: 12, imagen: 'https://via.placeholder.com/100' },
//   { id: 4, nombre: 'Galleta Dino', precio: 10, imagen: 'https://via.placeholder.com/100' },
// ];

// let carrito = [];

// const contenedorProductos = document.getElementById("productos");
// const contenedorFactura = document.getElementById("facturaItems");
// const totalSpan = document.getElementById("total");
// const recibeInput = document.getElementById("recibe");
// const cambioSpan = document.getElementById("cambio");
// const buscador = document.getElementById("buscador");

// productos.forEach(prod => {
//   const div = document.createElement("div");
//   div.className = "producto";
//   div.innerHTML = `
//     <img src="${prod.imagen}" alt="${prod.nombre}" />
//     <h4>${prod.nombre}</h4>
//     <p>C$${prod.precio}</p>
//     <button onclick="agregarProducto(${prod.id})">Comprar</button>
//   `;
//   contenedorProductos.appendChild(div);
// });

// function agregarProducto(id) {
//   const item = carrito.find(p => p.id === id);
//   if (item) {
//     item.cantidad++;
//   } else {
//     const prod = productos.find(p => p.id === id);
//     carrito.push({ ...prod, cantidad: 1 });
//   }
//   renderFactura();
// }

// function renderFactura() {
//   contenedorFactura.innerHTML = "";
//   let total = 0;

//   carrito.forEach(item => {
//     total += item.precio * item.cantidad;

//     const div = document.createElement("div");
//     div.className = "item-factura";
//     div.innerHTML = `
//       <div class="item-header">
//         <strong>${item.nombre}</strong>
//         <button onclick="eliminarProducto(${item.id})">❌</button>
//       </div>
//       <div class="item-controles">
//         <button onclick="cambiarCantidad(${item.id}, 1)">➕</button>
//         <span>${item.cantidad}</span>
//         <button onclick="cambiarCantidad(${item.id}, -1)">➖</button>
//       </div>
//       <p>Precio: C$${item.precio} | Subtotal: C$${item.precio * item.cantidad}</p>
//     `;
//     contenedorFactura.appendChild(div);
//   });

//   totalSpan.textContent = total;
//   calcularCambio();
// }

// function cambiarCantidad(id, cambio) {
//   const item = carrito.find(p => p.id === id);
//   if (!item) return;
//   item.cantidad += cambio;
//   if (item.cantidad <= 0) {
//     carrito = carrito.filter(p => p.id !== id);
//   }
//   renderFactura();
// }

// function eliminarProducto(id) {
//   carrito = carrito.filter(p => p.id !== id);
//   renderFactura();
// }

// recibeInput.addEventListener("input", calcularCambio);

// function calcularCambio() {
//   const total = parseFloat(totalSpan.textContent);
//   const recibe = parseFloat(recibeInput.value);
//   if (!isNaN(recibe) && recibe >= total) {
//     cambioSpan.textContent = (recibe - total).toFixed(2);
//   } else {
//     cambioSpan.textContent = "0";
//   }
// }

// // Búsqueda
// buscador.addEventListener("input", () => {
//   const texto = buscador.value.toLowerCase();
//   const tarjetas = document.querySelectorAll(".producto");
//   tarjetas.forEach((tarjeta, i) => {
//     const nombre = productos[i].nombre.toLowerCase();
//     tarjeta.style.display = nombre.includes(texto) ? "block" : "none";
//   });
// });

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
    div.innerHTML = `
      <img src="${prod.imagen || 'https://via.placeholder.com/100'}" alt="${prod.nombre}" />
      <h4>${prod.nombre}</h4>
      <p>C$${prod.precio}</p>
      <button onclick="agregarProducto('${prod._id}')">Comprar</button>
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
  tarjetas.forEach((tarjeta, i) => {
    const nombre = productos[i].nombre.toLowerCase();
    tarjeta.style.display = nombre.includes(texto) ? "block" : "none";
  });
});

// Al iniciar
cargarProductos();


