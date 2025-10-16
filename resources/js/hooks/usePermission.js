import { useAuth } from './useAuth';

export const usePermission = () => {
  const { user, hasPermission, hasRole, hasAnyRole, hasAnyPermission } = useAuth();

  // Permisos específicos para cada módulo
  const canViewUsers = hasPermission('view users');
  const canCreateUsers = hasPermission('create users');
  const canEditUsers = hasPermission('edit users');
  const canDeleteUsers = hasPermission('delete users');

  const canViewCourses = hasPermission('view courses');
  const canCreateCourses = hasPermission('create courses');
  const canEditCourses = hasPermission('edit courses');
  const canDeleteCourses = hasPermission('delete courses');

  const canViewSubjects = hasPermission('view subjects');
  const canCreateSubjects = hasPermission('create subjects');
  const canEditSubjects = hasPermission('edit subjects');
  const canDeleteSubjects = hasPermission('delete subjects');

  const canViewGrades = hasPermission('view grades');
  const canCreateGrades = hasPermission('create grades');
  const canEditGrades = hasPermission('edit grades');
  const canDeleteGrades = hasPermission('delete grades');

  const canViewSchools = hasPermission('view schools');
  const canCreateSchools = hasPermission('create schools');
  const canEditSchools = hasPermission('edit schools');
  const canDeleteSchools = hasPermission('delete schools');

  const canViewEnrollments = hasPermission('view enrollments');
  const canCreateEnrollments = hasPermission('create enrollments');
  const canEditEnrollments = hasPermission('edit enrollments');
  const canDeleteEnrollments = hasPermission('delete enrollments');

  // Permisos de gestión general
  const canManageUsers = hasAnyPermission(['create users', 'edit users', 'delete users']);
  const canManageCourses = hasAnyPermission(['create courses', 'edit courses', 'delete courses']);
  const canManageSubjects = hasAnyPermission(['create subjects', 'edit subjects', 'delete subjects']);
  const canManageGrades = hasAnyPermission(['create grades', 'edit grades', 'delete grades']);
  const canManageSchools = hasAnyPermission(['create schools', 'edit schools', 'delete schools']);
  const canManageEnrollments = hasAnyPermission(['create enrollments', 'edit enrollments', 'delete enrollments']);

  // Verificaciones de rol
  const isAdmin = hasRole('admin');
  const isCoordinator = hasRole('coordinator');
  const isTeacher = hasRole('teacher');
  const isStudent = hasRole('student');

  const isStaff = hasAnyRole(['admin', 'coordinator', 'teacher']);
  const isManagement = hasAnyRole(['admin', 'coordinator']);

  // Permisos específicos para estudiantes
  const canViewOwnGrades = isStudent || hasPermission('view grades');
  const canViewOwnCourses = isStudent || hasPermission('view enrollments');

  // Permisos específicos para profesores
  const canGradeOwnSubjects = isTeacher && hasPermission('create grades');
  const canViewOwnStudents = isTeacher || hasPermission('view users');

  // Permisos de dashboard
  const canViewDashboard = true; // Todos los usuarios autenticados pueden ver el dashboard
  const canViewAdminDashboard = hasAnyRole(['admin', 'coordinator']);
  const canViewTeacherDashboard = hasAnyRole(['admin', 'coordinator', 'teacher']);
  const canViewStudentDashboard = isStudent;

  // Función para verificar si el usuario puede acceder a una ruta específica
  const canAccess = (route) => {
    const routePermissions = {
      '/dashboard': canViewDashboard,
      '/users': canViewUsers,
      '/courses': canViewCourses,
      '/subjects': canViewSubjects,
      '/grades': canViewGrades || canViewOwnGrades,
      '/schools': canViewSchools,
      '/enrollments': canViewEnrollments || canViewOwnCourses,
    };

    return routePermissions[route] || false;
  };

  // Función para obtener el tipo de dashboard que debe mostrar el usuario
  const getDashboardType = () => {
    if (isAdmin) return 'admin';
    if (isCoordinator) return 'coordinator';
    if (isTeacher) return 'teacher';
    if (isStudent) return 'student';
    return 'default';
  };

  // Función para obtener las rutas del menú que el usuario puede ver
  const getAccessibleRoutes = () => {
    const routes = [
      { path: '/dashboard', name: 'Dashboard', icon: 'Home', permission: canViewDashboard },
      { path: '/users', name: 'Usuarios', icon: 'Users', permission: canViewUsers },
      { path: '/courses', name: 'Cursos', icon: 'GraduationCap', permission: canViewCourses },
      { path: '/subjects', name: 'Asignaturas', icon: 'BookOpen', permission: canViewSubjects },
      { path: '/grades', name: 'Calificaciones', icon: 'Award', permission: canViewGrades || canViewOwnGrades },
      { path: '/schools', name: 'Colegios', icon: 'Building2', permission: canViewSchools },
    ];

    return routes.filter(route => route.permission);
  };

  return {
    // Usuario y autenticación
    user,
    isAuthenticated: !!user,

    // Permisos específicos por módulo
    canViewUsers,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,

    canViewCourses,
    canCreateCourses,
    canEditCourses,
    canDeleteCourses,

    canViewSubjects,
    canCreateSubjects,
    canEditSubjects,
    canDeleteSubjects,

    canViewGrades,
    canCreateGrades,
    canEditGrades,
    canDeleteGrades,

    canViewSchools,
    canCreateSchools,
    canEditSchools,
    canDeleteSchools,

    canViewEnrollments,
    canCreateEnrollments,
    canEditEnrollments,
    canDeleteEnrollments,

    // Permisos de gestión
    canManageUsers,
    canManageCourses,
    canManageSubjects,
    canManageGrades,
    canManageSchools,
    canManageEnrollments,

    // Verificaciones de rol
    isAdmin,
    isCoordinator,
    isTeacher,
    isStudent,
    isStaff,
    isManagement,

    // Permisos específicos
    canViewOwnGrades,
    canViewOwnCourses,
    canGradeOwnSubjects,
    canViewOwnStudents,

    // Dashboard
    canViewDashboard,
    canViewAdminDashboard,
    canViewTeacherDashboard,
    canViewStudentDashboard,

    // Utilidades
    canAccess,
    getDashboardType,
    getAccessibleRoutes,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAnyPermission,
  };
};
