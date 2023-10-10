import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { IntlProvider } from 'react-intl';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { GoogleMapApiProvider, TournamentLayout, UserAccountLayout } from './components';
import NotFound from './components/NotFound';
import { useLocalStorage } from './hooks';
import { VenueManagementLayout, Layout, AuthLayout } from './layouts';
import { Locale, localeConfig } from './locales';
import {
  AccountBooking,
  AccountPassword,
  AccountProfile,
  BookingComplete,
  BookingManagement,
  Booking,
  Dashboard,
  ForgottenPassword,
  Home,
  Login,
  Register,
  ResetPassword,
  Search,
  VenueDetail,
  VenueManagement,
  AccountNotification,
  CreateTournament,
  TournamentSchedule,
  TournamentStanding,
  TournamentTeamManagement,
  TournamentMatch,
  AccountTournament,
  AccountFavorite,
  RegisterVenue,
} from './pages';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-toastify/dist/ReactToastify.css';
import '@mui/lab/themeAugmentation';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'swiper/css';
import './App.css';
import 'nprogress/nprogress.css';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'forgotten-password',
            element: <ForgottenPassword />,
          },
          {
            path: 'reset-password',
            children: [
              {
                path: ':resetToken',
                element: <ResetPassword />,
              },
            ],
          },
        ],
      },
      {
        path: 'venue-management',
        element: <VenueManagementLayout />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'your-venue',
            element: <VenueManagement />,
          },
          {
            path: 'bookings',
            element: <BookingManagement />,
          },
        ],
      },
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'search',
            children: [
              {
                index: true,
                element: <Search />,
              },
            ],
          },
          {
            path: 'league',
            children: [
              {
                path: 'create-tournament',
                element: <CreateTournament />,
              },
              {
                path: ':id',
                element: <TournamentLayout />,
                children: [
                  {
                    path: 'schedule',
                    element: <TournamentSchedule />,
                  },
                  {
                    path: 'matches',
                    element: <TournamentMatch />,
                  },
                  {
                    path: 'team-management',
                    element: <TournamentTeamManagement />,
                  },
                  {
                    path: 'standing',
                    element: <TournamentStanding />,
                  },
                ],
              },
            ],
          },
          {
            path: 'venue',
            children: [
              {
                path: ':slug/create-tournament',
              },
              {
                path: ':slug',
                element: <VenueDetail />,
              },
            ],
          },
          {
            path: 'booking',
            children: [
              {
                path: ':slug',
                element: <Booking />,
              },
              {
                path: 'success',
                element: <BookingComplete />,
              },
            ],
          },
          {
            path: 'account',
            children: [
              {
                path: 'profile',
                element: (
                  <UserAccountLayout>
                    <AccountProfile />
                  </UserAccountLayout>
                ),
              },
              {
                path: 'my-booking',
                element: (
                  <UserAccountLayout>
                    <AccountBooking />
                  </UserAccountLayout>
                ),
              },
              {
                path: 'notification',
                element: (
                  <UserAccountLayout>
                    <AccountNotification />
                  </UserAccountLayout>
                ),
              },
              {
                path: 'favorite',
                element: (
                  <UserAccountLayout>
                    <AccountFavorite />
                  </UserAccountLayout>
                ),
              },
              {
                path: 'my-league',
                element: (
                  <UserAccountLayout>
                    <AccountTournament />
                  </UserAccountLayout>
                ),
              },

              {
                path: 'change-password',
                element: (
                  <UserAccountLayout>
                    <AccountPassword />
                  </UserAccountLayout>
                ),
              },
            ],
          },
          {
            path: 'register-venue',
            element: <RegisterVenue />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  const [queryClient] = useState(() => new QueryClient({}));

  const { storedValue: locale } = useLocalStorage<Locale>('locale', 'vi');

  useEffect(() => {
    if (locale === 'en_US') {
      moment.locale('en');
    } else if (locale === 'vi') {
      moment.locale('vi');
    }
  }, [locale]);

  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale={locale.split('_')[0]} messages={localeConfig[locale]}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <GoogleMapApiProvider>
            <ToastContainer position='bottom-right' autoClose={1000} />
            <HelmetProvider>
              <RouterProvider router={router} />
            </HelmetProvider>
          </GoogleMapApiProvider>
        </LocalizationProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
}

export default App;
