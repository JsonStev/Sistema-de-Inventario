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
      
      const imagenUrl = p.imagen ? p.imagen : './assets/placeholder.png'; // Imagen por defecto si no hay 
      
      div.innerHTML = `
        <div class="img-container">
          <img src="${imagenUrl}" alt="Imagen de ${p.nombre}">
        </div>
        <div class="producto-info">
          <h4>${p.nombre}</h4>
          <p>En stock: <strong>${p.cantidad || 0}</strong></p>
          <div class="producto-precio">C$ ${p.precio.toFixed(2)}</div>
        </div>
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
