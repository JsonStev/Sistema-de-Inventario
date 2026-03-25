// const Producto = require("../../models/Producto");

const formProducto = document.getElementById('formProducto');
const contenedor = document.getElementById('productos');


formProducto.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(formProducto);

  const res = await fetch('/PRODUCTOS', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    alert('Producto agregado correctamente');
    formProducto.reset();
    cargarProductos(); // recarga los productos
  } else {
    const error = await res.text();
    alert('Error al agregar producto: ' + error);
    console.error(error);
  }
});

async function cargarProductos() {
  try {
    const res = await fetch('/PRODUCTOS');
    const productos = await res.json();
    mostrarProductos(productos);
  } catch (error) {
    console.error("Error al cargar productos", error);
    contenedor.innerHTML = "<p>Error al cargar productos</p>";
  }
}

function mostrarProductos(productos) {
  contenedor.innerHTML = '';

  productos.forEach(p => {
    const div = document.createElement("div");
    div.className = "producto";
    
    const imagenUrl = p.imagen ? p.imagen : './assets/placeholder.png'; // Evitar imágenes rotas

    div.innerHTML = `
      <div class="img-container">
        <img src="${imagenUrl}" alt="Imagen de ${p.nombre}">
      </div>
      <strong>${p.nombre}</strong>
      <p style="font-size:0.85rem;">${p.descripcion || 'Sin descripción'}</p>
      <div style="margin: 0.5rem 0;">
        <span style="color:var(--accent-success);font-weight:600;">C$ ${p.precio.toFixed(2)}</span>
        <br>
        <span style="font-size:0.85rem;color:var(--text-secondary);">Stock: ${p.cantidad}</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px; margin-top:auto;">
        <button onclick='abrirModal(${JSON.stringify(p)})'>✏️ Editar</button>
        <button class="btn-eliminar" onclick='eliminarProducto("${p._id}")'>🗑️ Eliminar</button>
      </div>
    `;
    contenedor.appendChild(div);
  });

//<p>Vence: ${new Date(p.fechaVencimiento).toLocaleDateString()}</p>
//<p>Cantidad: ${p.cantidad}</p>
    //<p>Vence: ${new Date(p.fechaVencimiento).toLocaleDateString()}</p>
    // <button onclick='abrirModal(${JSON.stringify(p)})'>✏️ Editar</button>

  // productos.forEach(p => {
  //   const div = document.createElement('div');
  //   div.className = 'producto';
  //   div.innerHTML = `
  //     <img src="${p.imagen}" alt="${p.nombre}" style="width:150px;height:150px;">
  //     <p>${p.nombre}</p>
  //     <p><strong>Precio:</strong> C$${p.precio}</p>
  //     <p><strong>Descripción:</strong> ${p.descripcion || 'Sin descripción'}</p>
  //     <p>Cantidad: ${prod.cantidad}</p>
  //     <p>Vence: ${new Date(prod.fechaVencimiento).toLocaleDateString()}</p>
  //     <div style="margin-top: 10px;">
  //       <button onclick='abrirModal(${JSON.stringify(p)})'>✏️ Editar</button>
  //       <button onclick="eliminarProducto('${p._id}')">🗑️ Eliminar</button>
  //     </div>
  //   `;
  //   contenedor.appendChild(div);
  // });
}

 function abrirModal(producto) {
   document.getElementById('modalEditar').style.display = 'flex';

   document.getElementById('editarId').value = producto._id;
   document.getElementById('editarNombre').value = producto.nombre;
   document.getElementById('editarDescripcion').value = producto.descripcion || '';
   document.getElementById('editarPrecio').value = producto.precio;
   document.getElementById('editarCantidad').value = producto.cantidad;
   document.getElementById('editarFechaVencimiento').value = new Date(producto.fechaVencimiento).toISOString().split('T')[0];   

 }

 function cerrarModal() {
   document.getElementById('modalEditar').style.display = 'none';
 }

 document.getElementById('formEditar').addEventListener('submit', async (e) => {
   e.preventDefault();

   const id = document.getElementById('editarId').value;
   const datos = {
     nombre: document.getElementById('editarNombre').value,
     descripcion: document.getElementById('editarDescripcion').value,
     precio: parseFloat(document.getElementById('editarPrecio').value),
     cantidad: parseInt(document.getElementById('editarCantidad').value) || 0,
     fechaVencimiento: document.getElementById('editarFechaVencimiento').value || new Date().toISOString()
   };

   try {
     const res = await fetch(`/productos/${id}`, {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(datos)
     });

     if (res.ok) {
       alert('Producto actualizado');
       cerrarModal();
       await cargarProductos();
     } else {
       alert('Error al actualizar');
     }
   } catch (err) {
     console.error(err);
   }
 });


async function eliminarProducto(id) {
  if (!confirm('¿Seguro que quieres eliminar este producto?')) return;

  try {
    const res = await fetch(`/PRODUCTOS/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Producto eliminado');
      cargarProductos();
    } else {
      alert('Error al eliminar producto');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
  }
}


const buscador = document.getElementById("buscador");

// Búsqueda dinámica
if (buscador) {
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
}

// Al cargar la página
cargarProductos();
