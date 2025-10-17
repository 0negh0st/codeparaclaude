import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingSpinner = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon 
            name="UserCheck" 
            size={24} 
            className="text-blue-600" 
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;