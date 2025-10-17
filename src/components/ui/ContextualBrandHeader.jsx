import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';


const ContextualBrandHeader = ({ userRole = 'simulation', simulationStage = 'booking' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine context based on current route and props
  const isSimulationContext = userRole === 'simulation' && 
    ['/flight-search-homepage', '/flight-results-selection', '/passenger-information', '/billing-and-payment']?.includes(location?.pathname);
  
  const isAdminContext = location?.pathname === '/admin-dashboard' || userRole === 'admin';
  const isEducationalContext = location?.pathname === '/educational-landing' || location?.pathname === '/fraud-revelation';

  // Navigation items based on context
  const getNavigationItems = () => {
    if (isSimulationContext) {
      // Minimal navigation for booking authenticity
      return [
        { label: 'Flights', path: '/flight-search-homepage', active: location?.pathname === '/flight-search-homepage' },
        { label: 'My Trips', path: '#', active: false },
        { label: 'Check-in', path: '#', active: false },
        { label: 'Help', path: '#', active: false }
      ];
    }
    
    if (isAdminContext) {
      // REMOVED all navigation tabs for admin context
      return [];
    }
    
    if (isEducationalContext) {
      return [
        { label: 'Home', path: '/educational-landing', active: location?.pathname === '/educational-landing' },
        { label: 'Training', path: '/educational-landing', active: false },
        { label: 'Resources', path: '/educational-landing', active: false },
        { label: 'About', path: '#', active: false }
      ];
    }
    
    return [];
  };

  const navigationItems = getNavigationItems();

  // Brand configuration based on context
  const getBrandConfig = () => {
    if (isSimulationContext) {
      return {
        logo: (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Plane" size={20} color="white" />
            </div>
            <span className="text-xl font-heading font-bold text-primary">AeroLineas</span>
          </div>
        ),
        showAuth: true,
        authLabel: 'Sign In'
      };
    }
    
    if (isAdminContext) {
      return {
        logo: (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} color="white" />
            </div>
            <span className="text-xl font-heading font-bold text-secondary">CyberSafety Admin</span>
          </div>
        ),
        showAuth: false,
        authLabel: null
      };
    }
    
    return {
      logo: (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
            <Icon name="GraduationCap" size={20} color="white" />
          </div>
          <span className="text-xl font-heading font-bold text-success">CyberSafety Trainer</span>
        </div>
      ),
      showAuth: true,
      authLabel: 'Login'
    };
  };

  const brandConfig = getBrandConfig();

  const handleNavigation = (path) => {
    if (path !== '#') {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  const handleAuthClick = () => {
    if (isSimulationContext) {
      // Simulate airline login
      console.log('Airline login clicked');
    } else {
      // Educational/admin login
      console.log('Educational login clicked');
    }
  };

  return (
    <header className="bg-surface border-b border-border shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Centered for admin context */}
          <div className={`flex-shrink-0 cursor-pointer ${
            isAdminContext ? 'mx-auto' : ''
          }`} onClick={() => handleNavigation(navigationItems?.[0]?.path || '/')}>
            {brandConfig?.logo}
          </div>

          {/* Desktop Navigation - Hidden for admin context */}
          {!isAdminContext && (
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item?.path)}
                  className={`px-3 py-2 text-sm font-medium transition-micro rounded-md ${
                    item?.active
                      ? 'text-primary bg-primary/10' :'text-text-primary hover:text-primary hover:bg-muted'
                  }`}
                >
                  {item?.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right Side Actions - Hidden for admin context */}
          {!isAdminContext && (
            <div className="flex items-center space-x-4">
              {/* Auth Button */}
              {brandConfig?.showAuth && (
                <button
                  onClick={handleAuthClick}
                  className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-button transition-micro"
                >
                  {brandConfig?.authLabel}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-text-primary hover:text-primary hover:bg-muted transition-micro"
              >
                <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation - Hidden for admin context */}
        {isMenuOpen && !isAdminContext && (
          <div className="md:hidden border-t border-border bg-surface">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item?.path)}
                  className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-micro ${
                    item?.active
                      ? 'text-primary bg-primary/10' :'text-text-primary hover:text-primary hover:bg-muted'
                  }`}
                >
                  {item?.label}
                </button>
              ))}
              
              {/* Mobile Auth Button */}
              {brandConfig?.showAuth && (
                <button
                  onClick={handleAuthClick}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-button transition-micro mt-4"
                >
                  {brandConfig?.authLabel}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ContextualBrandHeader;