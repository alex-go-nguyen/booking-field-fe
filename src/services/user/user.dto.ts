import { Venue } from '../venue/venue.dto';
import { BaseResponse } from '@/common/dtos/base.dto';
import { RoleEnum } from '@/common/enums/role.enum';

export type UpdateUserResponse = BaseResponse<User>;

export type User = {
  _id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  venue: Venue;
  role: RoleEnum;
};

export type SignInPayload = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
};

export type UpdateUserPayload = {
  id: number;
  data: UpdateUserData;
};

export type UpdateUserData = {
  firstName: string;
  lastName: string;
  phone: string;
};
