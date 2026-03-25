const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/SISIN')
  .then(async () => {
    const Producto = require('./models/Producto');
    const prods = await Producto.find();
    
    console.log("Actualizando imágenes de productos...");
    let actualizados = 0;
    
    for (const p of prods) {
      if (!p.imagen || p.imagen.includes('placeholder')) {
        const promptObj = encodeURIComponent(`fotografia de producto ${p.nombre}`);
        const nuevaImagen = `https://image.pollinations.ai/prompt/${promptObj}?width=300&height=300&nologo=true`;
        
        await Producto.findByIdAndUpdate(p._id, { imagen: nuevaImagen });
        actualizados++;
        console.log(`- ${p.nombre} -> Actualizado`);
      }
    }
    
    console.log(`¡Listo! Se actualizaron ${actualizados} productos en la BD.`);
    process.exit(0);
  })
  .catch(err => {
    console.error("ERROR DB:", err);
    process.exit(1);
  });
