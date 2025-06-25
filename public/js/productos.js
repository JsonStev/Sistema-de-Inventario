const form = document.getElementById('formProducto');
const lista = document.getElementById('listaProductos');

let editando = null;

async function cargarProductos() {
  const res = await fetch('/productos');
  const productos = await res.json();
  lista.innerHTML = '';
  productos.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.nombre}</strong> (${p.cantidad}) - $${p.precio}
      <button onclick="editar('${p._id}')">Editar</button>
      <button onclick="eliminar('${p._id}')" class="Eliminar">Eliminar</button>
    `;
    lista.appendChild(li);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const datos = {
    nombre: form.nombre.value,
    descripcion: form.descripcion.value,
    cantidad: form.cantidad.value,
    precio: form.precio.value
  };

  if (editando) {
    await fetch(`/productos/${editando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    editando = null;
  } else {
    await fetch('/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
  }

  form.reset();
  cargarProductos();
});

async function eliminar(id) {
  await fetch(`/productos/${id}`, { method: 'DELETE' });
  cargarProductos();
}

async function editar(id) {
  const res = await fetch('/productos');
  const productos = await res.json();
  const p = productos.find(prod => prod._id === id);
  form.nombre.value = p.nombre;
  form.descripcion.value = p.descripcion;
  form.cantidad.value = p.cantidad;
  form.precio.value = p.precio;
  editando = id;
}


cargarProductos();

document.getElementById('Cerrar').addEventListener('click', async () => {
  const res = await fetch('/logout');
  if (res.redirected) {
    window.location.href = res.url; // Redirige automáticamente al login
  }
});
