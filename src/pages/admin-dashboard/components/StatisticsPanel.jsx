import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Users, AlertTriangle } from 'lucide-react';

const StatisticsPanel = () => {
  const [statistics, setStatistics] = useState([]);
  const [summary, setSummary] = useState({
    totalSessions: 0,
    completedSessions: 0,
    abandonedSessions: 0,
    averageCompletionTime: '0 min',
    highRiskParticipants: 0,
    dataPointsCaptured: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSessions, setActiveSessions] = useState(0);

  useEffect(() => {
    loadStatistics();
    loadActiveSessions();
    
    // Refresh statistics every 30 seconds
    const interval = setInterval(() => {
      loadActiveSessions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const { data, error } = await adminService?.getTrainingStatistics(7);
      if (error) {
        setError(error?.message);
      } else {
        setStatistics(data || []);
        calculateSummary(data || []);
      }
    } catch (err) {
      setError('Error loading statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadActiveSessions = async () => {
    try {
      const { count, error } = await adminService?.getActiveSessionsCount();
      if (!error) {
        setActiveSessions(count || 0);
      }
    } catch (err) {
      // Silently handle error for background refresh
    }
  };

  const calculateSummary = (data) => {
    const totals = data?.reduce((acc, stat) => ({
      totalSessions: acc?.totalSessions + stat?.total_sessions,
      completedSessions: acc?.completedSessions + stat?.completed_sessions,
      abandonedSessions: acc?.abandonedSessions + stat?.abandoned_sessions,
      highRiskParticipants: acc?.highRiskParticipants + stat?.high_risk_participants,
      dataPointsCaptured: acc?.dataPointsCaptured + stat?.data_points_captured
    }), {
      totalSessions: 0,
      completedSessions: 0,
      abandonedSessions: 0,
      highRiskParticipants: 0,
      dataPointsCaptured: 0
    });

    // Calculate average completion time
    const totalTime = data?.reduce((acc, stat) => {
      if (stat?.average_completion_time) {
        // Convert interval to minutes (simplified)
        const timeStr = stat?.average_completion_time;
        const minutes = parseInt(timeStr?.match(/(\d+) minutes?/)?.[1] || '0');
        return acc + minutes * stat?.completed_sessions;
      }
      return acc;
    }, 0);

    const avgTime = totals?.completedSessions > 0 
      ? Math.round(totalTime / totals?.completedSessions)
      : 0;

    setSummary({
      ...totals,
      averageCompletionTime: `${avgTime} min`
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {/* Simplified Key Metrics Cards - ONLY Active Sessions */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Sesiones Activas
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {activeSessions}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Summary Stats - REMOVED Datos Capturados */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen de Actividad (Últimos 7 días)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {summary?.totalSessions}
            </div>
            <div className="text-sm text-gray-500">
              Total de Sesiones
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {summary?.completedSessions}
            </div>
            <div className="text-sm text-gray-500">
              Sesiones Completadas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;