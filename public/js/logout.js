document.getElementById('Cerrar').addEventListener('click', async (e) => {
  const res = await fetch('/logout');
  if (res.ok) location.href = '/index.html'; // página protegida
});