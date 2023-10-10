import { Grid, Paper } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';

export const AuthLayout = () => {
  const navigate = useNavigate();

  const { state } = useLocation();

  const { profile, isLoading, isFetched } = useAuth();

  useEffect(() => {
    if (profile) {
      navigate(state?.redirect || '/');
    }
  }, [profile, navigate, state?.redirect]);

  if (!isFetched || profile) {
    return null;
  }

  return (
    !isLoading && (
      <Grid container component='main' sx={{ height: '100vh' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://www.si.com/.image/t_share/MTkxMTk2ODg5NjI0MjI1MDAz/al-rihla.webp)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Outlet />
        </Grid>
      </Grid>
    )
  );
};
