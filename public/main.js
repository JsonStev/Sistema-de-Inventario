const listaProductos = document.getElementById('listaProductos');
if (listaProductos) {
  fetch('/productos')
    .then(res => res.json())
    .then(productos => {
      productos.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.nombre} (${p.cantidad})`;
        listaProductos.appendChild(li);
      });
    })
    .catch(() => alert('Debes iniciar sesión'));
}