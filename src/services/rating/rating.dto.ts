import { Booking } from '../booking/booking.dto';
import { BaseData, BasePaginationResponse, BaseResponse, PaginationQuery } from '@/common/dtos/base.dto';

export type RatingsResponse = BasePaginationResponse<Rating>;
export type RatingResponse = BaseResponse<Rating>;

export type Rating = {
  content: string;
  rate: number;
  booking: Booking;
} & BaseData;

export type CreateRatingPayload = {
  booking: number;
  content: string;
  rate: number;
};

export type GetRatingsQuery = {
  venueId?: number;
} & PaginationQuery;
