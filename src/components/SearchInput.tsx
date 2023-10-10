import { CancelOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { SelectBox } from '.';

export type SearchInputProps = {
  title: string;
  icon: ReactNode;
  placeHolder: string;
  value: string;
  onChange: (value: string) => void;
};

export const SearchInput = ({
  title,
  icon,
  placeHolder,
  value,
  onChange,
  children,
}: PropsWithChildren<SearchInputProps>) => {
  return (
    <Box position='relative'>
      <Typography variant='caption' pl={4}>
        {title}
      </Typography>

      <Box display='flex' gap={2}>
        <Box>{icon}</Box>
        <SelectBox value={value} onChange={onChange} placeHolder={placeHolder} id={`search-input-${title}`}>
          {children}
        </SelectBox>
      </Box>

      <CancelOutlined
        className='reset-icon'
        sx={{
          cursor: 'pointer',
          fontSize: 16,
          marginLeft: 1,
          display: 'none',
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        onClick={() => onChange('')}
      />
    </Box>
  );
};
