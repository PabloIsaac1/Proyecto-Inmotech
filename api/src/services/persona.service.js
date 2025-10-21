const { Persona } = require('../models');
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

class PersonaService {
  async buscarPorDocumento(tipo_documento, numero_documento) {
    try {
      const persona = await Persona.findOne({
        where: {
          tipo_documento,
          numero_documento: numero_documento.trim()
        }
      });

      return persona;
    } catch (error) {
      logger.error('Error al buscar persona por documento:', error);
      throw error;
    }
  }

  async crearOActualizar(datosPersona) {
    const transaction = await sequelize.transaction();

    try {
      const { tipo_documento, numero_documento, ...restoDatos } = datosPersona;

      const personaExistente = await this.buscarPorDocumento(
        tipo_documento,
        numero_documento
      );

      let persona;

      if (personaExistente) {
        await personaExistente.update(
          {
            ...restoDatos,
            fecha_registro: personaExistente.fecha_registro
          },
          { transaction }
        );
        persona = personaExistente;
        logger.info(`Persona actualizada: ${tipo_documento} ${numero_documento}`);
      } else {
        persona = await Persona.create(
          {
            tipo_documento,
            numero_documento: numero_documento.trim(),
            ...restoDatos,
            tiene_cuenta: false,
            estado: true
          },
          { transaction }
        );
        logger.info(`Nueva persona creada: ${tipo_documento} ${numero_documento}`);
      }

      await transaction.commit();
      return persona;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al crear o actualizar persona:', error);
      throw error;
    }
  }

  async obtenerPorId(id_persona) {
    try {
      const persona = await Persona.findByPk(id_persona);
      return persona;
    } catch (error) {
      logger.error('Error al obtener persona por ID:', error);
      throw error;
    }
  }
}

module.exports = new PersonaService();
