import { Box, Card, Pagination, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { commonImages } from '@/assets/images/common';
import { DEFAULT_NOTIFICATION_LIMIT, DEFAULT_NOTIFICATION_PAGE } from '@/common/constants';
import { OrderEnum } from '@/common/enums/order.enum';
import { useAuth } from '@/hooks';
import { useLocale } from '@/locales';
import { notificationKeys } from '@/services/notification/notification.query';

export const AccountNotification = () => {
  const { formatMessage } = useLocale();

  const { profile } = useAuth();

  const [page, setPage] = useState(DEFAULT_NOTIFICATION_PAGE);

  const notificationInstance = notificationKeys.list({
    page,
    limit: DEFAULT_NOTIFICATION_LIMIT,
    sorts: [
      {
        field: 'createdAt',
        order: OrderEnum.Desc,
      },
    ],
  });
  const {
    data: notifications,
    refetch: refetchNotification,
    isLoading: isNotificationLoading,
  } = useQuery({
    ...notificationInstance,
    enabled: !!profile,
  });

  useEffect(() => {
    if (profile) {
      refetchNotification();
    }
  }, [page, refetchNotification, profile]);

  return (
    <>
      <Typography variant='h4' fontSize={{ xs: 20, md: 30 }} fontWeight={500} marginBottom={4}>
        {formatMessage({ id: 'app.account.menu.notification.title' })}
      </Typography>
      {isNotificationLoading || !notifications ? (
        Array(3)
          .fill(null)
          .map((_, index) => (
            <Skeleton variant='rectangular' height={100} sx={{ borderRadius: 2, marginY: 2 }} key={index} />
          ))
      ) : notifications.data.length > 0 ? (
        notifications.data.map((notification) => (
          <Card variant='outlined' sx={{ padding: 2, marginBottom: 2 }} key={notification.id}>
            <Box paddingY={2}>
              <Typography fontWeight={500}>{notification.title}</Typography>
              <Typography>{notification.message}</Typography>
            </Box>
          </Card>
        ))
      ) : (
        <Box display='flex' justifyContent='center'>
          <Box marginY={2} textAlign='center'>
            <Box component='img' src={commonImages.noResult.src} alt={commonImages.noResult.name} />
            <Typography>{formatMessage({ id: 'app.account.menu.notification.no-result' })}</Typography>
          </Box>
        </Box>
      )}

      {notifications && notifications.pageInfo.pageCount > 1 && (
        <Pagination
          sx={{ display: 'flex', justifyContent: 'center', paddingY: 2 }}
          count={notifications.pageInfo.pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      )}
    </>
  );
};
