import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContextualBrandHeader from '../../components/ui/ContextualBrandHeader';
import SimulationProgressIndicator from '../../components/ui/SimulationProgressIndicator';
import HeroSection from './components/HeroSection';
import FlightSearchForm from './components/FlightSearchForm';
import PopularDestinations from './components/PopularDestinations';
import TrustSignals from './components/TrustSignals';
import { trainingService } from '../../services/trainingService';

const FlightSearchHomepage = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize session when component mounts
  useEffect(() => {
    const initializeUserSession = async () => {
      try {
        // Check if session already exists
        const currentSession = trainingService?.getCurrentSession();
        
        if (!currentSession?.sessionId) {
          // Initialize new session for this user
          const { data: sessionData, error } = await trainingService?.initializeSession();
          
          if (!error && sessionData) {
            console.log('User session initialized:', {
              sessionId: sessionData?.id,
              sessionToken: sessionData?.session_token,
              startTime: sessionData?.started_at
            });

            // Capture entry point data
            await trainingService?.captureData(
              sessionData?.id,
              'entry_point',
              'homepage',
              0,
              false
            );

            // Capture entry timestamp
            await trainingService?.captureData(
              sessionData?.id,
              'entry_timestamp',
              new Date()?.toISOString(),
              0,
              false
            );
          }
        } else {
          // Update existing session activity
          await trainingService?.updateAnonymousSessionActivity(
            currentSession?.sessionId,
            { 
              current_page: 'homepage',
              last_interaction: new Date()?.toISOString()
            }
          );
        }
      } catch (error) {
        console.log('Session initialization in educational mode:', error);
      }
    };

    initializeUserSession();
  }, []);

  // Update session when user interacts with search form
  const handleSearchInteraction = async (field, value) => {
    try {
      const currentSession = trainingService?.getCurrentSession();
      
      if (currentSession?.sessionId) {
        await trainingService?.captureData(
          currentSession?.sessionId,
          field,
          value,
          1, // Search step
          false
        );

        // Update session progress
        await trainingService?.updateSessionProgress(
          currentSession?.sessionId,
          1, // Current step: search
          6  // Total steps in the flow
        );
      }
    } catch (error) {
      console.log('Search interaction capture in educational mode:', { field, value });
    }
  };

  // Enhanced form submission with session tracking
  const handleSearch = async (e) => {
    e?.preventDefault();
    
    // Capture search data
    await handleSearchInteraction('search_from', searchFrom);
    await handleSearchInteraction('search_to', searchTo);
    await handleSearchInteraction('search_date', departureDate);
    await handleSearchInteraction('passenger_count', passengers);

    console.log('Processing search:', searchData);
    setSearchData(searchData);
    setIsLoading(true);

    try {
      // Simulate processing delay
      setTimeout(() => {
        setIsLoading(false);
        // Navigate to flight results with search data
        navigate('/flight-results-selection', {
          state: {
            searchData: searchData
          }
        });
      }, 1500);
    } catch (error) {
      console.error('Search processing error:', error);
      setIsLoading(false);
      // Ensure navigation happens even if there's an error
      navigate('/flight-results-selection', {
        state: {
          searchData: searchData || {
            from: 'Bogotá',
            to: 'Medellín',
            passengers: { adults: 1, children: 0, infants: 0, total: 1 },
            departureDate: '2024-12-15',
            tripType: 'one-way'
          }
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ContextualBrandHeader userRole="participant" />
      <SimulationProgressIndicator currentStep={1} totalSteps={6} />
      
      <main className="w-full">
        <HeroSection />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FlightSearchForm 
            onSubmit={handleSearch}
            isLoading={isLoading}
          />
          
          <div className="mt-16 space-y-16">
            <PopularDestinations />
            <TrustSignals />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FlightSearchHomepage;