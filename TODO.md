# TODO: Implementar mejoras en el módulo de citas

## Información Recopilada
- Estados actuales: programada, confirmada, cancelada, completada
- Componentes principales: AppointmentPage.jsx, AppointmentTable.jsx, AppointmentCalendar.jsx, AppointmentContext.jsx, StatusSelector.jsx, Header.jsx
- Flujo: Usuario solicita cita desde web → Aparece en dashboard como "programada" → Agente confirma → Realiza cita → Completa o cancela
- Necesidad de nuevos estados: "re agendada" y "solicitada" para mejor gestión
- Requerimientos incluyen filtros, alertas, notificaciones, historial, y restricciones en citas solicitadas

## Plan
### Nuevos Estados y Estados Existentes
- [ ] Agregar estados "re agendada" y "solicitada" al sistema
- [ ] Actualizar configuraciones de colores y etiquetas en StatusSelector y AppointmentCard
- [ ] Modificar lógica de filtros para incluir nuevos estados

### Tarjetas y Filtros
- [ ] Crear tarjetas extras para "re agendada" y "solicitada" en vista calendario
- [ ] Agregar nuevos estados al filtro por estados en AppointmentPage
- [ ] Actualizar leyenda del calendario con nuevos colores

### Funcionalidades para Estado "Solicitada"
- [ ] Modificar AppointmentTable para mostrar botones específicos (ver, aceptar, cancelar) cuando estado es "solicitada"
- [ ] Implementar lógica para aceptar cita (cambiar a "confirmada") y cancelar (hacer transparente)
- [ ] Agregar alertas de confirmación para aceptar/cancelar citas solicitadas
- [ ] Prevenir eliminación/sobrescritura de citas "solicitadas" hasta que se actúe

### Alertas y Confirmaciones
- [ ] Crear alertas para todas las acciones (eliminar, cancelar, aceptar) con confirmación
- [ ] Implementar validaciones de seguridad para cambios de estado

### Botón "Ver Citas Solicitadas"
- [ ] Agregar botón "ver citas solicitadas" en AppointmentPage
- [ ] Hacer compatible con vista tabla y calendario
- [ ] Filtrar automáticamente por estado "solicitada"

### Banner de Pendientes
- [ ] Implementar lógica para detectar citas "solicitadas" pendientes >24 horas
- [ ] Mostrar banner de advertencia en AppointmentPage

### Filtro por Defecto
- [ ] Cambiar filtro por defecto para mostrar "Solicitadas" primero

### Registro Histórico
- [ ] Crear sistema de historial para citas solicitadas (fecha, hora, motivo)
- [ ] Guardar en localStorage o estado separado

### Notificaciones en Header
- [ ] Modificar Header.jsx para mostrar notificaciones de solicitudes de citas
- [ ] Agregar contador de citas solicitadas pendientes
- [ ] Implementar dropdown con tarjetas de notificaciones y botones (aceptar, rechazar, ver)

## Archivos a editar
- src/features/dashboard/pages/appointment/AppointmentPage.jsx
- src/features/dashboard/components/appointment/AppointmentTable.jsx
- src/features/dashboard/components/appointment/AppointmentCalendar.jsx
- src/shared/contexts/AppointmentContext.jsx
- src/shared/components/ui/StatusSelector.jsx
- src/features/dashboard/components/appointment/AppointmentCard.jsx
- src/shared/components/dashboard/Header/Header.jsx
- src/shared/components/ui/ConfirmationDialog.jsx (si es necesario crear nuevas alertas)

## Pasos de implementación
### Fase 1: Nuevos Estados
- [x] Actualizar statusConfig en StatusSelector.jsx con "re agendada" y "solicitada"
- [x] Actualizar AppointmentCard.jsx para nuevos colores
- [x] Modificar AppointmentContext.jsx para incluir nuevos estados en lógica

### Fase 2: Filtros y Tarjetas
- [x] Agregar nuevos estados al Select en AppointmentPage.jsx
- [x] Actualizar stats en AppointmentPage.jsx para incluir nuevos estados
- [x] Modificar AppointmentCalendar.jsx para nuevas tarjetas y leyenda

### Fase 3: Funcionalidades "Solicitada"
- [ ] Modificar AppointmentTable.jsx para botones condicionales
- [ ] Implementar handleAcceptAppointment y handleRejectAppointment en AppointmentPage.jsx
- [ ] Agregar estilos de opacidad para citas canceladas
- [ ] Crear alertas de confirmación usando ConfirmationDialog

### Fase 4: Alertas y Seguridad
- [ ] Actualizar DeleteConfirmModal y StatusChangeConfirmModal para nuevos casos
- [ ] Agregar validaciones para prevenir cambios no autorizados

### Fase 5: Botón y Banner
- [ ] Agregar botón "ver citas solicitadas" en AppointmentPage
- [ ] Implementar lógica de banner para pendientes >24 horas
- [ ] Crear componente BannerAlert si es necesario

### Fase 6: Notificaciones
- [ ] Modificar Header.jsx para notificaciones dinámicas
- [ ] Crear componente NotificationDropdown con acciones
- [ ] Integrar con AppointmentContext para datos en tiempo real

### Fase 7: Historial y Defecto
- [ ] Implementar historial en AppointmentContext.jsx
- [ ] Cambiar estado inicial del filtro en AppointmentPage.jsx

## Pasos de seguimiento
- [ ] Probar creación de citas con nuevos estados
- [ ] Verificar filtros y tarjetas en ambas vistas
- [ ] Confirmar alertas y confirmaciones funcionan
- [ ] Testear notificaciones en header
- [ ] Validar restricciones en citas "solicitadas"
- [ ] Revisar persistencia en localStorage
- [ ] Asegurar responsive design en móviles
