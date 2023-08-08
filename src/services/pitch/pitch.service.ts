import { GetPitchByVenueResponse } from './pitch.dto';
import axiosInstance from '@/utils/axiosConfig';

export const getPitchesByVenue = async (venueId: string) => {
  const { data } = await axiosInstance.get<GetPitchByVenueResponse>(`/pitches/venue/${venueId}`);

  return data.data;
};
