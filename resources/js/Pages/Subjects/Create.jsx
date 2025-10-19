import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import { BookOpen, ArrowLeft, Loader2 } from 'lucide-react';

const SubjectsCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    course_id: '',
    teacher_id: '',
    school_id: '',
    hours_per_week: '',
    status: 'active'
  });

  const [schools, setSchools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [teachersLoading, setTeachersLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchSchools();
    fetchCourses();
    fetchTeachers();
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

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const token = localStorage.getItem('jwt_token');
      
      const response = await fetch('/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setCourses(data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      setTeachersLoading(true);
      const token = localStorage.getItem('jwt_token');
      
      const response = await fetch('/api/users?role=teacher', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setTeachers(data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setTeachersLoading(false);
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
      
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          hours_per_week: parseInt(formData.hours_per_week)
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirigir a la lista de asignaturas
        router.visit('/subjects');
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message || 'Error al crear la asignatura');
        }
      }
    } catch (error) {
      console.error('Error creating subject:', error);
      alert('Error al crear la asignatura');
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
            onClick={() => router.visit('/subjects')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          Crear Nueva Asignatura
        </h1>
        <p className="text-gray-600">Rellena los datos para crear una nueva asignatura</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <Card.Header>
            <Card.Title>Información de la Asignatura</Card.Title>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre de la asignatura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Asignatura *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Matemáticas, Lengua, Física"
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
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Descripción de la asignatura..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>
                )}
              </div>

              {/* Curso y Profesor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curso *
                  </label>
                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.course_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    disabled={coursesLoading}
                  >
                    <option value="">Seleccionar curso</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name} - {course.academic_year}
                      </option>
                    ))}
                  </select>
                  {errors.course_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.course_id[0]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profesor *
                  </label>
                  <select
                    name="teacher_id"
                    value={formData.teacher_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.teacher_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    disabled={teachersLoading}
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
              </div>

              {/* Horas por semana y Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horas por Semana *
                  </label>
                  <Input
                    type="number"
                    name="hours_per_week"
                    value={formData.hours_per_week}
                    onChange={handleChange}
                    placeholder="4"
                    min="0"
                    max="40"
                    className={errors.hours_per_week ? 'border-red-500' : ''}
                    required
                  />
                  {errors.hours_per_week && (
                    <p className="text-red-500 text-sm mt-1">{errors.hours_per_week[0]}</p>
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
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
                  )}
                </div>
              </div>

              {/* Escuela */}
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

              {/* Botones */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit('/subjects')}
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
                      <BookOpen className="w-4 h-4 mr-2" />
                      Crear Asignatura
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

export default SubjectsCreate;
