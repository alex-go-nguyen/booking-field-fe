import { DashboardOutlined, HouseOutlined, Menu as MenuIcon, ShoppingBagOutlined } from '@mui/icons-material';
import { IconButton, List, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MenuNotification, MenuActions, LangueSwitcher } from '../components';
import { useAuth, useBoolean } from '@/hooks';
import { useLocale } from '@/locales';

export const VenueManagementLayout = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { profile, isFetched } = useAuth();

  const { value: open, toggle: toggleDrawer } = useBoolean(true);

  const { formatMessage } = useLocale();

  if (!profile?.id) {
    navigate('/login', {
      state: {
        redirect: pathname,
      },
    });
  }

  if (!isFetched) {
    return null;
  }

  const menuItems = [
    {
      title: formatMessage({ id: 'app.dashboard' }),
      href: 'dashboard',
      icon: <DashboardOutlined />,
    },
    {
      title: formatMessage({ id: 'app.your-venue' }),
      href: 'your-venue',
      icon: <HouseOutlined />,
    },
    {
      title: formatMessage({ id: 'app.booking' }),
      href: 'bookings',
      icon: <ShoppingBagOutlined />,
    },
  ];

  return (
    profile && (
      <>
        <Box display='flex'>
          <Box
            bgcolor='primary.contrastText'
            zIndex={10}
            sx={{
              overflow: 'hidden',
              position: { xs: 'absolute', md: 'relative' },
              height: '100%',
              width: {
                xs: open ? '100%' : 0,
                md: open ? 280 : 100,
              },
              transition: '0.2s ease all',
              whiteSpace: 'nowrap',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: open ? 'space-between' : 'center',
                px: 1,
              }}
              py={2}
            >
              <Box
                component='img'
                src='/logo.png'
                width={open ? 120 : 0}
                onClick={() => navigate('/')}
                sx={{ cursor: 'pointer', transition: '0.2s ease all' }}
              />

              <IconButton color='primary' aria-label='open drawer' onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </Box>
            <List
              component='nav'
              sx={{
                mx: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {menuItems.map((item) => (
                <ListItemButton
                  key={item.href}
                  sx={{
                    ...(pathname === `/venue-management/${item.href}` && {
                      bgcolor: 'primary.light',
                      color: 'primary.dark',
                    }),
                    borderRadius: 3,
                    px: {
                      xs: 1,
                      md: 3,
                    },
                    my: 1,
                    ':hover': {
                      bgcolor: 'primary.light',
                      color: 'primary.dark',
                    },
                  }}
                  onClick={() => {
                    navigate(`/venue-management/${item.href}`);
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: pathname === `/venue-management/${item.href}` ? 'primary.dark' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.title} />}
                </ListItemButton>
              ))}
            </List>
          </Box>
          <Box display='flex' flexDirection='column' height='100vh' width='100%'>
            <Box display='flex' alignItems='center' justifyContent={{ xs: 'space-between', md: 'end' }} m={1}>
              <IconButton
                color='primary'
                aria-label='open drawer'
                onClick={toggleDrawer}
                sx={{
                  display: {
                    xs: 'block',
                    md: 'none',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>

              <Box display='flex' gap={2}>
                <LangueSwitcher />
                <MenuNotification />
                <MenuActions />
              </Box>
            </Box>

            <Box
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                mx: 2,
              }}
              flex={1}
              height='100%'
            >
              <Box sx={{ m: 3 }}>
                <Outlet />
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    )
  );
};
