import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSignals = () => {
  const certifications = [
  {
    id: 1,
    name: "IATA",
    logo: "https://images.unsplash.com/photo-1600640893668-6f9be3334c06",
    logoAlt: "IATA certification logo with blue and white design",
    description: "Miembro certificado"
  },
  {
    id: 2,
    name: "Aerocivil",
    logo: "https://images.unsplash.com/photo-1718095187155-4aa2399b117d",
    logoAlt: "Colombian civil aviation authority Aerocivil official seal",
    description: "Autorizado por Aerocivil"
  },
  {
    id: 3,
    name: "SSL Secure",
    logo: "https://images.unsplash.com/photo-1603899122406-e7eb957f9fd6",
    logoAlt: "SSL security certificate badge with green checkmark and lock icon",
    description: "Conexión segura"
  },
  {
    id: 4,
    name: "PCI DSS",
    logo: "https://images.unsplash.com/photo-1660732106134-f3009a1e90ea",
    logoAlt: "PCI DSS compliance certification logo for secure payment processing",
    description: "Pagos protegidos"
  }];


  const features = [
  {
    icon: "Shield",
    title: "Reserva Segura",
    description: "Tus datos están protegidos con encriptación de nivel bancario"
  },
  {
    icon: "Clock",
    title: "Confirmación Inmediata",
    description: "Recibe tu boleto electrónico al instante por email"
  },
  {
    icon: "Headphones",
    title: "Soporte 24/7",
    description: "Atención al cliente disponible todos los días del año"
  },
  {
    icon: "CreditCard",
    title: "Múltiples Formas de Pago",
    description: "Tarjetas de crédito, débito, PSE y más opciones"
  }];


  const stats = [
  {
    number: "2.5M+",
    label: "Pasajeros satisfechos",
    icon: "Users"
  },
  {
    number: "98%",
    label: "Puntualidad",
    icon: "Clock"
  },
  {
    number: "25+",
    label: "Destinos nacionales",
    icon: "MapPin"
  },
  {
    number: "15",
    label: "Años de experiencia",
    icon: "Award"
  }];


  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Confía en Nuestra Experiencia
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Miles de colombianos ya han elegido volar con nosotros
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats?.map((stat, index) =>
            <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={stat?.icon} size={32} className="text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat?.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat?.label}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features?.map((feature, index) =>
          <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-micro">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={feature?.icon} size={32} color="white" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-3">
                {feature?.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature?.description}
              </p>
            </div>
          )}
        </div>

        {/* Certifications */}
        <div className="border-t border-gray-200 pt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-2">
              Certificaciones y Seguridad
            </h3>
            <p className="text-gray-600">
              Cumplimos con los más altos estándares de la industria
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {certifications?.map((cert) =>
            <div key={cert?.id} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center group-hover:shadow-soft transition-micro">
                  <Image
                  src={cert?.logo}
                  alt={cert?.logoAlt}
                  className="w-16 h-16 object-contain" />

                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {cert?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {cert?.description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Shield" size={20} className="text-green-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-900 mb-2">
                Tu Seguridad es Nuestra Prioridad
              </h4>
              <p className="text-green-800 text-sm leading-relaxed">
                Utilizamos tecnología de encriptación SSL de 256 bits para proteger toda tu información personal y financiera. 
                Nuestros sistemas cumplen con los estándares PCI DSS para el procesamiento seguro de pagos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default TrustSignals;