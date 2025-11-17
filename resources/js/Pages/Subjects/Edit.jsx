import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import { BookOpen, ArrowLeft, Loader2 } from 'lucide-react';

const SubjectsEdit = () => {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const subjectId = segments[1];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    course_id: '',
    teacher_id: '',
    school_id: '',
    hours_per_week: '',
    status: 'active',
  });
  const [schools, setSchools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const [subjectRes, coursesRes, teachersRes, schoolsRes] = await Promise.all([
        fetch(`/api/subjects/${subjectId}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        }),
        fetch('/api/courses', { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }),
        fetch('/api/users?role=teacher', { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }),
        fetch('/api/schools', { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }),
      ]);

      const [subjectData, coursesData, teachersData, schoolsData] = await Promise.all([
        subjectRes.json(),
        coursesRes.json(),
        teachersRes.json(),
        schoolsRes.json(),
      ]);

      if (subjectRes.ok && subjectData.success) {
        const subject = subjectData.data;
        setFormData({
          name: subject.name || '',
          description: subject.description || '',
          course_id: subject.course_id?.toString() || '',
          teacher_id: subject.teacher_id?.toString() || '',
          school_id: subject.school_id?.toString() || '',
          hours_per_week: subject.hours_per_week?.toString() || '',
          status: subject.status || 'active',
        });
      } else {
        throw new Error(subjectData.message || 'No se pudo cargar la asignatura');
      }

      if (coursesRes.ok && coursesData.success) setCourses(coursesData.data.data || []);
      if (teachersRes.ok && teachersData.success) setTeachers(teachersData.data.data || []);
      if (schoolsRes.ok && schoolsData.success) setSchools(schoolsData.data.data || []);
    } catch (error) {
      console.error('Error loading subject', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`/api/subjects/${subjectId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          hours_per_week: parseInt(formData.hours_per_week, 10),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message || 'No se pudo actualizar la asignatura');
      }

      router.visit('/subjects');
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
        <Button variant="outline" size="sm" onClick={() => router.visit('/subjects')} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center mt-4">
          <BookOpen className="w-6 h-6 mr-2" />
          Editar Asignatura
        </h1>
      </div>

      <div className="max-w-2xl">
        <Card>
          <Card.Header>
            <Card.Title>Datos de la Asignatura</Card.Title>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                <Input name="name" value={formData.name} onChange={handleChange} className={errors.name ? 'border-red-500' : ''} required />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Curso *</label>
                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.course_id ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Seleccionar curso</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name} - {course.academic_year}
                      </option>
                    ))}
                  </select>
                  {errors.course_id && <p className="text-red-500 text-sm mt-1">{errors.course_id[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profesor *</label>
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horas por semana *</label>
                  <Input
                    type="number"
                    name="hours_per_week"
                    value={formData.hours_per_week}
                    onChange={handleChange}
                    className={errors.hours_per_week ? 'border-red-500' : ''}
                    required
                  />
                  {errors.hours_per_week && <p className="text-red-500 text-sm mt-1">{errors.hours_per_week[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                  {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Colegio *</label>
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
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={() => router.visit('/subjects')} disabled={saving}>
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
                      <BookOpen className="w-4 h-4 mr-2" />
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

export default SubjectsEdit;

