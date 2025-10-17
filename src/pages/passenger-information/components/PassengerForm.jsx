import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PassengerForm = ({ onSubmit, onBack, passengerData = {}, setPassengerData, passengerNumber, totalPassengers, loading }) => {
  const [errors, setErrors] = useState({});

  // Colombian identification types
  const identificacionOptions = [
    { value: 'cedula', label: 'Cédula de Ciudadanía' },
    { value: 'cedula_extranjeria', label: 'Cédula de Extranjería' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'tarjeta_identidad', label: 'Tarjeta de Identidad' }
  ];

  // Gender options
  const generoOptions = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' },
    { value: 'otro', label: 'Otro' }
  ];

  // Country options (focused on Colombia and common destinations)
  const paisOptions = [
    { value: 'colombia', label: 'Colombia' },
    { value: 'venezuela', label: 'Venezuela' },
    { value: 'ecuador', label: 'Ecuador' },
    { value: 'peru', label: 'Perú' },
    { value: 'panama', label: 'Panamá' },
    { value: 'brasil', label: 'Brasil' },
    { value: 'argentina', label: 'Argentina' },
    { value: 'chile', label: 'Chile' },
    { value: 'mexico', label: 'México' },
    { value: 'estados_unidos', label: 'Estados Unidos' },
    { value: 'espana', label: 'España' }
  ];

  const handleInputChange = (field, value) => {
    // Ensure passengerData is always an object
    const currentData = passengerData || {};
    
    const updatedData = {
      ...currentData,
      [field]: value || '' // Ensure value is never undefined
    };
    
    // Call setPassengerData if it's provided
    if (setPassengerData && typeof setPassengerData === 'function') {
      setPassengerData(updatedData);
    }
    
    // Clear error when user starts typing
    if (errors && errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentData = passengerData || {};

    // Required field validation with safe string checks
    if (!currentData?.nombres || !currentData?.nombres?.toString()?.trim()) {
      newErrors.nombres = 'Los nombres son obligatorios';
    }
    if (!currentData?.apellidos || !currentData?.apellidos?.toString()?.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    }
    if (!currentData?.tipoIdentificacion) {
      newErrors.tipoIdentificacion = 'Seleccione el tipo de identificación';
    }
    if (!currentData?.numeroIdentificacion || !currentData?.numeroIdentificacion?.toString()?.trim()) {
      newErrors.numeroIdentificacion = 'El número de identificación es obligatorio';
    }
    if (!currentData?.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    }
    if (!currentData?.genero) {
      newErrors.genero = 'Seleccione el género';
    }
    if (!currentData?.email || !currentData?.email?.toString()?.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/?.test(currentData?.email?.toString())) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }
    if (!currentData?.telefono || !currentData?.telefono?.toString()?.trim()) {
      newErrors.telefono = 'El número de teléfono es obligatorio';
    }
    if (!currentData?.paisResidencia) {
      newErrors.paisResidencia = 'Seleccione el país de residencia';
    }

    // Emergency contact validation
    if (!currentData?.contactoEmergenciaNombre || !currentData?.contactoEmergenciaNombre?.toString()?.trim()) {
      newErrors.contactoEmergenciaNombre = 'El nombre del contacto de emergencia es obligatorio';
    }
    if (!currentData?.contactoEmergenciaTelefono || !currentData?.contactoEmergenciaTelefono?.toString()?.trim()) {
      newErrors.contactoEmergenciaTelefono = 'El teléfono del contacto de emergencia es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      // Pass the actual passenger data to the parent component
      const finalData = passengerData || {};
      console.log('Submitting passenger data:', finalData);
      
      if (onSubmit && typeof onSubmit === 'function') {
        onSubmit(finalData);
      }
    }
  };

  // Safe value access with fallbacks
  const getFieldValue = (fieldName) => {
    return passengerData && passengerData?.[fieldName] !== undefined ? passengerData?.[fieldName] : '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* JetSmart-inspired Progress Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl mb-0">
        <h2 className="text-2xl font-bold mb-2">Información del Pasajero</h2>
        <p className="text-orange-100">
          Pasajero {passengerNumber} de {totalPassengers} • Completa tus datos para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-b-2xl border border-gray-100">
        {/* Personal Information Section - JetSmart Style */}
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-l-4 border-orange-500 pl-4">
            <Icon name="User" size={24} className="mr-3 text-orange-500" />
            Datos Personales
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Nombres *"
              type="text"
              placeholder="Ingrese sus nombres completos"
              value={getFieldValue('nombres')}
              onChange={(e) => handleInputChange('nombres', e?.target?.value)}
              error={errors?.nombres}
              required
              className="focus:border-orange-500 focus:ring-orange-500"
            />
            
            <Input
              label="Apellidos *"
              type="text"
              placeholder="Ingrese sus apellidos completos"
              value={getFieldValue('apellidos')}
              onChange={(e) => handleInputChange('apellidos', e?.target?.value)}
              error={errors?.apellidos}
              required
              className="focus:border-orange-500 focus:ring-orange-500"
            />
            
            <Select
              label="Tipo de Identificación *"
              options={identificacionOptions}
              value={getFieldValue('tipoIdentificacion')}
              onChange={(value) => handleInputChange('tipoIdentificacion', value)}
              error={errors?.tipoIdentificacion}
              placeholder="Seleccione tipo de documento"
              description=""
              required
              className="focus:border-orange-500 focus:ring-orange-500"
            />
            
            <Input
              label="Número de Identificación *"
              type="text"
              placeholder="Ej: 1234567890"
              value={getFieldValue('numeroIdentificacion')}
              onChange={(e) => handleInputChange('numeroIdentificacion', e?.target?.value)}
              error={errors?.numeroIdentificacion}
              required
              className="focus:border-orange-500 focus:ring-orange-500"
            />
            
            <Input
              label="Fecha de Nacimiento *"
              type="date"
              value={getFieldValue('fechaNacimiento')}
              onChange={(e) => handleInputChange('fechaNacimiento', e?.target?.value)}
              error={errors?.fechaNacimiento}
              required
              className="focus:border-orange-500 focus:ring-orange-500"
            />
            
            <Select
              label="Género *"
              options={generoOptions}
              value={getFieldValue('genero')}
              onChange={(value) => handleInputChange('genero', value)}
              error={errors?.genero}
              placeholder="Seleccione género"
              description=""
              required
              className="focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Contact Information Section - Updated JetSmart Style */}
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-l-4 border-orange-500 pl-4">
            <Icon name="Phone" size={24} className="mr-3 text-orange-500" />
            Datos de Contacto
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Correo Electrónico *"
              type="email"
              placeholder="ejemplo@correo.com"
              value={getFieldValue('email')}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              description="Recibirás la confirmación de tu vuelo aquí"
              required
              className="focus:border-orange-500 focus:ring-orange-500"
            />
            
            <Input
              label="Número de Teléfono *"
              type="tel"
              placeholder="+57 300 123 4567"
              value={getFieldValue('telefono')}
              onChange={(e) => handleInputChange('telefono', e?.target?.value)}
              error={errors?.telefono}
              required
              className="focus:border-orange-500 focus:ring-orange-500"
            />
            
            <Select
              label="País de Residencia *"
              options={paisOptions}
              value={getFieldValue('paisResidencia')}
              onChange={(value) => handleInputChange('paisResidencia', value)}
              error={errors?.paisResidencia}
              placeholder="Seleccione país"
              description=""
              searchable
              required
              className="focus:border-orange-500 focus:ring-orange-500"
            />
            
            <Input
              label="Dirección de Residencia"
              type="text"
              placeholder="Calle 123 #45-67, Barrio Centro"
              value={getFieldValue('direccion')}
              onChange={(e) => handleInputChange('direccion', e?.target?.value)}
              className="focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Emergency Contact Section - JetSmart Style */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-l-4 border-orange-500 pl-4">
            <Icon name="AlertCircle" size={24} className="mr-3 text-orange-500" />
            Contacto de Emergencia
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Nombre Completo *"
              type="text"
              placeholder="Nombre del contacto de emergencia"
              value={getFieldValue('contactoEmergenciaNombre')}
              onChange={(e) => handleInputChange('contactoEmergenciaNombre', e?.target?.value)}
              error={errors?.contactoEmergenciaNombre}
              required
              className="focus:border-orange-500 focus:ring-orange-500"
            />
            
            <Input
              label="Número de Teléfono *"
              type="tel"
              placeholder="+57 300 123 4567"
              value={getFieldValue('contactoEmergenciaTelefono')}
              onChange={(e) => handleInputChange('contactoEmergenciaTelefono', e?.target?.value)}
              error={errors?.contactoEmergenciaTelefono}
              required
              className="focus:border-orange-500 focus:ring-orange-500"
            />
            
            <Input
              label="Relación"
              type="text"
              placeholder="Ej: Madre, Esposo/a, Hermano/a"
              value={getFieldValue('contactoEmergenciaRelacion')}
              onChange={(e) => handleInputChange('contactoEmergenciaRelacion', e?.target?.value)}
              className="focus:border-orange-500 focus:ring-orange-500"
            />
            
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="contacto@correo.com"
              value={getFieldValue('contactoEmergenciaEmail')}
              onChange={(e) => handleInputChange('contactoEmergenciaEmail', e?.target?.value)}
              className="focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Form Actions - JetSmart Style */}
        <div className="bg-gray-50 px-8 py-6 rounded-b-2xl flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            iconName="ArrowLeft"
            iconPosition="left"
            className="sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
            disabled={loading}
          >
            Regresar
          </Button>
          
          <Button
            type="submit"
            variant="default"
            iconName="ArrowRight"
            iconPosition="right"
            className="sm:ml-auto sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                {passengerNumber < totalPassengers ? 'Procesando...' : 'Finalizando...'}
              </>
            ) : (
              passengerNumber < totalPassengers ? 'Siguiente Pasajero' : 'Continuar al Pago'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PassengerForm;