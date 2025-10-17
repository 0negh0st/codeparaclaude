import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary to-secondary text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full" />
        <div className="absolute top-32 right-20 w-24 h-24 border border-white/20 rounded-full" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white/20 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
              Vuela por Colombia
              <span className="block text-accent">con Confianza</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Descubre los mejores destinos de Colombia con nuestras ofertas exclusivas. 
              Reserva fácil, vuela cómodo.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Shield" size={20} />
                </div>
                <span className="text-lg">Reserva segura</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Clock" size={20} />
                </div>
                <span className="text-lg">Check-in rápido</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="CreditCard" size={20} />
                </div>
                <span className="text-lg">Pago flexible</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Headphones" size={20} />
                </div>
                <span className="text-lg">Soporte 24/7</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start space-x-6 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <Icon name="Star" size={16} className="text-accent" />
                <span>4.8/5 en satisfacción</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-accent" />
                <span>+2M pasajeros</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} className="text-accent" />
                <span>25+ destinos</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="https://images.unsplash.com/photo-1662653593899-f16cf5cf0b32"
                alt="Modern commercial airplane flying above white clouds against blue sky"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-elevated" />

              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-800 p-6 rounded-xl shadow-elevated max-w-xs">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                    <Icon name="Plane" size={24} color="white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Vuelo directo</p>
                    <p className="text-sm text-gray-600">BOG → CTG</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">$289.000</span>
                  <span className="text-sm text-gray-500">COP</span>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-8 -right-8 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>);

};

export default HeroSection;