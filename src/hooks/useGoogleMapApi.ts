import { useContext } from 'react';
import { GoogleMapApiContext } from '@/components';

export const useGoogleMapApi = () => {
  const isLoaded = useContext(GoogleMapApiContext);

  return { isLoaded };
};
