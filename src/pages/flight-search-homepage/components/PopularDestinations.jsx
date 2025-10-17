import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const PopularDestinations = () => {
  const destinations = [
  {
    id: 1,
    city: "Cartagena",
    code: "CTG",
    image: "https://images.unsplash.com/photo-1683060984221-c875322bf01f",
    imageAlt: "Historic colonial buildings with colorful facades and balconies in Cartagena\'s old town",
    price: "289.000",
    description: "Ciudad amurallada y playas caribeñas",
    popular: true
  },
  {
    id: 2,
    city: "San Andrés",
    code: "ADZ",
    image: "https://images.unsplash.com/photo-1722395227181-1f56a10989d7",
    imageAlt: "Crystal clear turquoise Caribbean waters with white sand beach and palm trees",
    price: "425.000",
    description: "Paraíso caribeño con mar de siete colores",
    popular: true
  },
  {
    id: 3,
    city: "Medellín",
    code: "MDE",
    image: "https://images.unsplash.com/photo-1654060024449-b9fe864495ac",
    imageAlt: "Modern city skyline of Medellin with mountains in background and cable cars",
    price: "195.000",
    description: "Ciudad de la eterna primavera",
    popular: false
  },
  {
    id: 4,
    city: "Santa Marta",
    code: "SMR",
    image: "https://images.unsplash.com/photo-1602167352383-fb75bb04ea47",
    imageAlt: "Coastal city view with mountains meeting the Caribbean sea and colonial architecture",
    price: "315.000",
    description: "Puerta de entrada a la Sierra Nevada",
    popular: false
  },
  {
    id: 5,
    city: "Cali",
    code: "CLO",
    image: "https://images.unsplash.com/photo-1709531766566-7e26b3ea582d",
    imageAlt: "Vibrant city street scene with salsa dancers and colorful buildings in Cali",
    price: "225.000",
    description: "Capital mundial de la salsa",
    popular: false
  },
  {
    id: 6,
    city: "Bucaramanga",
    code: "BGA",
    image: "https://images.unsplash.com/photo-1654551052649-9e7f1259b9c0",
    imageAlt: "Mountain city landscape with green hills and modern buildings in Bucaramanga",
    price: "175.000",
    description: "Ciudad bonita de Colombia",
    popular: false
  }];


  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Destinos Populares
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre los lugares más visitados de Colombia con nuestras mejores tarifas
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations?.map((destination) =>
          <div
            key={destination?.id}
            className="group bg-white rounded-xl shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden cursor-pointer">

              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <Image
                src={destination?.image}
                alt={destination?.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

                
                {/* Popular Badge */}
                {destination?.popular &&
              <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Icon name="TrendingUp" size={14} />
                    <span>Popular</span>
                  </div>
              }

                {/* Price Badge */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-lg shadow-soft">
                  <div className="text-sm text-gray-600">Desde</div>
                  <div className="text-lg font-bold text-primary">
                    ${destination?.price}
                    <span className="text-sm font-normal text-gray-500 ml-1">COP</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-heading font-semibold text-gray-900">
                    {destination?.city}
                  </h3>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {destination?.code}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {destination?.description}
                </p>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>2h vuelo</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={14} className="text-accent" />
                      <span>4.8</span>
                    </div>
                  </div>
                  
                  <button className="text-primary hover:text-primary/80 font-medium text-sm flex items-center space-x-1 group-hover:space-x-2 transition-all">
                    <span>Ver vuelos</span>
                    <Icon name="ArrowRight" size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-micro font-medium">
            <span>Ver todos los destinos</span>
            <Icon name="ArrowRight" size={20} />
          </button>
        </div>
      </div>
    </section>);

};

export default PopularDestinations;