import { LocationOn } from '@mui/icons-material';
import { Autocomplete, TextField, Box, Grid, Typography } from '@mui/material';
import { debounce } from '@mui/material/utils';
import parse from 'autosuggest-highlight/parse';
import { useEffect, useMemo, useState } from 'react';
import { LocationMap } from '@/services/venue/venue.dto';

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
  place_id: string;
  reference: string;
}

interface MapPlaceProps {
  onInputChange?: (inputValue: string) => void;
  onChange?: (locationValue: LocationMap | null) => void;
  placeholder?: string;
}

export const MapPlace = ({ onChange, onInputChange, placeholder: placeHolder }: MapPlaceProps) => {
  const [value, setValue] = useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<readonly PlaceType[]>([]);
  const autocompleteService = { current: null };

  const fetch = useMemo(
    () =>
      debounce((request: { input: string }, callback: (results?: readonly PlaceType[]) => void) => {
        (autocompleteService.current as any)?.getPlacePredictions(request, callback);
      }, 400),
    [],
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google && new window.google.maps.places.AutocompleteService()) {
      autocompleteService['current'] = new window.google.maps.places.AutocompleteService() as any;
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
      if (active) {
        let newOptions: readonly PlaceType[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      fullWidth
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      size='small'
      noOptionsText='No results'
      onChange={(_, newValue: PlaceType | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);

        if (newValue) {
          const placeService = new google.maps.places.PlacesService(document.createElement('div'));
          placeService.getDetails({ placeId: newValue.place_id }, (place) => {
            if (place?.geometry?.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              onChange && onChange({ lat, lng });
            }
          });
        } else {
          onChange && onChange(null);
        }
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
        onInputChange && onInputChange(newInputValue);
      }}
      renderInput={(params) => <TextField {...params} fullWidth placeholder={placeHolder} />}
      renderOption={(props, option) => {
        const matches = option.structured_formatting.main_text_matched_substrings || [];

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length]),
        );

        return (
          <li {...props}>
            <Grid container alignItems='center'>
              <Grid item sx={{ display: 'flex', width: 44 }}>
                <LocationOn sx={{ color: 'text.secondary' }} />
              </Grid>
              <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                {parts.map((part, index) => (
                  <Box key={index} component='span' sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}>
                    {part.text}
                  </Box>
                ))}
                <Typography variant='body2' color='text.secondary'>
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};
