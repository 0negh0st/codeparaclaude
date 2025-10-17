import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterSortControls = ({ onSortChange, onFilterChange, totalResults = 3 }) => {
  const [activeFilters, setActiveFilters] = useState({
    priceRange: 'all',
    airline: 'all',
    stops: 'all',
    departureTime: 'all'
  });

  const [sortBy, setSortBy] = useState('price');

  const sortOptions = [
    { value: 'price', label: 'Precio (menor a mayor)' },
    { value: 'price-desc', label: 'Precio (mayor a menor)' },
    { value: 'departure', label: 'Hora de salida' },
    { value: 'duration', label: 'Duración del vuelo' },
    { value: 'rating', label: 'Mejor valorado' }
  ];

  const priceRangeOptions = [
    { value: 'all', label: 'Todos los precios' },
    { value: '0-500000', label: 'Hasta $500.000' },
    { value: '500000-1000000', label: '$500.000 - $1.000.000' },
    { value: '1000000+', label: 'Más de $1.000.000' }
  ];

  const airlineOptions = [
    { value: 'all', label: 'Todas las aerolíneas' },
    { value: 'avianca', label: 'Avianca' },
    { value: 'latam', label: 'LATAM' },
    { value: 'viva', label: 'Viva Air' },
    { value: 'jetblue', label: 'JetBlue' }
  ];

  const stopsOptions = [
    { value: 'all', label: 'Cualquier escala' },
    { value: 'direct', label: 'Vuelos directos' },
    { value: '1-stop', label: '1 escala' },
    { value: '2-stops', label: '2+ escalas' }
  ];

  const timeOptions = [
    { value: 'all', label: 'Cualquier hora' },
    { value: 'morning', label: 'Mañana (06:00 - 12:00)' },
    { value: 'afternoon', label: 'Tarde (12:00 - 18:00)' },
    { value: 'evening', label: 'Noche (18:00 - 24:00)' }
  ];

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priceRange: 'all',
      airline: 'all',
      stops: 'all',
      departureTime: 'all'
    };
    setActiveFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters)?.filter(value => value !== 'all')?.length;
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-soft p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            Filtros y ordenamiento
          </h3>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">
            {totalResults} vuelo{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
          </span>
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>
      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Sort By */}
        <Select
          label="Ordenar por"
          options={sortOptions}
          value={sortBy}
          onChange={handleSortChange}
          className="lg:col-span-1"
        />

        {/* Price Range Filter */}
        <Select
          label="Rango de precio"
          options={priceRangeOptions}
          value={activeFilters?.priceRange}
          onChange={(value) => handleFilterChange('priceRange', value)}
          className="lg:col-span-1"
        />

        {/* Airline Filter */}
        <Select
          label="Aerolínea"
          options={airlineOptions}
          value={activeFilters?.airline}
          onChange={(value) => handleFilterChange('airline', value)}
          className="lg:col-span-1"
        />

        {/* Stops Filter */}
        <Select
          label="Escalas"
          options={stopsOptions}
          value={activeFilters?.stops}
          onChange={(value) => handleFilterChange('stops', value)}
          className="lg:col-span-1"
        />

        {/* Departure Time Filter */}
        <Select
          label="Hora de salida"
          options={timeOptions}
          value={activeFilters?.departureTime}
          onChange={(value) => handleFilterChange('departureTime', value)}
          className="lg:col-span-1"
        />
      </div>
      {/* Quick Filter Buttons */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm font-medium text-text-primary mb-2">Filtros rápidos:</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('stops', 'direct')}
            className={activeFilters?.stops === 'direct' ? 'bg-primary/10 border-primary' : ''}
          >
            Solo directos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('priceRange', '0-500000')}
            className={activeFilters?.priceRange === '0-500000' ? 'bg-primary/10 border-primary' : ''}
          >
            Económicos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSortChange('duration')}
            className={sortBy === 'duration' ? 'bg-primary/10 border-primary' : ''}
          >
            Más rápidos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('departureTime', 'morning')}
            className={activeFilters?.departureTime === 'morning' ? 'bg-primary/10 border-primary' : ''}
          >
            Vuelos matutinos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSortControls;