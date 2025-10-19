import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  User,
  Clock,
  GraduationCap
} from 'lucide-react';

const SubjectsIndex = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, searchTerm, courseFilter, teacherFilter]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      
      let url = `/api/subjects?page=${currentPage}`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (courseFilter) url += `&course_id=${courseFilter}`;
      if (teacherFilter) url += `&teacher_id=${teacherFilter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setSubjects(data.data.data);
        setTotalPages(data.data.last_page);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subjectId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta asignatura?')) {
      return;
    }

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`/api/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        fetchSubjects(); // Recargar la lista
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert('Error al eliminar la asignatura');
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              Gestión de Asignaturas
            </h1>
            <p className="text-gray-600">Administra todas las asignaturas del sistema</p>
          </div>
          
          {user.permissions?.includes('create subjects') && (
            <Button 
              variant="primary" 
              className="flex items-center"
              onClick={() => router.visit('/subjects/create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Asignatura
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
                placeholder="Buscar asignaturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Input
              placeholder="Filtrar por curso"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            />
          </div>

          <div>
            <Input
              placeholder="Filtrar por profesor"
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Tabla de asignaturas */}
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Cargando asignaturas...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asignatura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profesor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horas/Semana
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {subject.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {subject.description?.substring(0, 60)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          {subject.course?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <User className="w-3 h-3 mr-1" />
                          {subject.teacher?.name} {subject.teacher?.surname}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock className="w-3 h-3 mr-1" />
                          {subject.hours_per_week}h
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(subject.status)}`}>
                          {subject.status === 'active' ? 'Activa' : 'Inactiva'}
                        </span>
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
                          
                          {user.permissions?.includes('edit subjects') && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {user.permissions?.includes('delete subjects') && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(subject.id)}
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
    </Layout>
  );
};

export default SubjectsIndex;
