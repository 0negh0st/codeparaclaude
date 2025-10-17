import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingSummaryPanel = ({ bookingData = {} }) => {
  const {
    flightDetails = {
      departure: { city: 'Bogotá', airport: 'BOG', time: '08:30' },
      arrival: { city: 'Medellín', airport: 'MDE', time: '10:15' },
      date: '15/10/2025',
      airline: 'AeroLineas',
      flightNumber: 'AL-1234',
      duration: '1h 45m',
      aircraft: 'Airbus A320'
    },
    passengers = [
      { type: 'Adulto', name: 'Juan Pérez', count: 1 }
    ],
    pricing = {
      basePrice: 285000,
      taxes: 45600,
      fees: 12400,
      total: 343000
    },
    returnFlight = null
  } = bookingData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-4">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-primary text-white rounded-t-lg">
        <h3 className="text-lg font-semibold">Resumen de Reserva</h3>
        <p className="text-sm opacity-90">Confirme los detalles antes del pago</p>
      </div>
      <div className="p-4 space-y-4">
        {/* Flight Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Icon name="Plane" size={16} className="text-primary" />
            <span className="font-medium text-gray-900">Vuelo de Ida</span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-900">{flightDetails?.departure?.city}</p>
                <p className="text-sm text-gray-600">{flightDetails?.departure?.airport} - {flightDetails?.departure?.time}</p>
              </div>
              <div className="text-center">
                <Icon name="ArrowRight" size={16} className="text-gray-400" />
                <p className="text-xs text-gray-500 mt-1">{flightDetails?.duration}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{flightDetails?.arrival?.city}</p>
                <p className="text-sm text-gray-600">{flightDetails?.arrival?.airport} - {flightDetails?.arrival?.time}</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Fecha:</span> {flightDetails?.date}</p>
              <p><span className="font-medium">Vuelo:</span> {flightDetails?.airline} {flightDetails?.flightNumber}</p>
              <p><span className="font-medium">Aeronave:</span> {flightDetails?.aircraft}</p>
            </div>
          </div>
        </div>

        {/* Return Flight (if exists) */}
        {returnFlight && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Icon name="RotateCcw" size={16} className="text-primary" />
              <span className="font-medium text-gray-900">Vuelo de Regreso</span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{returnFlight?.departure?.city}</p>
                  <p className="text-sm text-gray-600">{returnFlight?.departure?.airport} - {returnFlight?.departure?.time}</p>
                </div>
                <div className="text-center">
                  <Icon name="ArrowRight" size={16} className="text-gray-400" />
                  <p className="text-xs text-gray-500 mt-1">{returnFlight?.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{returnFlight?.arrival?.city}</p>
                  <p className="text-sm text-gray-600">{returnFlight?.arrival?.airport} - {returnFlight?.arrival?.time}</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Fecha:</span> {returnFlight?.date}</p>
                <p><span className="font-medium">Vuelo:</span> {returnFlight?.airline} {returnFlight?.flightNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* Passengers */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} className="text-primary" />
            <span className="font-medium text-gray-900">Pasajeros</span>
          </div>
          
          <div className="space-y-2">
            {passengers?.map((passenger, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{passenger?.count}x {passenger?.type}</span>
                <span className="text-gray-900">{passenger?.name || 'Por definir'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Icon name="Calculator" size={16} className="text-primary" />
            <span className="font-medium text-gray-900">Desglose de Precios</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tarifa base</span>
              <span className="text-gray-900">{formatCurrency(pricing?.basePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Impuestos y tasas</span>
              <span className="text-gray-900">{formatCurrency(pricing?.taxes)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cargos administrativos</span>
              <span className="text-gray-900">{formatCurrency(pricing?.fees)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total a Pagar</span>
                <span className="font-bold text-lg text-primary">{formatCurrency(pricing?.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="pt-4 border-t border-gray-200">
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Importante:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Los precios están sujetos a disponibilidad</li>
                  <li>• Verifique los datos antes de proceder</li>
                  <li>• Políticas de cancelación aplican</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryPanel;