import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { trainingService } from '../../services/trainingService';
import { flightService } from '../../services/flightService';
import ContextualBrandHeader from '../../components/ui/ContextualBrandHeader';
import SimulationProgressIndicator from '../../components/ui/SimulationProgressIndicator';
import SearchSummary from './components/SearchSummary';
import FlightCard from './components/FlightCard';
import BookingSummary from './components/BookingSummary';

const FlightResultsSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get search data from previous step with enhanced validation
  const searchData = location?.state?.searchData || {
    from: 'Bogotá',
    to: 'Santa Marta',
    fromCode: 'BOG',
    toCode: 'SMR',
    departureDate: '2024-12-15',
    returnDate: null,
    passengers: { adults: 1, children: 0, infants: 0, total: 1 },
    tripType: 'one-way',
    class: 'economy'
  };

  // Ensure passenger data is properly structured (fallback for existing sessions)
  const normalizedSearchData = {
    ...searchData,
    // Preserve individual passenger fields for backward compatibility
    adults: searchData?.adults || searchData?.passengers?.adults || 1,
    children: searchData?.children || searchData?.passengers?.children || 0,
    infants: searchData?.infants || searchData?.passengers?.infants || 0,
    passengers: searchData?.passengers || {
      adults: Number(searchData?.adults) || 1,
      children: Number(searchData?.children) || 0,
      infants: Number(searchData?.infants) || 0,
      total: Number(searchData?.adults || 1) + Number(searchData?.children || 0) + Number(searchData?.infants || 0)
    }
  };

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flights, setFlights] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchProcessed, setSearchProcessed] = useState(false);

  // Get session from storage
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('trainingSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
  }, []);

  // Update session activity when component mounts
  useEffect(() => {
    const updateSessionForResultsPage = async () => {
      try {
        const currentSession = trainingService?.getCurrentSession();
        
        if (currentSession?.sessionId) {
          // Update session progress to selection step
          await trainingService?.updateSessionProgress(
            currentSession?.sessionId,
            2, // Current step: flight selection
            6  // Total steps
          );

          // Capture page entry
          await trainingService?.captureData(
            currentSession?.sessionId,
            'page_visited',
            'flight-results-selection',
            2,
            false
          );

          // Update session activity
          await trainingService?.updateAnonymousSessionActivity(
            currentSession?.sessionId,
            { 
              current_page: 'flight-results',
              step_progress: 2,
              last_interaction: new Date()?.toISOString()
            }
          );
        }
      } catch (error) {
        console.log('Session update in educational mode:', error);
      }
    };

    updateSessionForResultsPage();
  }, []);

  // Generate flights using the new flight service
  useEffect(() => {
    if (!searchProcessed) {
      try {
        console.log('Generating flights with normalized search data:', normalizedSearchData);
        const generatedFlights = flightService?.searchFlights(normalizedSearchData);
        console.log('Generated flights:', generatedFlights);
        setFlights(generatedFlights);
        setSearchProcessed(true);
      } catch (error) {
        console.error('Error generating flights:', error);
        setFlights([]);
        setSearchProcessed(true);
      }
    }
  }, [normalizedSearchData, searchProcessed]);

  // Enhanced flight selection with session tracking
  const handleSelectFlight = async (flight) => {
    try {
      const currentSession = trainingService?.getCurrentSession();
      
      if (currentSession?.sessionId) {
        // Capture selected flight data
        await trainingService?.captureData(
          currentSession?.sessionId,
          'selected_flight_id',
          flight?.id,
          2,
          false
        );

        await trainingService?.captureData(
          currentSession?.sessionId,
          'selected_price',
          flight?.price,
          2,
          false
        );

        await trainingService?.captureData(
          currentSession?.sessionId,
          'flight_selection_time',
          new Date()?.toISOString(),
          2,
          false
        );
      }
    } catch (error) {
      console.log('Flight selection capture in educational mode:', flight);
    }

    setSelectedFlight(flight);
    navigate('/passenger-information');
  };

  const handleBackToSearch = () => {
    navigate('/', {
      state: { searchData: normalizedSearchData }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ContextualBrandHeader userRole="participant" />
      <SimulationProgressIndicator currentStep={2} totalSteps={6} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* JetSmart-style Route Header */}
        <SearchSummary 
          searchData={normalizedSearchData} 
          searchCriteria={normalizedSearchData}
          onEdit={handleBackToSearch}
        />
        
        {/* Two-column layout like JetSmart - Desktop only */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flight Cards - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-4 pb-24 lg:pb-6">
            {flights?.length > 0 ? (
              flights?.map((flight) => (
                <FlightCard
                  key={flight?.id}
                  flight={flight}
                  searchData={normalizedSearchData}
                  onSelect={() => handleSelectFlight(flight)}
                  isSelected={selectedFlight?.id === flight?.id}
                  isLoading={isLoading && selectedFlight?.id === flight?.id}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-gray-500 text-lg mb-4">Cargando vuelos disponibles...</p>
                <p className="text-gray-400 text-sm">
                  Buscando vuelos desde {normalizedSearchData?.from} hacia {normalizedSearchData?.to}
                </p>
              </div>
            )}
          </div>
          
          {/* Booking Summary Sidebar - Desktop only */}
          <div className="hidden lg:block lg:col-span-1">
            <BookingSummary 
              searchData={normalizedSearchData}
              selectedFlight={selectedFlight}
              onContinue={() => {
                if (selectedFlight) {
                  handleSelectFlight(selectedFlight);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking Summary */}
      <div className="lg:hidden">
        <BookingSummary 
          searchData={normalizedSearchData}
          selectedFlight={selectedFlight}
          onContinue={() => {
            if (selectedFlight) {
              handleSelectFlight(selectedFlight);
            }
          }}
        />
      </div>
    </div>
  );
};

export default FlightResultsSelection;