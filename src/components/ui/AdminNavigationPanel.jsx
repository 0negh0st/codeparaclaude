import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const AdminNavigationPanel = ({ 
  isCollapsed = false, 
  isMobileOpen = false,
  onToggleCollapse, 
  onMobileClose 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only show on admin dashboard
  const shouldShow = location?.pathname === '/admin-dashboard';

  // Simplified navigation items for admin panel - REMOVED Active Sessions & Real-time Monitor
  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      shortLabel: 'Resumen',
      icon: 'BarChart3',
      path: '/admin-dashboard',
      active: true,
      badge: null
    }
  ];

  // Simplified secondary items - REMOVED Analytics, Reports, Alerts, Help & Support
  const secondaryItems = [
    {
      id: 'settings',
      label: 'Settings',
      shortLabel: 'Config',
      icon: 'Settings',
      path: '/admin-dashboard',
      active: false
    }
  ];

  const handleNavigation = (item) => {
    if (item?.path !== '#') {
      navigate(item?.path);
    }
    
    // Close mobile nav when item is selected
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
    
    console.log(`Admin navigation: ${item?.label}`);
  };

  if (!shouldShow) return null;

  // Mobile Navigation (Slide-over)
  if (isMobile) {
    return (
      <div className={`fixed inset-y-0 left-0 w-64 bg-surface border-r border-border shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full pt-16">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-heading font-semibold text-secondary">Admin Panel</h2>
            <button
              onClick={onMobileClose}
              className="p-2 rounded-md text-text-secondary hover:text-primary hover:bg-muted transition-micro"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems?.map((item) => (
              <button
                key={item?.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-micro group ${
                  item?.active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-primary hover:text-primary hover:bg-muted'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  className="flex-shrink-0 mr-3"
                />
                <span className="flex-1 text-left">{item?.shortLabel || item?.label}</span>
                {item?.badge && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full min-w-[20px] text-center ${
                    item?.active
                      ? 'bg-primary-foreground text-primary'
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {item?.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Divider */}
            <div className="my-4 border-t border-border" />

            {/* Secondary Navigation */}
            {secondaryItems?.map((item) => (
              <button
                key={item?.id}
                onClick={() => handleNavigation(item)}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-text-secondary hover:text-primary hover:bg-muted rounded-md transition-micro group"
              >
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  className="flex-shrink-0 mr-3"
                />
                <span className="flex-1 text-left">{item?.shortLabel || item?.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Status Indicator */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-text-secondary">Sistema Online</span>
            </div>
            <div className="mt-2 text-xs text-text-secondary">
              Actualizado: {new Date()?.toLocaleTimeString('es-CO', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Navigation
  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-surface border-r border-border shadow-soft z-40 transition-all duration-300 hidden md:block ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Desktop Toggle Button */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <h2 className="text-lg font-heading font-semibold text-secondary">Admin Panel</h2>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-md text-text-secondary hover:text-primary hover:bg-muted transition-micro"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
          </button>
        </div>

        {/* Desktop Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems?.map((item) => (
            <button
              key={item?.id}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-micro group ${
                item?.active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-primary hover:text-primary hover:bg-muted'
              }`}
              title={isCollapsed ? item?.label : ''}
            >
              <Icon 
                name={item?.icon} 
                size={20} 
                className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
              />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item?.label}</span>
                  {item?.badge && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      item?.active
                        ? 'bg-primary-foreground text-primary'
                        : 'bg-accent text-accent-foreground'
                    }`}>
                      {item?.badge}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && item?.badge && (
                <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-accent text-accent-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {item?.badge}
                </span>
              )}
            </button>
          ))}

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Desktop Secondary Navigation */}
          {secondaryItems?.map((item) => (
            <button
              key={item?.id}
              onClick={() => handleNavigation(item)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary hover:bg-muted rounded-md transition-micro group"
              title={isCollapsed ? item?.label : ''}
            >
              <Icon 
                name={item?.icon} 
                size={20} 
                className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
              />
              {!isCollapsed && (
                <span className="flex-1 text-left">{item?.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Desktop Status Indicator */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-text-secondary">System Online</span>
            </div>
            <div className="mt-2 text-xs text-text-secondary">
              Last updated: {new Date()?.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminNavigationPanel;