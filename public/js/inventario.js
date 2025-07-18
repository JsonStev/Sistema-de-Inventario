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
  div.innerHTML = `
    <img src="${p.imagen}" />
    <h4>${p.nombre}</h4>
    <p>${p.descripcion}</p>
    <p>Precio: C$${p.precio}</p>
    <p>Cantidad: ${p.cantidad}</p>
    
    <button onclick='eliminarProducto("${p._id}")'>🗑️ Eliminar</button>
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
   cantidad: parseInt(document.getElementById('editarCantidad').value),
   fechaVencimiento: document.getElementById('editarFechaVencimiento').value
   }
   
  
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


// Al cargar la página
cargarProductos();
