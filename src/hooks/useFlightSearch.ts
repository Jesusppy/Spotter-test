import { useState, useCallback } from 'react';
import type { FlightItinerary, SearchParams } from '../types';
import { searchFlights } from '../api/skyScrapper';

export const useFlightSearch = () => {
  const [itineraries, setItineraries] = useState<FlightItinerary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setItineraries([]);

    try {
      const results = await searchFlights(params);

      if (results && results.length > 0) {
        setItineraries(results);
      } else {
        setError('No flights found for this route. Try different parameters.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while searching for flights. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { itineraries, isLoading, error, search };
};