const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Persona = sequelize.define('Personas', {
  id_persona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_persona'
  },
  tipo_documento: {
    type: DataTypes.STRING(5),
    allowNull: false,
    validate: {
      isIn: {
        args: [['CC', 'CE', 'NIT', 'Pasaporte', 'TI']],
        msg: 'Tipo de documento inválido'
      }
    }
  },
  numero_documento: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  primer_nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  segundo_nombre: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  primer_apellido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  segundo_apellido: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Correo electrónico inválido'
      }
    }
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  tiene_cuenta: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  id_codeudor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Personas',
      key: 'id_persona'
    }
  }
}, {
  tableName: 'Personas',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['tipo_documento', 'numero_documento'],
      name: 'UQ_Persona_Documento'
    },
    {
      fields: ['tipo_documento', 'numero_documento'],
      name: 'IX_Personas_Documento'
    }
  ]
});

module.exports = Persona;
