import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import { FileText, ArrowLeft, Loader2, Send, Calendar, Users, AlertTriangle } from 'lucide-react';

const ReportsCreate = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({
    title: '',
    class_progress: '',
    student_participation: '',
    incidents: '',
    next_activities: '',
    date: new Date().toISOString().split('T')[0],
    priority: 'normal'
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || {});
        throw new Error(data.message || 'No se pudo enviar el reporte');
      }

      alert('Reporte enviado exitosamente al coordinador');
      router.visit('/reports');
    } catch (error) {
      console.error('Error sending report:', error);
      alert(error.message || 'Error al enviar el reporte');
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
            onClick={() => router.visit('/home')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Nuevo Reporte Diario
        </h1>
        <p className="text-gray-600">
          Envía un informe sobre el estado de tus clases al coordinador
        </p>
      </div>

      <div className="max-w-4xl">
        <Card>
          <Card.Header>
            <Card.Title>Formulario de Reporte</Card.Title>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Profesor:</strong> {user.name} | <strong>Centro:</strong> {user.school?.name || 'Sistema'}
              </p>
            </div>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Fecha y Título */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del Reporte *
                  </label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={errors.date ? 'border-red-500' : ''}
                    required
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date[0]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Reporte *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ej: Reporte de clase Matemáticas 2º ESO"
                    className={errors.title ? 'border-red-500' : ''}
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
                  )}
                </div>
              </div>

              {/* Progreso de la Clase */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Estado de las Clases y Progreso *
                </label>
                <textarea
                  name="class_progress"
                  value={formData.class_progress}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe los temas cubiertos, avance del programa, dificultades encontradas..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.class_progress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.class_progress && (
                  <p className="text-red-500 text-sm mt-1">{errors.class_progress[0]}</p>
                )}
              </div>

              {/* Participación Estudiantil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Participación y Comportamiento Estudiantil
                </label>
                <textarea
                  name="student_participation"
                  value={formData.student_participation}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Asistencia, participación, comportamiento, dudas principales de los estudiantes..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.student_participation ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.student_participation && (
                  <p className="text-red-500 text-sm mt-1">{errors.student_participation[0]}</p>
                )}
              </div>

              {/* Incidencias */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Incidencias y Situaciones Especiales
                </label>
                <textarea
                  name="incidents"
                  value={formData.incidents}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Problemas técnicos, faltas de material, situaciones de conducta, etc..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.incidents ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.incidents && (
                  <p className="text-red-500 text-sm mt-1">{errors.incidents[0]}</p>
                )}
              </div>

              {/* Próximas Actividades */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📋 Próximas Actividades y Planificación
                </label>
                <textarea
                  name="next_activities"
                  value={formData.next_activities}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Exámenes próximos, tareas pendientes, eventos importantes, cambios en la programación..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.next_activities ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.next_activities && (
                  <p className="text-red-500 text-sm mt-1">{errors.next_activities[0]}</p>
                )}
              </div>

              {/* Prioridad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad del Reporte
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.priority ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="low">Baja - Información rutinaria</option>
                  <option value="normal">Normal - Situación estándar</option>
                  <option value="high">Alta - Requiere atención</option>
                  <option value="urgent">Urgente - Situación crítica</option>
                </select>
                {errors.priority && (
                  <p className="text-red-500 text-sm mt-1">{errors.priority[0]}</p>
                )}
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit('/home')}
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
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Reporte
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

export default ReportsCreate;
