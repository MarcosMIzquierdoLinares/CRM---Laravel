import React from 'react';
import { usePage, router } from '@inertiajs/react';
import { LogOut, User, BarChart3 } from 'lucide-react';
import NotificationBell from '../Notifications/NotificationBell';

const Header = () => {
  const { auth } = usePage().props;
  const user = auth?.user || JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar todo el localStorage
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      
      // Redirigir al login
      router.visit('/');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Home</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">
          {user?.school?.full_name || 'Sistema CRM'}
        </span>
      </div>

      {/* User menu */}
      <div className="flex items-center space-x-4">
        {user?.roles?.includes('admin') && (
          <button
            className="flex items-center px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => router.visit('/statistics')}
          >
            <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
            Estadísticas
          </button>
        )}

        <NotificationBell />

        {/* Usuario */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name} {user?.surname}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.roles?.[0]}</p>
          </div>
          
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <User size={16} className="text-gray-600" />
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name} {user?.surname}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
