# Esquema de Permisos CRUD por Módulo

## Usuarios
- **Admin**: Crear, listar, editar y eliminar cualquier usuario.
- **Coordinador**: Puede crear, listar y editar usuarios de su centro. Elimina solo los de su centro.
- **Profesor**: Solo lectura de sus estudiantes (sin crear/editar/eliminar).
- **Estudiante**: Sin acceso al CRUD (solo ve su perfil vía `/api/me`).

## Cursos
- **Admin**: CRUD completo sobre todos los cursos.
- **Coordinador**: CRUD completo sobre los cursos de su centro.
- **Profesor**: Lectura de los cursos donde imparte clase.
- **Estudiante**: Lectura de cursos en los que está matriculado (vía `/my-courses`).

## Asignaturas
- **Admin**: CRUD completo.
- **Coordinador**: CRUD completo de las asignaturas de su centro.
- **Profesor**: Lectura de sus asignaturas y actualización de calificaciones relacionadas.
- **Estudiante**: Lectura indirecta a través de cursos/calificaciones.

## Calificaciones
- **Admin**: CRUD completo.
- **Coordinador**: Lectura de todas las calificaciones de su centro.
- **Profesor**: Crear, editar y eliminar calificaciones de sus asignaturas.
- **Estudiante**: Lectura de sus calificaciones en `/my-grades`.

