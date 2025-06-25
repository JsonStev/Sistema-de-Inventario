module.exports = (req, res, next) => {
  if (req.session.usuario) return next();
  res.status(401).send('Acceso no autorizado');
};
