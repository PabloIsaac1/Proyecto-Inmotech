const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notificacion = sequelize.define('Notificaciones', {
  id_notificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_notificacion'
  },
  tipo_notificacion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: {
        args: [['CITA_SOLICITADA', 'CITA_CANCELADA', 'CITA_REAGENDADA', 'CITA_CONFIRMADA', 'CITA_COMPLETADA']],
        msg: 'Tipo de notificación inválido'
      }
    }
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  id_cita: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Citas',
      key: 'id_cita'
    }
  },
  id_rol_destino: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Roles',
      key: 'id_rol'
    }
  },
  id_persona_destino: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Personas',
      key: 'id_persona'
    }
  },
  leida: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  fecha_leida: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Notificaciones',
  timestamps: false,
  indexes: [
    {
      fields: ['leida', 'fecha_creacion'],
      name: 'IX_Notificaciones_NoLeidas'
    },
    {
      fields: ['id_rol_destino'],
      name: 'IX_Notificaciones_Rol'
    }
  ],
  validate: {
    destinoValido() {
      if (!this.id_rol_destino && !this.id_persona_destino) {
        throw new Error('Debe especificar al menos un destinatario (rol o persona)');
      }
    }
  }
});

module.exports = Notificacion;
