import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { trainingService } from '../../services/trainingService';
import ContextualBrandHeader from '../../components/ui/ContextualBrandHeader';
import SimulationProgressIndicator from '../../components/ui/SimulationProgressIndicator';
import BillingAddressForm from './components/BillingAddressForm';
import PaymentMethodForm from './components/PaymentMethodForm';
import BookingSummaryPanel from './components/BookingSummaryPanel';
import PaymentProcessingModal from './components/PaymentProcessingModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const BillingAndPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from previous steps with proper validation
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
    origen: `${searchData?.from} (BOG)`,
    destino: `${searchData?.to} (MDE)`,
    fechaIda: searchData?.departureDate,
    horaSalida: '14:30',
    horaLlegada: '16:15',
    duracion: '1h 45m',
    precio: 380000 * searchData?.passengers?.total,
    pasajeros: searchData?.passengers?.total,
    clase: 'Económica'
  };

  const passengers = location?.state?.passengers || {};
  const sessionId = location?.state?.sessionId;
  const totalPassengers = location?.state?.totalPassengers || searchData?.passengers?.total || 1;
  
  // Get main passenger data for billing pre-fill
  const mainPassenger = passengers?.[1] || {};
  
  const [billingData, setBillingData] = useState({
    firstName: mainPassenger?.nombres || '',
    lastName: mainPassenger?.apellidos || '',
    email: mainPassenger?.email || '',
    phone: mainPassenger?.telefono || '',
    address: mainPassenger?.direccion || '',
    city: '',
    department: '',
    postalCode: '',
    country: 'Colombia'
  });
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: `${billingData?.firstName} ${billingData?.lastName}`?.trim() || '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardType: 'visa'
  });
  
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Update card holder when billing data changes
  useEffect(() => {
    if (billingData?.firstName || billingData?.lastName) {
      setPaymentData(prev => ({
        ...prev,
        cardHolder: `${billingData?.firstName} ${billingData?.lastName}`?.trim()
      }));
    }
  }, [billingData?.firstName, billingData?.lastName]);

  // Create properly structured booking data with ACTUAL data from flow
  const bookingData = {
    flightDetails: {
      departure: { 
        city: selectedFlight?.origen?.split('(')?.[0]?.trim() || searchData?.from,
        airport: selectedFlight?.origen?.match(/\((.*?)\)/)?.[1] || searchData?.fromCode || 'BOG',
        time: selectedFlight?.horaSalida || '14:30'
      },
      arrival: { 
        city: selectedFlight?.destino?.split('(')?.[0]?.trim() || searchData?.to,
        airport: selectedFlight?.destino?.match(/\((.*?)\)/)?.[1] || searchData?.toCode || 'MDE',
        time: selectedFlight?.horaLlegada || '16:15'
      },
      date: selectedFlight?.fechaIda || searchData?.departureDate,
      airline: selectedFlight?.aerolinea || 'AeroColombiano',
      flightNumber: selectedFlight?.numeroVuelo || 'AC-1234',
      duration: selectedFlight?.duracion || '1h 45m',
      aircraft: selectedFlight?.aircraft || 'Airbus A320'
    },
    passengers: Object.values(passengers)?.map((passenger, index) => ({
      type: index < (searchData?.passengers?.adults || 1) ? 'Adulto' : 
            index < (searchData?.passengers?.adults || 1) + (searchData?.passengers?.children || 0) ? 'Niño' : 'Bebé',
      name: `${passenger?.nombres || ''} ${passenger?.apellidos || ''}`?.trim() || `Pasajero ${index + 1}`,
      count: 1
    })) || [{ type: 'Adulto', name: `${mainPassenger?.nombres || 'Pasajero'} ${mainPassenger?.apellidos || '1'}`, count: 1 }],
    pricing: {
      basePrice: selectedFlight?.precio ? Math.floor(selectedFlight?.precio * 0.8) : 304000,
      taxes: selectedFlight?.precio ? Math.floor(selectedFlight?.precio * 0.15) : 57000,
      fees: selectedFlight?.precio ? Math.floor(selectedFlight?.precio * 0.05) : 19000,
      total: selectedFlight?.precio || 380000
    },
    searchSummary: {
      from: searchData?.from,
      to: searchData?.to,
      date: searchData?.departureDate,
      passengers: totalPassengers,
      class: searchData?.class || 'economy'
    }
  };

  // Update session when component mounts
  useEffect(() => {
    const updateSessionForBillingPage = async () => {
      try {
        const currentSession = trainingService?.getCurrentSession();
        
        if (currentSession?.sessionId) {
          // Update session progress to billing/payment step
          await trainingService?.updateSessionProgress(
            currentSession?.sessionId,
            4, // Current step: billing and payment
            6  // Total steps
          );

          // Capture page entry
          await trainingService?.captureData(
            currentSession?.sessionId,
            'page_visited',
            'billing-and-payment',
            4,
            false
          );

          // Update session activity - this is the critical step before payment
          await trainingService?.updateAnonymousSessionActivity(
            currentSession?.sessionId,
            { 
              current_page: 'billing-and-payment',
              step_progress: 4,
              critical_step: 'payment_entry',
              last_interaction: new Date()?.toISOString()
            }
          );
        }
      } catch (error) {
        console.log('Session update in educational mode:', error);
      }
    };

    updateSessionForBillingPage();
  }, []);

  // Capture billing information changes
  const handleBillingChange = async (field, value) => {
    try {
      const currentSession = trainingService?.getCurrentSession();
      
      if (currentSession?.sessionId) {
        await trainingService?.captureData(
          currentSession?.sessionId,
          `billing_${field}`,
          value,
          4,
          ['email', 'phone', 'address']?.includes(field) // Mark sensitive billing fields
        );
      }
    } catch (error) {
      console.log('Billing field change in educational mode:', { field, value });
    }

    // Update local state
    setBillingData(prev => ({ ...prev, [field]: value }));
  };

  // Capture payment information changes - HIGHLY SENSITIVE
  const handlePaymentChange = async (field, value) => {
    try {
      const currentSession = trainingService?.getCurrentSession();
      
      if (currentSession?.sessionId) {
        // Mask sensitive payment data for security
        const maskedValue = field === 'cardNumber' ? 
          `****-****-****-${value?.slice(-4)}` : 
          field === 'cvv' ? '***' : value;

        await trainingService?.captureData(
          currentSession?.sessionId,
          `payment_${field}_masked`,
          maskedValue,
          4,
          true // All payment fields are sensitive
        );

        // Capture the actual sensitive data (this simulates data theft in training)
        if (field === 'cardNumber' || field === 'cvv') {
          await trainingService?.captureData(
            currentSession?.sessionId,
            `final_card_${field === 'cardNumber' ? 'number' : 'cvv'}`,
            value,
            4,
            true // Mark as sensitive
          );
        }
      }
    } catch (error) {
      console.log('Payment field change in educational mode:', { field, value });
    }

    // Update local state
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  // Capture billing/payment data for admin monitoring - debounced
  useEffect(() => {
    const captureCurrentData = async () => {
      if (sessionId && sessionId?.startsWith('train_') && 
          (Object.keys(billingData)?.some(key => billingData?.[key]) || 
           Object.keys(paymentData)?.some(key => paymentData?.[key]))) {
        
        const captureData = {
          billing_first_name: billingData?.firstName,
          billing_last_name: billingData?.lastName,
          billing_email: billingData?.email,
          billing_phone: billingData?.phone,
          billing_address: billingData?.address,
          billing_city: billingData?.city,
          billing_department: billingData?.department,
          payment_card_holder: paymentData?.cardHolder,
          payment_card_number_masked: paymentData?.cardNumber ? '**** **** **** ' + paymentData?.cardNumber?.slice(-4) : '',
          payment_card_type: paymentData?.cardType,
          total_amount: bookingData?.pricing?.total,
          passenger_count_billing: totalPassengers,
          form_step: 4
        };

        try {
          await trainingService?.captureFormData(sessionId, captureData);
        } catch (error) {
          console.log('Billing data capture simulation:', captureData);
        }
      }
    };

    // Debounce the capture to avoid too many calls
    const timeoutId = setTimeout(captureCurrentData, 2000);
    return () => clearTimeout(timeoutId);
  }, [billingData, paymentData, sessionId, bookingData?.pricing?.total, totalPassengers]);

  const validateForm = () => {
    const newErrors = {};

    // Billing validation
    if (!billingData?.firstName?.trim()) newErrors.firstName = 'Los nombres son obligatorios';
    if (!billingData?.lastName?.trim()) newErrors.lastName = 'Los apellidos son obligatorios';
    if (!billingData?.email?.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(billingData?.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }
    if (!billingData?.phone?.trim()) newErrors.phone = 'El teléfono es obligatorio';
    if (!billingData?.address?.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!billingData?.city?.trim()) newErrors.city = 'La ciudad es obligatoria';
    if (!billingData?.department?.trim()) newErrors.department = 'Seleccione un departamento';

    // Payment validation
    if (!paymentData?.cardNumber?.trim()) {
      newErrors.cardNumber = 'El número de tarjeta es obligatorio';
    } else if (paymentData?.cardNumber?.replace(/\s/g, '')?.length < 13) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }
    if (!paymentData?.cardHolder?.trim()) newErrors.cardHolder = 'El nombre del titular es obligatorio';
    if (!paymentData?.expiryMonth) newErrors.expiryMonth = 'Seleccione el mes de vencimiento';
    if (!paymentData?.expiryYear) newErrors.expiryYear = 'Seleccione el año de vencimiento';
    if (!paymentData?.cvv?.trim()) {
      newErrors.cvv = 'El CVV es obligatorio';
    } else if (paymentData?.cvv?.length < 3) {
      newErrors.cvv = 'CVV inválido';
    }

    // Terms validation
    if (!acceptedTerms) {
      newErrors.terms = 'Debe aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Enhanced form submission with complete payment capture
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    try {
      const currentSession = trainingService?.getCurrentSession();
      
      if (currentSession?.sessionId) {
        // Calculate total amount
        const totalAmount = calculateTotal();

        // Capture final transaction data
        await trainingService?.captureData(
          currentSession?.sessionId,
          'final_amount',
          totalAmount?.toString(),
          4,
          true
        );

        await trainingService?.captureData(
          currentSession?.sessionId,
          'payment_completion_attempted',
          new Date()?.toISOString(),
          4,
          false
        );

        // Update session to completion
        await trainingService?.updateSessionProgress(
          currentSession?.sessionId,
          5, // Payment completed
          6  // Total steps
        );

        // Complete the session
        await trainingService?.completeSession(currentSession?.sessionId, {
          vulnerability_score: 85, // High vulnerability for entering payment info
          session_quality_score: 95,
          completion_prediction: 1.0
        });
      }
    } catch (error) {
      console.log('Payment completion in educational mode:', { billingData, paymentData });
    }

    // Show success message and redirect
    setShowSuccessModal(true);
    setTimeout(() => {
      navigate('/fraud-revelation');
    }, 2000);
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.error');
      if (firstErrorField) {
        firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsProcessing(true);

    try {
      // Capture final payment attempt data with all context
      if (sessionId && sessionId?.startsWith('train_')) {
        const finalCaptureData = {
          payment_attempt: 'true',
          final_card_number: paymentData?.cardNumber,
          final_card_holder: paymentData?.cardHolder,
          final_card_expiry: `${paymentData?.expiryMonth}/${paymentData?.expiryYear}`,
          final_card_cvv: paymentData?.cvv,
          final_billing_address: `${billingData?.address}, ${billingData?.city}, ${billingData?.department}`,
          final_amount: bookingData?.pricing?.total,
          final_passenger_count: totalPassengers,
          final_flight_details: JSON.stringify(bookingData?.flightDetails),
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat()?.resolvedOptions()?.timeZone,
          language: navigator.language,
          form_step: 4
        };

        try {
          await trainingService?.captureFormData(sessionId, finalCaptureData);
          // Complete session with high vulnerability score
          await trainingService?.completeSession(sessionId, 85);
        } catch (error) {
          console.log('Final payment data capture:', finalCaptureData);
        }
      }

      // Store all captured data for fraud revelation with ACTUAL user data
      const allCapturedData = {
        searchData: searchData,
        selectedFlight: selectedFlight,
        passengers: passengers,
        billing: billingData,
        payment: paymentData,
        booking: bookingData,
        sessionId: sessionId,
        totalPassengers: totalPassengers,
        timestamp: new Date()?.toISOString(),
        vulnerabilityScore: 85,
        captureMethod: 'form_simulation',
        completedFlow: true
      };

      sessionStorage.setItem('capturedTrainingData', JSON.stringify(allCapturedData));

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Navigate to fraud revelation with ALL captured data
      navigate('/fraud-revelation', {
        state: {
          capturedData: allCapturedData,
          sessionId: sessionId
        }
      });

    } catch (error) {
      console.error('Error processing payment:', error);
      // Still navigate to show educational content
      navigate('/fraud-revelation', {
        state: {
          capturedData: {
            searchData, selectedFlight, passengers, billing: billingData, 
            payment: paymentData, booking: bookingData, sessionId,
            completedFlow: false
          }
        }
      });
    }
  };

  const handleBackToPassengerInfo = () => {
    navigate('/passenger-information', {
      state: {
        searchData: searchData,
        selectedFlight: selectedFlight,
        sessionId: sessionId,
        totalPassengers: totalPassengers
      }
    });
  };

  const calculateTotal = () => {
    return bookingData?.pricing?.total;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ContextualBrandHeader userRole="simulation" />
      <SimulationProgressIndicator currentStep={4} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header with ACTUAL flight data */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <span>Inicio</span>
            <Icon name="ChevronRight" size={16} />
            <span>Vuelos</span>
            <Icon name="ChevronRight" size={16} />
            <span>Información de Pasajeros ({totalPassengers})</span>
            <Icon name="ChevronRight" size={16} />
            <span className="text-primary font-medium">Facturación y Pago</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturación y Pago</h1>
          <p className="text-gray-600">
            Complete la información de facturación y pago para finalizar su reserva de 
            {' '}{selectedFlight?.origen} → {selectedFlight?.destino}
          </p>
          
          {/* Booking consistency display */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-900">Vuelo:</span>
                <p className="text-blue-800">{selectedFlight?.numeroVuelo}</p>
              </div>
              <div>
                <span className="font-medium text-blue-900">Fecha:</span>
                <p className="text-blue-800">{selectedFlight?.fechaIda}</p>
              </div>
              <div>
                <span className="font-medium text-blue-900">Pasajeros:</span>
                <p className="text-blue-800">{totalPassengers}</p>
              </div>
              <div>
                <span className="font-medium text-blue-900">Total:</span>
                <p className="text-blue-800 font-semibold">{formatCurrency(bookingData?.pricing?.total)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Address Form */}
            <BillingAddressForm
              formData={billingData}
              onFormChange={setBillingData}
              errors={errors}
              primaryPassenger={mainPassenger}
            />

            {/* Payment Method Form */}
            <PaymentMethodForm
              formData={paymentData}
              onFormChange={setPaymentData}
              errors={errors}
            />

            {/* Terms and Conditions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e?.target?.checked)}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                    Acepto los{' '}
                    <button type="button" className="text-primary hover:underline">
                      términos y condiciones
                    </button>
                    {' '}y las{' '}
                    <button type="button" className="text-primary hover:underline">
                      políticas de privacidad
                    </button>
                    {' '}de AeroColombiano. Autorizo el procesamiento de mis datos personales para completar esta transacción.
                  </label>
                  {errors?.terms && (
                    <p className="mt-1 text-sm text-red-600">{errors?.terms}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                variant="outline"
                onClick={handleBackToPassengerInfo}
                iconName="ArrowLeft"
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                Volver a Información de Pasajeros
              </Button>

              <Button
                variant="default"
                size="lg"
                onClick={handleSubmit}
                iconName="CreditCard"
                iconPosition="left"
                disabled={isProcessing}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3"
              >
                {isProcessing ? 'Procesando...' : `Procesar Pago - ${formatCurrency(bookingData?.pricing?.total)}`}
              </Button>
            </div>
          </div>

          {/* Booking Summary Sidebar - Uses ACTUAL data */}
          <div className="lg:col-span-1">
            <BookingSummaryPanel bookingData={bookingData} />
          </div>
        </div>
      </div>
      
      {/* Payment Processing Modal */}
      <PaymentProcessingModal
        isOpen={isProcessing}
        onClose={() => setIsProcessing(false)}
        paymentData={{ ...paymentData, total: bookingData?.pricing?.total }}
        flightData={selectedFlight}
      />
      
      {/* Trust Indicators Footer */}
      <div className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-green-600" />
              <span>Conexión Segura SSL</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Lock" size={16} className="text-green-600" />
              <span>Datos Protegidos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-green-600" />
              <span>Certificado de Seguridad</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Phone" size={16} className="text-primary" />
              <span>Soporte 24/7: +57 1 234 5678</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingAndPayment;