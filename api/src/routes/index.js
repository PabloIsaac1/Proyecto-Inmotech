const express = require('express');
const router = express.Router();
const citaRoutes = require('./cita.routes');
const notificacionRoutes = require('./notificacion.routes');

router.use('/citas', citaRoutes);
router.use('/notificaciones', notificacionRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1'
  });
});

module.exports = router;
