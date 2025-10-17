import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const EducationalResourceNavigation = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState('fraud-prevention');

  // Only show on educational pages
  const shouldShow = ['/educational-landing', '/fraud-revelation']?.includes(location?.pathname);

  // Resource categories and items
  const resourceSections = [
    {
      id: 'fraud-prevention',
      title: 'Fraud Prevention',
      icon: 'Shield',
      items: [
        { id: 'phishing-basics', label: 'Phishing Basics', path: '/educational-landing', icon: 'Mail' },
        { id: 'website-verification', label: 'Website Verification', path: '/educational-landing', icon: 'CheckCircle' },
        { id: 'secure-browsing', label: 'Secure Browsing', path: '/educational-landing', icon: 'Lock' },
        { id: 'red-flags', label: 'Warning Signs', path: '/educational-landing', icon: 'AlertTriangle' }
      ]
    },
    {
      id: 'training-modules',
      title: 'Training Modules',
      icon: 'BookOpen',
      items: [
        { id: 'interactive-demos', label: 'Interactive Demos', path: '/educational-landing', icon: 'Play' },
        { id: 'case-studies', label: 'Case Studies', path: '/educational-landing', icon: 'FileText' },
        { id: 'best-practices', label: 'Best Practices', path: '/educational-landing', icon: 'Star' },
        { id: 'assessment', label: 'Knowledge Assessment', path: '/educational-landing', icon: 'CheckSquare' }
      ]
    },
    {
      id: 'resources',
      title: 'Additional Resources',
      icon: 'Library',
      items: [
        { id: 'downloads', label: 'Downloads', path: '/educational-landing', icon: 'Download' },
        { id: 'external-links', label: 'External Links', path: '/educational-landing', icon: 'ExternalLink' },
        { id: 'contact-support', label: 'Contact Support', path: '/educational-landing', icon: 'MessageCircle' },
        { id: 'feedback', label: 'Feedback', path: '/educational-landing', icon: 'MessageSquare' }
      ]
    }
  ];

  const handleSectionToggle = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleItemClick = (item) => {
    navigate(item?.path);
    console.log(`Educational resource clicked: ${item?.label}`);
  };

  if (!shouldShow) return null;

  return (
    <nav className={`bg-surface border border-border rounded-card shadow-soft ${className}`}>
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-heading font-semibold text-secondary flex items-center">
          <Icon name="GraduationCap" size={24} className="mr-2" />
          Learning Resources
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          Explore cybersecurity education materials
        </p>
      </div>
      <div className="p-2">
        {resourceSections?.map((section) => {
          const isExpanded = expandedSection === section?.id;
          
          return (
            <div key={section?.id} className="mb-2">
              {/* Section Header */}
              <button
                onClick={() => handleSectionToggle(section?.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium text-text-primary hover:text-primary hover:bg-muted rounded-md transition-micro"
              >
                <div className="flex items-center">
                  <Icon name={section?.icon} size={18} className="mr-2" />
                  <span>{section?.title}</span>
                </div>
                <Icon 
                  name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                  size={16} 
                  className="text-text-secondary"
                />
              </button>
              {/* Section Items */}
              {isExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {section?.items?.map((item) => (
                    <button
                      key={item?.id}
                      onClick={() => handleItemClick(item)}
                      className="w-full flex items-center px-3 py-2 text-sm text-text-secondary hover:text-primary hover:bg-muted rounded-md transition-micro group"
                    >
                      <Icon 
                        name={item?.icon} 
                        size={16} 
                        className="mr-2 text-text-secondary group-hover:text-primary transition-micro" 
                      />
                      <span>{item?.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Quick Actions */}
      <div className="p-4 border-t border-border bg-muted/50">
        <h4 className="text-sm font-medium text-text-primary mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <button
            onClick={() => navigate('/fraud-revelation')}
            className="w-full flex items-center px-3 py-2 text-sm text-accent hover:text-accent-foreground hover:bg-accent rounded-md transition-micro"
          >
            <Icon name="Eye" size={16} className="mr-2" />
            View Simulation Demo
          </button>
          <button
            onClick={() => console.log('Start new training')}
            className="w-full flex items-center px-3 py-2 text-sm text-success hover:text-success-foreground hover:bg-success rounded-md transition-micro"
          >
            <Icon name="Play" size={16} className="mr-2" />
            Start New Training
          </button>
        </div>
      </div>
    </nav>
  );
};

export default EducationalResourceNavigation;