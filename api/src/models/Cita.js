const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cita = sequelize.define('Citas', {
  id_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_cita'
  },
  id_persona: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Personas',
      key: 'id_persona'
    }
  },
  id_inmueble: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Inmuebles',
      key: 'id_inmueble'
    }
  },
  id_servicio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Servicios_cita',
      key: 'id_servicio'
    }
  },
  fecha_cita: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  id_estado_cita: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Estados_cita',
      key: 'id_estado_cita'
    }
  },
  id_agente_asignado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Personas',
      key: 'id_persona'
    }
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  motivo_cancelacion: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  es_reagendada: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  id_cita_original: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Citas',
      key: 'id_cita'
    }
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_confirmacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_cancelacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_completada: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Citas',
  timestamps: false,
  indexes: [
    {
      fields: ['id_estado_cita', 'fecha_cita', 'hora_inicio'],
      name: 'IX_Citas_Estado'
    },
    {
      fields: ['id_agente_asignado'],
      name: 'IX_Citas_Agente'
    },
    {
      fields: ['fecha_cita', 'hora_inicio'],
      name: 'IX_Citas_Fecha'
    },
    {
      fields: ['id_persona'],
      name: 'IX_Citas_Persona'
    }
  ],
  validate: {
    horaValida() {
      if (this.hora_fin <= this.hora_inicio) {
        throw new Error('La hora de fin debe ser mayor que la hora de inicio');
      }
    }
  }
});

module.exports = Cita;
