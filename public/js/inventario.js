const formProducto = document.getElementById('formProducto');
const contenedor = document.getElementById('productos');

formProducto.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(formProducto);

  const res = await fetch('/productos', {
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
    const res = await fetch('/productos');
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
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" style="width:150px;height:150px;">
      <h3>${p.nombre}</h3>
      <p><strong>Precio:</strong> C$${p.precio}</p>
      <p><strong>Descripción:</strong> ${p.descripcion || 'Sin descripción'}</p>
    `;
    contenedor.appendChild(div);
  });
}

// Al cargar la página
cargarProductos();
