import { NotificationsOutlined } from '@mui/icons-material';
import { Badge, Box, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { commonImages } from '@/assets/images/common';
import { DEFAULT_NOTIFICATION_LIMIT, DEFAULT_NOTIFICATION_PAGE } from '@/common/constants';
import { OrderEnum } from '@/common/enums/order.enum';
import { useAuth, useMenu } from '@/hooks';
import { useLocale } from '@/locales';
import { notificationKeys } from '@/services/notification/notification.query';
import notificationService from '@/services/notification/notification.service';
import { getRelativeTimeFromNow } from '@/utils';

export const MenuNotification = () => {
  const { profile } = useAuth();

  const navigate = useNavigate();

  const { formatMessage } = useLocale();

  const queryClient = useQueryClient();

  const {
    anchorEl: anchorNotification,
    isOpen: isOpenNotification,
    onClose: closeNotification,
    onOpen: openNotification,
  } = useMenu();

  const notificationInstance = notificationKeys.list({
    page: DEFAULT_NOTIFICATION_PAGE,
    limit: DEFAULT_NOTIFICATION_LIMIT,
    sorts: [
      {
        field: 'createdAt',
        order: OrderEnum.Desc,
      },
    ],
  });
  const { data: notifications, refetch: notificationRefetch } = useQuery({
    ...notificationInstance,
    enabled: Boolean(profile),
  });

  const countNotSeenNotificationsInstance = notificationKeys.countNotSeen();
  const { data: countNotSeen, isLoading: isLoadingCountNotSeen } = useQuery({
    ...countNotSeenNotificationsInstance,
    enabled: Boolean(profile),
  });

  const { mutate: mutateUpdateSeenStatus } = useMutation({
    mutationFn: notificationService.bulkUpdateSeenStatus,
    onSuccess: () => {
      queryClient.setQueryData(countNotSeenNotificationsInstance.queryKey, 0);
    },
  });

  useEffect(() => {
    if (profile) {
      notificationRefetch();
    }
  }, [profile, notificationRefetch, isLoadingCountNotSeen]);

  return profile && notifications ? (
    <>
      <Tooltip title='Notifications'>
        <IconButton
          onClick={(e) => {
            openNotification(e);
            mutateUpdateSeenStatus();
          }}
          color='secondary'
        >
          {countNotSeen > 0 ? (
            <Badge badgeContent={countNotSeen > 0 ? countNotSeen : ''} color='primary'>
              <NotificationsOutlined />
            </Badge>
          ) : (
            <NotificationsOutlined />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        id='notifications-menu'
        anchorEl={anchorNotification}
        open={isOpenNotification}
        onClose={closeNotification}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box width={400}>
          <Box
            maxHeight={500}
            sx={{
              overflowY: 'scroll',
              '&::-webkit-scrollbar': {
                width: '0',
              },
            }}
          >
            {notifications.data.length > 0 ? (
              notifications?.data.map((notification) => (
                <MenuItem
                  key={notification.id}
                  onClick={() => {
                    closeNotification();
                    navigate('/account/notification');
                  }}
                >
                  <Box display='flex' gap={2} alignItems='center'>
                    <Box component='img' src='/logo.png' alt={notification.title} width='20%' height='100%' />
                    <Box flex={1} paddingX={2}>
                      <Typography variant='body1' fontWeight={500}>
                        {notification.title}
                      </Typography>
                      <Typography variant='body2' sx={{ whiteSpace: 'wrap' }}>
                        {notification.message}
                      </Typography>
                      <Typography variant='caption'>{getRelativeTimeFromNow(notification.createdAt)}</Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))
            ) : (
              <Box display='flex' justifyContent='center' paddingY={4} alignItems='center' flexDirection='column'>
                <Box
                  component='img'
                  src={commonImages.noResult.src}
                  alt={commonImages.noResult.name}
                  width={100}
                  height={100}
                />
                <Typography variant='body2' paddingTop={1}>
                  Chưa có thông báo nào
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ marginY: 1 }} />
          <Typography
            textAlign='center'
            width='100%'
            color='secondary.main'
            sx={{
              cursor: 'pointer',
              ':hover': {
                color: 'secondary.dark',
              },
            }}
            onClick={() => {
              closeNotification();
              navigate('/account/notification');
            }}
          >
            {formatMessage({
              id: 'app.home.header.notification.view-all',
            })}
          </Typography>
        </Box>
      </Menu>
    </>
  ) : null;
};
