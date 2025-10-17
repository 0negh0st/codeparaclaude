import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { adminService } from '../../../services/adminService';

const SessionControls = ({ 
  session, 
  onAction, 
  onGuidance, 
  className = "",
  isMobile = false 
}) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showGuidancePanel, setShowGuidancePanel] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [actionResult, setActionResult] = useState(null);

  const handleSessionAction = async (action) => {
    try {
      setIsActionLoading(true);
      setActionResult(null);

      let result;
      switch (action) {
        case 'analyze':
          result = await adminService?.analyzeSessionIntelligence?.(session?.sessionId);
          break;
        case 'guidance':
          result = await adminService?.triggerIntelligentGuidance?.(session?.sessionId);
          break;
        case 'restart':
          result = await adminService?.restartClientSession?.(session?.sessionId);
          break;
        case 'nudge':
          result = await adminService?.nudgeClientToNextStep?.(session?.sessionId);
          break;
        case 'alerts':
          result = await adminService?.checkSessionAlerts?.(session?.sessionId);
          break;
        default:
          throw new Error('Acción no reconocida');
      }

      if (result?.error) {
        throw new Error(result.error.message || 'Error en la acción');
      }

      setActionResult({
        type: 'success',
        action,
        data: result?.data,
        message: `✅ ${action?.toUpperCase()} ejecutado exitosamente`
      });

      if (onAction) {
        onAction(action, session, result?.data);
      }
    } catch (error) {
      console.error(`Error in ${action}:`, error);
      setActionResult({
        type: 'error',
        action,
        message: `❌ Error: ${error?.message}`
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSendCustomGuidance = async () => {
    if (!customMessage?.trim()) return;

    try {
      setIsActionLoading(true);
      let result = await adminService?.sendGuidanceToClient?.(
        session?.sessionId, 
        customMessage, 
        'show_message'
      );

      if (result?.error) {
        throw new Error(result.error.message || 'Error enviando mensaje');
      }

      setActionResult({
        type: 'success',
        action: 'custom_guidance',
        data: result?.data,
        message: '✅ Mensaje enviado al cliente'
      });

      setCustomMessage('');
      setShowGuidancePanel(false);

      if (onGuidance) {
        onGuidance(session, customMessage, result?.data);
      }
    } catch (error) {
      console.error('Error sending custom guidance:', error);
      setActionResult({
        type: 'error',
        action: 'custom_guidance',
        message: `❌ Error: ${error?.message}`
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const getSessionStatusColor = () => {
    if (!session?.isActive) return 'text-red-500';
    if (session?.isRecentlyActive) return 'text-green-500';
    return 'text-yellow-500';
  };

  const getSessionPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Session Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <div className={`w-3 h-3 rounded-full ${getSessionStatusColor()}`} />
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {session?.clientId || 'Cliente'}
          </h3>
          {session?.sessionPriority && session?.sessionPriority !== 'normal' && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSessionPriorityColor(session?.sessionPriority)}`}>
              {session?.sessionPriority?.toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Icon name="Clock" size={14} className="mr-1" />
          <span>
            Paso {session?.stepNumber || 1}/{session?.totalSteps || 6}
          </span>
        </div>
      </div>
      {/* Session Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
        <div>
          <div className="text-gray-500">Progreso</div>
          <div className="font-medium">{session?.progress || 0}%</div>
        </div>
        <div>
          <div className="text-gray-500">Calidad</div>
          <div className="font-medium">{session?.sessionQualityScore || 'N/A'}</div>
        </div>
        <div>
          <div className="text-gray-500">Predicción</div>
          <div className="font-medium">
            {session?.completionPrediction ? `${Math.round(session?.completionPrediction * 100)}%` : 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Último Activo</div>
          <div className="font-medium">
            {session?.lastActivity ? new Date(session.lastActivity)?.toLocaleTimeString('es-CO', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : 'N/A'}
          </div>
        </div>
      </div>
      {/* Action Result Display */}
      {actionResult && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          actionResult?.type === 'success' ?'bg-green-50 text-green-800 border border-green-200' :'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="font-medium">{actionResult?.message}</div>
          {actionResult?.data && typeof actionResult?.data === 'object' && (
            <pre className="mt-2 text-xs overflow-auto max-h-20">
              {JSON.stringify(actionResult?.data, null, 2)}
            </pre>
          )}
        </div>
      )}
      {/* Control Buttons */}
      <div className="space-y-3">
        {/* Primary Actions Row */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSessionAction('analyze')}
            disabled={isActionLoading}
            className="flex items-center"
          >
            <Icon name="Search" size={14} className="mr-1" />
            {isActionLoading ? 'Analizando...' : 'Analizar'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSessionAction('guidance')}
            disabled={isActionLoading}
            className="flex items-center"
          >
            <Icon name="Lightbulb" size={14} className="mr-1" />
            {isActionLoading ? 'Enviando...' : 'Guía IA'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSessionAction('alerts')}
            disabled={isActionLoading}
            className="flex items-center"
          >
            <Icon name="AlertTriangle" size={14} className="mr-1" />
            Alertas
          </Button>
        </div>

        {/* Secondary Actions Row */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleSessionAction('restart')}
            disabled={isActionLoading}
            className="flex items-center"
          >
            <Icon name="RotateCcw" size={14} className="mr-1" />
            Reiniciar
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSessionAction('nudge')}
            disabled={isActionLoading}
            className="flex items-center"
          >
            <Icon name="ArrowRight" size={14} className="mr-1" />
            Siguiente Paso
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowGuidancePanel(!showGuidancePanel)}
            disabled={isActionLoading}
            className="flex items-center"
          >
            <Icon name="MessageSquare" size={14} className="mr-1" />
            Mensaje
          </Button>
        </div>
      </div>
      {/* Custom Guidance Panel */}
      {showGuidancePanel && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Mensaje Personalizado al Cliente</h4>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e?.target?.value)}
            placeholder="Escribe un mensaje personalizado para guiar al cliente..."
            className="w-full p-2 text-sm border border-gray-300 rounded-lg resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {customMessage?.length}/500 caracteres
            </span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowGuidancePanel(false);
                  setCustomMessage('');
                }}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSendCustomGuidance}
                disabled={isActionLoading || !customMessage?.trim()}
              >
                {isActionLoading ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Behavioral Flags Display */}
      {session?.behavioralFlags && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Indicadores de Comportamiento</h4>
          <div className="flex flex-wrap gap-1">
            {Object.entries(session?.behavioralFlags)?.map(([flag, value]) => (
              value && (
                <span 
                  key={flag}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {flag?.replace(/_/g, ' ')}
                </span>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionControls;