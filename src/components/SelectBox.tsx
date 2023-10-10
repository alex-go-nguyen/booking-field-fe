import { Autocomplete, InputBase, InputBaseProps, Popper } from '@mui/material';
import { PropsWithChildren } from 'react';
import { defaultLocations } from '@/common/datas/location.data';
import { useBoolean } from '@/hooks';

export interface SelectBoxProps extends Omit<InputBaseProps, 'onChange' | 'value' | 'placeHolder'> {
  value: string;
  onChange: (data: string) => void;
  placeHolder: string;
}

export const SelectBox = ({ value, onChange, placeHolder, children, ...props }: PropsWithChildren<SelectBoxProps>) => {
  const { value: isOpen, setFalse, setTrue } = useBoolean(false);

  return (
    <Autocomplete
      disablePortal
      options={defaultLocations}
      open={isOpen}
      onClose={setFalse}
      onOpen={setTrue}
      onInputChange={(_, newValue) => onChange(newValue)}
      value={value}
      noOptionsText='No results'
      fullWidth
      PopperComponent={(props) => (
        <Popper
          sx={{
            maxHeight: 500,
            overflowY: 'scroll',
            bgcolor: 'primary.contrastText',
            boxShadow: 4,
            borderRadius: 2,
            paddingY: 1,
            '&::-webkit-scrollbar': {
              width: '0',
            },
          }}
          {...props}
          onMouseDown={(e) => e.preventDefault()}
        >
          {children}
        </Popper>
      )}
      renderInput={(params) => (
        <InputBase
          sx={{
            display: 'flex',
            height: '100%',
          }}
          ref={params.InputProps.ref}
          {...params}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          placeholder={placeHolder}
          {...props}
        />
      )}
    />
  );
};
