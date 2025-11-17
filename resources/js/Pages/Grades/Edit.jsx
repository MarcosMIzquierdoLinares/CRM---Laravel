import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import { Award, ArrowLeft, Loader2 } from 'lucide-react';

const GradesEdit = () => {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const gradeId = segments[1];

  const [formData, setFormData] = useState({
    user_id: '',
    subject_id: '',
    school_id: '',
    evaluation: 1,
    grade: '',
    comments: '',
    grade_date: '',
  });
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const [gradeRes, studentsRes, subjectsRes, schoolsRes] = await Promise.all([
        fetch(`/api/grades/${gradeId}`, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }),
        fetch('/api/users?role=student', { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }),
        fetch('/api/subjects', { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }),
        fetch('/api/schools', { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }),
      ]);

      const [gradeData, studentsData, subjectsData, schoolsData] = await Promise.all([
        gradeRes.json(),
        studentsRes.json(),
        subjectsRes.json(),
        schoolsRes.json(),
      ]);

      if (gradeRes.ok && gradeData.success) {
        const grade = gradeData.data;
        setFormData({
          user_id: grade.user_id?.toString() || '',
          subject_id: grade.subject_id?.toString() || '',
          school_id: grade.school_id?.toString() || '',
          evaluation: grade.evaluation?.toString() || '1',
          grade: grade.grade?.toString() || '',
          comments: grade.comments || '',
          grade_date: grade.grade_date || new Date().toISOString().split('T')[0],
        });
      } else {
        throw new Error(gradeData.message || 'No se pudo cargar la calificación');
      }

      if (studentsRes.ok && studentsData.success) setStudents(studentsData.data.data || []);
      if (subjectsRes.ok && subjectsData.success) setSubjects(subjectsData.data.data || []);
      if (schoolsRes.ok && schoolsData.success) setSchools(schoolsData.data.data || []);
    } catch (error) {
      console.error('Error loading grade', error);
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
      const response = await fetch(`/api/grades/${gradeId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          grade: parseFloat(formData.grade),
          evaluation: parseInt(formData.evaluation, 10),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message || 'No se pudo actualizar la calificación');
      }

      router.visit('/grades');
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
        <Button variant="outline" size="sm" onClick={() => router.visit('/grades')} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center mt-4">
          <Award className="w-6 h-6 mr-2" />
          Editar Calificación
        </h1>
      </div>

      <div className="max-w-2xl">
        <Card>
          <Card.Header>
            <Card.Title>Datos de la Calificación</Card.Title>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estudiante *</label>
                  <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.user_id ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Seleccionar estudiante</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} {student.surname}
                      </option>
                    ))}
                  </select>
                  {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asignatura *</label>
                  <select
                    name="subject_id"
                    value={formData.subject_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.subject_id ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Seleccionar asignatura</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  {errors.subject_id && <p className="text-red-500 text-sm mt-1">{errors.subject_id[0]}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calificación *</label>
                  <Input
                    type="number"
                    name="grade"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.grade}
                    onChange={handleChange}
                    className={errors.grade ? 'border-red-500' : ''}
                    required
                  />
                  {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evaluación *</label>
                  <select
                    name="evaluation"
                    value={formData.evaluation}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.evaluation ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="1">1ª Evaluación</option>
                    <option value="2">2ª Evaluación</option>
                    <option value="3">3ª Evaluación</option>
                  </select>
                  {errors.evaluation && <p className="text-red-500 text-sm mt-1">{errors.evaluation[0]}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
                  <Input type="date" name="grade_date" value={formData.grade_date} onChange={handleChange} className={errors.grade_date ? 'border-red-500' : ''} required />
                  {errors.grade_date && <p className="text-red-500 text-sm mt-1">{errors.grade_date[0]}</p>}
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.comments ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.comments && <p className="text-red-500 text-sm mt-1">{errors.comments[0]}</p>}
              </div>
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={() => router.visit('/grades')} disabled={saving}>
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
                      <Award className="w-4 h-4 mr-2" />
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

export default GradesEdit;

