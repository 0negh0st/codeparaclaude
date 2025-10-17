import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import QuestionDisplay from './components/QuestionDisplay';
import AnswerInput from './components/AnswerInput';
import SubmissionButton from './components/SubmissionButton';
import ErrorModal from './components/ErrorModal';
import LoadingState from './components/LoadingState';

const QuizQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [sessionId, setSessionId] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', age: '' });

  // Hardcoded questions in Spanish
  const questions = [
    {
      id: 1,
      text: "¿Cuál es la capital de Francia?",
      placeholder: "Ejemplo: París",
      correctAnswer: "parís" // For demo purposes
    },
    {
      id: 2,
      text: "¿Cuántos continentes hay en el mundo?",
      placeholder: "Ejemplo: 7",
      correctAnswer: "7" // For demo purposes
    },
    {
      id: 3,
      text: "¿Cuál es conocido como el planeta rojo?",
      placeholder: "Ejemplo: Marte",
      correctAnswer: "marte" // For demo purposes
    }
  ];

  // Mock session data
  const mockSessionData = {
    sessionId: "QZ_2025_" + Math.random()?.toString(36)?.substr(2, 9),
    ipAddress: "192.168.1.100",
    deviceInfo: "Chrome 118.0.0.0 / Windows 10",
    createdAt: new Date()?.toISOString(),
    lastActivity: new Date()?.toISOString()
  };

  // Mock admin responses for demo
  const mockAdminResponses = {
    1: {
      correct: ["parís", "paris"],
      message: "La respuesta correcta es París. Por favor, verifica la ortografía y vuelve a intentarlo."
    },
    2: {
      correct: ["7", "siete"],
      message: "Hay 7 continentes en el mundo. Asegúrate de escribir el número correcto."
    },
    3: {
      correct: ["marte"],
      message: "El planeta rojo es Marte. Revisa tu respuesta e inténtalo de nuevo."
    }
  };

  // Initialize session and load data
  useEffect(() => {
    initializeSession();
    loadSessionData();
  }, []);

  // Handle URL parameters for question navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const questionParam = urlParams?.get('question');
    if (questionParam && parseInt(questionParam) >= 1 && parseInt(questionParam) <= 3) {
      setCurrentQuestion(parseInt(questionParam));
    }
  }, [location]);

  const initializeSession = () => {
    let storedSessionId = localStorage.getItem('quizSessionId');
    if (!storedSessionId) {
      storedSessionId = mockSessionData?.sessionId;
      localStorage.setItem('quizSessionId', storedSessionId);
      localStorage.setItem('quizSessionData', JSON.stringify(mockSessionData));
    }
    setSessionId(storedSessionId);
  };

  const loadSessionData = () => {
    const storedUserInfo = localStorage.getItem('quizUserInfo');
    const storedCurrentQuestion = localStorage.getItem('quizCurrentQuestion');
    const storedAttempts = localStorage.getItem('quizAttempts');

    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }

    if (storedCurrentQuestion) {
      setCurrentQuestion(parseInt(storedCurrentQuestion));
    }

    if (storedAttempts) {
      setAttemptCount(parseInt(storedAttempts));
    }

    // Update last activity
    updateLastActivity();
  };

  const updateLastActivity = () => {
    const sessionData = JSON.parse(localStorage.getItem('quizSessionData') || '{}');
    sessionData.lastActivity = new Date()?.toISOString();
    localStorage.setItem('quizSessionData', JSON.stringify(sessionData));
  };

  const handleAnswerSubmit = async () => {
    if (!answer?.trim()) {
      return;
    }

    setIsLoading(true);
    updateLastActivity();

    // Simulate real-time admin validation
    setTimeout(() => {
      simulateAdminValidation();
    }, 2000 + Math.random() * 3000); // 2-5 seconds delay
  };

  const simulateAdminValidation = () => {
    const currentQuestionData = mockAdminResponses?.[currentQuestion];
    const userAnswer = answer?.toLowerCase()?.trim();
    const isCorrect = currentQuestionData?.correct?.includes(userAnswer);

    if (isCorrect) {
      // Correct answer - proceed to next question or rating
      handleCorrectAnswer();
    } else {
      // Incorrect answer - show error modal
      handleIncorrectAnswer(currentQuestionData?.message);
    }

    setIsLoading(false);
  };

  const handleCorrectAnswer = () => {
    // Save progress
    localStorage.setItem('quizCurrentQuestion', (currentQuestion + 1)?.toString());
    localStorage.removeItem('quizAttempts'); // Reset attempts for next question

    if (currentQuestion < 3) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
      setAttemptCount(0);
      navigate(`/quiz-question?question=${currentQuestion + 1}`);
    } else {
      // All questions completed - go to rating
      navigate('/rating-collection');
    }
  };

  const handleIncorrectAnswer = (message) => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    setAdminMessage(message);
    setShowError(true);
    
    // Save attempt count
    localStorage.setItem('quizAttempts', newAttemptCount?.toString());
  };

  const handleRetry = () => {
    setShowError(false);
    setAnswer('');
    setAdminMessage('');
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !isLoading && answer?.trim()) {
      handleAnswerSubmit();
    }
  };

  const currentQuestionData = questions?.[currentQuestion - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Icon name="Brain" size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Quiz Interactivo
          </h1>
          <p className="text-slate-600 text-sm">
            Responde las preguntas y espera la validación del administrador
          </p>
        </div>

        {/* Main Quiz Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Question Display */}
          <QuestionDisplay
            questionNumber={currentQuestion}
            totalQuestions={3}
            questionText={currentQuestionData?.text}
          />

          {/* Answer Input */}
          <div onKeyPress={handleKeyPress}>
            <AnswerInput
              value={answer}
              onChange={setAnswer}
              disabled={isLoading}
              placeholder={currentQuestionData?.placeholder}
            />
          </div>

          {/* Submit Button */}
          <SubmissionButton
            onSubmit={handleAnswerSubmit}
            disabled={!answer?.trim() || isLoading}
            loading={isLoading}
            attemptCount={attemptCount}
          />
        </div>

        {/* Session Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <Icon name="Shield" size={16} />
            <span>Sesión segura: {sessionId?.slice(-8)}</span>
          </div>
          {userInfo?.name && (
            <p className="text-xs text-slate-500 mt-1">
              Usuario: {userInfo?.name} ({userInfo?.age} años)
            </p>
          )}
        </div>

        {/* Navigation Helper */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/welcome-registration')}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-150"
          >
            ← Volver al registro
          </button>
        </div>
      </div>
      {/* Loading Overlay */}
      <LoadingState
        isVisible={isLoading}
        message="Validando tu respuesta..."
        estimatedTime="30-60 segundos"
      />
      {/* Error Modal */}
      <ErrorModal
        isVisible={showError}
        adminMessage={adminMessage}
        onRetry={handleRetry}
        onClose={handleCloseError}
        attemptCount={attemptCount}
      />
    </div>
  );
};

export default QuizQuestion;