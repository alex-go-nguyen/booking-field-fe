import { Autocomplete, InputBase, Popper } from '@mui/material';
import { PropsWithChildren } from 'react';
import { DefaultLocations } from '@/common/datas/location.data';
import { useBoolean } from '@/hooks';

export interface ISelectBoxProps extends PropsWithChildren {
  value: string;
  onChange: (data: string) => void;
  placeHolder: string;
}

export const SelectBox = ({ value, onChange, placeHolder, children }: ISelectBoxProps) => {
  const { value: isOpenSearchVenue, setFalse: closeSearchVenue, setTrue: openSearchVenue } = useBoolean(false);

  return (
    <Autocomplete
      disablePortal
      id='combo-box-address'
      sx={{ flex: 1 }}
      options={DefaultLocations}
      open={isOpenSearchVenue}
      onClose={closeSearchVenue}
      onOpen={openSearchVenue}
      onInputChange={(_, newValue) => onChange(newValue)}
      value={value}
      PopperComponent={(props) => (
        <Popper
          sx={{
            minWidth: 250,
            maxHeight: 500,
            overflowY: 'scroll',
            bgcolor: 'primary.contrastText',
            boxShadow: 4,
            borderRadius: 2,
            paddingY: 1,
          }}
          {...props}
          onMouseDown={(e) => e.preventDefault()}
        >
          {children}
        </Popper>
      )}
      renderInput={(params) => (
        <InputBase
          sx={{ display: 'flex' }}
          ref={params.InputProps.ref}
          {...params}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeHolder}
        />
      )}
    />
  );
};
