import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';


const PaymentMethodForm = ({ formData, onFormChange, errors = {} }) => {
  const [localData, setLocalData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardType: '',
    ...formData
  });

  const [showCvvHelp, setShowCvvHelp] = useState(false);

  const months = [
    { value: '01', label: '01 - Enero' },
    { value: '02', label: '02 - Febrero' },
    { value: '03', label: '03 - Marzo' },
    { value: '04', label: '04 - Abril' },
    { value: '05', label: '05 - Mayo' },
    { value: '06', label: '06 - Junio' },
    { value: '07', label: '07 - Julio' },
    { value: '08', label: '08 - Agosto' },
    { value: '09', label: '09 - Septiembre' },
    { value: '10', label: '10 - Octubre' },
    { value: '11', label: '11 - Noviembre' },
    { value: '12', label: '12 - Diciembre' }
  ];

  const years = [];
  const currentYear = new Date()?.getFullYear();
  for (let i = 0; i < 15; i++) {
    const year = currentYear + i;
    years?.push({ value: year?.toString(), label: year?.toString() });
  }

  const detectCardType = (number) => {
    const cleanNumber = number?.replace(/\s/g, '');
    if (cleanNumber?.startsWith('4')) return 'visa';
    if (cleanNumber?.startsWith('5') || cleanNumber?.startsWith('2')) return 'mastercard';
    if (cleanNumber?.startsWith('3')) return 'amex';
    return '';
  };

  const formatCardNumber = (value) => {
    const cleanValue = value?.replace(/\s/g, '');
    const formatted = cleanValue?.replace(/(.{4})/g, '$1 ')?.trim();
    return formatted?.substring(0, 19);
  };

  const handleInputChange = (field, value) => {
    let processedValue = value;
    
    if (field === 'cardNumber') {
      processedValue = formatCardNumber(value);
      const cardType = detectCardType(processedValue);
      setLocalData(prev => ({ ...prev, cardType }));
    }
    
    if (field === 'cvv') {
      processedValue = value?.replace(/\D/g, '')?.substring(0, 4);
    }

    const updatedData = { ...localData, [field]: processedValue };
    setLocalData(updatedData);
    onFormChange(updatedData);
  };

  const getCardIcon = () => {
    switch (localData?.cardType) {
      case 'visa':
        return <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>;
      case 'mastercard':
        return <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>;
      case 'amex':
        return <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>;
      default:
        return <Icon name="CreditCard" size={20} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
          2
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Método de Pago</h2>
      </div>
      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={20} className="text-green-600" />
          <span className="text-sm text-gray-700 font-medium">Conexión Segura SSL</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Lock" size={20} className="text-green-600" />
          <span className="text-sm text-gray-700 font-medium">Datos Protegidos</span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Número de Tarjeta *"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={localData?.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e?.target?.value)}
            error={errors?.cardNumber}
            required
          />
          <div className="absolute right-3 top-9">
            {getCardIcon()}
          </div>
        </div>

        <Input
          label="Nombre del Titular *"
          type="text"
          placeholder="Como aparece en la tarjeta"
          value={localData?.cardHolder}
          onChange={(e) => handleInputChange('cardHolder', e?.target?.value?.toUpperCase())}
          error={errors?.cardHolder}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Mes de Vencimiento *"
            placeholder="Mes"
            options={months}
            value={localData?.expiryMonth}
            onChange={(value) => handleInputChange('expiryMonth', value)}
            error={errors?.expiryMonth}
            required
          />

          <Select
            label="Año de Vencimiento *"
            placeholder="Año"
            options={years}
            value={localData?.expiryYear}
            onChange={(value) => handleInputChange('expiryYear', value)}
            error={errors?.expiryYear}
            required
          />

          <div className="relative">
            <Input
              label="CVV *"
              type="text"
              placeholder="123"
              value={localData?.cvv}
              onChange={(e) => handleInputChange('cvv', e?.target?.value)}
              error={errors?.cvv}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              onMouseEnter={() => setShowCvvHelp(true)}
              onMouseLeave={() => setShowCvvHelp(false)}
            >
              <Icon name="HelpCircle" size={16} />
            </button>
            
            {showCvvHelp && (
              <div className="absolute right-0 top-16 z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                <p className="mb-2">El CVV es el código de seguridad de 3 o 4 dígitos:</p>
                <p>• Visa/MasterCard: 3 dígitos en el reverso</p>
                <p>• American Express: 4 dígitos en el frente</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Accepted Cards */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Tarjetas Aceptadas:</p>
        <div className="flex space-x-3">
          <div className="w-12 h-8 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
          <div className="w-12 h-8 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
          <div className="w-12 h-8 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
          <div className="w-12 h-8 bg-orange-600 rounded text-white text-xs flex items-center justify-center font-bold">DISC</div>
        </div>
      </div>
      {/* Security Notice */}
      <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={16} className="text-green-600 mt-0.5" />
          <p className="text-sm text-green-800">
            <span className="font-medium">Transacción Segura:</span> Sus datos están protegidos con encriptación SSL de 256 bits. No almacenamos información de tarjetas de crédito.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodForm;