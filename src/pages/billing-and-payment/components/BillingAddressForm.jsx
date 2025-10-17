import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BillingAddressForm = ({ formData, onFormChange, errors = {} }) => {
  const [localData, setLocalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    postalCode: '',
    ...formData
  });

  const colombianDepartments = [
    { value: 'antioquia', label: 'Antioquia' },
    { value: 'atlantico', label: 'Atlántico' },
    { value: 'bogota', label: 'Bogotá D.C.' },
    { value: 'bolivar', label: 'Bolívar' },
    { value: 'boyaca', label: 'Boyacá' },
    { value: 'caldas', label: 'Caldas' },
    { value: 'caqueta', label: 'Caquetá' },
    { value: 'cauca', label: 'Cauca' },
    { value: 'cesar', label: 'Cesar' },
    { value: 'cordoba', label: 'Córdoba' },
    { value: 'cundinamarca', label: 'Cundinamarca' },
    { value: 'huila', label: 'Huila' },
    { value: 'magdalena', label: 'Magdalena' },
    { value: 'meta', label: 'Meta' },
    { value: 'narino', label: 'Nariño' },
    { value: 'norte-santander', label: 'Norte de Santander' },
    { value: 'quindio', label: 'Quindío' },
    { value: 'risaralda', label: 'Risaralda' },
    { value: 'santander', label: 'Santander' },
    { value: 'sucre', label: 'Sucre' },
    { value: 'tolima', label: 'Tolima' },
    { value: 'valle', label: 'Valle del Cauca' }
  ];

  const handleInputChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onFormChange(updatedData);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
          1
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Información de Facturación</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombres *"
          type="text"
          placeholder="Ingrese sus nombres"
          value={localData?.firstName}
          onChange={(e) => handleInputChange('firstName', e?.target?.value)}
          error={errors?.firstName}
          required
        />

        <Input
          label="Apellidos *"
          type="text"
          placeholder="Ingrese sus apellidos"
          value={localData?.lastName}
          onChange={(e) => handleInputChange('lastName', e?.target?.value)}
          error={errors?.lastName}
          required
        />

        <Input
          label="Correo Electrónico *"
          type="email"
          placeholder="ejemplo@correo.com"
          value={localData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
          className="md:col-span-2"
        />

        <Input
          label="Teléfono *"
          type="tel"
          placeholder="+57 300 123 4567"
          value={localData?.phone}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          error={errors?.phone}
          required
        />

        <Input
          label="Dirección *"
          type="text"
          placeholder="Calle 123 # 45-67"
          value={localData?.address}
          onChange={(e) => handleInputChange('address', e?.target?.value)}
          error={errors?.address}
          required
          className="md:col-span-2"
        />

        <Input
          label="Ciudad *"
          type="text"
          placeholder="Bogotá"
          value={localData?.city}
          onChange={(e) => handleInputChange('city', e?.target?.value)}
          error={errors?.city}
          required
        />

        <Select
          label="Departamento *"
          placeholder="Seleccione departamento"
          options={colombianDepartments}
          value={localData?.department}
          onChange={(value) => handleInputChange('department', value)}
          error={errors?.department}
          required
        />

        <Input
          label="Código Postal"
          type="text"
          placeholder="110111"
          value={localData?.postalCode}
          onChange={(e) => handleInputChange('postalCode', e?.target?.value)}
          error={errors?.postalCode}
        />
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Importante:</span> La información de facturación debe coincidir con los datos del titular de la tarjeta de crédito.
        </p>
      </div>
    </div>
  );
};

export default BillingAddressForm;