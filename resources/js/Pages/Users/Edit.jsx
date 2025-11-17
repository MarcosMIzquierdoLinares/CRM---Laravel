import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../../Components/Layout/Layout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import { UserCog, ArrowLeft, Loader2 } from 'lucide-react';

const UsersEdit = () => {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const userId = segments[1];

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    name_user: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    school_id: '',
    role: '',
  });
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const [userResponse, schoolsResponse] = await Promise.all([
        fetch(`/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('/api/schools', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      ]);

      const userData = await userResponse.json();
      const schoolsData = await schoolsResponse.json();

      if (userResponse.ok && userData.success) {
        const user = userData.data;
        setFormData({
          name: user.name || '',
          surname: user.surname || '',
          name_user: user.name_user || '',
          email: user.email || '',
          phone: user.phone || '',
          password: '',
          password_confirmation: '',
          school_id: user.school_id?.toString() || '',
          role: user.roles?.[0] || 'student',
        });
      } else {
        throw new Error(userData.message || 'No se pudo cargar el usuario');
      }

      if (schoolsResponse.ok && schoolsData.success) {
        setSchools(schoolsData.data.data || []);
      }
    } catch (error) {
      console.error('Error loading data', error);
      alert(error.message || 'No se pudo cargar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.message || 'No se pudo actualizar el usuario');
      }

      router.visit('/users');
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
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="outline" size="sm" onClick={() => router.visit('/users')} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <UserCog className="w-6 h-6 mr-2" />
          Editar Usuario
        </h1>
        <p className="text-gray-600">Actualiza los datos del usuario seleccionado</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <Card.Header>
            <Card.Title>Información del Usuario</Card.Title>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'border-red-500' : ''}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                  <Input
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className={errors.surname ? 'border-red-500' : ''}
                    required
                  />
                  {errors.surname && <p className="text-red-500 text-sm mt-1">{errors.surname[0]}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usuario *</label>
                  <Input
                    name="name_user"
                    value={formData.name_user}
                    onChange={handleChange}
                    className={errors.name_user ? 'border-red-500' : ''}
                    required
                  />
                  {errors.name_user && <p className="text-red-500 text-sm mt-1">{errors.name_user[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'border-red-500' : ''}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <Input name="phone" value={formData.phone} onChange={handleChange} />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Déjalo vacío para mantenerla"
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
                  <Input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={errors.password_confirmation ? 'border-red-500' : ''}
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation[0]}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Colegio *</label>
                  <select
                    name="school_id"
                    value={formData.school_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.school_id ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
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
                    {currentUser.permissions?.includes('manage roles') && <option value="admin">Administrador</option>}
                  </select>
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={() => router.visit('/users')} disabled={saving}>
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
                      <UserCog className="w-4 h-4 mr-2" />
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

export default UsersEdit;

