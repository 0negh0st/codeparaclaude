import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FlightCard = ({ flight, searchData, onSelect, isSelected = false, isLoading = false }) => {
  const formatTime = (time) => {
    if (!time) return '--:--';
    return time;
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    })?.format(price);
  };

  // Ensure flight object exists and has default values
  if (!flight) {
    return (
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <p className="text-center text-gray-500">Cargando información del vuelo...</p>
      </div>
    );
  }

  // Safe property access with comprehensive fallbacks
  const flightData = {
    aerolinea: flight?.aerolinea || 'Aerolínea',
    numeroVuelo: flight?.numeroVuelo || 'FL-0000',
    precio: flight?.precio || 0,
    pasajeros: flight?.pasajeros || searchData?.passengers?.total || 1,
    horaSalida: flight?.horaSalida || '--:--',
    horaLlegada: flight?.horaLlegada || '--:--',
    duracion: flight?.duracion || '1h 36m',
    escalas: flight?.escalas || 'Directo',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4">
      {/* Flight Times and Route - Main content */}
      <div className="flex items-center justify-between mb-4">
        {/* Departure */}
        <div className="text-left">
          <div className="text-2xl font-bold text-gray-900">{formatTime(flightData?.horaSalida)}</div>
          <div className="text-sm text-gray-500">Bogotá</div>
        </div>

        {/* Flight path with duration */}
        <div className="flex-1 mx-6 relative">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="px-3 bg-white">
              <Icon name="Plane" size={16} className="text-gray-400" />
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="text-center mt-2">
            <div className="text-xs text-gray-600 font-medium">{flightData?.duracion}</div>
            <div className="text-xs text-green-600 font-medium">{flightData?.escalas}</div>
          </div>
        </div>

        {/* Arrival */}
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{formatTime(flightData?.horaLlegada)}</div>
          <div className="text-sm text-gray-500">Santa Marta</div>
        </div>
      </div>

      {/* Bottom section with price and button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <div>
            <div className="text-lg font-bold text-gray-900">{formatPrice(flightData?.precio)}</div>
          </div>
        </div>
        
        <Button
          onClick={() => onSelect && onSelect(flight)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          disabled={isLoading}
        >
          {isLoading ? 'Seleccionando...' : 'Continuar'}
        </Button>
      </div>
    </div>
  );
};

export default FlightCard;