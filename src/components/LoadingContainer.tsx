import { Box, CircularProgress } from '@mui/material';

export const LoadingContainer = () => {
  return (
    <Box display='flex' justifyContent='center' alignItems='center' height='100%' my={1}>
      <CircularProgress color='primary' />
    </Box>
  );
};
