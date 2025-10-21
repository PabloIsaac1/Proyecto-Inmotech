const express = require('express');
const router = express.Router();
const citaController = require('../controllers/cita.controller');
const { validate, validateQuery } = require('../middlewares/validate.middleware');
const { createLimiter, strictLimiter } = require('../middlewares/security.middleware');
const {
  crearCitaSchema,
  actualizarCitaSchema,
  confirmarCitaSchema,
  cancelarCitaSchema,
  reagendarCitaSchema,
  buscarPersonaSchema
} = require('../validators/cita.validator');

router.post(
  '/',
  createLimiter,
  validate(crearCitaSchema),
  citaController.crearCita
);

router.get(
  '/',
  citaController.obtenerCitas
);

router.get(
  '/buscar-persona',
  validateQuery(buscarPersonaSchema),
  citaController.buscarPersonaPorDocumento
);

router.get(
  '/:id',
  citaController.obtenerCitaPorId
);

router.patch(
  '/:id',
  strictLimiter,
  validate(actualizarCitaSchema),
  citaController.actualizarCita
);

router.post(
  '/:id/confirmar',
  strictLimiter,
  validate(confirmarCitaSchema),
  citaController.confirmarCita
);

router.post(
  '/:id/cancelar',
  strictLimiter,
  validate(cancelarCitaSchema),
  citaController.cancelarCita
);

router.post(
  '/:id/reagendar',
  strictLimiter,
  validate(reagendarCitaSchema),
  citaController.reagendarCita
);

router.post(
  '/:id/completar',
  strictLimiter,
  citaController.completarCita
);

router.delete(
  '/:id',
  strictLimiter,
  citaController.eliminarCita
);

module.exports = router;
