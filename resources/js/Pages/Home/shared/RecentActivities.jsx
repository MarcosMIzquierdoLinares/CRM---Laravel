import React from 'react';
import Card from '../../../Components/UI/Card';
import { UserCheck, Award, BookOpen } from 'lucide-react';


/**
 *  
 * Este componente es para las actividades recientes que se muestran en la dashboard
 * Si el usuario es estudiante, se muestran sus calificaciones recientes
 * Si el usuario es profesor, se muestran sus actividades recientes
 * Si el usuario es coordinador, se muestran sus actividades recientes
 * Si el usuario es admin, se muestran sus actividades recientes
 * 
 **/
const RecentActivities = ({ userRole }) => {
  if (userRole === 'student') {
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

export default RecentActivities;
