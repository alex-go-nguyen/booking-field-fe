import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { useBoolean, useVenueByCurrentUser, useVenueMutation } from '@/hooks';
import { useLocale } from '@/locales';
import { locationKeys } from '@/services/location/location.query';
import { UpdateVenueData } from '@/services/venue/venue.dto';

const schema = object({
  name: string(),
  description: string(),
  openAt: string(),
  closeAt: string(),
  address: string(),
  province: string(),
  district: string(),
});
export const InfoManagement = () => {
  const { formatMessage } = useLocale();

  const { value: isFixingMode, setFalse: closeFixingMode, setTrue: openFixingMode } = useBoolean(false);

  const { register, handleSubmit, reset } = useForm({ resolver: yupResolver(schema) });

  const [currentProvince, setCurrentProvince] = useState<string>();
  const [currentDistrict, setCurrentDistrict] = useState<string[]>();

  const { updateVenueMutation, isUpdating } = useVenueMutation();

  const { data: venue } = useVenueByCurrentUser();

  const locationInstace = locationKeys.list();
  const { data: provinces } = useQuery(locationInstace);

  const onSubmitHandler = (data: UpdateVenueData) => {
    if (venue) {
      updateVenueMutation({ id: venue.id, data });
    }
  };

  const handleCancel = () => {
    closeFixingMode();
    reset();
  };

  useEffect(() => {
    if (provinces) {
      setCurrentDistrict(
        provinces.filter((item) => item.name === currentProvince)[0]?.districts.map((district) => district.name),
      );
    }
  }, [currentProvince, provinces]);

  return (
    venue && (
      <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Grid container display='flex'>
          <Grid item marginY={2} xs={6}>
            <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.name' })}</Typography>
            <TextField
              disabled={!isFixingMode}
              variant='outlined'
              defaultValue={venue.name}
              {...register('name')}
              fullWidth
            />
          </Grid>
          <Grid item marginY={2} xs={12}>
            <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.description' })}</Typography>
            <TextField
              disabled={!isFixingMode}
              variant='outlined'
              defaultValue={venue.description}
              {...register('description')}
              fullWidth
            />
          </Grid>
          <Grid item marginY={2} xs={12} display='flex' gap={4}>
            <Box>
              <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.open' })}</Typography>
              <TextField
                disabled={!isFixingMode}
                variant='outlined'
                defaultValue={venue.openAt}
                {...register('openAt')}
              />
            </Box>
            <Box>
              <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.close' })}</Typography>
              <TextField
                disabled={!isFixingMode}
                variant='outlined'
                defaultValue={venue.closeAt}
                {...register('closeAt')}
              />
            </Box>
          </Grid>

          <Grid item marginY={2} xs={12}>
            <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.address' })}</Typography>
            <TextField
              disabled={!isFixingMode}
              variant='outlined'
              defaultValue={venue.address}
              {...register('address')}
              fullWidth
            />
          </Grid>
          <Grid item marginY={2} xs={12} display='flex' gap={4}>
            <Box sx={{ flex: 1 }}>
              <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.province' })}</Typography>
              <Autocomplete
                disabled={!isFixingMode}
                disablePortal
                options={provinces?.map((province) => province.name) || []}
                onInputChange={(_, value) => setCurrentProvince(value)}
                defaultValue={venue.province}
                renderInput={(params) => <TextField {...params} value={currentProvince} {...register('province')} />}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.district' })}</Typography>
              <Autocomplete
                disabled={!isFixingMode}
                disablePortal
                options={currentDistrict || []}
                defaultValue={venue.district}
                renderInput={(params) => <TextField {...params} {...register('district')} />}
              />
            </Box>
          </Grid>
          <Box display='flex' gap={1} marginY={2}>
            {isFixingMode ? (
              <Box>
                <Button variant='contained' type='submit'>
                  {formatMessage({ id: 'app.common.button.save' })}
                </Button>
                <Button variant='text' color='secondary' onClick={handleCancel}>
                  {formatMessage({ id: 'app.common.button.cancel' })}
                </Button>
              </Box>
            ) : (
              <Button variant='outlined' onClick={openFixingMode}>
                {formatMessage({ id: 'app.common.button.edit' })}
              </Button>
            )}
          </Box>
        </Grid>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isUpdating}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Box>
    )
  );
};
