import React from 'react';
import Icon from '../../../components/AppIcon';

const FlightSummaryCard = ({ flightData }) => {
  // Mock flight data if not provided
  const defaultFlightData = {
    origen: "Bogotá (BOG)",
    destino: "Medellín (MDE)",
    fechaIda: "15/10/2024",
    fechaVuelta: "22/10/2024",
    pasajeros: 2,
    clase: "Económica",
    aerolinea: "AeroLineas",
    numeroVuelo: "AL-1234",
    horaSalida: "08:30",
    horaLlegada: "10:15",
    duracion: "1h 45m",
    precio: 450000,
    equipaje: "Equipaje de mano incluido",
    servicios: ["Selección de asiento", "Snack a bordo"]
  };

  const flight = flightData || defaultFlightData;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="bg-surface border border-border rounded-card shadow-soft">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 rounded-t-card">
        <h3 className="text-lg font-heading font-semibold flex items-center">
          <Icon name="Plane" size={20} className="mr-2" />
          Resumen de Vuelo
        </h3>
      </div>
      {/* Flight Details */}
      <div className="p-4 space-y-4">
        {/* Route Information */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-sm text-text-secondary">Origen</p>
            <p className="font-medium text-text-primary">{flight?.origen}</p>
          </div>
          <div className="flex-1 flex items-center justify-center mx-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1 h-0.5 bg-border mx-2"></div>
              <Icon name="Plane" size={16} className="text-primary" />
              <div className="flex-1 h-0.5 bg-border mx-2"></div>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-text-secondary">Destino</p>
            <p className="font-medium text-text-primary">{flight?.destino}</p>
          </div>
        </div>

        {/* Flight Times */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-border">
          <div>
            <p className="text-sm text-text-secondary flex items-center">
              <Icon name="Calendar" size={16} className="mr-1" />
              Fecha de Ida
            </p>
            <p className="font-medium text-text-primary">{flight?.fechaIda}</p>
            <p className="text-sm text-text-secondary">{flight?.horaSalida} - {flight?.horaLlegada}</p>
          </div>
          {flight?.fechaVuelta && (
            <div>
              <p className="text-sm text-text-secondary flex items-center">
                <Icon name="Calendar" size={16} className="mr-1" />
                Fecha de Vuelta
              </p>
              <p className="font-medium text-text-primary">{flight?.fechaVuelta}</p>
              <p className="text-sm text-text-secondary">Por confirmar</p>
            </div>
          )}
        </div>

        {/* Flight Details */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Aerolínea:</span>
            <span className="text-sm font-medium text-text-primary">{flight?.aerolinea}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Vuelo:</span>
            <span className="text-sm font-medium text-text-primary">{flight?.numeroVuelo}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Duración:</span>
            <span className="text-sm font-medium text-text-primary">{flight?.duracion}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Clase:</span>
            <span className="text-sm font-medium text-text-primary">{flight?.clase}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Pasajeros:</span>
            <span className="text-sm font-medium text-text-primary">{flight?.pasajeros}</span>
          </div>
        </div>

        {/* Services Included */}
        <div className="pt-3 border-t border-border">
          <p className="text-sm font-medium text-text-primary mb-2">Servicios Incluidos:</p>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-text-secondary">
              <Icon name="Check" size={14} className="mr-2 text-success" />
              {flight?.equipaje}
            </div>
            {flight?.servicios?.map((servicio, index) => (
              <div key={index} className="flex items-center text-sm text-text-secondary">
                <Icon name="Check" size={14} className="mr-2 text-success" />
                {servicio}
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="pt-3 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-lg font-heading font-semibold text-text-primary">Total:</span>
            <span className="text-xl font-heading font-bold text-primary">{formatPrice(flight?.precio)}</span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Impuestos y tasas incluidos
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-muted/50 p-3 rounded-md">
          <div className="flex items-start">
            <Icon name="Shield" size={16} className="mr-2 text-success mt-0.5" />
            <div>
              <p className="text-xs font-medium text-text-primary">Reserva Segura</p>
              <p className="text-xs text-text-secondary">
                Sus datos están protegidos con encriptación SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSummaryCard;