import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Home, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Building2,
  FileText,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  // Obtener usuario desde localStorage ya que usamos JWT
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { name: 'Home', path: '/home', icon: Home, permission: null },
    { name: 'Usuarios', path: '/users', icon: Users, permission: 'view users' },
    { name: 'Cursos', path: '/courses', icon: GraduationCap, permission: 'view courses' },
    { name: 'Asignaturas', path: '/subjects', icon: BookOpen, permission: 'view subjects' },
    { name: 'Calificaciones', path: '/grades', icon: Award, permission: 'view grades' },
    { name: '📝 Mis Reportes', path: '/reports/create', icon: FileText, permission: 'create reports' },
    { name: '📋 Ver Reportes', path: '/reports', icon: FileText, permission: 'view reports' },
    { name: 'Colegios', path: '/schools', icon: Building2, permission: 'view schools' },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.permission) return true;
    return user?.permissions?.includes(item.permission);
  });

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header del sidebar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-sm">CRM</span>
            </div>
            <div>
              <h1 className="font-bold text-sm">CRM</h1>
              <p className="text-xs text-gray-400 truncate max-w-32">
                {user?.school?.name || user?.school?.full_name || 'Sistema'}
              </p>
            </div>
          </div>
        )}
        
        {collapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <span className="font-bold text-sm">CRM</span>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-800 rounded"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Menú de navegación */}
      <nav className="mt-4">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${
                window.location.pathname === item.path ? 'bg-gray-800 border-r-2 border-blue-500' : ''
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="ml-3 text-sm">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.roles?.[0]}</p>
            </div>
          </div>
        )}
        
        {collapsed && (
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
