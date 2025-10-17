import React from 'react';
import Icon from '../../../components/AppIcon';

const RatingSuccess = ({ rating, onContinue }) => {
  const getRatingText = () => {
    const ratingTexts = {
      1: 'Muy malo',
      2: 'Malo', 
      3: 'Regular',
      4: 'Bueno',
      5: 'Excelente'
    };
    return ratingTexts?.[rating] || '';
  };

  return (
    <div className="w-full max-w-md mx-auto text-center animate-slide-up">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="relative inline-flex">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="CheckCircle" size={32} className="text-green-600" />
          </div>
          <div className="absolute -top-1 -right-1">
            <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
              <Icon name="Star" size={14} className="text-white fill-current" />
            </div>
          </div>
        </div>
      </div>
      {/* Success Message */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        ¡Calificación enviada!
      </h2>
      <p className="text-gray-600 mb-6 leading-relaxed">
        Gracias por tu calificación de <span className="font-semibold text-amber-600">{rating} estrellas</span> 
        ({getRatingText()?.toLowerCase()}). Tu opinión es muy valiosa para nosotros.
      </p>
      {/* Rating Display */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5]?.map((star) => (
            <Icon
              key={star}
              name="Star"
              size={24}
              className={`
                ${star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'}
                transition-colors duration-200
              `}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Tu calificación: {rating}/5
        </p>
      </div>
      {/* Continue Message */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">
          Serás redirigido automáticamente en unos segundos...
        </p>
        
        {/* Loading Dots */}
        <div className="flex justify-center gap-1">
          {[0, 1, 2]?.map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSuccess;