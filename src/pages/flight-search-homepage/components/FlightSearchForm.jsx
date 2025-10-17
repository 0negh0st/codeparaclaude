import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const FlightSearchForm = ({ onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('round-trip');
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0
  });

  // Colombian cities for dropdown options
  const colombianCities = [
    { value: 'BOG', label: 'Bogotá (BOG)' },
    { value: 'MDE', label: 'Medellín (MDE)' },
    { value: 'CLO', label: 'Cali (CLO)' },
    { value: 'BAQ', label: 'Barranquilla (BAQ)' },
    { value: 'CTG', label: 'Cartagena (CTG)' },
    { value: 'BGA', label: 'Bucaramanga (BGA)' },
    { value: 'PEI', label: 'Pereira (PEI)' },
    { value: 'CUC', label: 'Cúcuta (CUC)' },
    { value: 'SMR', label: 'Santa Marta (SMR)' },
    { value: 'ADZ', label: 'San Andrés (ADZ)' },
    { value: 'VVC', label: 'Villavicencio (VVC)' },
    { value: 'IBE', label: 'Ibagué (IBE)' }
  ];

  const passengerOptions = Array.from({ length: 9 }, (_, i) => ({
    value: i,
    label: i === 0 ? '0' : `${i}`
  }));

  const adultOptions = Array.from({ length: 9 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`
  }));

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: field?.includes('adults') || field?.includes('children') || field?.includes('infants') ? Number(value) : value
    }));
  };

  const handleTripTypeChange = (type) => {
    setTripType(type);
    if (type === 'one-way') {
      setSearchData(prev => ({
        ...prev,
        returnDate: ''
      }));
    }
  };

  const handleSwapCities = () => {
    setSearchData(prev => ({
      ...prev,
      origin: prev?.destination,
      destination: prev?.origin
    }));
  };

  const validateForm = () => {
    if (!searchData?.origin) {
      alert('Por favor selecciona la ciudad de origen');
      return false;
    }
    if (!searchData?.destination) {
      alert('Por favor selecciona la ciudad de destino');
      return false;
    }
    if (searchData?.origin === searchData?.destination) {
      alert('La ciudad de origen y destino no pueden ser iguales');
      return false;
    }
    if (!searchData?.departureDate) {
      alert('Por favor selecciona la fecha de salida');
      return false;
    }
    if (tripType === 'round-trip' && !searchData?.returnDate) {
      alert('Por favor selecciona la fecha de regreso');
      return false;
    }
    return true;
  };

  const handleSearch = async () => {
    if (!validateForm()) return;

    // Calculate total passengers
    const totalPassengers = searchData?.adults + searchData?.children + searchData?.infants;
    
    // Transform searchData to match expected structure in flight results
    const transformedSearchData = {
      ...searchData,
      tripType,
      // Add city names for display
      from: colombianCities?.find(city => city?.value === searchData?.origin)?.label?.split(' (')?.[0] || searchData?.origin,
      to: colombianCities?.find(city => city?.value === searchData?.destination)?.label?.split(' (')?.[0] || searchData?.destination,
      fromCode: searchData?.origin,
      toCode: searchData?.destination,
      // Transform passenger data to expected structure
      passengers: {
        adults: searchData?.adults,
        children: searchData?.children,
        infants: searchData?.infants,
        total: totalPassengers
      },
      // Set default class if not specified
      class: 'economy'
    };
    
    // Call parent onSubmit if provided, otherwise navigate directly
    if (onSubmit && typeof onSubmit === 'function') {
      await onSubmit(transformedSearchData);
    } else {
      // Direct navigation for fallback
      navigate('/flight-results-selection', { 
        state: { 
          searchData: transformedSearchData
        }
      });
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date()?.toISOString()?.split('T')?.[0];

  return (
    <div className="bg-white rounded-lg shadow-elevated p-6 md:p-8 max-w-4xl mx-auto">
      {/* Trip Type Toggle */}
      <div className="flex items-center space-x-6 mb-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="round-trip"
            checked={tripType === 'round-trip'}
            onChange={(e) => handleTripTypeChange(e?.target?.value)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-micro ${
            tripType === 'round-trip' ? 'border-primary bg-primary' : 'border-gray-300'
          }`}>
            {tripType === 'round-trip' && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          <span className="text-lg font-medium text-gray-800">Ida y vuelta</span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="one-way"
            checked={tripType === 'one-way'}
            onChange={(e) => handleTripTypeChange(e?.target?.value)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-micro ${
            tripType === 'one-way' ? 'border-primary bg-primary' : 'border-gray-300'
          }`}>
            {tripType === 'one-way' && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          <span className="text-lg font-medium text-gray-800">Solo ida</span>
        </label>
      </div>
      {/* Flight Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Origin City */}
        <div className="relative">
          <Select
            label="Desde"
            placeholder="Seleccionar ciudad"
            options={colombianCities}
            value={searchData?.origin}
            onChange={(value) => handleInputChange('origin', value)}
            searchable
            required
            className="text-lg"
            error=""
            description=""
          />
        </div>

        {/* Swap Button */}
        <div className="hidden lg:flex items-end justify-center pb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapCities}
            className="rounded-full hover:bg-primary/10"
          >
            <Icon name="ArrowLeftRight" size={20} />
          </Button>
        </div>

        {/* Destination City */}
        <div className="relative">
          <Select
            label="Hacia"
            placeholder="Seleccionar ciudad"
            options={colombianCities}
            value={searchData?.destination}
            onChange={(value) => handleInputChange('destination', value)}
            searchable
            required
            className="text-lg"
            error=""
            description=""
          />
        </div>

        {/* Mobile Swap Button */}
        <div className="lg:hidden flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwapCities}
            iconName="ArrowUpDown"
            iconPosition="left"
          >
            Intercambiar
          </Button>
        </div>
      </div>
      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          label="Fecha de salida"
          type="date"
          value={searchData?.departureDate}
          onChange={(e) => handleInputChange('departureDate', e?.target?.value)}
          min={today}
          required
          className="text-lg"
        />

        {tripType === 'round-trip' && (
          <Input
            label="Fecha de regreso"
            type="date"
            value={searchData?.returnDate}
            onChange={(e) => handleInputChange('returnDate', e?.target?.value)}
            min={searchData?.departureDate || today}
            required
            className="text-lg"
          />
        )}
      </div>
      {/* Passenger Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Select
          label="Adultos"
          description="12 años o más"
          options={adultOptions}
          value={searchData?.adults}
          onChange={(value) => handleInputChange('adults', value)}
          required
          error=""
        />

        <Select
          label="Niños"
          description="2-11 años"
          options={passengerOptions}
          value={searchData?.children}
          onChange={(value) => handleInputChange('children', value)}
          error=""
        />

        <Select
          label="Bebés"
          description="0-23 meses"
          options={passengerOptions}
          value={searchData?.infants}
          onChange={(value) => handleInputChange('infants', value)}
          error=""
        />
      </div>
      {/* Search Button */}
      <div className="flex justify-center">
        <Button
          variant="default"
          size="lg"
          onClick={handleSearch}
          loading={isLoading}
          iconName="Search"
          iconPosition="left"
          className="px-12 py-4 text-lg font-semibold"
          fullWidth
        >
          {isLoading ? 'Buscando vuelos...' : 'Buscar vuelos'}
        </Button>
      </div>
      {/* Additional Info */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Los precios mostrados incluyen impuestos y tasas</p>
        <p className="mt-1">Moneda: Peso Colombiano (COP)</p>
      </div>
    </div>
  );
};

export default FlightSearchForm;