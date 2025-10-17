import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ContextualBrandHeader from '../../components/ui/ContextualBrandHeader';
import RevealationHeader from './components/RevealationHeader';
import DataExposureSection from './components/DataExposureSection';
import FraudTechniquesSection from './components/FraudTechniquesSection';
import PreventionStrategiesSection from './components/PreventionStrategiesSection';
import EducationalCallToAction from './components/EducationalCallToAction';

const FraudRevelation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [capturedData, setCapturedData] = useState(null);
  const [fraudAnalysis, setFraudAnalysis] = useState(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Get captured data from location state or sessionStorage
    let dataFromFlow = location?.state?.capturedData;
    
    if (!dataFromFlow) {
      try {
        dataFromFlow = JSON.parse(sessionStorage?.getItem('capturedTrainingData') || '{}');
      } catch (error) {
        console.error('Error loading captured data:', error);
      }
    }

    if (dataFromFlow && Object.keys(dataFromFlow)?.length > 0) {
      setCapturedData(dataFromFlow);
      
      // Generate fraud analysis based on ACTUAL captured data
      const analysis = generateFraudAnalysis(dataFromFlow);
      setFraudAnalysis(analysis);
    } else {
      // Fallback to minimal mock data if no data was captured
      const mockData = {
        passengers: {
          1: {
            nombres: 'Usuario',
            apellidos: 'Ejemplo',
            email: 'usuario@ejemplo.com',
            telefono: '300-123-4567',
            numeroIdentificacion: '12345678'
          }
        },
        billing: {
          firstName: 'Usuario',
          lastName: 'Ejemplo',
          email: 'usuario@ejemplo.com',
          phone: '300-123-4567',
          address: 'Dirección no especificada'
        },
        payment: {
          cardNumber: '****-****-****-1234',
          cardHolder: 'USUARIO EJEMPLO',
          expiryMonth: '12',
          expiryYear: '2025'
        },
        searchData: {
          from: 'Bogotá',
          to: 'Medellín',
          passengers: { total: 1 }
        },
        selectedFlight: {
          precio: 380000
        },
        completedFlow: false
      };
      
      setCapturedData(mockData);
      setFraudAnalysis(generateFraudAnalysis(mockData));
    }

    // Log completion of simulation for admin tracking
    console.log('User reached fraud revelation screen at:', new Date()?.toISOString());
  }, [location]);

  const generateFraudAnalysis = (data) => {
    const hasPersonalData = data?.passengers || data?.billing;
    const hasPaymentData = data?.payment;
    const hasFlightData = data?.selectedFlight || data?.searchData;
    const completedFullFlow = data?.completedFlow;
    
    let riskLevel = 'LOW';
    let vulnerabilityScore = 30;
    
    if (completedFullFlow && hasPersonalData && hasPaymentData && hasFlightData) {
      riskLevel = 'CRITICAL';
      vulnerabilityScore = 95;
    } else if (hasPersonalData && hasPaymentData && hasFlightData) {
      riskLevel = 'HIGH';
      vulnerabilityScore = 85;
    } else if (hasPersonalData && hasPaymentData) {
      riskLevel = 'HIGH';
      vulnerabilityScore = 75;
    } else if (hasPersonalData) {
      riskLevel = 'MEDIUM';
      vulnerabilityScore = 55;
    }

    const exposedDataPoints = [];
    
    if (hasPersonalData) {
      // Count actual passenger data
      const passengerCount = Object.keys(data?.passengers || {})?.length;
      if (passengerCount > 0) {
        exposedDataPoints?.push(
          `Información personal de ${passengerCount} pasajero${passengerCount > 1 ? 's' : ''}`,
          'Nombres y apellidos completos',
          'Números de identificación',
          'Correos electrónicos',
          'Números de teléfono',
          'Direcciones residenciales',
          'Información de contactos de emergencia'
        );
      }
    }
    
    if (hasPaymentData) {
      exposedDataPoints?.push(
        'Información completa de tarjeta de crédito',
        'Número de tarjeta completo',
        'CVV de seguridad',
        'Fecha de vencimiento',
        'Nombre del titular',
        'Información de facturación completa'
      );
    }
    
    if (hasFlightData) {
      exposedDataPoints?.push(
        'Detalles completos del viaje planificado',
        'Fechas y horarios de vuelo',
        'Preferencias de viaje',
        'Información financiera (precio pagado)'
      );
    }

    // Generate personalized threat analysis
    const personalizedThreats = [];
    const mainPassenger = data?.passengers?.[1] || data?.billing || {};
    
    if (mainPassenger?.nombres || mainPassenger?.firstName) {
      personalizedThreats?.push(`Suplantación de identidad usando el nombre "${mainPassenger?.nombres || mainPassenger?.firstName}"`);
    }
    
    if (mainPassenger?.email || data?.billing?.email) {
      personalizedThreats?.push(`Phishing dirigido al correo ${mainPassenger?.email || data?.billing?.email}`);
    }
    
    if (data?.payment?.cardNumber) {
      personalizedThreats?.push('Uso fraudulento inmediato de la tarjeta de crédito');
      personalizedThreats?.push('Compras no autorizadas en línea');
    }
    
    if (data?.searchData?.from && data?.searchData?.to) {
      personalizedThreats?.push(`Estafas de viajes falsas entre ${data?.searchData?.from} y ${data?.searchData?.to}`);
    }

    return {
      riskLevel,
      vulnerabilityScore,
      exposedDataPoints,
      potentialThreats: personalizedThreats?.length > 0 ? personalizedThreats : [
        'Suplantación de identidad personalizada',
        'Fraude con tarjeta de crédito',
        'Ingeniería social dirigida',
        'Estafas de viajes especializadas',
        'Robo de identidad financiera',
        'Creación de perfiles criminales'
      ],
      dataCollectionMethods: [
        'Formularios web falsos pero convincentes',
        'Captura de datos en tiempo real durante la interacción',
        'Técnicas de ingeniería social aplicadas',
        'Recolección progresiva de información sensible',
        'Simulación de procesos legítimos de reserva',
        'Uso de confianza progresiva para extraer más datos'
      ],
      timeToExpose: calculateExposureTime(data),
      estimatedDamage: riskLevel === 'CRITICAL' ? 'CRÍTICO - Pérdida financiera inmediata, robo de identidad completo y potencial daño a largo plazo' :
        riskLevel === 'HIGH'? 'ALTO - Pérdida financiera significativa y compromiso de identidad': 'MEDIO - Potencial uso fraudulento de datos personales',
      capturedSummary: generateCapturedSummary(data)
    };
  };

  const calculateExposureTime = (data) => {
    // Calculate based on actual data captured
    const hasPassengers = data?.passengers && Object.keys(data?.passengers)?.length > 0;
    const hasBilling = data?.billing && Object.keys(data?.billing)?.length > 0;
    const hasPayment = data?.payment && Object.keys(data?.payment)?.length > 0;
    
    if (hasPassengers && hasBilling && hasPayment) return '4.2 minutos';
    if (hasPassengers && hasBilling) return '3.1 minutos';
    if (hasPassengers) return '2.3 minutos';
    return '1.5 minutos';
  };

  const generateCapturedSummary = (data) => {
    const summary = {
      passengersData: 0,
      billingData: false,
      paymentData: false,
      flightData: false,
      totalFields: 0
    };

    if (data?.passengers) {
      summary.passengersData = Object.keys(data?.passengers)?.length;
      summary.totalFields += Object.keys(data?.passengers)?.length * 8; // Average fields per passenger
    }

    if (data?.billing && Object.keys(data?.billing)?.length > 0) {
      summary.billingData = true;
      summary.totalFields += Object.keys(data?.billing)?.length;
    }

    if (data?.payment && Object.keys(data?.payment)?.length > 0) {
      summary.paymentData = true;
      summary.totalFields += Object.keys(data?.payment)?.length;
    }

    if (data?.selectedFlight || data?.searchData) {
      summary.flightData = true;
      summary.totalFields += 10; // Flight details count
    }

    return summary;
  };

  const handleContinueToEducation = () => {
    navigate('/educational-landing');
  };

  const handleRestartSimulation = () => {
    // Clear all captured data
    sessionStorage?.removeItem('capturedTrainingData');
    sessionStorage?.removeItem('trainingSessionId');
    sessionStorage?.removeItem('trainingSessionToken');
    // Return to homepage
    navigate('/');
  };

  if (!capturedData || !fraudAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analizando datos capturados...</p>
          <p className="text-sm text-gray-500 mt-2">Preparando revelación educativa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with educational context */}
      <ContextualBrandHeader userRole="educational" />
      {/* Main Content */}
      <main className="w-full">
        {/* Shock Revelation Header */}
        <RevealationHeader 
          riskLevel={fraudAnalysis?.riskLevel}
          vulnerabilityScore={fraudAnalysis?.vulnerabilityScore}
          capturedSummary={fraudAnalysis?.capturedSummary}
        />
        
        {/* Data Exposure Summary - Shows ACTUAL captured data */}
        <DataExposureSection 
          capturedData={capturedData}
          exposedDataPoints={fraudAnalysis?.exposedDataPoints}
          timeToExpose={fraudAnalysis?.timeToExpose}
          personalizedData={true}
        />
        
        {/* Fraud Techniques Education */}
        <FraudTechniquesSection 
          techniques={fraudAnalysis?.dataCollectionMethods}
          threats={fraudAnalysis?.potentialThreats}
          estimatedDamage={fraudAnalysis?.estimatedDamage}
        />
        
        {/* Prevention Strategies */}
        <PreventionStrategiesSection />
        
        {/* Call to Action for Further Learning */}
        <EducationalCallToAction
          onContinueEducation={handleContinueToEducation}
          onRestartSimulation={handleRestartSimulation}
        />
      </main>
      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
              <span className="text-success-foreground font-bold text-sm">CS</span>
            </div>
            <span className="text-xl font-heading font-bold">CyberSafety Trainer</span>
          </div>
          
          <p className="text-sm opacity-80 mb-4">
            Protegiendo a las personas vulnerables contra el fraude digital a través de la educación práctica
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-70">
            <span>Simulación Educativa</span>
            <span>•</span>
            <span>Entorno Seguro</span>
            <span>•</span>
            <span>Datos Ficticios</span>
            <span>•</span>
            <span>© {new Date()?.getFullYear()} CyberSafety</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-secondary-foreground/20">
            <p className="text-xs opacity-60">
              Esta es una simulación educativa. Los datos mostrados corresponden a la información que usted ingresó
              durante el ejercicio. Esta experiencia demuestra cómo los estafadores capturan información personal en línea.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FraudRevelation;