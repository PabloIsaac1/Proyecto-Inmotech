const { Cita, Persona, Inmueble, ServicioCita, EstadoCita } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const personaService = require('./persona.service');
const notificacionService = require('./notificacion.service');

class CitaService {
  async crearCita(datosCita) {
    const transaction = await sequelize.transaction();

    try {
      const {
        tipo_documento,
        numero_documento,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        correo,
        telefono,
        id_inmueble,
        id_servicio,
        fecha_cita,
        hora_inicio,
        hora_fin,
        observaciones,
        id_estado_cita
      } = datosCita;

      const persona = await personaService.crearOActualizar({
        tipo_documento,
        numero_documento,
        primer_nombre,
        segundo_nombre: segundo_nombre || null,
        primer_apellido,
        segundo_apellido: segundo_apellido || null,
        correo,
        telefono
      });

      const inmueble = await Inmueble.findByPk(id_inmueble);
      if (!inmueble) {
        throw new Error('El inmueble especificado no existe');
      }

      const servicio = await ServicioCita.findByPk(id_servicio);
      if (!servicio) {
        throw new Error('El servicio especificado no existe');
      }

      let estadoCitaId = id_estado_cita;
      if (!estadoCitaId) {
        const estadoSolicitada = await EstadoCita.findOne({
          where: { nombre_estado: 'Solicitada' }
        });
        estadoCitaId = estadoSolicitada.id_estado_cita;
      }

      const citasConflicto = await Cita.findAll({
        where: {
          fecha_cita,
          id_inmueble,
          id_estado_cita: {
            [Op.in]: [
              await this.obtenerIdEstadoPorNombre('Solicitada'),
              await this.obtenerIdEstadoPorNombre('Confirmada'),
              await this.obtenerIdEstadoPorNombre('Programada')
            ]
          },
          [Op.or]: [
            {
              hora_inicio: {
                [Op.between]: [hora_inicio, hora_fin]
              }
            },
            {
              hora_fin: {
                [Op.between]: [hora_inicio, hora_fin]
              }
            },
            {
              [Op.and]: [
                { hora_inicio: { [Op.lte]: hora_inicio } },
                { hora_fin: { [Op.gte]: hora_fin } }
              ]
            }
          ]
        }
      });

      if (citasConflicto.length > 0) {
        throw new Error('Ya existe una cita programada para este inmueble en el horario seleccionado');
      }

      const cita = await Cita.create(
        {
          id_persona: persona.id_persona,
          id_inmueble,
          id_servicio,
          fecha_cita,
          hora_inicio,
          hora_fin,
          id_estado_cita: estadoCitaId,
          observaciones: observaciones || null,
          fecha_creacion: new Date()
        },
        { transaction }
      );

      const estadoCita = await EstadoCita.findByPk(estadoCitaId);

      if (estadoCita.nombre_estado === 'Solicitada') {
        const idRolAgente = 2;
        await notificacionService.crearNotificacion({
          tipo: 'CITA_SOLICITADA',
          titulo: 'Nueva Cita Solicitada',
          mensaje: `${primer_nombre} ${primer_apellido} ha solicitado una cita para el ${fecha_cita}`,
          id_cita: cita.id_cita,
          id_rol_destino: idRolAgente
        });
      }

      await transaction.commit();

      const citaCompleta = await this.obtenerCitaPorId(cita.id_cita);
      logger.info(`Cita creada exitosamente: ID ${cita.id_cita}`);

      return citaCompleta;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al crear cita:', error);
      throw error;
    }
  }

