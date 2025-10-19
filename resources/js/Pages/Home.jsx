import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout/Layout';
import DashboardContent from './Home/components/DashboardContent';

const Home = ({ user: userFromBackend, userRole }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalSubjects: 0,
    totalGrades: 0,
  });

  // Usar datos del backend si están disponibles, sino usar localStorage como fallback
  const user = userFromBackend || JSON.parse(localStorage.getItem('user') || '{}');
  const role = userRole || user.roles?.[0];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        // Fallback a datos simulados si hay error
        setStats({
          totalUsers: 0,
          totalCourses: 0,
          totalSubjects: 0,
          totalGrades: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback a datos simulados en caso de error
      setStats({
        totalUsers: 0,
        totalCourses: 0,
        totalSubjects: 0,
        totalGrades: 0,
      });
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          ¡Bienvenido, {user.name}! 👋
        </h1>
        <p className="text-gray-600">
          Aquí tienes un resumen de tu {role === 'student' ? 'progreso académico' : 'gestión educativa'}
        </p>
      </div>

      <DashboardContent 
        user={user} 
        userRole={role} 
        stats={stats} 
      />
    </Layout>
  );
};

export default Home;