import { Pitch } from '../pitch/pitch.dto';
import { BaseData, BasePaginationResponse, BaseResponse } from '@/common/dtos/base.dto';

export type VenuesResponse = BasePaginationResponse<Venue>;
export type VenueResponse = BaseResponse<Venue>;
export type SearchVenuesResponse = BasePaginationResponse<SearchVenueData>;

export type SearchVenueQuery = {
  page?: number;
  limit?: number;
  order?: string;
  keyword?: string;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type Venue = {
  name: string;
  description: string;
  location: Location;
  address: string;
  province: string;
  district: string;
  price: Price;
  rating: number;
  totalReview: number;
  pitches: Pitch[];
  imageList: VenueImage[];
  openAt: string;
  closeAt: string;
  slug: string;
} & BaseData;

export type Location = {
  lat: number;
  lng: number;
};

export type Price = {
  type: string;
  pricePerHour: number;
};

export type SearchVenueData = Venue & {
  price: number;
  category_id: number;
};

export type VenueImage = {
  imagePath: string;
};
