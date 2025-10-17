import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompletionMessage from './components/CompletionMessage';
import NextStepsInfo from './components/NextStepsInfo';
import SessionSummary from './components/SessionSummary';

const CompletionThankYou = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get session data from localStorage
    const storedSessionData = localStorage.getItem('quizSessionData');
    const storedUserName = localStorage.getItem('quizUserName');
    
    if (storedSessionData) {
      try {
        const parsedData = JSON.parse(storedSessionData);
        setSessionData(parsedData);
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }

    // Check if user should be on this page
    const completionStatus = localStorage.getItem('quizCompletionStatus');
    if (completionStatus !== 'completed') {
      // Redirect to welcome if not completed
      navigate('/welcome-registration', { replace: true });
    }

    // Optional: Clear session data after showing completion
    // This can be uncommented if you want to clear data immediately
    // setTimeout(() => {
    //   localStorage.removeItem('quizSessionData');
    //   localStorage.removeItem('quizUserName');
    //   localStorage.removeItem('quizCompletionStatus');
    // }, 5000);

  }, [navigate]);

  const handleStartNewSession = () => {
    // Clear all quiz-related data
    localStorage.removeItem('quizSessionData');
    localStorage.removeItem('quizUserName');
    localStorage.removeItem('quizCompletionStatus');
    localStorage.removeItem('quizCurrentStep');
    localStorage.removeItem('quizSessionId');
    
    // Navigate to start
    navigate('/welcome-registration');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Content Container */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          
          {/* Header Section */}
          <div className="px-8 py-12">
            <CompletionMessage 
              userName={userName}
              completionTime={new Date()}
              sessionId={sessionData?.sessionId || ''}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-white/30 mx-8"></div>

          {/* Session Summary Section */}
          <div className="px-8 py-8">
            <SessionSummary sessionData={sessionData} />
          </div>

          {/* Divider */}
          <div className="border-t border-white/30 mx-8"></div>

          {/* Next Steps Section */}
          <div className="px-8 py-8">
            <NextStepsInfo />
          </div>

          {/* Footer Actions */}
          <div className="bg-white/40 backdrop-blur-sm px-8 py-6 border-t border-white/30">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleStartNewSession}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Realizar nuevo cuestionario
              </button>
              
              <p className="text-sm text-slate-600 text-center">
                ¿Quieres participar nuevamente? Puedes iniciar una nueva sesión
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-600">
            Gracias por tu tiempo y participación • {new Date()?.getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompletionThankYou;