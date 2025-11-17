import React, { useEffect, useState } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCount(data.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNotifications(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      fetchNotifications();
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchNotifications();
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error updating notification', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchNotifications();
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notifications', error);
    }
  };

  return (
    <div className="relative">
      <button className="p-2 hover:bg-gray-100 rounded-full relative" onClick={toggleDropdown}>
        <Bell size={20} className="text-gray-600" />
        {count > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <p className="text-sm font-semibold text-gray-800">Notificaciones</p>
            <button className="text-xs text-blue-600 hover:underline" onClick={markAllAsRead}>
              Marcar todas
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">No tienes notificaciones</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b text-sm ${notification.read_at ? 'bg-white' : 'bg-blue-50'}`}
                >
                  <p className="font-semibold text-gray-900">{notification.title}</p>
                  <p className="text-gray-600">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{new Date(notification.created_at).toLocaleString('es-ES')}</span>
                    {!notification.read_at && (
                      <button
                        className="flex items-center text-blue-600"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Marcar leído
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

