import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Phone, Mail, Check, X } from 'lucide-react';
import { formatPhoneNumber } from '../../../../shared/utils/phoneFormatter';
import StatusSelector from '../../../../shared/components/ui/StatusSelector';

const AppointmentTable = ({
  citas,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onAcceptAppointment,
  onRejectAppointment,
  loadingStatusChanges,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const getStatusBadge = (estado) => {
    const statusConfig = {
      programada: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Programada'
      },
      confirmada: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Confirmada'
      },
      cancelada: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Cancelada'
      },
      completada: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: 'Completada'
      },
      're agendada': {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        label: 'Re Agendada'
      },
      solicitada: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        label: 'Solicitada'
      }
    };

    const config = statusConfig[estado] || statusConfig.programada;

    return (
      <span
        className={`inline-flex w-[124px] min-w-0 flex-none items-center gap-1 px-1.5 py-1.5 rounded-md border text-xs font-medium transition-all duration-200 truncate whitespace-nowrap justify-center ${config.bg} ${config.borderColor} ${config.text} ${estado === 'cancelada' ? 'opacity-60' : ''}`}
      >
        {config.label}
      </span>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDocumentTypeLabel = (tipoDocumento) => {
    const documentTypes = {
      'CC': 'Cédula de Ciudadanía',
      'CE': 'Cédula de Extranjería',
      'NIT': 'NIT',
      'PASAPORTE': 'Pasaporte',
      'TI': 'Tarjeta de Identidad'
    };
    return documentTypes[tipoDocumento] || tipoDocumento;
  };

  const formatDocumentInfo = (tipoDocumento, numeroDocumento) => {
    if (!tipoDocumento || !numeroDocumento) return '-';
    return `${tipoDocumento} ${numeroDocumento}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';

    // Clean multiple AM/PM suffixes for display safety
    let cleanedTime = timeString;
    const amMatches = timeString.match(/\b(am|AM)\b/g);
    const pmMatches = timeString.match(/\b(pm|PM)\b/g);
    const totalSuffixes = (amMatches ? amMatches.length : 0) + (pmMatches ? pmMatches.length : 0);

    if (totalSuffixes > 1) {
      // Keep only the last suffix
      const lastAM = amMatches && amMatches.length > 0 ? amMatches[amMatches.length - 1] : null;
      const lastPM = pmMatches && pmMatches.length > 0 ? pmMatches[pmMatches.length - 1] : null;

      // Remove all suffixes first
      cleanedTime = timeString.replace(/\s*\b(am|pm)\b/gi, '');

      // Add back the last suffix
      if (lastPM) {
        cleanedTime += ' ' + lastPM.toLowerCase();
      } else if (lastAM) {
        cleanedTime += ' ' + lastAM.toLowerCase();
      }

      cleanedTime = cleanedTime.trim();
    }

    // Si ya tiene am/pm (minúsculas o mayúsculas), devolver como está
    if (cleanedTime.includes('am') || cleanedTime.includes('pm') ||
        cleanedTime.includes('AM') || cleanedTime.includes('PM')) {
      return cleanedTime;
    }

    // Convertir de formato 24 horas a 12 horas
    const [hours, minutes] = cleanedTime.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';

    return `${hour12}:${minutes} ${ampm}`;
  };

  // Componente para vista móvil
  const MobileAppointmentCard = ({ cita }) => {
    const isSolicitada = cita.estado === 'solicitada';
    const isCancelled = cita.estado === 'cancelada';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg border border-slate-200 p-4 mb-4 ${isCancelled ? 'opacity-60' : ''}`}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-slate-800">{cita.cliente}</h3>
            <p className="text-sm text-slate-600">{cita.servicio}</p>
          </div>
          {isSolicitada ? (
            getStatusBadge(cita.estado)
          ) : (
            <StatusSelector
              value={cita.estado}
              onChange={(newStatus) => onStatusChange(cita, newStatus)}
              loading={loadingStatusChanges.has(cita.id)}
              className="w-32"
            />
          )}
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(cita.fecha)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(cita.hora)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4" />
            <span>{cita.propiedad}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="w-4 h-4" />
            <span>{formatPhoneNumber(cita.telefono)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="w-4 h-4" />
            <span>{cita.email}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {isSolicitada ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onView(cita)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ver
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAcceptAppointment(cita)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Aceptar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onRejectAppointment(cita)}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onView(cita)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ver
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(cita)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(cita)}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fecha & Hora
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {citas.map((cita) => {
                const isSolicitada = cita.estado === 'solicitada';
                const isCancelled = cita.estado === 'cancelada';

                return (
                  <motion.tr
                    key={cita.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`hover:bg-slate-50 transition-colors ${isCancelled ? 'opacity-60' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{cita.cliente}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{cita.servicio}</div>
                      <div className="text-sm text-slate-500">{cita.propiedad}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-900">{formatDate(cita.fecha)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-500">{formatTime(cita.hora)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isSolicitada ? (
                        getStatusBadge(cita.estado)
                      ) : (
                        <StatusSelector
                          value={cita.estado}
                          onChange={(newStatus) => onStatusChange(cita, newStatus)}
                          loading={loadingStatusChanges.has(cita.id)}
                          className="w-44"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-900">{formatPhoneNumber(cita.telefono)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-500">{cita.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {formatDocumentInfo(cita.tipoDocumento, cita.numeroDocumento)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {isSolicitada ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onView(cita)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onAcceptAppointment(cita)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Aceptar cita"
                            >
                              <Check className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onRejectAppointment(cita)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancelar cita"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </>
                        ) : (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onView(cita)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onEdit(cita)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar cita"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onDelete(cita)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar cita"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-4">
        {citas.map((cita) => (
          <MobileAppointmentCard key={cita.id} cita={cita} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-slate-600 hover:bg-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                const isCurrentPage = page === currentPage;

                return (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isCurrentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    {page}
                  </motion.button>
                );
              })}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-slate-600 hover:bg-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentTable;
