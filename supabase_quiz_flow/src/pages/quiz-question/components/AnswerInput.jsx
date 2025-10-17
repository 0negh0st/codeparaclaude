import React from 'react';
import Input from '../../../components/ui/Input';

const AnswerInput = ({ 
  value, 
  onChange, 
  disabled = false, 
  error = '', 
  placeholder = 'Escribe tu respuesta aquí...',
  className = '' 
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <Input
        type="text"
        label="Tu respuesta"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e?.target?.value)}
        disabled={disabled}
        error={error}
        required
        className="text-center"
      />
      {!error && (
        <p className="text-xs text-slate-500 mt-2 text-center">
          Presiona Enter o haz clic en "Enviar Respuesta" para continuar
        </p>
      )}
    </div>
  );
};

export default AnswerInput;