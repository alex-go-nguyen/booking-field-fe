import { VenueResponse, VenuesResponse, SearchVenueQuery, SearchVenuesResponse } from './venue.dto';
import axiosInstance from '@/utils/axiosConfig';

export const getVenues = async (query: SearchVenueQuery) => {
  const { keyword } = query;

  const { data } = await axiosInstance.get<VenuesResponse>('/venues', {
    params: {
      keyword,
    },
  });

  return data;
};

export const getVenue = async (slug: string) => {
  const { data } = await axiosInstance.get<VenueResponse>(`/venues/${slug}`);

  return data.data;
};

export const searchVenues = async (query: SearchVenueQuery) => {
  const { keyword, category, minPrice, maxPrice, order, page, limit } = query;

  const { data } = await axiosInstance.get<SearchVenuesResponse>(
    `/venues/search?location=${keyword}&pitchCategory=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${order}&page=${page}&limit=${limit}`,
  );

  return data;
};
