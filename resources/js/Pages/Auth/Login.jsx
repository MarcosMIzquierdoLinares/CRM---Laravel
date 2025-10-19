import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Button from '../../Components/UI/Button';
import Input from '../../Components/UI/Input';
import Card from '../../Components/UI/Card';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('jwt_token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        router.visit('/home');
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Educativo</h1>
          <p className="text-gray-600">Inicia sesión en tu cuenta</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => router.visit('/api/register')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </Card>

        {/* Demo credentials */}
        <Card className="mt-6" padding="sm">
          <h3 className="font-medium text-gray-900 mb-3">🔑 Credenciales de prueba:</h3>
          <div className="text-sm space-y-2">
            <div className="p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="font-medium text-blue-900">👨‍💼 Administrador</p>
              <p className="text-blue-700">admin@iessanjuan.edu</p>
              <p className="text-blue-600 font-mono">password123</p>
            </div>
            
            <div className="p-2 bg-green-50 rounded-lg border-l-4 border-green-400">
              <p className="font-medium text-green-900">👩‍🏫 Coordinador</p>
              <p className="text-green-700">coordinador@test.com</p>
              <p className="text-green-600 font-mono">password123</p>
            </div>
            
            <div className="p-2 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <p className="font-medium text-purple-900">👨‍🏫 Profesor</p>
              <p className="text-purple-700">profesor@test.com</p>
              <p className="text-purple-600 font-mono">password123</p>
            </div>
            
            <div className="p-2 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <p className="font-medium text-orange-900">👨‍🎓 Estudiante</p>
              <p className="text-orange-700">estudiante@test.com</p>
              <p className="text-orange-600 font-mono">password123</p>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              💡 <strong>Nota:</strong> Todos los usuarios generados por el seeder tienen la contraseña <code>password123</code>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
