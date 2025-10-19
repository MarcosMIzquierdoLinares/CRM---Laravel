import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import { Award, ArrowLeft, Loader2 } from 'lucide-react';

const GradesCreate = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    subject_id: '',
    school_id: '',
    evaluation: 1,
    grade: '',
    comments: '',
    grade_date: new Date().toISOString().split('T')[0]
  });

  const [schools, setSchools] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchSchools();
    fetchSubjects();
    fetchStudents();
  }, []);

  useEffect(() => {
    // Si el usuario no es admin, seleccionar automáticamente su escuela
    if (!user.permissions?.includes('view schools') && user.school_id) {
      setFormData(prev => ({ ...prev, school_id: user.school_id.toString() }));
    }
  }, [user]);

  // Filtrar asignaturas según el rol del usuario
  useEffect(() => {
    if (user.roles?.[0] === 'teacher' && subjects.length > 0) {
      // Si es profesor, filtrar solo sus asignaturas
      const userSubjects = subjects.filter(subject => subject.teacher_id === parseInt(user.id));
      setSubjects(userSubjects);
    }
  }, [subjects, user]);

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

  const fetchSubjects = async () => {
    try {
      setSubjectsLoading(true);
      const token = localStorage.getItem('jwt_token');
      
      const response = await fetch('/api/subjects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setSubjects(data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setSubjectsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
      const token = localStorage.getItem('jwt_token');
      
      const response = await fetch('/api/users?role=student', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setStudents(data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setStudentsLoading(false);
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
      
      const response = await fetch('/api/grades', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          grade: parseFloat(formData.grade),
          evaluation: parseInt(formData.evaluation)
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirigir a la lista de calificaciones
        router.visit('/grades');
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message || 'Error al crear la calificación');
        }
      }
    } catch (error) {
      console.error('Error creating grade:', error);
      alert('Error al crear la calificación');
    } finally {
      setLoading(false);
    }
  };

  const getEvaluationText = (evaluation) => {
    const evaluations = {
      1: '1ª Evaluación',
      2: '2ª Evaluación', 
      3: '3ª Evaluación'
    };
    return evaluations[evaluation] || evaluation;
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.visit('/grades')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Award className="w-6 h-6 mr-2" />
          Crear Nueva Calificación
        </h1>
        <p className="text-gray-600">Introduce la calificación para un estudiante</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <Card.Header>
            <Card.Title>Información de la Calificación</Card.Title>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Estudiante y Asignatura */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estudiante *
                  </label>
                  <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.user_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    disabled={studentsLoading}
                  >
                    <option value="">Seleccionar estudiante</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} {student.surname}
                      </option>
                    ))}
                  </select>
                  {errors.user_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.user_id[0]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asignatura *
                  </label>
                  <select
                    name="subject_id"
                    value={formData.subject_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.subject_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    disabled={subjectsLoading}
                  >
                    <option value="">Seleccionar asignatura</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  {errors.subject_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject_id[0]}</p>
                  )}
                </div>
              </div>

              {/* Calificación y Evaluación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calificación (0-10) *
                  </label>
                  <Input
                    type="number"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    placeholder="7.5"
                    min="0"
                    max="10"
                    step="0.1"
                    className={errors.grade ? 'border-red-500' : ''}
                    required
                  />
                  {errors.grade && (
                    <p className="text-red-500 text-sm mt-1">{errors.grade[0]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evaluación *
                  </label>
                  <select
                    name="evaluation"
                    value={formData.evaluation}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.evaluation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="1">1ª Evaluación</option>
                    <option value="2">2ª Evaluación</option>
                    <option value="3">3ª Evaluación</option>
                  </select>
                  {errors.evaluation && (
                    <p className="text-red-500 text-sm mt-1">{errors.evaluation[0]}</p>
                  )}
                </div>
              </div>

              {/* Fecha y Comentarios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de la Calificación *
                  </label>
                  <Input
                    type="date"
                    name="grade_date"
                    value={formData.grade_date}
                    onChange={handleChange}
                    className={errors.grade_date ? 'border-red-500' : ''}
                    required
                  />
                  {errors.grade_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.grade_date[0]}</p>
                  )}
                </div>
                
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
              </div>

              {/* Comentarios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Comentarios adicionales sobre la calificación..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.comments ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.comments && (
                  <p className="text-red-500 text-sm mt-1">{errors.comments[0]}</p>
                )}
              </div>

              {/* Información adicional para profesores */}
              {user.roles?.[0] === 'teacher' && (
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        <strong>Nota:</strong> Solo puedes calificar en las asignaturas donde eres el profesor responsable.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit('/grades')}
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
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 mr-2" />
                      Crear Calificación
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

export default GradesCreate;
