// Colombian Flight Management Service
// Base price: 75,000 COP with dynamic pricing rules

class FlightService {
  constructor() {
    this.BASE_PRICE = 75000; // Base price in COP as requested
    this.colombianCities = {
      'Bogotá': { code: 'BOG', name: 'Bogotá', fullName: 'Bogotá (BOG)' },
      'Medellín': { code: 'MDE', name: 'Medellín', fullName: 'Medellín (MDE)' },
      'Cali': { code: 'CLO', name: 'Cali', fullName: 'Cali (CLO)' },
      'Barranquilla': { code: 'BAQ', name: 'Barranquilla', fullName: 'Barranquilla (BAQ)' },
      'Cartagena': { code: 'CTG', name: 'Cartagena', fullName: 'Cartagena (CTG)' },
      'Bucaramanga': { code: 'BGA', name: 'Bucaramanga', fullName: 'Bucaramanga (BGA)' },
      'Pereira': { code: 'UIO', name: 'Pereira', fullName: 'Pereira (UIO)' },
      'Santa Marta': { code: 'SMR', name: 'Santa Marta', fullName: 'Santa Marta (SMR)' },
      'Villavicencio': { code: 'VVC', name: 'Villavicencio', fullName: 'Villavicencio (VVC)' },
      'Neiva': { code: 'NVA', name: 'Neiva', fullName: 'Neiva (NVA)' }
    };

    this.airlines = [
      {
        name: 'AeroColombiano',
        code: 'AC',
        multiplier: 1.0, // Base price
        services: ['Selección de asiento', 'Snack a bordo'],
        baggage: 'Equipaje de mano incluido',
        aircraft: ['Airbus A320', 'Boeing 737']
      },
      {
        name: 'VuelaExpress', 
        code: 'VE',
        multiplier: 0.9, // 10% discount
        services: ['Wi-Fi gratis', 'Entretenimiento'],
        baggage: 'Equipaje de mano incluido',
        aircraft: ['Boeing 737', 'Embraer E190']
      },
      {
        name: 'ColombiAir',
        code: 'CA', 
        multiplier: 1.1, // 10% premium
        services: ['Selección de asiento', 'Comida incluida', 'Priority boarding'],
        baggage: 'Equipaje de mano + 20kg facturado',
        aircraft: ['Embraer E190', 'ATR 72']
      }
    ];
  }

  // Calculate dynamic pricing based on user variables
  calculatePrice(searchCriteria) {
    let finalPrice = this.BASE_PRICE;

    // Class multipliers
    const classMultipliers = {
      'economy': 1.0,
      'premium': 1.6, 
      'business': 2.1
    };

    // Route distance multipliers
    const routeMultipliers = {
      'short': 1.0,    // Same region (< 300km)
      'medium': 1.3,   // Medium distance (300-600km) 
      'long': 1.7      // Long distance (> 600km)
    };

    // Weekend multiplier
    const departureDate = new Date(searchCriteria?.departureDate);
    const isWeekend = departureDate?.getDay() === 0 || departureDate?.getDay() === 6;
    const weekendMultiplier = isWeekend ? 1.15 : 1.0;

    // Peak season multiplier (December, June-July)
    const month = departureDate?.getMonth() + 1;
    const isPeakSeason = month === 12 || month === 6 || month === 7;
    const seasonMultiplier = isPeakSeason ? 1.25 : 1.0;

    // Apply multipliers
    finalPrice *= classMultipliers?.[searchCriteria?.class] || 1.0;
    finalPrice *= this.getRouteMultiplier(searchCriteria?.from, searchCriteria?.to);
    finalPrice *= weekendMultiplier;
    finalPrice *= seasonMultiplier;

    // Round to nearest 1000 COP
    return Math.round(finalPrice / 1000) * 1000;
  }

  getRouteMultiplier(origin, destination) {
    // Define route distances (simplified)
    const longRoutes = [
      ['Bogotá', 'Santa Marta'], ['Bogotá', 'Cartagena'],
      ['Medellín', 'Barranquilla'], ['Cali', 'Bucaramanga']
    ];

    const mediumRoutes = [
      ['Bogotá', 'Medellín'], ['Bogotá', 'Cali'],
      ['Medellín', 'Cartagena'], ['Cali', 'Barranquilla']
    ];

    const routeKey = [origin, destination]?.sort()?.join('-');
    
    if (longRoutes?.some(route => route?.sort()?.join('-') === routeKey)) {
      return 1.7;
    } else if (mediumRoutes?.some(route => route?.sort()?.join('-') === routeKey)) {
      return 1.3;
    }
    return 1.0; // Short routes
  }

