import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import ConfirmDialog from '../../Components/UI/ConfirmDialog';
import { 
  Award, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  User,
  BookOpen,
  Calendar,
  TrendingUp
} from 'lucide-react';

const GradesIndex = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [evaluationFilter, setEvaluationFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, targetId: null });
  const [processing, setProcessing] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchGrades();
  }, [currentPage, searchTerm, evaluationFilter, subjectFilter]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      
      let url = `/api/grades?page=${currentPage}`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (evaluationFilter) url += `&evaluation=${evaluationFilter}`;
      if (subjectFilter) url += `&subject_id=${subjectFilter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setGrades(data.data.data);
        setTotalPages(data.data.last_page);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (gradeId) => {
    setConfirmDialog({
      open: true,
      targetId: gradeId,
      title: 'Eliminar calificación',
      description: '¿Seguro que quieres eliminar esta calificación? Esta acción no se puede deshacer.',
    });
  };

  const handleDelete = async () => {
    if (!confirmDialog.targetId) return;

    try {
      setProcessing(true);
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`/api/grades/${confirmDialog.targetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        fetchGrades(); // Recargar la lista
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting grade:', error);
      alert('Error al eliminar la calificación');
    } finally {
      setProcessing(false);
      setConfirmDialog({ open: false, targetId: null });
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 9) return 'text-green-600 bg-green-100';
    if (grade >= 7) return 'text-blue-600 bg-blue-100';
    if (grade >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getEvaluationText = (evaluation) => {
    const texts = {
      1: '1ª Evaluación',
      2: '2ª Evaluación',
      3: '3ª Evaluación',
    };
    return texts[evaluation] || `Evaluación ${evaluation}`;
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Award className="w-6 h-6 mr-2" />
              Gestión de Calificaciones
            </h1>
            <p className="text-gray-600">
              {user.roles?.[0] === 'student' 
                ? 'Consulta tus calificaciones' 
                : 'Administra las calificaciones del sistema'
              }
            </p>
          </div>
          
          {user.permissions?.includes('create grades') && (
            <Button 
              variant="primary" 
              className="flex items-center"
              onClick={() => router.visit('/grades/create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Calificación
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6" padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar calificaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <select
              value={evaluationFilter}
              onChange={(e) => setEvaluationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las evaluaciones</option>
              <option value="1">1ª Evaluación</option>
              <option value="2">2ª Evaluación</option>
              <option value="3">3ª Evaluación</option>
            </select>
          </div>

          <div>
            <Input
              placeholder="Filtrar por asignatura"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Estadísticas rápidas */}
      {user.roles?.[0] === 'student' && grades.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card padding="sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Promedio General</p>
                <p className="text-xl font-bold text-gray-900">
                  {(grades.reduce((acc, grade) => acc + parseFloat(grade.grade), 0) / grades.length).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Calificaciones</p>
                <p className="text-xl font-bold text-gray-900">{grades.length}</p>
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Asignaturas</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Set(grades.map(g => g.subject_id)).size}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tabla de calificaciones */}
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Cargando calificaciones...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {user.roles?.[0] === 'student' ? 'Asignatura' : 'Estudiante'}
                    </th>
                    {user.roles?.[0] !== 'student' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asignatura
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evaluación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calificación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {user.roles?.[0] === 'student' 
                                ? grade.subject?.name
                                : `${grade.user?.name} ${grade.user?.surname}`
                              }
                            </div>
                            {user.roles?.[0] !== 'student' && (
                              <div className="text-sm text-gray-500">
                                {grade.subject?.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      {user.roles?.[0] !== 'student' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {grade.subject?.name}
                          </div>
                        </td>
                      )}
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getEvaluationText(grade.evaluation)}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(grade.grade_date).toLocaleDateString()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {user.permissions?.includes('edit grades') && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center"
                              onClick={() => router.visit(`/grades/${grade.id}/edit`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {user.permissions?.includes('delete grades') && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => requestDelete(grade.id)}
                              className="flex items-center"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
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

export default GradesIndex;
