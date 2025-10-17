import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchSummary = ({ searchCriteria, searchData, onEdit }) => {
  // Use searchData as fallback for searchCriteria for consistency
  const criteria = searchCriteria || searchData || {};
  
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

  const getRouteText = () => {
    const origin = criteria?.origin || criteria?.from || 'Origen';
    const destination = criteria?.destination || criteria?.to || 'Destino';
    return `${origin} → ${destination}`;
  };

  return (
    <div className="bg-blue-600 text-white rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={20} className="text-blue-200" />
            <span className="text-lg font-semibold">
              {getRouteText()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-blue-200" />
            <span className="text-sm">
              {formatDate(criteria?.departureDate)}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="border-blue-300 text-blue-100 hover:bg-blue-500 hover:border-blue-400"
        >
          <Icon name="Edit2" size={16} className="mr-1" />
          Modificar
        </Button>
      </div>
    </div>
  );
};

export default SearchSummary;