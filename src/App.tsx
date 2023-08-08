import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { MainLayout, SecondaryLayout } from './components/Layout';
import { Home, Login, Register, Search } from './pages';
import { VenueDetail } from './pages/VenueDetail';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <Home />
      </MainLayout>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/search',
    element: (
      <SecondaryLayout>
        <Search />
      </SecondaryLayout>
    ),
  },
  {
    path: '/venue/:slug',
    element: (
      <MainLayout>
        <VenueDetail />
      </MainLayout>
    ),
  },
]);

function App() {
  const [queryClient] = useState(() => new QueryClient({}));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </LocalizationProvider>
  );
}

export default App;
