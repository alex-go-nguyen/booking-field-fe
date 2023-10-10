import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mixed, number, object, string } from 'yup';
import { defaultLocation } from '@/common/constants';
import { MapPlace, TextArea } from '@/components';
import { LocationPicker } from '@/components/LocationPicker';
import { useAuth } from '@/hooks';
import { useLocale } from '@/locales';
import { locationKeys } from '@/services/location/location.query';
import { CreateVenuePayload, LocationMap } from '@/services/venue/venue.dto';
import venueService from '@/services/venue/venue.service';

const schema = object({
  name: string().required('Please enter your venue name'),
  description: string().required('Please enter your venue description'),
  province: string().required('Please choose province'),
  district: string().required('Please choose district'),
  address: string().required('Please enter your venue address'),
  openAt: string().required('Please enter your open time'),
  closeAt: string().required('Please enter your close time'),
  user: number().required(),
  location: mixed<LocationMap>().required('Please choose your location on google map'),
});
export const RegisterVenue = () => {
  const { formatMessage } = useLocale();

  const { profile } = useAuth();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const {
    register,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVenuePayload>({
    resolver: yupResolver(schema),
    defaultValues: { location: defaultLocation, user: profile?.id },
  });

  const [currentProvince, setCurrentProvince] = useState<string>();
  const [currentDistrict, setCurrentDistrict] = useState<string[]>();
  const [close, setClose] = useState<Date | null>();
  const [open, setOpen] = useState<Date | null>();

  const locationInstace = locationKeys.list();
  const { data: provinces } = useQuery(locationInstace);

  const { mutate: mutateVenue, isSuccess: isMutateVenueSuccess } = useMutation({
    mutationFn: venueService.create,
    onSuccess: () => {
      reset();
      setCurrentDistrict([]);
      setCurrentProvince('');
      setOpen(null);
      setClose(null);
      toast.success('Request successfully');
    },
  });

  const handleClearInput = () => {
    reset();
    setCurrentDistrict([]);
    setCurrentProvince('');
    setOpen(null);
    setClose(null);
  };

  const onSubmitHandler = (data: CreateVenuePayload) => mutateVenue(data);

  useEffect(() => {
    if (provinces) {
      setCurrentDistrict(
        provinces.filter((item) => item.name === currentProvince)[0]?.districts.map((district) => district.name),
      );
    }
  }, [currentProvince, provinces]);

  useEffect(() => {
    if (!profile) {
      navigate('/login', {
        state: {
          redirect: pathname,
        },
      });
    }
  }, [profile, navigate, pathname]);

  return (
    <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
      <Button onClick={handleClearInput}></Button>
      <Typography variant='h5'>{formatMessage({ id: 'app.register-venue.title' })}</Typography>
      <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.sub-title' })}</Typography>
      {isMutateVenueSuccess && (
        <Alert severity='success' sx={{ my: 2, width: 'fit-content' }}>
          {formatMessage({ id: 'app.register-venue.success' })}
        </Alert>
      )}
      <Box display='flex' gap={3} flexDirection={{ xs: 'column', md: 'row' }} mt={2}>
        <Grid container spacing={2} flex={{ xs: 1, md: 7 }}>
          <Grid item xs={12}>
            <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.name' })}</Typography>
            <TextField {...register('name')} fullWidth size='small' placeholder='Sân bóng Lữ Đoàn' />
            {errors.name && (
              <Typography variant='body2' color='error.main'>
                {errors.name.message}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.description' })}</Typography>
            <TextArea minRows={3} {...register('description')} placeholder='...' />
            {errors.description && (
              <Typography variant='body2' color='error.main'>
                {errors.description.message}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.province' })}</Typography>
            <Autocomplete
              size='small'
              options={provinces?.map((province) => province.name) || []}
              onInputChange={(_, value) => setCurrentProvince(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  value={currentProvince}
                  {...register('province')}
                  fullWidth
                  placeholder={formatMessage({ id: 'app.register-venue.venue.province' })}
                />
              )}
            />
            {errors.province && (
              <Typography variant='body2' color='error.main'>
                {errors.province.message}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.district' })}</Typography>
            <Autocomplete
              size='small'
              options={currentDistrict || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...register('district')}
                  fullWidth
                  placeholder={formatMessage({ id: 'app.register-venue.venue.district' })}
                />
              )}
            />
            {errors.district && (
              <Typography variant='body2' color='error.main'>
                {errors.district.message}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.address' })}</Typography>
            <MapPlace
              onChange={(value) => value && setValue('location', value)}
              onInputChange={(value) => setValue('address', value)}
              placeholder={formatMessage({ id: 'app.register-venue.venue.address' })}
            />
            {errors.address && (
              <Typography variant='body2' color='error.main'>
                {errors.address.message}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.open' })}</Typography>
            <TimePicker
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
              ampm={false}
              value={open}
              onChange={(date: Date | null) => {
                setOpen(date);
                setValue('openAt', dayjs(date).format('HH:mm'));
              }}
            />
            {errors.openAt && (
              <Typography variant='body2' color='error.main'>
                {errors.openAt.message}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2'>{formatMessage({ id: 'app.register-venue.venue.close' })}</Typography>

            <TimePicker
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
              ampm={false}
              value={close}
              onChange={(date: Date | null) => {
                setClose(date);
                setValue('closeAt', dayjs(date).format('HH:mm'));
              }}
            />
            {errors.closeAt && (
              <Typography variant='body2' color='error.main'>
                {errors.closeAt.message}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' fullWidth type='submit'>
              {formatMessage({ id: 'app.common.button.title.submit' })}
            </Button>
          </Grid>
        </Grid>
        <Box flex={{ xs: 1, md: 5 }}>
          <LocationPicker location={watch('location')} onChange={(value) => setValue('location', value)} />
        </Box>
      </Box>
    </Box>
  );
};
