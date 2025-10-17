import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Activity, User, Eye, Download, Settings, AlertTriangle, Clock } from 'lucide-react';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadActivities = async () => {
    try {
      const { data, error } = await adminService?.getActivitiesFeed(50);
      if (error) {
        setError(error?.message);
      } else {
        setActivities(data || []);
      }
    } catch (err) {
      setError('Error loading activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
    
    // Refresh activities every minute
    const interval = setInterval(loadActivities, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Justo ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
    
    return date?.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'session_monitoring':
        return <Eye className="h-4 w-4" />;
      case 'data_export':
        return <Download className="h-4 w-4" />;
      case 'user_management':
        return <User className="h-4 w-4" />;
      case 'system_config':
        return <Settings className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (activityType) => {
    switch (activityType) {
      case 'session_monitoring':
        return 'text-blue-600 bg-blue-50';
      case 'data_export':
        return 'text-green-600 bg-green-50';
      case 'user_management':
        return 'text-purple-600 bg-purple-50';
      case 'system_config':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getActivityTypeLabel = (activityType) => {
    const labels = {
      session_monitoring: 'Monitoreo de Sesión',
      data_export: 'Exportación de Datos',
      user_management: 'Gestión de Usuarios',
      system_config: 'Configuración del Sistema'
    };
    return labels?.[activityType] || activityType;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(8)]?.map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-gray-600" />
          Registro de Actividades
        </h3>
      </div>
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
      <div className="p-6">
        {activities?.length > 0 ? (
          <div className="flow-root">
            <ul className="-mb-8">
              {activities?.map((activity, activityIdx) => (
                <li key={activity?.id}>
                  <div className="relative pb-8">
                    {activityIdx !== activities?.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex items-start space-x-3">
                      <div className={`relative px-1`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getActivityColor(activity?.activity_type)}`}>
                          {getActivityIcon(activity?.activity_type)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">
                              {activity?.admin?.full_name || 'Admin Usuario'}
                            </span>
                            <span className="text-gray-500 ml-1">
                              realizó {getActivityTypeLabel(activity?.activity_type)?.toLowerCase()}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimestamp(activity?.created_at)}
                          </p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>{activity?.description}</p>
                          {activity?.metadata && Object.keys(activity?.metadata)?.length > 0 && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-md">
                              <details className="text-xs">
                                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                                  Ver detalles
                                </summary>
                                <div className="mt-2 space-y-1">
                                  {Object.entries(activity?.metadata)?.map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="font-medium">{key}:</span>
                                      <span className="text-gray-600">
                                        {typeof value === 'object' ? JSON.stringify(value) : value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay actividades registradas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;