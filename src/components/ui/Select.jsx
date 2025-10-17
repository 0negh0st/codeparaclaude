import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const Select = ({ 
  label, 
  options = [], 
  value = '', 
  onChange, 
  placeholder = 'Seleccionar...', 
  error, 
  disabled = false, 
  required = false,
  description,
  searchable = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  // Update filtered options when search term changes
  useEffect(() => {
    if (searchable && searchTerm) {
      const filtered = options?.filter(option => {
        if (option && option?.label) {
          return option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase());
        }
        return false;
      });
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options, searchable]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef?.current && !selectRef?.current?.contains(event?.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event?.key) {
        case 'Escape':
          setIsOpen(false);
          setSearchTerm('');
          break;
        case 'Enter':
          event?.preventDefault();
          if (filteredOptions?.length > 0) {
            handleSelect(filteredOptions?.[0]?.value);
          }
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, filteredOptions]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef?.current) {
      setTimeout(() => {
        if (searchInputRef?.current) {
          searchInputRef?.current?.focus();
        }
      }, 100);
    }
  }, [isOpen, searchable]);

  const handleSelect = (optionValue) => {
    if (onChange && typeof onChange === 'function') {
      onChange(optionValue);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const getSelectedLabel = () => {
    const selectedOption = options?.find(option => option && option?.value === value);
    return selectedOption && selectedOption?.label ? selectedOption?.label : '';
  };

  const handleToggle = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  const handleSearchChange = (event) => {
    if (event && event?.target && event?.target?.value !== undefined) {
      setSearchTerm(event?.target?.value);
    }
  };

  const handleOptionClick = (optionValue, event) => {
    event?.preventDefault();
    event?.stopPropagation();
    handleSelect(optionValue);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-800 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      {/* Select Button */}
      <button
        type="button"
        onClick={handleToggle}
        onMouseDown={(e) => e?.preventDefault()}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`
          w-full flex items-center justify-between px-3 py-2 text-left
          border rounded-md bg-white transition-colors duration-200
          ${disabled 
            ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' :'border-gray-300 hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 cursor-pointer'
          }
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
          ${isOpen ? 'border-blue-600 ring-2 ring-blue-200' : ''}
        `}
      >
        <span className={`block truncate ${!value ? 'text-gray-500' : 'text-gray-900'}`}>
          {value ? getSelectedLabel() : placeholder}
        </span>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          } ${disabled ? 'text-gray-400' : 'text-gray-600'}`}
        />
      </button>
      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden"
          role="listbox"
          aria-label={label || 'Options'}
        >
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onMouseDown={(e) => e?.stopPropagation()}
                  onClick={(e) => e?.stopPropagation()}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-200"
                />
              </div>
            </div>
          )}
          
          <div className="overflow-y-auto max-h-48">
            {filteredOptions && filteredOptions?.length > 0 ? (
              filteredOptions?.map((option, index) => {
                if (!option || !option?.value) return null;
                
                return (
                  <button
                    key={`${option?.value}-${index}`}
                    type="button"
                    onClick={(e) => handleOptionClick(option?.value, e)}
                    onMouseDown={(e) => e?.preventDefault()}
                    role="option"
                    tabIndex={0}
                    aria-selected={value === option?.value}
                    className={`
                      w-full text-left px-3 py-2 text-sm transition-colors duration-150
                      hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer
                      ${value === option?.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-900'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{option?.label || ''}</span>
                      {value === option?.value && (
                        <Icon name="Check" size={16} className="text-blue-700 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                {searchable && searchTerm ? 'No se encontraron resultados' : 'No hay opciones disponibles'}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Description */}
      {description && !error && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center">
          <Icon name="AlertCircle" size={14} className="mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;