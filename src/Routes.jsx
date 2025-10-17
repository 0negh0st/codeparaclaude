import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

// Pages
import FlightSearchHomepage from './pages/flight-search-homepage';
import FlightResultsSelection from './pages/flight-results-selection';
import PassengerInformation from './pages/passenger-information';
import BillingAndPayment from './pages/billing-and-payment';
import FraudRevelation from './pages/fraud-revelation';
import EducationalLanding from './pages/educational-landing';
import AdminDashboard from './pages/admin-dashboard';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import NotFound from './pages/NotFound';

export default function Routes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public Routes - Flight booking simulation */}
            <Route path="/" element={<FlightSearchHomepage />} />
            <Route path="/flight-results-selection" element={<FlightResultsSelection />} />
            <Route path="/passenger-information" element={<PassengerInformation />} />
            <Route path="/billing-and-payment" element={<BillingAndPayment />} />
            <Route path="/fraud-revelation" element={<FraudRevelation />} />
            
            {/* Educational Routes */}
            <Route path="/educational-landing" element={<EducationalLanding />} />
            
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}