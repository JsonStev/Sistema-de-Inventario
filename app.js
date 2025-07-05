const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
//app.use(express.json())

// Inicializar Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

// Modelos
const Usuario = require('./models/Usuario');


// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Conectado a MongoDB'))
  .catch(err => console.error(err));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Guardar Imagenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


// Rutas
app.post('/registro', async (req, res) => {
  const { username, password } = req.body;
  const existe = await Usuario.findOne({ username });
  if (existe) return res.status(400).send('Usuario ya existe');

  const nuevo = new Usuario({ username, password });
  await nuevo.save();
  res.send('Usuario registrado correctamente');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const usuario = await Usuario.findOne({ username });
  if (!usuario || !(await usuario.validarPassword(password)))
    return res.status(401).send('Credenciales incorrectas');

  req.session.usuario = usuario._id;
  res.send('Login exitoso');
});

// app.get('/logout', (req, res) => {
//   req.session.destroy(() => {
//     res.send('Sesión cerrada');
//   });
// });

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.clearCookie('connect.sid'); // Borra la cookie de sesión
    res.redirect('/index.html');   // Redirige al login
  });
});


app.get('/verificar-sesion', (req, res) => {
  if (req.session.usuario) return res.send('Sesión activa');
  res.status(401).send('No autorizado');
});

const Producto = require('./models/Producto');
const verificarSesion = require('./middlewares/verificarSesion');




// Obtener todos los productos del usuario
app.get('/productos', verificarSesion, async (req, res) => {
  const productos = await Producto.find().sort({_id: -1});
  res.json(productos);
});

app.get('/dashboard', verificarSesion, async (req, res) => {
  try {
    const usuario = req.session.usuario;
    const ultimos = await Producto.find().sort({ _id: -1 }).limit(5);
    const total = await Producto.countDocuments();

    res.json({ usuario, ultimos, total });
  } catch (err) {
    res.status(500).send('Error al cargar dashboard');
  }
});
// Crear producto


// app.post('/productos', verificarSesion, async (req, res) => {
//   const nuevo = new Producto({ ...req.body, creadoPor: req.session.usuario });
//   await nuevo.save();
//   res.send('Producto creado');
// });

app.post('/productos', verificarSesion, upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, precio, fechaVencimiento, cantidad } = req.body;
    const imagen = req.file ? '/uploads/' + req.file.filename : ''; // Ruta pública

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio: parseFloat(precio),
      imagen,
      fechaVencimiento: new Date(fechaVencimiento),
      cantidad: parseInt(cantidad),
      creadoPor: req.session.usuario
    });

    await nuevoProducto.save();
    res.status(201).send('Producto creado');
  } catch (err) {
    console.error('Error al guardar producto:', err);
    res.status(500).send('Error al guardar producto');
  }
});


// app.post('/productos', verificarSesion, upload.single('imagen'), async (req, res) => {
//   try {
//     const { nombre, descripcion, precio } = req.body;
//     const imagen = req.file ? '/uploads/' + req.file.filename : ''; // Ruta pública

//     const nuevoProducto = new Producto({
//       nombre,
//       descripcion,
//       precio:parseFloat(precio),
//       imagen,
//       creadoPor: req.session.usuario
//     });

//     await nuevoProducto.save();
//     res.status(201).send('Producto creado');
//   } catch (err) {
//     res.status(500).send('Error al guardar producto');
//   }
// });


// Actualizar producto
app.put('/productos/:id', verificarSesion, async (req, res) => {
  try {
    const {nombre, descripcion, precio, cantidad, fechaVencimiento} = req.body;

    await Producto.findOneAndUpdate(req.params.id,{
      nombre,
      descripcion,
      precio,
      cantidad,
      fechaVencimiento: new Date(fechaVencimiento)
    });
    res.status(200).send('Producto Actualizado');
  } catch (err) {
    console.error('Error al actualizar Producto')
    res.status(500).send('Error')
  }
});

// Eliminar producto
app.delete('/productos/:id', verificarSesion, async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.status(200).send('Producto Eliminado');
  } catch (err) {
    console.error('Error al Eliminar Producto:', err);
    res.status(500).send('Error')
  }
});

app.post('/facturar', verificarSesion, async (req, res) => {
  try {
    const compras = req.body.compras; // Array de { id, cantidad }

    for (const item of compras) {
      await Producto.findByIdAndUpdate(item.id, {
        $inc: { cantidad: -item.cantidad }
      });
    }

    res.status(200).send('Factura procesada');
  } catch (err) {
    console.error('Error al facturar:', err);
    res.status(500).send('Error al procesar la factura');
  }
});





// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});