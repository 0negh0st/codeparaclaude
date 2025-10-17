import React from 'react';
import Icon from '../../../components/AppIcon';

const PriceComparisonAlert = ({ lowestPrice, averagePrice }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const savings = averagePrice - lowestPrice;
  const savingsPercentage = Math.round((savings / averagePrice) * 100);

  return (
    <div className="bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-success/20 rounded-full flex-shrink-0">
          <Icon name="TrendingDown" size={20} className="text-success" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-semibold text-success">
              ¡Excelente precio encontrado!
            </h3>
            <span className="px-2 py-1 bg-success text-success-foreground text-xs font-medium rounded-full">
              -{savingsPercentage}%
            </span>
          </div>
          
          <p className="text-sm text-text-primary mb-3">
            El precio más bajo que encontramos es <span className="font-semibold">{formatPrice(lowestPrice)}</span>, 
            que está <span className="font-semibold text-success">{formatPrice(savings)} por debajo</span> del precio promedio 
            para esta ruta.
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between p-2 bg-surface rounded-md">
              <span className="text-text-secondary">Precio más bajo:</span>
              <span className="font-semibold text-success">{formatPrice(lowestPrice)}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-surface rounded-md">
              <span className="text-text-secondary">Precio promedio:</span>
              <span className="font-medium text-text-primary">{formatPrice(averagePrice)}</span>
            </div>
          </div>
          
          <div className="mt-3 flex items-center space-x-2 text-xs text-text-secondary">
            <Icon name="Info" size={14} />
            <span>Precios basados en búsquedas similares en los últimos 30 días</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceComparisonAlert;