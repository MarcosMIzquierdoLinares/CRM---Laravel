import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout/Layout';
import Card from '../Components/UI/Card';
import Button from '../Components/UI/Button';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Award, 
  TrendingUp,
  Calendar,
  UserCheck,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalSubjects: 0,
    totalGrades: 0,
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Aquí cargarías las estadísticas reales desde la API
    // Por ahora simulamos datos
    setStats({
      totalUsers: 156,
      totalCourses: 24,
      totalSubjects: 120,
      totalGrades: 2450,
    });
  }, []);

  const getRoleBasedContent = () => {
    const role = user.roles?.[0];

    switch (role) {
      case 'admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cursos Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Asignaturas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSubjects}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Calificaciones</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalGrades}</p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'coordinator':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cursos Coordinados</p>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Promedio General</p>
                  <p className="text-2xl font-bold text-gray-900">7.2</p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'teacher':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Asignaturas</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                  <p className="text-2xl font-bold text-gray-900">85</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Horas/Semana</p>
                  <p className="text-2xl font-bold text-gray-900">20</p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'student':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Curso Actual</p>
                  <p className="text-lg font-bold text-gray-900">2º ESO A</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">8.5</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Próximo Examen</p>
                  <p className="text-lg font-bold text-gray-900">15 Dic</p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const getRecentActivities = () => {
    const role = user.roles?.[0];
    
    if (role === 'student') {
      return (
        <Card>
          <Card.Header>
            <Card.Title>Mis Calificaciones Recientes</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Matemáticas</p>
                  <p className="text-sm text-gray-600">Evaluación 2</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">9.5</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Lengua</p>
                  <p className="text-sm text-gray-600">Evaluación 2</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">8.0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Inglés</p>
                  <p className="text-sm text-gray-600">Evaluación 2</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">7.5</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card>
        <Card.Header>
          <Card.Title>Actividad Reciente</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <UserCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Nuevo estudiante matriculado</p>
                <p className="text-sm text-gray-600">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <Award className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Calificaciones actualizadas</p>
                <p className="text-sm text-gray-600">Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Nueva asignatura creada</p>
                <p className="text-sm text-gray-600">Ayer</p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          ¡Bienvenido, {user.name}! 👋
        </h1>
        <p className="text-gray-600">
          Aquí tienes un resumen de tu {user.roles?.[0] === 'student' ? 'progreso académico' : 'gestión educativa'}
        </p>
      </div>

      {getRoleBasedContent()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getRecentActivities()}

        <Card>
          <Card.Header>
            <Card.Title>Acciones Rápidas</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {user.permissions?.includes('view users') && (
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Gestionar Usuarios
                </Button>
              )}
              {user.permissions?.includes('view courses') && (
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Ver Cursos
                </Button>
              )}
              {user.permissions?.includes('view grades') && (
                <Button variant="outline" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  Gestionar Calificaciones
                </Button>
              )}
              {user.roles?.[0] === 'student' && (
                <Button variant="outline" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  Ver Mis Calificaciones
                </Button>
              )}
            </div>
          </Card.Content>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
