import React from 'react';
import Icon from '../AppIcon';

const Button = React.forwardRef(({
    className = '',
    variant = 'default',
    size = 'default',
    children,
    loading = false,
    iconName = null,
    iconPosition = 'left',
    iconSize = 16,
    fullWidth = false,
    disabled = false,
    onClick,
    type = 'button',
    ...props
}, ref) => {
    // Variant classes
    const variantClasses = {
        default: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    };

    // Size classes
    const sizeClasses = {
        xs: 'px-2 py-1 text-xs h-8',
        sm: 'px-3 py-2 text-sm h-9',
        default: 'px-4 py-2 text-sm h-10',
        lg: 'px-6 py-3 text-base h-11',
        xl: 'px-8 py-4 text-lg h-12',
        icon: 'p-2 h-10 w-10',
    };

    // Loading spinner component
    const LoadingSpinner = () => (
        <svg 
            className="animate-spin h-4 w-4 mr-2" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4" 
            />
            <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
        </svg>
    );

    // Icon rendering with error handling
    const renderIcon = () => {
        if (!iconName) return null;
        try {
            return (
                <Icon
                    name={iconName}
                    size={iconSize}
                    className={`${children && iconPosition === 'left' ? 'mr-2' : ''} ${children && iconPosition === 'right' ? 'ml-2' : ''}`}
                />
            );
        } catch (error) {
            console.warn('Failed to render icon:', iconName, error);
            return null;
        }
    };

    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const buttonClasses = [
        baseClasses,
        variantClasses?.[variant] || variantClasses?.default,
        sizeClasses?.[size] || sizeClasses?.default,
        fullWidth && 'w-full',
        className
    ]?.filter(Boolean)?.join(' ');

    const handleClick = (e) => {
        if (disabled || loading) {
            e?.preventDefault();
            return;
        }
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button
            ref={ref}
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={handleClick}
            {...props}
        >
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === 'left' && renderIcon()}
            {children}
            {iconName && iconPosition === 'right' && renderIcon()}
        </button>
    );
});

Button.displayName = "Button";

export default Button;