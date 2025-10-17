import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field) => (e) => {
    const value = e?.target?.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData?.age) {
      newErrors.age = 'La edad es obligatoria';
    } else {
      const ageNum = parseInt(formData?.age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = 'Por favor ingresa una edad válida (1-120)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random()?.toString(36)?.substr(2, 9);
  };

  const getDeviceInfo = () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timestamp: new Date()?.toISOString()
    };
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate session creation with IP and device detection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const sessionId = generateSessionId();
      const deviceInfo = getDeviceInfo();
      
      // Mock session data
      const sessionData = {
        sessionId,
        name: formData?.name?.trim(),
        age: parseInt(formData?.age),
        deviceInfo,
        ipAddress: '192.168.1.100', // Mock IP
        createdAt: new Date()?.toISOString(),
        currentStep: 1,
        status: 'active',
        answers: [],
        lastActivity: new Date()?.toISOString()
      };
      
      // Store session in localStorage
      localStorage.setItem('quizSession', JSON.stringify(sessionData));
      localStorage.setItem('currentStep', '1');
      
      // Navigate to first question
      navigate('/quiz-question');
      
    } catch (error) {
      console.error('Error creating session:', error);
      setErrors({ submit: 'Error al crear la sesión. Por favor intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Información Básica
          </h2>
          <p className="text-sm text-slate-600">
            Solo necesitamos algunos datos para comenzar
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Nombre completo"
            type="text"
            placeholder="Ingresa tu nombre"
            value={formData?.name}
            onChange={handleInputChange('name')}
            error={errors?.name}
            required
            className="w-full"
          />

          <Input
            label="Edad"
            type="number"
            placeholder="Ingresa tu edad"
            value={formData?.age}
            onChange={handleInputChange('age')}
            error={errors?.age}
            min="1"
            max="120"
            required
            className="w-full"
          />
        </div>

        {errors?.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" size={16} className="text-red-600" />
              <span className="text-sm text-red-700">{errors?.submit}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          iconName="ArrowRight"
          iconPosition="right"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? 'Creando sesión...' : 'Comenzar Quiz'}
        </Button>

        <div className="text-center">
          <p className="text-xs text-slate-500">
            Al continuar, aceptas participar en este quiz interactivo
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;