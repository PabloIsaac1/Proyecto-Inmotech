import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check, X, Clock } from 'lucide-react';

const NotificationDropdown = ({
  isOpen,
  onClose,
  notifications,
  onAcceptAppointment,
  onRejectAppointment,
  onViewAppointment,
  triggerRef
}) => {
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const updatePosition = () => {
        const rect = triggerRef.current.getBoundingClientRect();
        const newPosition = {
          top: rect.bottom + 8, // mt-2 equivalent, fixed to viewport
          left: rect.right - 320, // w-80 = 320px, right aligned
        };
        setPosition(newPosition);
        setIsPositioned(true);
      };

      // Force a reflow to ensure the element is positioned correctly
      triggerRef.current.offsetHeight;

      // Update position immediately when opening
      updatePosition();

      // Update position on scroll or resize to keep it positioned correctly
      const handleUpdate = () => updatePosition();
      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);

      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
        setIsPositioned(false);
      };
    } else {
      setIsPositioned(false);
    }
  }, [isOpen, triggerRef]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target) && triggerRef.current && !triggerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || !isPositioned) return null;

  const dropdownContent = (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, scale: 0.9, y: -20, rotateX: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20, rotateX: -15 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3
        }}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          width: '320px',
        }}
        className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/60 z-[10000] overflow-hidden"
      >
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">Notificaciones</h3>
          <p className="text-xs text-slate-500 mt-1">
            {notifications.length} cita{notifications.length !== 1 ? 's' : ''} solicitada{notifications.length !== 1 ? 's' : ''} pendiente{notifications.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="max-h-48 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay notificaciones pendientes</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        Nueva cita solicitada
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {appointment.cliente} - {appointment.servicio}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {appointment.fecha} a las {appointment.hora}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onViewAppointment(appointment)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onAcceptAppointment(appointment)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Aceptar cita"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onRejectAppointment(appointment)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Rechazar cita"
                      >
                        <X className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(dropdownContent, document.body);
};

export default NotificationDropdown;
