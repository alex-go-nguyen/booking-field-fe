import { Box } from '@mui/material';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { useCallback } from 'react';
import { useGoogleMapApi } from './GoogleMapApiProvider';
import { LocationMap } from '@/services/venue/venue.dto';

const DEFAULT_ZOOM = 10;
export interface LocationPickerProps {
  location: LocationMap;
  onChange: (value: LocationMap) => void;
}

export const LocationPicker = ({ location, onChange }: LocationPickerProps) => {
  const { isLoaded } = useGoogleMapApi();

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds(location);

    map.fitBounds(bounds);
  }, []);

  return (
    <Box component='div'>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '100%',
            minHeight: 500,
            borderRadius: 10,
          }}
          center={location}
          zoom={DEFAULT_ZOOM}
          onLoad={onLoad}
          // onUnmount={onUnmount}
          onClick={(e) => e.latLng && onChange({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
        >
          <MarkerF position={location} />
        </GoogleMap>
      )}
    </Box>
  );
};
