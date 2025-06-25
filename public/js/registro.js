document.getElementById('formRegistro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = {
    username: e.target.username.value,
    password: e.target.password.value
  };

  const res = await fetch('/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

  const texto = await res.text();
  alert(texto);

  if (res.ok) location.href = '/index.html';
});
