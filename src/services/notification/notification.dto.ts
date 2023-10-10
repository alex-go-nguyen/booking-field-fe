import { User } from '../user/user.dto';
import { BaseData, BasePaginationResponse, BaseQuery, BaseResponse } from '@/common/dtos/base.dto';

export type NotificationsResponse = BasePaginationResponse<Notification>;
export type NotificationResponse = BaseResponse<Notification>;

export type Notification = {
  title: string;
  message: string;
  isSeen: boolean;
  user: User;
} & BaseData;

export type getNotificationsQuery = BaseQuery;

export type UpdateNotificationPayload = {
  id: number;
  data: UpdateNotificationPayload;
};

export type UpdateNotificationData = {
  title?: string;
  message?: string;
  isSeen?: string;
};
