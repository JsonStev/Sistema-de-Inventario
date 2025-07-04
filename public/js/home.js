// public/home.js

async function cargarDashboard() {
  try {
    const res = await fetch('/dashboard');
    const data = await res.json();

    document.getElementById('nombreUsuario').textContent = data.usuario.nombre;
    document.getElementById('totalProductos').textContent = data.total;

    const contenedor = document.getElementById('ultimosProductos');
    contenedor.innerHTML = '';

    data.ultimos.forEach(p => {
      const div = document.createElement('div');
      div.className = 'producto-mini';
      div.innerHTML = `
        <img src="${p.imagen}" style="width:80px; height:80px;" alt="${p.nombre}" />
        <p><strong>${p.nombre}</strong><br>C$${p.precio}</p>
      `;
      contenedor.appendChild(div);
    });
  } catch (err) {
    console.error('Error al cargar dashboard', err);
  }
}

function cerrarSesion() {
  fetch('/cerrar-sesion', { method: 'POST' })
    .then(() => window.location.href = '/index.html');
}

cargarDashboard();
