import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AdminMessageDisplay = ({ 
  adminMessage = '',
  adminName = 'Administrador',
  timestamp = null,
  messageType = 'error', // 'error', 'hint', 'guidance'
  isTyping = false,
  onMessageComplete = null
}) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (adminMessage && adminMessage !== displayedMessage) {
      setIsAnimating(true);
      setDisplayedMessage('');
      
      // Typing animation
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= adminMessage?.length) {
          setDisplayedMessage(adminMessage?.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsAnimating(false);
          if (onMessageComplete) {
            onMessageComplete();
          }
        }
      }, 30);

      return () => clearInterval(typingInterval);
    }
  }, [adminMessage, displayedMessage, onMessageComplete]);

  const getMessageConfig = () => {
    switch (messageType) {
      case 'hint':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-900',
          icon: 'Lightbulb',
          title: 'Pista del Administrador'
        };
      case 'guidance':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-900',
          icon: 'MessageCircle',
          title: 'Orientación del Administrador'
        };
      default:
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-900',
          icon: 'AlertCircle',
          title: 'Corrección del Administrador'
        };
    }
  };

  if (!adminMessage && !isTyping) return null;

  const config = getMessageConfig();

  return (
    <div className={`p-4 ${config?.bgColor} border ${config?.borderColor} rounded-lg animate-slide-up`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 ${config?.bgColor} rounded-full flex items-center justify-center border ${config?.borderColor}`}>
            <Icon name={config?.icon} size={12} className={config?.iconColor} />
          </div>
          <span className={`text-sm font-medium ${config?.textColor}`}>
            {config?.title}
          </span>
        </div>
        
        {timestamp && (
          <span className="text-xs text-gray-500">
            {new Date(timestamp)?.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        )}
      </div>
      {/* Admin Info */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Icon name="User" size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{adminName}</p>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-gray-500">En línea</span>
          </div>
        </div>
      </div>
      {/* Message Content */}
      <div className="relative">
        <div className={`text-sm ${config?.textColor} leading-relaxed min-h-[20px]`}>
          {displayedMessage}
          {isAnimating && (
            <span className="inline-block w-0.5 h-4 bg-current ml-1 animate-pulse" />
          )}
        </div>

        {/* Typing Indicator */}
        {isTyping && !adminMessage && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <div className="flex gap-1">
              {[0, 1, 2]?.map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span>{adminName} está escribiendo...</span>
          </div>
        )}
      </div>
      {/* Message Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
            <Icon name="ThumbsUp" size={12} />
            <span>Útil</span>
          </button>
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
            <Icon name="MessageSquare" size={12} />
            <span>Responder</span>
          </button>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Icon name="Clock" size={10} />
          <span>Hace {Math.floor(Math.random() * 5) + 1}m</span>
        </div>
      </div>
    </div>
  );
};

export default AdminMessageDisplay;