  async obtenerCitaPorId(id_cita) {
    try {
      const cita = await Cita.findByPk(id_cita, {
        include: [
          {
            association: 'cliente',
            attributes: ['id_persona', 'tipo_documento', 'numero_documento', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'correo', 'telefono']
          },
          {
            association: 'inmueble',
            attributes: ['id_inmueble', 'registro_inmobiliario', 'direccion', 'ciudad', 'categoria']
          },
          {
            association: 'servicio',
            attributes: ['id_servicio', 'nombre_servicio', 'duracion_estimada']
          },
          {
            association: 'estado',
            attributes: ['id_estado_cita', 'nombre_estado']
          },
          {
            association: 'agente',
            attributes: ['id_persona', 'primer_nombre', 'primer_apellido', 'correo', 'telefono']
          }
        ]
      });

      return cita;
    } catch (error) {
      logger.error('Error al obtener cita por ID:', error);
      throw error;
    }
  }

  async obtenerTodasLasCitas(filtros = {}) {
    try {
      const where = {};

      if (filtros.id_estado_cita) {
        where.id_estado_cita = filtros.id_estado_cita;
      }

      if (filtros.fecha_cita) {
        where.fecha_cita = filtros.fecha_cita;
      }

      if (filtros.id_agente_asignado) {
        where.id_agente_asignado = filtros.id_agente_asignado;
      }

      const citas = await Cita.findAll({
        where,
        include: [
          {
            association: 'cliente',
            attributes: ['id_persona', 'tipo_documento', 'numero_documento', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'correo', 'telefono']
          },
          {
            association: 'inmueble',
            attributes: ['id_inmueble', 'registro_inmobiliario', 'direccion', 'ciudad', 'categoria']
          },
          {
            association: 'servicio',
            attributes: ['id_servicio', 'nombre_servicio', 'duracion_estimada']
          },
          {
            association: 'estado',
            attributes: ['id_estado_cita', 'nombre_estado']
          },
          {
            association: 'agente',
            attributes: ['id_persona', 'primer_nombre', 'primer_apellido', 'correo', 'telefono']
          }
        ],
        order: [['fecha_cita', 'ASC'], ['hora_inicio', 'ASC']]
      });

      return citas;
    } catch (error) {
      logger.error('Error al obtener todas las citas:', error);
      throw error;
    }
  }

  async confirmarCita(id_cita, id_agente_asignado) {
    const transaction = await sequelize.transaction();

    try {
      const cita = await Cita.findByPk(id_cita);

      if (!cita) {
        throw new Error('Cita no encontrada');
      }

      const estadoConfirmada = await EstadoCita.findOne({
        where: { nombre_estado: 'Confirmada' }
      });

      await cita.update(
        {
          id_estado_cita: estadoConfirmada.id_estado_cita,
          id_agente_asignado,
          fecha_confirmacion: new Date()
        },
        { transaction }
      );

      await notificacionService.crearNotificacion({
        tipo: 'CITA_CONFIRMADA',
        titulo: 'Cita Confirmada',
        mensaje: `Tu cita para el ${cita.fecha_cita} ha sido confirmada`,
        id_cita: cita.id_cita,
        id_persona_destino: cita.id_persona
      });

      await transaction.commit();

      const citaActualizada = await this.obtenerCitaPorId(id_cita);
      logger.info(`Cita confirmada: ID ${id_cita} - Agente ${id_agente_asignado}`);

      return citaActualizada;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al confirmar cita:', error);
      throw error;
    }
  }

  async cancelarCita(id_cita, motivo_cancelacion) {
    const transaction = await sequelize.transaction();

    try {
      const cita = await Cita.findByPk(id_cita);

      if (!cita) {
        throw new Error('Cita no encontrada');
      }

      const estadoCancelada = await EstadoCita.findOne({
        where: { nombre_estado: 'Cancelada' }
      });

      await cita.update(
        {
          id_estado_cita: estadoCancelada.id_estado_cita,
          motivo_cancelacion,
          fecha_cancelacion: new Date()
        },
        { transaction }
      );

      await notificacionService.crearNotificacion({
        tipo: 'CITA_CANCELADA',
        titulo: 'Cita Cancelada',
        mensaje: `La cita para el ${cita.fecha_cita} ha sido cancelada. Motivo: ${motivo_cancelacion}`,
        id_cita: cita.id_cita,
        id_persona_destino: cita.id_persona
      });

      await transaction.commit();

      const citaActualizada = await this.obtenerCitaPorId(id_cita);
      logger.info(`Cita cancelada: ID ${id_cita}`);

      return citaActualizada;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al cancelar cita:', error);
      throw error;
    }
  }

