import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import { GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';

const CoursesEdit = () => {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const courseId = segments[1];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    academic_year: '',
    start_date: '',
    end_date: '',
    teacher_id: '',
    coord_id: '',
    school_id: '',
    status: 'active',
  });
  const [schools, setSchools] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const [courseRes, schoolsRes, teachersRes, coordsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        }),
        fetch('/api/schools', { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }),
        fetch('/api/users?role=teacher', { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }),
        fetch('/api/users?role=coordinator', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        }),
      ]);

      const [courseData, schoolsData, teachersData, coordsData] = await Promise.all([
        courseRes.json(),
        schoolsRes.json(),
        teachersRes.json(),
        coordsRes.json(),
      ]);

      if (courseRes.ok && courseData.success) {
        const course = courseData.data;
        setFormData({
          name: course.name || '',
          description: course.description || '',
          location: course.location || '',
          academic_year: course.academic_year || '2024-2025',
          start_date: course.start_date || '',
          end_date: course.end_date || '',
          teacher_id: course.teacher_id?.toString() || '',
          coord_id: course.coord_id?.toString() || '',
          school_id: course.school_id?.toString() || '',
          status: course.status || 'active',
        });
      } else {
        throw new Error(courseData.message || 'No se pudo cargar el curso');
      }

      if (schoolsRes.ok && schoolsData.success) {
        setSchools(schoolsData.data.data || []);
      }
      if (teachersRes.ok && teachersData.success) {
        setTeachers(teachersData.data.data || []);
      }
      if (coordsRes.ok && coordsData.success) {
        setCoordinators(coordsData.data.data || []);
      }
    } catch (error) {
      console.error('Error loading course', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message || 'No se pudo actualizar el curso');
      }

      router.visit('/courses');
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => router.visit('/courses')} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center mt-4">
          <GraduationCap className="w-6 h-6 mr-2" />
          Editar Curso
        </h1>
        <p className="text-gray-600">Actualiza la información del curso.</p>
      </div>

      <div className="max-w-4xl">
        <Card>
          <Card.Header>
            <Card.Title>Datos del Curso</Card.Title>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                <Input name="name" value={formData.name} onChange={handleChange} className={errors.name ? 'border-red-500' : ''} required />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ubicación *</label>
                  <Input name="location" value={formData.location} onChange={handleChange} className={errors.location ? 'border-red-500' : ''} required />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Año Académico *</label>
                  <Input name="academic_year" value={formData.academic_year} onChange={handleChange} className={errors.academic_year ? 'border-red-500' : ''} required />
                  {errors.academic_year && <p className="text-red-500 text-sm mt-1">{errors.academic_year[0]}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de inicio *</label>
                  <Input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className={errors.start_date ? 'border-red-500' : ''} required />
                  {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de fin</label>
                  <Input type="date" name="end_date" value={formData.end_date || ''} onChange={handleChange} className={errors.end_date ? 'border-red-500' : ''} />
                  {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date[0]}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Profesor *</label>
                  <select
                    name="teacher_id"
                    value={formData.teacher_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.teacher_id ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Seleccionar profesor</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} {teacher.surname}
                      </option>
                    ))}
                  </select>
                  {errors.teacher_id && <p className="text-red-500 text-sm mt-1">{errors.teacher_id[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Coordinador *</label>
                  <select
                    name="coord_id"
                    value={formData.coord_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.coord_id ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Seleccionar coordinador</option>
                    {coordinators.map((coord) => (
                      <option key={coord.id} value={coord.id}>
                        {coord.name} {coord.surname}
                      </option>
                    ))}
                  </select>
                  {errors.coord_id && <p className="text-red-500 text-sm mt-1">{errors.coord_id[0]}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Colegio *</label>
                  <select
                    name="school_id"
                    value={formData.school_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.school_id ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Seleccionar colegio</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                  {errors.school_id && <p className="text-red-500 text-sm mt-1">{errors.school_id[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Estado *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="completed">Completado</option>
                  </select>
                  {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={() => router.visit('/courses')} disabled={saving}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving} className="flex items-center">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Guardar cambios
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

export default CoursesEdit;

