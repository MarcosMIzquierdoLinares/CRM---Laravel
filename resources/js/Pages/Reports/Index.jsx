import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import ConfirmDialog from '../../Components/UI/ConfirmDialog';
import { FileText, Plus, Search, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react';

const ReportsIndex = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isCoordinator = user.permissions?.includes('view reports');
  const canCreateReports = user.permissions?.includes('create reports');

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, targetId: null });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [page, priorityFilter, statusFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      let url = `/api/reports?page=${page}`;
      if (priorityFilter) url += `&priority=${priorityFilter}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'No se pudieron cargar los reportes');
      }

      setReports(data.data.data);
      setTotalPages(data.data.last_page);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

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
    const teacherName = `${report.teacher?.name || ''} ${report.teacher?.surname || ''}`.trim().toLowerCase();
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacherName.includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || report.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleMarkAsRead = async (reportId) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`/api/reports/${reportId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo actualizar el reporte');
      }

      fetchReports();
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const openDeleteDialog = (reportId) => {
    setConfirmDialog({
      open: true,
      targetId: reportId,
      title: 'Eliminar reporte',
      description: '¿Seguro que quieres eliminar este reporte? Esta acción no se puede deshacer.',
    });
  };

  const handleDelete = async () => {
    if (!confirmDialog.targetId) return;
    try {
      setProcessing(true);
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`/api/reports/${confirmDialog.targetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo eliminar el reporte');
      }

      fetchReports();
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessing(false);
      setConfirmDialog({ open: false, targetId: null });
    }
  };

  const teacherName = (report) => `${report.teacher?.name || ''} ${report.teacher?.surname || ''}`.trim() || 'Sin profesor';

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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="unread">No leídos</option>
              <option value="read">Leídos</option>
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
                        {teacherName(report)}
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
                  
                  <div className="ml-4 flex flex-col space-y-2">
                    {isCoordinator && report.status === 'unread' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(report.id)}
                        disabled={processing}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar leído
                      </Button>
                    )}
                    {(String(report.teacher_id) === String(user.id) || user.roles?.includes('admin')) && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => openDeleteDialog(report.id)}
                        disabled={processing}
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          <div className="space-x-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Siguiente
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ open: false, targetId: null })}
        loading={processing}
      />
    </Layout>
  );
};

export default ReportsIndex;
