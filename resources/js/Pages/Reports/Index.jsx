import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import { FileText, Plus, Search, Calendar, User, AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react';

const ReportsIndex = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isCoordinator = user.permissions?.includes('view reports');
  const canCreateReports = user.permissions?.includes('create reports');

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Datos simulados para demostración
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        title: 'Reporte de clase Matemáticas 2º ESO',
        teacher_name: 'Ana García',
        date: '2024-10-17',
        priority: 'normal',
        status: 'read',
        class_progress: 'Avance normal en ecuaciones de segundo grado. Algunos estudiantes necesitan refuerzo.',
        incidents: 'Falta de material de geometría para la próxima clase.',
        next_activities: 'Examen parcial la próxima semana.'
      },
      {
        id: 2,
        title: 'Incidente en Laboratorio de Ciencias',
        teacher_name: 'Carlos López',
        date: '2024-10-16',
        priority: 'high',
        status: 'unread',
        class_progress: 'Práctica de química interrumpida por problema en equipos.',
        incidents: 'Fallo eléctrico en 3 de los equipos del laboratorio. Necesaria revisión urgente.',
        next_activities: 'Solicito revisión técnica para el viernes.'
      }
    ];

    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityText = (priority) => {
    const texts = {
      low: 'Baja',
      normal: 'Normal',
      high: 'Alta',
      urgent: 'Urgente'
    };
    return texts[priority] || priority;
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.teacher_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || report.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              {isCoordinator ? 'Reportes Recibidos' : 'Mis Reportes'}
            </h1>
            <p className="text-gray-600">
              {isCoordinator 
                ? 'Reportes diarios enviados por los profesores' 
                : 'Historial de tus reportes enviados'}
            </p>
          </div>
          
          {canCreateReports && (
            <Button 
              variant="primary" 
              className="flex items-center"
              onClick={() => router.visit('/reports/create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Reporte
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6" padding="sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por título o profesor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las prioridades</option>
              <option value="low">Baja</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de Reportes */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <Card.Content>
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando reportes...</p>
              </div>
            </Card.Content>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card>
            <Card.Content>
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay reportes
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || priorityFilter 
                    ? 'No se encontraron reportes con los filtros aplicados'
                    : isCoordinator 
                      ? 'No hay reportes enviados por los profesores aún'
                      : 'No has enviado ningún reporte aún'
                  }
                </p>
                {canCreateReports && !searchTerm && !priorityFilter && (
                  <Button onClick={() => router.visit('/reports/create')}>
                    Crear mi primer reporte
                  </Button>
                )}
              </div>
            </Card.Content>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <Card.Content>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {report.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                        {getPriorityText(report.priority)}
                      </span>
                      {report.status === 'unread' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          No leído
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {report.teacher_name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(report.date).toLocaleDateString('es-ES')}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Progreso de la clase:</h4>
                        <p className="text-sm text-gray-700 line-clamp-2">{report.class_progress}</p>
                      </div>
                      
                      {report.incidents && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1 text-yellow-600" />
                            Incidencias:
                          </h4>
                          <p className="text-sm text-gray-700 line-clamp-1">{report.incidents}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Aquí se abriría un modal o página de detalles
                        alert('Funcionalidad de detalles en desarrollo');
                      }}
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
};

export default ReportsIndex;