  // Generate flight times based on route
  generateFlightTimes(origin, destination) {
    const baseDuration = this.getFlightDuration(origin, destination);
    
    return [
      {
        departure: '06:30',
        arrival: this.addMinutes('06:30', baseDuration),
        duration: this.formatDuration(baseDuration)
      },
      {
        departure: '14:30', 
        arrival: this.addMinutes('14:30', baseDuration),
        duration: this.formatDuration(baseDuration)
      },
      {
        departure: '18:45',
        arrival: this.addMinutes('18:45', baseDuration),
        duration: this.formatDuration(baseDuration)
      }
    ];
  }

  getFlightDuration(origin, destination) {
    // Flight durations in minutes for Colombian routes
    const durations = {
      'Bogotá-Medellín': 105,
      'Bogotá-Cali': 95,
      'Bogotá-Barranquilla': 120,
      'Bogotá-Cartagena': 125,
      'Medellín-Cali': 75,
      'Medellín-Cartagena': 90,
      'Cali-Barranquilla': 85
    };

    const routeKey = [origin, destination]?.sort()?.join('-');
    return durations?.[routeKey] || 105; // Default 1h 45m
  }

  addMinutes(time, minutes) {
    const [hours, mins] = time?.split(':')?.map(Number);
    const totalMins = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMins / 60) % 24;
    const newMins = totalMins % 60;
    return `${newHours?.toString()?.padStart(2, '0')}:${newMins?.toString()?.padStart(2, '0')}`;
  }

  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  // Main method to generate flights based on search criteria
  searchFlights(searchCriteria) {
    const basePrice = this.calculatePrice(searchCriteria);
    const flightTimes = this.generateFlightTimes(searchCriteria?.from, searchCriteria?.to);
    
    const flights = [];

    this.airlines?.forEach((airline, index) => {
      const timeSlot = flightTimes?.[index] || flightTimes?.[0];
      const airlinePrice = Math.round(basePrice * airline?.multiplier);
      const totalPassengers = searchCriteria?.passengers?.total || 1;

      const flight = {
        id: `${airline?.code}-${Math.random()?.toString(36)?.substr(2, 4)?.toUpperCase()}`,
        aerolinea: airline?.name,
        numeroVuelo: `${airline?.code}-${1000 + Math.floor(Math.random() * 9000)}`,
        origen: this.colombianCities?.[searchCriteria?.from]?.fullName || searchCriteria?.from,
        destino: this.colombianCities?.[searchCriteria?.to]?.fullName || searchCriteria?.to,
        fechaIda: searchCriteria?.departureDate,
        fechaVuelta: searchCriteria?.returnDate || null,
        horaSalida: timeSlot?.departure,
        horaLlegada: timeSlot?.arrival,
        duracion: timeSlot?.duration,
        precio: airlinePrice * totalPassengers, // Total price for all passengers
        precioBase: this.BASE_PRICE, // Original base price
        precioPorPersona: airlinePrice, // Price per person after calculations
        clase: this.getClassLabel(searchCriteria?.class),
        pasajeros: totalPassengers,
        equipaje: airline?.baggage,
        servicios: airline?.services,
        escalas: 'Directo',
        aircraft: airline?.aircraft?.[Math.floor(Math.random() * airline?.aircraft?.length)],
        available: true,
        searchData: searchCriteria,
        // Additional pricing breakdown
        priceBreakdown: {
          basePrice: this.BASE_PRICE,
          classMultiplier: searchCriteria?.class === 'business' ? 2.1 : searchCriteria?.class === 'premium' ? 1.6 : 1.0,
          routeMultiplier: this.getRouteMultiplier(searchCriteria?.from, searchCriteria?.to),
          airlineMultiplier: airline?.multiplier,
          finalPricePerPerson: airlinePrice
        }
      };

      flights?.push(flight);
    });

    return flights?.sort((a, b) => a?.precio - b?.precio); // Sort by total price
  }

  getClassLabel(classType) {
    const labels = {
      'economy': 'Económica',
      'premium': 'Premium Economy', 
      'business': 'Ejecutiva'
    };
    return labels?.[classType] || 'Económica';
  }

  // Get available cities
  getCities() {
    return Object.values(this.colombianCities);
  }

  // Validate route
  validateRoute(origin, destination) {
    return this.colombianCities?.[origin] && this.colombianCities?.[destination] && origin !== destination;
  }
}

// Export singleton instance
export const flightService = new FlightService();
export default flightService;