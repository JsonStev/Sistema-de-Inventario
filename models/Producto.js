const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  imagen: String,
  fechaVencimiento: Date,
  cantidad: Number
});

module.exports = mongoose.model('PRODUCTOS', productoSchema);