  async reagendarCita(id_cita, { fecha_cita, hora_inicio, hora_fin }) {
    const transaction = await sequelize.transaction();

    try {
      const cita = await Cita.findByPk(id_cita);

      if (!cita) {
        throw new Error('Cita no encontrada');
      }

      const estadoReagendada = await EstadoCita.findOne({
        where: { nombre_estado: 'Reagendada' }
      });

      await cita.update(
        {
          fecha_cita,
          hora_inicio,
          hora_fin,
          id_estado_cita: estadoReagendada.id_estado_cita,
          es_reagendada: true,
          id_cita_original: cita.id_cita_original || cita.id_cita
        },
        { transaction }
      );

      await notificacionService.crearNotificacion({
        tipo: 'CITA_REAGENDADA',
        titulo: 'Cita Reagendada',
        mensaje: `Tu cita ha sido reagendada para el ${fecha_cita} a las ${hora_inicio}`,
        id_cita: cita.id_cita,
        id_persona_destino: cita.id_persona
      });

      await transaction.commit();

      const citaActualizada = await this.obtenerCitaPorId(id_cita);
      logger.info(`Cita reagendada: ID ${id_cita}`);

      return citaActualizada;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al reagendar cita:', error);
      throw error;
    }
  }

  async completarCita(id_cita) {
    const transaction = await sequelize.transaction();

    try {
      const cita = await Cita.findByPk(id_cita);

      if (!cita) {
        throw new Error('Cita no encontrada');
      }

      const estadoCompletada = await EstadoCita.findOne({
        where: { nombre_estado: 'Completada' }
      });

      await cita.update(
        {
          id_estado_cita: estadoCompletada.id_estado_cita,
          fecha_completada: new Date()
        },
        { transaction }
      );

      await notificacionService.crearNotificacion({
        tipo: 'CITA_COMPLETADA',
        titulo: 'Cita Completada',
        mensaje: `La cita del ${cita.fecha_cita} ha sido completada exitosamente`,
        id_cita: cita.id_cita,
        id_persona_destino: cita.id_persona
      });

      await transaction.commit();

      const citaActualizada = await this.obtenerCitaPorId(id_cita);
      logger.info(`Cita completada: ID ${id_cita}`);

      return citaActualizada;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al completar cita:', error);
      throw error;
    }
  }

  async actualizarCita(id_cita, datosActualizacion) {
    const transaction = await sequelize.transaction();

    try {
      const cita = await Cita.findByPk(id_cita);

      if (!cita) {
        throw new Error('Cita no encontrada');
      }

      await cita.update(datosActualizacion, { transaction });

      await transaction.commit();

      const citaActualizada = await this.obtenerCitaPorId(id_cita);
      logger.info(`Cita actualizada: ID ${id_cita}`);

      return citaActualizada;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al actualizar cita:', error);
      throw error;
    }
  }

  async eliminarCita(id_cita) {
    const transaction = await sequelize.transaction();

    try {
      const cita = await Cita.findByPk(id_cita);

      if (!cita) {
        throw new Error('Cita no encontrada');
      }

      await cita.destroy({ transaction });

      await transaction.commit();

      logger.info(`Cita eliminada: ID ${id_cita}`);

      return true;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al eliminar cita:', error);
      throw error;
    }
  }

  async obtenerIdEstadoPorNombre(nombreEstado) {
    try {
      const estado = await EstadoCita.findOne({
        where: { nombre_estado: nombreEstado }
      });

      return estado ? estado.id_estado_cita : null;
    } catch (error) {
      logger.error('Error al obtener ID de estado por nombre:', error);
      throw error;
    }
  }
}

module.exports = new CitaService();
