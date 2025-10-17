import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorModal from './components/ErrorModal';
import RetryButton from './components/RetryButton';
import AdminMessageDisplay from './components/AdminMessageDisplay';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ErrorMessageModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract data from navigation state or URL params
  const {
    errorMessage = '',
    adminMessage = '',
    attemptCount = 1,
    maxAttempts = 3,
    questionNumber = 1,
    sessionId = '',
    questionData = null
  } = location?.state || {};

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [currentAttempts, setCurrentAttempts] = useState(attemptCount);
  const [isTypingMessage, setIsTypingMessage] = useState(false);

  // Mock data for demonstration
  const mockErrorData = {
    errorMessage: errorMessage || "Tu respuesta no es correcta. Por favor, revisa la información y vuelve a intentarlo.",
    adminMessage: adminMessage || `La respuesta correcta requiere más precisión. Para la pregunta sobre la capital de Francia, recuerda que estamos buscando la ciudad principal y centro político del país.\n\nConsejo: Piensa en la ciudad más famosa de Francia, conocida por la Torre Eiffel.`,
    adminName: "Dr. María González",
    timestamp: new Date()?.toISOString(),
    messageType: "error",
    sessionId: sessionId || `session_${Date.now()}`,
    questionNumber: questionNumber,
    attemptCount: currentAttempts,
    maxAttempts: maxAttempts
  };

  const mockQuestionData = questionData || {
    id: 1,
    question: "¿Cuál es la capital de Francia?",
    options: ["Londres", "Madrid", "París", "Roma"],
    correctAnswer: "París",
    userAnswer: "Madrid",
    explanation: "París es la capital y ciudad más poblada de Francia, así como el centro político, económico y cultural del país."
  };

  useEffect(() => {
    // Simulate real-time admin message typing
    if (adminMessage) {
      setIsTypingMessage(true);
      const timer = setTimeout(() => {
        setIsTypingMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [adminMessage]);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      // Simulate API call to retry answer
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update attempt count
      const newAttemptCount = currentAttempts + 1;
      setCurrentAttempts(newAttemptCount);
      
      // Navigate back to quiz question with updated attempt count
      navigate('/quiz-question', {
        state: {
          questionNumber: mockErrorData?.questionNumber,
          attemptCount: newAttemptCount,
          sessionId: mockErrorData?.sessionId,
          previousError: true
        }
      });
    } catch (error) {
      console.error('Error retrying question:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Navigate back to the question
    navigate('/quiz-question', {
      state: {
        questionNumber: mockErrorData?.questionNumber,
        attemptCount: currentAttempts,
        sessionId: mockErrorData?.sessionId,
        reviewMode: true
      }
    });
  };

  const handleRestartQuiz = () => {
    // Clear session data
    localStorage.removeItem('quizSession');
    localStorage.removeItem('currentStep');
    
    // Navigate to welcome page
    navigate('/welcome-registration');
  };

  const handleNextQuestion = () => {
    if (mockErrorData?.questionNumber < 3) {
      navigate('/quiz-question', {
        state: {
          questionNumber: mockErrorData?.questionNumber + 1,
          attemptCount: 1,
          sessionId: mockErrorData?.sessionId,
          skipCurrent: true
        }
      });
    } else {
      navigate('/rating-collection', {
        state: {
          sessionId: mockErrorData?.sessionId,
          incompleteQuestions: [mockErrorData?.questionNumber]
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      {/* Main Error Modal */}
      <ErrorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRetry={handleRetry}
        errorMessage={mockErrorData?.errorMessage}
        attemptCount={currentAttempts}
        maxAttempts={mockErrorData?.maxAttempts}
        questionNumber={mockErrorData?.questionNumber}
        adminMessage={mockErrorData?.adminMessage}
        sessionId={mockErrorData?.sessionId}
      />
      {/* Alternative Layout for Mobile/Tablet */}
      {!isModalOpen && (
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertCircle" size={32} className="text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Respuesta Incorrecta
              </h1>
              <p className="text-gray-600">
                Pregunta {mockErrorData?.questionNumber} de 3 • Sesión {mockErrorData?.sessionId?.slice(-8)}
              </p>
            </div>

            {/* Question Review */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Pregunta:</h3>
              <p className="text-gray-800 mb-3">{mockQuestionData?.question}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {mockQuestionData?.options?.map((option, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded border text-sm ${
                      option === mockQuestionData?.correctAnswer
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : option === mockQuestionData?.userAnswer
                        ? 'bg-red-100 border-red-300 text-red-800' :'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {option === mockQuestionData?.correctAnswer && (
                        <Icon name="Check" size={14} className="text-green-600" />
                      )}
                      {option === mockQuestionData?.userAnswer && option !== mockQuestionData?.correctAnswer && (
                        <Icon name="X" size={14} className="text-red-600" />
                      )}
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-gray-600">
                <span className="font-medium">Tu respuesta:</span> {mockQuestionData?.userAnswer} • 
                <span className="font-medium"> Respuesta correcta:</span> {mockQuestionData?.correctAnswer}
              </div>
            </div>

            {/* Admin Message */}
            <div className="mb-6">
              <AdminMessageDisplay
                adminMessage={mockErrorData?.adminMessage}
                adminName={mockErrorData?.adminName}
                timestamp={mockErrorData?.timestamp}
                messageType={mockErrorData?.messageType}
                isTyping={isTypingMessage}
              />
            </div>

            {/* Retry Section */}
            <div className="mb-6">
              <RetryButton
                onRetry={handleRetry}
                attemptCount={currentAttempts}
                maxAttempts={mockErrorData?.maxAttempts}
                isLoading={isRetrying}
                questionNumber={mockErrorData?.questionNumber}
              />
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                iconName="ArrowLeft"
                iconPosition="left"
                className="flex-1"
              >
                Volver a la Pregunta
              </Button>
              
              {currentAttempts >= mockErrorData?.maxAttempts && (
                <Button
                  variant="secondary"
                  onClick={handleNextQuestion}
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="flex-1"
                >
                  Continuar Quiz
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={handleRestartQuiz}
                iconName="RotateCcw"
                iconPosition="left"
                className="flex-1 sm:flex-initial"
              >
                Reiniciar
              </Button>
            </div>

            {/* Help Section */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">
                    ¿Necesitas ayuda adicional?
                  </p>
                  <p className="text-blue-800">
                    Los administradores están disponibles en tiempo real para proporcionar 
                    orientación adicional. Tu progreso se guarda automáticamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorMessageModal;