import { Category } from '../category/category.dto';
import { Venue } from '../venue/venue.dto';
import { BaseData, BasePaginationResponse } from '@/common/dtos/base.dto';

export type PitchesResponse = BasePaginationResponse<Pitch>;
export type GetPitchByVenueResponse = BasePaginationResponse<GetPitchByVenueData>;

export type Pitch = {
  no: number;
  price: number;
  category: Category;
  venue: Venue;
} & BaseData;

export type GetPitchByVenueData = {
  price: number;
  category_id: number;
  name: string;
  description: string;
  thumbnail: string;
  quantity: number;
};
