import axios from 'axios';
import type { AirportOption, FlightItinerary, SearchParams, CalendarData } from '../types';

const apiKey = import.meta.env.VITE_RAPIDAPI_KEY || '820bdb01a9msh2209c4d1d67d15cp192817jsna857d3afbe11'; // Replace with your actual API key

const apiClient = axios.create({
  baseURL: 'https://sky-scrapper.p.rapidapi.com/api/v1',
  headers: {
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
  },
});

export const searchFlights = async (params: SearchParams): Promise<FlightItinerary[]> => {
  try {
    const response = await apiClient.get("/flights/searchFlights", {
      baseURL: 'https://sky-scrapper.p.rapidapi.com/api/v2', 
      params: {
        originSkyId: params.originSkyId,
        destinationSkyId: params.destinationSkyId,
        originEntityId: params.originEntityId,
        destinationEntityId: params.destinationEntityId,
        date: params.date,
         adults: params.adults,
        returnDate: params.returnDate, 
        currency: "USD",
        market: "en-US", 
        countryCode: "US",
        cabinClass: "economy",
      },
    });
    return response.data?.data?.itineraries || [];
  } catch (error) {
    console.error("Error searching flights:", error);
    throw error;
  }
};

export const searchAirport = async (query: string): Promise<AirportOption[]> => {
  if (!query) return [];
  try {
    const response = await apiClient.get('/flights/searchAirport', {
      params: { query, locale: 'en-US' }
    });
    return response.data?.data || [];
  } catch (error) {
    console.error(`Error searching airport for query: ${query}`, error);
    return [];
  }
};

export const getFlightDetails = async (params: { legs: string; adults: number; currency: string }): Promise<FlightItinerary> => {
  try {
    const response = await apiClient.get('/flights/getFlightDetails', {
      params
    });
    return response.data?.data?.itinerary;
  } catch (error) {
    console.error("Error getting flight details:", error);
    throw error;
  }
};

export const getPriceCalendar = async (originSkyId: string, destinationSkyId: string, fromDate: string, currency: string): Promise<CalendarData | null> => {
  try {
    const response = await apiClient.get('/flights/getPriceCalendar', {
        params: { originSkyId, destinationSkyId, fromDate, currency }
    });
    return response.data?.data?.flights;
  } catch (error) {
    console.error('Error fetching price calendar:', error);
    return null;
  }
};