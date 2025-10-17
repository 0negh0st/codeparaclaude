import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  size = 32, 
  disabled = false,
  className = '' 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starValue) => {
    if (!disabled && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (!disabled) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverRating(0);
    }
  };

  const getStarColor = (starIndex) => {
    const currentRating = hoverRating || rating;
    return starIndex <= currentRating ? 'text-amber-400' : 'text-gray-300';
  };

  return (
    <div 
      className={`flex items-center justify-center gap-2 ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5]?.map((starValue) => (
        <button
          key={starValue}
          type="button"
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
          disabled={disabled}
          className={`
            transition-all duration-200 ease-out transform
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
            focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 rounded
            p-1
          `}
          aria-label={`Calificar con ${starValue} estrella${starValue !== 1 ? 's' : ''}`}
        >
          <Icon
            name="Star"
            size={size}
            className={`
              ${getStarColor(starValue)}
              transition-colors duration-200 ease-out
              ${starValue <= (hoverRating || rating) ? 'fill-current' : ''}
            `}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;