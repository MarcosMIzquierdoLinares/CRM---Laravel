<!-- 2c18151f-0f55-4414-bbe9-22582a1b15d7 82a170e1-5b88-4b66-94b8-5df328827a99 -->
# Plan de Mejoras - CRM Educativo

## 1. Estadísticas para Admin con Exportación PDF

### Backend

- Crear `StatisticsController` con método `getStatistics()` que retorne:
- Total usuarios por rol
- Total cursos activos/inactivos
- Total asignaturas
- Total calificaciones
- Promedio general de calificaciones
- Estadísticas por colegio (si admin)
- Crear método `exportStatisticsPDF()` usando `barryvdh/laravel-dompdf`
- Ruta: `GET /api/statistics` y `GET /api/statistics/export-pdf`

### Frontend

- Agregar botón "Estadísticas" en `Header.jsx` (solo visible para admin)
- Crear página `Statistics.jsx` que muestre resumen visual de estadísticas
- Botón destacado para descargar PDF
- Conectar con APIs

## 2. Sistema de Registro - Solo Admin

### Backend

- Eliminar o restringir ruta pública `/api/register` (solo admin puede crear usuarios)
- El `AuthController::register()` ya existe pero está público - mover a middleware de admin
- O eliminar completamente y usar solo `UserController::store()`

### Frontend

- Verificar que no exista página de registro público
- Confirmar que solo admin puede crear usuarios desde formulario
- Revisar que en las listas donde se tienen que mostrar los cursos, colegios, notas y alumnos, aparezcan datos, aún no aparecen datos....

## 3. Documentación de CRUD por Roles

### Crear archivo `CRUD_PERMISSIONS.md` con esquema:

- **USUARIOS**: Admin (CRUD completo), Coordinator (CRUD de su centro), Teacher (Ver sus estudiantes), Student (N/A)
- **CURSOS**: Admin (CRUD completo), Coordinator (CRUD de su centro), Teacher (Ver donde imparte), Student (Ver donde está matriculado)
- **ASIGNATURAS**: Admin (CRUD completo), Coordinator (CRUD de su centro), Teacher (Ver sus asignaturas), Student (Ver asignaturas de sus cursos)
- **CALIFICACIONES**: Admin (CRUD completo), Coordinator (Ver todas), Teacher (CRUD de sus asignaturas), Student (Ver solo propias)

## 4. Sistema de Reportes - Backend Completo

### Modelo y Migración

- Crear migración `create_reports_table` con campos:
- `id`, `teacher_id`, `coordinator_id` (nullable), `school_id`
- `title`, `class_progress`, `student_participation`, `incidents`, `next_activities`
- `date`, `priority` (enum: low, normal, high, urgent)
- `status` (enum: unread, read)
- `timestamps`, `softDeletes`
- Crear modelo `Report` con relaciones: `teacher()`, `coordinator()`, `school()`

### Controller

- Crear `ReportController` con métodos:
- `index()` - Listar reportes (filtros por prioridad, estado, fecha)
- `store()` - Crear reporte (solo teachers)
- `show()` - Ver detalle
- `update()` - Marcar como leído (coordinadores)
- `destroy()` - Eliminar (solo quien lo creó o admin)

### Rutas API

- `GET /api/reports` - Listar
- `POST /api/reports` - Crear
- `GET /api/reports/{id}` - Ver detalle
- `PATCH /api/reports/{id}/read` - Marcar como leído
- `DELETE /api/reports/{id}` - Eliminar

### Frontend

- Conectar `Reports/Create.jsx` con API real
- Conectar `Reports/Index.jsx` con API real
- Agregar funcionalidad de marcar como leído

## 5. Sistema de Notificaciones

### Backend

- Crear migración `create_notifications_table` con campos:
- `id`, `user_id`, `type` (enum: report, grade, enrollment, system)
- `title`, `message`, `data` (JSON)
- `read_at` (nullable), `timestamps`
- Crear modelo `Notification` con relación `user()`
- Crear `NotificationController` con:
- `index()` - Listar notificaciones del usuario
- `markAsRead()` - Marcar como leída
- `markAllAsRead()` - Marcar todas como leídas
- `unreadCount()` - Contador de no leídas
- Crear eventos/listeners para generar notificaciones cuando:
- Profesor crea reporte → notificar coordinador
- Admin crea usuario → notificar usuario (opcional)
- Se asigna calificación → notificar estudiante

### Frontend

- Crear componente `NotificationBell.jsx` con dropdown
- Agregar contador de no leídas
- Lista de notificaciones con opción de marcar como leída
- Integrar en `Header.jsx`

## 6. Formularios de Edición

### Backend

- Los métodos `update()` ya existen en todos los controllers
- Verificar que funcionen correctamente

### Frontend

- Crear páginas de edición para:
- `Users/Edit.jsx` - Formulario prellenado con datos del usuario
- `Courses/Edit.jsx` - Formulario prellenado
- `Subjects/Edit.jsx` - Formulario prellenado
- `Grades/Edit.jsx` - Formulario prellenado
- Agregar botones "Editar" en las listas que redirijan a estas páginas
- Conectar con APIs de actualización

## 7. Confirmaciones Antes de Eliminar

### Frontend

- Crear componente `ConfirmDialog.jsx` reutilizable
- Agregar confirmación antes de `destroy()` en:
- Eliminar usuario
- Eliminar curso
- Eliminar asignatura
- Eliminar calificación
- Eliminar reporte
- Mensaje tipo: "¿Estás seguro de eliminar [entidad]? Esta acción no se puede deshacer."

## 8. Documentación de Roles

### Crear archivo `ROLES_PERMISSIONS.md` con matriz:

- Tabla de roles (Admin, Coordinator, Teacher, Student) vs acciones
- Qué puede hacer cada rol y qué no puede hacer
- Basado en `RoleSeeder.php` y `PermissionSeeder.php`

## 9. Mejoras Adicionales Identificadas

- Agregar validaciones mejoradas en backend (reglas más estrictas)
- Mejorar manejo de errores en frontend
- Agregar loading states en todas las operaciones
- Mejorar UX de formularios con mejor feedback visual

### To-dos

- [x] Implementar sistema de estadísticas con exportación PDF para admin
- [x] Restringir registro público - solo admin puede crear usuarios
- [x] Crear documentación de permisos CRUD por rol
- [x] Desarrollar backend completo de reportes (modelo, migración, controller, rutas)
- [x] Conectar formularios de reportes con APIs reales
- [x] Desarrollar sistema de notificaciones en backend (modelo, migración, controller, eventos)
- [x] Implementar bandeja de notificaciones en frontend
- [x] Crear formularios de edición para todos los CRUD
- [x] Agregar confirmaciones antes de eliminar en todos los CRUD
- [x] Crear documentación completa de roles y permisos

