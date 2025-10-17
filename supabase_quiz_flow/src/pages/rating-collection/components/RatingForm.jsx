import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import StarRating from './StarRating';
import Icon from '../../../components/AppIcon';

const RatingForm = ({ onSubmitRating, isSubmitting = false }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const navigate = useNavigate();

  const handleRatingSubmit = async () => {
    if (selectedRating === 0) {
      setShowValidation(true);
      setTimeout(() => setShowValidation(false), 3000);
      return;
    }

    try {
      await onSubmitRating(selectedRating);
      // Navigation will be handled by parent component
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const getRatingText = () => {
    const ratingTexts = {
      1: 'Muy malo',
      2: 'Malo',
      3: 'Regular',
      4: 'Bueno',
      5: 'Excelente'
    };
    return selectedRating > 0 ? ratingTexts?.[selectedRating] : '';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <Icon 
            name="Star" 
            size={48} 
            className="text-amber-400 mx-auto fill-current" 
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Gracias por completar el cuestionario!
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Tu opinión es muy importante para nosotros. Por favor, califica tu experiencia.
        </p>
      </div>

      {/* Rating Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ¿Cómo calificarías tu experiencia?
          </h3>
          
          <StarRating
            rating={selectedRating}
            onRatingChange={setSelectedRating}
            size={40}
            disabled={isSubmitting}
            className="mb-4"
          />

          {/* Rating Text */}
          {selectedRating > 0 && (
            <div className="animate-fade-in">
              <p className="text-lg font-medium text-gray-700 mb-2">
                {getRatingText()}
              </p>
              <p className="text-sm text-gray-500">
                {selectedRating} de 5 estrellas
              </p>
            </div>
          )}

          {/* Validation Message */}
          {showValidation && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md animate-slide-up">
              <div className="flex items-center gap-2 text-red-700">
                <Icon name="AlertCircle" size={16} />
                <span className="text-sm font-medium">
                  Por favor, selecciona una calificación antes de continuar
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <Button
          variant="default"
          size="lg"
          onClick={handleRatingSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          iconName="Send"
          iconPosition="right"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Calificación'}
        </Button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Tu calificación nos ayuda a mejorar nuestros servicios
        </p>
      </div>
    </div>
  );
};

export default RatingForm;