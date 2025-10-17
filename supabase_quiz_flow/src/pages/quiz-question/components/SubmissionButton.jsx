import React from 'react';
import Button from '../../../components/ui/Button';

const SubmissionButton = ({ 
  onSubmit, 
  disabled = false, 
  loading = false, 
  attemptCount = 0,
  className = '' 
}) => {
  const getButtonText = () => {
    if (loading) return 'Enviando...';
    if (attemptCount > 0) return `Reintentar (${attemptCount + 1})`;
    return 'Enviar Respuesta';
  };

  const getButtonVariant = () => {
    if (attemptCount > 0) return 'warning';
    return 'default';
  };

  return (
    <div className={`text-center ${className}`}>
      <Button
        variant={getButtonVariant()}
        size="lg"
        fullWidth
        onClick={onSubmit}
        disabled={disabled}
        loading={loading}
        iconName={attemptCount > 0 ? "RotateCcw" : "Send"}
        iconPosition="right"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {getButtonText()}
      </Button>
      
      {attemptCount > 0 && (
        <p className="text-xs text-amber-600 mt-2">
          Intento {attemptCount + 1} - Revisa tu respuesta cuidadosamente
        </p>
      )}
    </div>
  );
};

export default SubmissionButton;