import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import { GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';

const CoursesCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    academic_year: '2024-2025',
    start_date: '',
    end_date: '',
    teacher_id: '',
    coord_id: '',
    school_id: '',
    status: 'active'
  });

  const [schools, setSchools] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchSchools();
    fetchUsers();
  }, []);

  useEffect(() => {
    // Si el usuario no es admin, seleccionar automáticamente su escuela
    if (!user.permissions?.includes('view schools') && user.school_id) {
      setFormData(prev => ({ ...prev, school_id: user.school_id.toString() }));
    }
  }, [user]);

  const fetchSchools = async () => {
    try {
      setSchoolsLoading(true);
      const token = localStorage.getItem('jwt_token');
      
      const response = await fetch('/api/schools', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setSchools(data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setSchoolsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const token = localStorage.getItem('jwt_token');
      
      // Obtener profesores y coordinadores por separado
      const [teachersResponse, coordinatorsResponse] = await Promise.all([
        fetch('/api/users?role=teacher', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('/api/users?role=coordinator', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      ]);

      const [teachersData, coordinatorsData] = await Promise.all([
        teachersResponse.json(),
        coordinatorsResponse.json()
      ]);
      
      if (teachersData.success) {
        setTeachers(teachersData.data.data || []);
      }
      
      if (coordinatorsData.success) {
        setCoordinators(coordinatorsData.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('jwt_token');
      
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Redirigir a la lista de cursos
        router.visit('/courses');
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message || 'Error al crear el curso');
        }
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error al crear el curso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.visit('/courses')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <GraduationCap className="w-6 h-6 mr-2" />
          Crear Nuevo Curso
        </h1>
        <p className="text-gray-600">Rellena los datos para crear un nuevo curso</p>
      </div>

      <div className="max-w-4xl">
        <Card>
          <Card.Header>
            <Card.Title>Información del Curso</Card.Title>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre del curso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Curso *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: 2º ESO A, 1º Bachillerato Ciencias"
                  className={errors.name ? 'border-red-500' : ''}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Descripción detallada del curso..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>
                )}
              </div>

              {/* Ubicación y Año Académico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación *
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ej: Aula 12, Edificio Principal"
                    className={errors.location ? 'border-red-500' : ''}
                    required
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location[0]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año Académico *
                  </label>
                  <select
                    name="academic_year"
                    value={formData.academic_year}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.academic_year ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                  </select>
                  {errors.academic_year && (
                    <p className="text-red-500 text-sm mt-1">{errors.academic_year[0]}</p>
                  )}
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <Input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className={errors.start_date ? 'border-red-500' : ''}
                    required
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.start_date[0]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin
                  </label>
                  <Input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className={errors.end_date ? 'border-red-500' : ''}
                  />
                  {errors.end_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.end_date[0]}</p>
                  )}
                </div>
              </div>

              {/* Profesor y Coordinador */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profesor Responsable *
                  </label>
                  <select
                    name="teacher_id"
                    value={formData.teacher_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.teacher_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    disabled={usersLoading}
                  >
                    <option value="">Seleccionar profesor</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} {teacher.surname}
                      </option>
                    ))}
                  </select>
                  {errors.teacher_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.teacher_id[0]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coordinador *
                  </label>
                  <select
                    name="coord_id"
                    value={formData.coord_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.coord_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    disabled={usersLoading}
                  >
                    <option value="">Seleccionar coordinador</option>
                    {coordinators.map((coord) => (
                      <option key={coord.id} value={coord.id}>
                        {coord.name} {coord.surname}
                      </option>
                    ))}
                  </select>
                  {errors.coord_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.coord_id[0]}</p>
                  )}
                </div>
              </div>

              {/* Escuela y Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colegio *
                  </label>
                  <select
                    name="school_id"
                    value={formData.school_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.school_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    disabled={schoolsLoading || !user.permissions?.includes('view schools')}
                  >
                    <option value="">Seleccionar colegio</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                  {errors.school_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.school_id[0]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="completed">Completado</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit('/courses')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Crear Curso
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      </div>
    </Layout>
  );
};

export default CoursesCreate;
