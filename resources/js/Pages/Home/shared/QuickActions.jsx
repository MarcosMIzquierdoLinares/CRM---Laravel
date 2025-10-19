import React from 'react';
import { router } from '@inertiajs/react';
import Card from '../../../Components/UI/Card';
import Button from '../../../Components/UI/Button';
import { Users, GraduationCap, Award, FileText, BookOpen, Building2, Plus } from 'lucide-react';


// Este componente es para las acciones rapidas que se muestran en la dashboard
const QuickActions = ({ user }) => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Acciones Rápidas</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="space-y-3">
          {user.permissions?.includes('view users') && (
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.visit('/users')}
            >
              <Users className="w-4 h-4 mr-2" />
              Gestionar Usuarios
            </Button>
          )}
          {user.permissions?.includes('view courses') && (
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.visit('/courses')}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Ver Cursos
            </Button>
          )}
          {user.permissions?.includes('view subjects') && (
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.visit('/subjects')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Ver Asignaturas
            </Button>
          )}
          {user.permissions?.includes('view grades') && (
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.visit('/grades')}
            >
              <Award className="w-4 h-4 mr-2" />
              Gestionar Calificaciones
            </Button>
          )}
          {user.permissions?.includes('view schools') && (
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.visit('/schools')}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Ver Colegios
            </Button>
          )}
          {user.permissions?.includes('create reports') && (
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.visit('/reports/create')}
            >
              <FileText className="w-4 h-4 mr-2" />
              📝 Reporte Diario
            </Button>
          )}
          {user.permissions?.includes('view reports') && (
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.visit('/reports')}
            >
              <FileText className="w-4 h-4 mr-2" />
              📋 Ver Reportes
            </Button>
          )}
          
          {/* Botones de creación rápida */}
          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2 font-medium">Crear nuevo:</div>
            {user.permissions?.includes('create users') && (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => router.visit('/users/create')}
              >
                <Plus className="w-3 h-3 mr-2" />
                Usuario
              </Button>
            )}
            {user.permissions?.includes('create courses') && (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => router.visit('/courses/create')}
              >
                <Plus className="w-3 h-3 mr-2" />
                Curso
              </Button>
            )}
            {user.permissions?.includes('create subjects') && (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => router.visit('/subjects/create')}
              >
                <Plus className="w-3 h-3 mr-2" />
                Asignatura
              </Button>
            )}
            {user.permissions?.includes('create grades') && (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => router.visit('/grades/create')}
              >
                <Plus className="w-3 h-3 mr-2" />
                Calificación
              </Button>
            )}
          </div>
          
          {user.roles?.[0] === 'student' && (
            <Button variant="outline" className="w-full justify-start">
              <Award className="w-4 h-4 mr-2" />
              Ver Mis Calificaciones
            </Button>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default QuickActions;
