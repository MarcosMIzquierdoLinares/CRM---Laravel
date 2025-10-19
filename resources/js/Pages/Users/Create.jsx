import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import { UserPlus, ArrowLeft, Loader2 } from 'lucide-react';

const UsersCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    name_user: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    school_id: '',
    role: 'student'
  });

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [schoolsLoading, setSchoolsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchSchools();
  }, []);

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
        // Si el usuario no es admin, seleccionar automáticamente su escuela
        if (!user.permissions?.includes('view schools') && user.school_id) {
          setFormData(prev => ({ ...prev, school_id: user.school_id.toString() }));
        }
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setSchoolsLoading(false);
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
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Redirigir a la lista de usuarios
        router.visit('/users');
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message || 'Error al crear el usuario');
        }
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error al crear el usuario');
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
            onClick={() => router.visit('/users')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <UserPlus className="w-6 h-6 mr-2" />
          Crear Nuevo Usuario
        </h1>
        <p className="text-gray-600">Rellena los datos para crear un nuevo usuario</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <Card.Header>
            <Card.Title>Información del Usuario</Card.Title>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre del usuario"
                    className={errors.name ? 'border-red-500' : ''}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <Input
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Apellidos del usuario"
                    className={errors.surname ? 'border-red-500' : ''}
                    required
                  />
                  {errors.surname && (
                    <p className="text-red-500 text-sm mt-1">{errors.surname[0]}</p>
                  )}
                </div>
              </div>

              {/* Username y Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de usuario *
                  </label>
                  <Input
                    name="name_user"
                    value={formData.name_user}
                    onChange={handleChange}
                    placeholder="usuario123"
                    className={errors.name_user ? 'border-red-500' : ''}
                    required
                  />
                  {errors.name_user && (
                    <p className="text-red-500 text-sm mt-1">{errors.name_user[0]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="usuario@ejemplo.com"
                    className={errors.email ? 'border-red-500' : ''}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
                  )}
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+34 600 000 000"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>
                )}
              </div>

              {/* Contraseñas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    className={errors.password ? 'border-red-500' : ''}
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <Input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Repetir contraseña"
                    className={errors.password_confirmation ? 'border-red-500' : ''}
                    required
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation[0]}</p>
                  )}
                </div>
              </div>

              {/* Escuela y Rol */}
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
                    disabled={schoolsLoading}
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
                    Rol *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="student">Estudiante</option>
                    <option value="teacher">Profesor</option>
                    <option value="coordinator">Coordinador</option>
                    {user.permissions?.includes('manage roles') && (
                      <option value="admin">Administrador</option>
                    )}
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit('/users')}
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
                      <UserPlus className="w-4 h-4 mr-2" />
                      Crear Usuario
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

export default UsersCreate;
