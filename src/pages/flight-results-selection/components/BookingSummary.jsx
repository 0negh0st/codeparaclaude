import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const BookingSummary = ({ searchData, selectedFlight, onContinue }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close expanded view when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && isMobile && !event?.target?.closest('.booking-summary-content')) {
        setIsExpanded(false);
      }
    };

    if (isExpanded && isMobile) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded, isMobile]);

  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    try {
      const dateParts = dateString?.split('-');
      const year = parseInt(dateParts?.[0]);
      const month = parseInt(dateParts?.[1]) - 1;
      const day = parseInt(dateParts?.[2]);
      
      const date = new Date(year, month, day);
      
      return date?.toLocaleDateString('es-CO', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Calculate prices
  const basePrice = selectedFlight?.precio || 0;
  const subtotal = basePrice;
  const taxes = selectedFlight ? Math.floor(subtotal * 0.19) : 0;
  const total = subtotal + taxes;

  const toggleExpanded = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  // Desktop Layout (unchanged)
  if (!isMobile) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-4">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Detalle de tu reserva</h3>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
            <div className="flex items-center text-teal-800 mb-1">
              <Icon name="MapPin" size={16} className="mr-2" />
              <span className="font-medium text-sm">IDA</span>
            </div>
            <div className="text-sm text-teal-700">
              {searchData?.from || 'Bogotá'} → {searchData?.to || 'Santa Marta'}
            </div>
            <div className="text-xs text-teal-600 mt-1">
              {formatDate(searchData?.departureDate)}
            </div>
          </div>
        </div>

        {/* Flight Details */}
        {selectedFlight && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Vuelo seleccionado</span>
              <Icon name="CheckCircle" size={16} className="text-blue-600" />
            </div>
            <div className="text-sm text-blue-800">
              {selectedFlight?.aerolinea || 'Aerolínea'}
            </div>
            <div className="text-xs text-blue-600 flex items-center space-x-4 mt-1">
              <span>{selectedFlight?.horaSalida || '--:--'} - {selectedFlight?.horaLlegada || '--:--'}</span>
              <span>{selectedFlight?.duracion || '1h 36m'}</span>
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-medium text-gray-900">{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tasas e impuestos</span>
            <span className="text-sm font-medium text-gray-900">{formatPrice(taxes)}</span>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-teal-800">Total</span>
              <span className="text-lg font-bold text-teal-800">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Continue Button for Desktop */}
        {selectedFlight && onContinue && (
          <div className="mt-6">
            <button
              onClick={onContinue}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Selection Status */}
        {!selectedFlight && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center">
              <Icon name="Info" size={16} className="text-amber-600 mr-2" />
              <span className="text-sm text-amber-800">
                Selecciona un vuelo para continuar
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile Layout - Sticky Bottom
  return (
    <>
      {/* Background Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}
      {/* Sticky Bottom Container */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isExpanded ? 'h-screen' : 'h-auto'
      }`}>
        
        {/* Expandable Content */}
        <div 
          className={`booking-summary-content bg-white transition-all duration-300 ease-in-out ${
            isExpanded 
              ? 'h-full overflow-y-auto rounded-t-2xl shadow-2xl' 
              : 'rounded-t-2xl shadow-lg'
          }`}
        >
          {/* Collapsed State - Summary Bar */}
          {!isExpanded && (
            <div 
              className="p-4 cursor-pointer"
              onClick={toggleExpanded}
            >
              {/* Handle Bar */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
              
              {/* Summary Content */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm text-gray-600">
                    {searchData?.from || 'Bogotá'} → {searchData?.to || 'Santa Marta'}
                  </div>
                  {selectedFlight ? (
                    <div className="text-lg font-bold text-teal-800">
                      {formatPrice(total)}
                    </div>
                  ) : (
                    <div className="text-sm text-amber-600">
                      Selecciona un vuelo
                    </div>
                  )}
                </div>
                
                {/* Expand Arrow */}
                <div className="ml-4">
                  <Icon name="ChevronUp" size={20} className="text-gray-400" />
                </div>
              </div>

              {/* Continue Button in Collapsed State */}
              {selectedFlight && onContinue && (
                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e?.stopPropagation();
                      onContinue();
                    }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Expanded State - Full Details */}
          {isExpanded && (
            <div className="h-full overflow-y-auto">
              {/* Header with Close */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Detalle de tu reserva</h3>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Icon name="ChevronDown" size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pb-32">
                {/* Route Information */}
                <div className="mb-6">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <div className="flex items-center text-teal-800 mb-2">
                      <Icon name="MapPin" size={16} className="mr-2" />
                      <span className="font-medium text-sm">IDA</span>
                    </div>
                    <div className="text-base text-teal-700 font-medium">
                      {searchData?.from || 'Bogotá'} → {searchData?.to || 'Santa Marta'}
                    </div>
                    <div className="text-sm text-teal-600 mt-1">
                      {formatDate(searchData?.departureDate)}
                    </div>
                  </div>
                </div>

                {/* Flight Details */}
                {selectedFlight && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-medium text-blue-900">Vuelo seleccionado</span>
                      <Icon name="CheckCircle" size={18} className="text-blue-600" />
                    </div>
                    <div className="text-base text-blue-800 font-medium mb-2">
                      {selectedFlight?.aerolinea || 'Aerolínea'}
                    </div>
                    <div className="text-sm text-blue-600 flex items-center space-x-4">
                      <span>{selectedFlight?.horaSalida || '--:--'} - {selectedFlight?.horaLlegada || '--:--'}</span>
                      <span>{selectedFlight?.duracion || '1h 36m'}</span>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base text-gray-600">Subtotal</span>
                    <span className="text-base font-medium text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-base text-gray-600">Tasas e impuestos</span>
                    <span className="text-base font-medium text-gray-900">{formatPrice(taxes)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold text-teal-800">Total</span>
                      <span className="text-xl font-bold text-teal-800">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Selection Status for Expanded */}
                {!selectedFlight && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center">
                      <Icon name="Info" size={16} className="text-amber-600 mr-2" />
                      <span className="text-sm text-amber-800">
                        Selecciona un vuelo para continuar
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Fixed Bottom Continue Button */}
              {selectedFlight && onContinue && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                  <button
                    onClick={onContinue}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-4 rounded-lg transition-colors duration-200 text-lg"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingSummary;