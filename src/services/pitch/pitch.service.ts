import {
  CreatePitchDto,
  GetPitchesByVenueDetailResponse,
  PitchResponse,
  PitchesResponse,
  PitchesQuery,
  UpdatePitchPayload,
} from './pitch.dto';
import axiosInstance from '@/utils/axiosConfig';

const pitchService = {
  getAll: async (query: PitchesQuery) => {
    const { data } = await axiosInstance.get<PitchesResponse>(`/pitches`, {
      params: query,
    });

    return data;
  },

  getOne: async (id: number) => {
    const { data } = await axiosInstance.get<PitchResponse>(`/pitches/${id}`);

    return data.data;
  },

  getPitchesByVenueDetail: async (venueId: number) => {
    const { data } = await axiosInstance.get<GetPitchesByVenueDetailResponse>(`/pitches/venue-detail/${venueId}`);

    return data.data;
  },

  create: async (payload: CreatePitchDto) => {
    const { data } = await axiosInstance.post<PitchResponse>('/pitches', payload);

    return data;
  },

  update: async (payload: UpdatePitchPayload) => {
    const { id, data: pitchData } = payload;

    const { data } = await axiosInstance.put<PitchResponse>(`/pitches/${id}`, pitchData);

    return data;
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`/pitches/${id}`);
  },
};

export default pitchService;
