import { PitchCategory } from '../pitch_category/pitch-category.dto';
import { Venue } from '../venue/venue.dto';
import { BaseData, BasePaginationResponse, BaseResponse, PaginationQuery } from '@/common/dtos/base.dto';

export type PitchesResponse = BasePaginationResponse<Pitch>;
export type PitchResponse = BaseResponse<Pitch>;
export type GetPitchesByVenueResponse = BaseResponse<Pitch[]>;
export type GetPitchesByVenueDetailResponse = BaseResponse<GetPitchByVenueDetailData[]>;

export type CreatePitchDto = {
  name: string;
  price: number;
  pitchCategory: number;
  venue: number;
};

export type UpdatePitchPayload = {
  id: number;
  data: UpdatePitchDto;
};

export type UpdatePitchDto = Partial<Omit<CreatePitchDto, 'venue'>>;

export type Pitch = {
  name: string;
  price: number;
  pitchCategory: PitchCategory;
  venue: Venue;
} & BaseData;

export type GetPitchByVenueDetailData = {
  price: number;
  pitchCategoryId: number;
  name: string;
  description: string;
  thumbnail: string;
  quantity: number;
} & BaseData;

export type GetPitchesByVenueQuery = {
  pitchCategoryId?: number;
};

export type PitchesQuery = {
  pitchCategoryId?: number;
  venueId?: number;
} & PaginationQuery;
