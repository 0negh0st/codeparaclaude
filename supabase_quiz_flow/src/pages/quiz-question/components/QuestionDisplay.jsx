import React from 'react';
import Icon from '../../../components/AppIcon';

const QuestionDisplay = ({ 
  questionNumber, 
  totalQuestions, 
  questionText, 
  className = '' 
}) => {
  return (
    <div className={`text-center mb-8 ${className}`}>
      {/* Question Progress */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Icon name="HelpCircle" size={20} className="text-blue-600" />
        <span className="text-sm font-medium text-slate-600">
          Pregunta {questionNumber} de {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Text */}
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        {questionText}
      </h2>
      
      <p className="text-slate-600 text-sm">
        Escribe tu respuesta en el campo de abajo
      </p>
    </div>
  );
};

export default QuestionDisplay;