export interface SearchParams {
  adults: number;
  originSkyId: string;
  originEntityId: string;
  destinationSkyId: string;
  destinationEntityId: string;
  date: string;
  returnDate?: string; 
}

export interface CalendarDay {
    day: string;
    price: number;
    group: "low" | "medium" | "high";
}

export interface CalendarData {
    days: CalendarDay[];
}

export interface Airport {
  id: string;
  name: string;
  displayCode: string; 
  city: string;
}

export interface Carrier {
  id: string;
  name: string;
  logoUrl: string; 
}

export interface Segment {
  id: string;
  origin: Airport;
  destination: Airport;
  departure: string;
  arrival: string;
  duration: number;
  marketingCarrier: Carrier;
}

export interface Leg {
  id: string;
  origin: Airport;
  destination: Airport;
  departure: string;
  arrival: string;
  durationInMinutes: number; 
  stopCount: number;
  segments: Segment[]; 
  carriers: {          
    marketing: Carrier[];
  };
}

export interface AirportOption {
  entityId: string;
  presentation: {
    suggestionTitle: string;
  };
  navigation: { 
    entityId: string;
    relevantFlightParams: {
      skyId: string;
    };
  };
}

export interface PricingOption {
  price: number;
  agents: { name: string; url: string }[];
}

export interface FlightItinerary {
  id: string; 
  price: {
    raw: number;
    formatted: string;
  };
  legs: Leg[];
  pricingOptions?: PricingOption[];
}

export interface ExtendedFlightItinerary extends FlightItinerary {
  pricingOptions?: PricingOption[];
}

export interface ApiSearchFlightsResponse {
  status: boolean;
  data: {
    itineraries: FlightItinerary[];
    context: {
      status: string; 
    };
  };
}
export interface ApiResponse {
  status: boolean;
  data?: {
    itinerary: FlightItinerary;
  };
}