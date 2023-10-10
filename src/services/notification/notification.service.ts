import { NotificationResponse, NotificationsResponse, getNotificationsQuery } from './notification.dto';
import axiosInstance from '@/utils/axiosConfig';

const notificationService = {
  async getAll(query: getNotificationsQuery) {
    const { data } = await axiosInstance.get<NotificationsResponse>('/notifications', { params: query });

    return data;
  },

  async getCountNotSeen() {
    const { data } = await axiosInstance.get('/notifications/count-not-seen');

    return data.data.countNotSeen;
  },

  async getOne(id: number) {
    const { data } = await axiosInstance.get<NotificationResponse>(`/notifications/${id}`);

    return data.data;
  },
  async bulkUpdateSeenStatus() {
    const { data } = await axiosInstance.put(`/notifications/bulk-update-status`);

    return data;
  },
};

export default notificationService;
