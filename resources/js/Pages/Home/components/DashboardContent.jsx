import React from 'react';
import StatsCard from '../shared/StatsCard';
import RecentActivities from '../shared/RecentActivities';
import QuickActions from '../shared/QuickActions';
import { Users, GraduationCap, BookOpen, Award, TrendingUp, Clock, Calendar } from 'lucide-react';

const DashboardContent = ({ user, userRole, stats }) => {
  // Determinar qué estadísticas mostrar según el rol
  const getStatsForRole = () => {
    switch (userRole) {
      case 'admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={Users}
              title="Total Usuarios"
              value={stats.totalUsers}
              color="blue"
            />
            <StatsCard
              icon={GraduationCap}
              title="Cursos Activos"
              value={stats.totalCourses}
              color="green"
            />
            <StatsCard
              icon={BookOpen}
              title="Asignaturas"
              value={stats.totalSubjects}
              color="purple"
            />
            <StatsCard
              icon={Award}
              title="Calificaciones"
              value={stats.totalGrades}
              color="orange"
            />
          </div>
        );

      case 'coordinator':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon={Users}
              title="Estudiantes"
              value="89"
              color="blue"
            />
            <StatsCard
              icon={GraduationCap}
              title="Cursos Coordinados"
              value="6"
              color="green"
            />
            <StatsCard
              icon={TrendingUp}
              title="Promedio General"
              value="7.2"
              color="orange"
            />
          </div>
        );

      case 'teacher':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon={BookOpen}
              title="Asignaturas"
              value="4"
              color="blue"
            />
            <StatsCard
              icon={Users}
              title="Estudiantes"
              value="85"
              color="green"
            />
            <StatsCard
              icon={Clock}
              title="Horas/Semana"
              value="20"
              color="orange"
            />
          </div>
        );

      case 'student':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon={GraduationCap}
              title="Curso Actual"
              value="2º ESO A"
              color="blue"
            />
            <StatsCard
              icon={Award}
              title="Promedio"
              value="8.5"
              color="green"
            />
            <StatsCard
              icon={Calendar}
              title="Próximo Examen"
              value="15 Dic"
              color="orange"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {getStatsForRole()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities userRole={userRole} />
        <QuickActions user={user} />
      </div>
    </>
  );
};

export default DashboardContent;
