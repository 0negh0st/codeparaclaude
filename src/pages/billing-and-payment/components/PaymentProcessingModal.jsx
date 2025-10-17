import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const PaymentProcessingModal = ({ isOpen, onClose, paymentData }) => {
  const navigate = useNavigate();
  const [processingStage, setProcessingStage] = useState('validating');
  const [progress, setProgress] = useState(0);

  const stages = [
    { id: 'validating', label: 'Validando información de pago...', duration: 2000 },
    { id: 'authorizing', label: 'Autorizando transacción...', duration: 3000 },
    { id: 'processing', label: 'Procesando pago...', duration: 2500 },
    { id: 'finalizing', label: 'Finalizando reserva...', duration: 1500 }
  ];

  useEffect(() => {
    if (!isOpen) return;

    let currentStageIndex = 0;
    let progressInterval;
    let stageTimeout;

    const processNextStage = () => {
      if (currentStageIndex < stages?.length) {
        const currentStage = stages?.[currentStageIndex];
        setProcessingStage(currentStage?.id);
        setProgress(0);

        // Animate progress bar
        progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + (100 / (currentStage?.duration / 100));
          });
        }, 100);

        // Move to next stage
        stageTimeout = setTimeout(() => {
          clearInterval(progressInterval);
          currentStageIndex++;
          if (currentStageIndex < stages?.length) {
            processNextStage();
          } else {
            // Processing complete - redirect to fraud revelation
            setTimeout(() => {
              navigate('/fraud-revelation');
            }, 1000);
          }
        }, currentStage?.duration);
      }
    };

    processNextStage();

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stageTimeout);
    };
  }, [isOpen, navigate]);

  const getCurrentStageLabel = () => {
    const stage = stages?.find(s => s?.id === processingStage);
    return stage ? stage?.label : 'Procesando...';
  };

  const getStageIcon = () => {
    switch (processingStage) {
      case 'validating':
        return 'CheckCircle';
      case 'authorizing':
        return 'Shield';
      case 'processing':
        return 'CreditCard';
      case 'finalizing':
        return 'Package';
      default:
        return 'Loader';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name={getStageIcon()} size={32} className="text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Procesando Pago</h2>
          <p className="text-sm text-gray-600">Por favor espere mientras procesamos su transacción</p>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          {/* Current Stage */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 mb-2">{getCurrentStageLabel()}</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-between items-center">
            {stages?.map((stage, index) => {
              const currentIndex = stages?.findIndex(s => s?.id === processingStage);
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              
              return (
                <div key={stage?.id} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-primary text-white' :'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs text-gray-500 mt-1 text-center max-w-16">
                    {stage?.id === 'validating' ? 'Validar' :
                     stage?.id === 'authorizing' ? 'Autorizar' :
                     stage?.id === 'processing' ? 'Procesar' : 'Finalizar'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-green-600" />
            <p className="text-sm text-green-800">
              <span className="font-medium">Transacción Segura:</span> Sus datos están protegidos
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Monto a procesar:</span>
            <span className="font-semibold text-gray-900">
              {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
              })?.format(paymentData?.total || 343000)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-gray-600">Tarjeta terminada en:</span>
            <span className="font-medium text-gray-900">
              ****{paymentData?.cardNumber?.slice(-4) || '1234'}
            </span>
          </div>
        </div>

        {/* Warning - Do not close */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5" />
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Importante:</span> No cierre esta ventana ni actualice la página durante el procesamiento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingModal;