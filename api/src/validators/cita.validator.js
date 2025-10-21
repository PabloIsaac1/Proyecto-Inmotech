const Joi = require('joi');

const crearCitaSchema = Joi.object({
  tipo_documento: Joi.string()
    .valid('CC', 'CE', 'NIT', 'Pasaporte', 'TI')
    .required()
    .messages({
      'any.required': 'El tipo de documento es obligatorio',
      'any.only': 'Tipo de documento inválido. Debe ser CC, CE, NIT, Pasaporte o TI'
    }),

  numero_documento: Joi.string()
    .min(6)
    .max(20)
    .pattern(/^[A-Za-z0-9\s\.\-]+$/)
    .required()
    .messages({
      'string.min': 'El número de documento debe tener al menos 6 caracteres',
      'string.max': 'El número de documento no puede exceder 20 caracteres',
      'string.pattern.base': 'El número de documento solo puede contener letras, números, espacios, puntos y guiones',
      'any.required': 'El número de documento es obligatorio'
    }),

  primer_nombre: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .required()
    .messages({
      'string.min': 'El primer nombre debe tener al menos 2 caracteres',
      'string.max': 'El primer nombre no puede exceder 50 caracteres',
      'string.pattern.base': 'El primer nombre solo puede contener letras y espacios',
      'any.required': 'El primer nombre es obligatorio'
    }),

  segundo_nombre: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .allow('', null)
    .messages({
      'string.min': 'El segundo nombre debe tener al menos 2 caracteres',
      'string.max': 'El segundo nombre no puede exceder 50 caracteres',
      'string.pattern.base': 'El segundo nombre solo puede contener letras y espacios'
    }),

  primer_apellido: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .required()
    .messages({
      'string.min': 'El primer apellido debe tener al menos 2 caracteres',
      'string.max': 'El primer apellido no puede exceder 50 caracteres',
      'string.pattern.base': 'El primer apellido solo puede contener letras y espacios',
      'any.required': 'El primer apellido es obligatorio'
    }),

  segundo_apellido: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .allow('', null)
    .messages({
      'string.min': 'El segundo apellido debe tener al menos 2 caracteres',
      'string.max': 'El segundo apellido no puede exceder 50 caracteres',
      'string.pattern.base': 'El segundo apellido solo puede contener letras y espacios'
    }),

  correo: Joi.string()
    .email()
    .max(100)
    .required()
    .messages({
      'string.email': 'El correo electrónico no es válido',
      'string.max': 'El correo electrónico no puede exceder 100 caracteres',
      'any.required': 'El correo electrónico es obligatorio'
    }),

  telefono: Joi.string()
    .pattern(/^(\+57|57)?[3][0-9]{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'El teléfono debe tener formato colombiano (+57 XXX XXX XXXX o 3XX XXX XXXX)',
      'any.required': 'El teléfono es obligatorio'
    }),

  id_inmueble: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del inmueble debe ser un número',
      'number.positive': 'El ID del inmueble debe ser positivo',
      'any.required': 'El inmueble es obligatorio'
    }),

  id_servicio: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del servicio debe ser un número',
      'number.positive': 'El ID del servicio debe ser positivo',
      'any.required': 'El servicio es obligatorio'
    }),

  fecha_cita: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'date.base': 'La fecha de la cita no es válida',
      'date.min': 'No se pueden agendar citas en fechas pasadas',
      'any.required': 'La fecha de la cita es obligatoria'
    }),

  hora_inicio: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.pattern.base': 'La hora de inicio debe tener formato HH:MM',
      'any.required': 'La hora de inicio es obligatoria'
    }),

  hora_fin: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.pattern.base': 'La hora de fin debe tener formato HH:MM',
      'any.required': 'La hora de fin es obligatoria'
    }),

  observaciones: Joi.string()
    .max(1000)
    .allow('', null)
    .messages({
      'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
    }),

  id_estado_cita: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El ID del estado debe ser un número',
      'number.positive': 'El ID del estado debe ser positivo'
    })
});

const actualizarCitaSchema = Joi.object({
  id_estado_cita: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El ID del estado debe ser un número',
      'number.positive': 'El ID del estado debe ser positivo'
    }),

  fecha_cita: Joi.date()
    .iso()
    .min('now')
    .messages({
      'date.base': 'La fecha de la cita no es válida',
      'date.min': 'No se pueden agendar citas en fechas pasadas'
    }),

  hora_inicio: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      'string.pattern.base': 'La hora de inicio debe tener formato HH:MM'
    }),

  hora_fin: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      'string.pattern.base': 'La hora de fin debe tener formato HH:MM'
    }),

  observaciones: Joi.string()
    .max(1000)
    .allow('', null)
    .messages({
      'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
    }),

  motivo_cancelacion: Joi.string()
    .max(500)
    .allow('', null)
    .messages({
      'string.max': 'El motivo de cancelación no puede exceder 500 caracteres'
    }),

  id_agente_asignado: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      'number.base': 'El ID del agente debe ser un número',
      'number.positive': 'El ID del agente debe ser positivo'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

const confirmarCitaSchema = Joi.object({
  id_agente_asignado: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del agente debe ser un número',
      'number.positive': 'El ID del agente debe ser positivo',
      'any.required': 'El agente asignado es obligatorio'
    })
});

const cancelarCitaSchema = Joi.object({
  motivo_cancelacion: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'El motivo de cancelación debe tener al menos 10 caracteres',
      'string.max': 'El motivo de cancelación no puede exceder 500 caracteres',
      'any.required': 'El motivo de cancelación es obligatorio'
    })
});

const reagendarCitaSchema = Joi.object({
  fecha_cita: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'date.base': 'La fecha de la cita no es válida',
      'date.min': 'No se pueden agendar citas en fechas pasadas',
      'any.required': 'La nueva fecha es obligatoria'
    }),

  hora_inicio: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.pattern.base': 'La hora de inicio debe tener formato HH:MM',
      'any.required': 'La nueva hora de inicio es obligatoria'
    }),

  hora_fin: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.pattern.base': 'La hora de fin debe tener formato HH:MM',
      'any.required': 'La nueva hora de fin es obligatoria'
    })
});

const buscarPersonaSchema = Joi.object({
  tipo_documento: Joi.string()
    .valid('CC', 'CE', 'NIT', 'Pasaporte', 'TI')
    .required()
    .messages({
      'any.required': 'El tipo de documento es obligatorio',
      'any.only': 'Tipo de documento inválido'
    }),

  numero_documento: Joi.string()
    .required()
    .messages({
      'any.required': 'El número de documento es obligatorio'
    })
});

module.exports = {
  crearCitaSchema,
  actualizarCitaSchema,
  confirmarCitaSchema,
  cancelarCitaSchema,
  reagendarCitaSchema,
  buscarPersonaSchema
};
