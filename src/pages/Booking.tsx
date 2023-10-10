import { ReportOutlined } from '@mui/icons-material';
import { Alert, Box, Button, Divider, Grid, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { OrderEnum } from '@/common/enums/order.enum';
import { Stepper, TimeSelect, StripeContainer } from '@/components';
import { useAuth } from '@/hooks';
import { useLocale } from '@/locales';
import { CreateBookingDto } from '@/services/booking/booking.dto';
import { bookingKeys } from '@/services/booking/booking.query';
import bookingService from '@/services/booking/booking.service';
import { Pitch } from '@/services/pitch/pitch.dto';
import { pitchKeys } from '@/services/pitch/pitch.query';
import { venueKeys } from '@/services/venue/venue.query';
import { convertCurrency, formatDate } from '@/utils';
import { convertDecimalToTime, findFreeTime, convertToDate } from '@/utils';

export const Booking = () => {
  const { formatMessage } = useLocale();

  const stepList = [
    formatMessage({ id: 'app.booking.step.custom' }),
    formatMessage({ id: 'app.booking.step.payment' }),
    formatMessage({ id: 'app.booking.step.finish' }),
  ];

  const navigate = useNavigate();

  const { pathname, search } = useLocation();

  const { profile, socket } = useAuth();

  const { slug } = useParams();

  const [searchParams, _] = useSearchParams();

  const [step, setStep] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>();
  const [selectedTime, setSelectedTime] = useState<number[] | null>();
  const [selectedPitch, setSelectedPitch] = useState<Pitch>();

  const venueInstance = venueKeys.detail(slug);
  const { data: venue, refetch: refetchVenue } = useQuery({ ...venueInstance, enabled: !!slug });

  const bookingInstance = bookingKeys.list({
    pitchId: selectedPitch?.id,
    date: dayjs(selectedDate).format('YYYY-MM-DD'),
    sorts: [{ field: 'startTime', order: OrderEnum.Asc }],
  });

  const { data: bookings, refetch: refetchBookings } = useQuery({
    ...bookingInstance,
    enabled: !!selectedPitch && !!selectedDate,
  });

  const { mutate: createBookingMutate } = useMutation({
    mutationFn: (payload: CreateBookingDto) => bookingService.create(payload),
    onSuccess: (data) => {
      socket?.emit('booking', data.data);
    },
  });

  const pitchCategoryId = Number(searchParams.get('pitchCategory'));

  const pitchInstance = pitchKeys.list({ venueId: venue?.id, pitchCategoryId });
  const { data: pitches } = useQuery({
    ...pitchInstance,
    enabled: Boolean(venue),
  });

  const times = bookings && venue && findFreeTime(bookings.data, venue);

  const rangeTime = times?.reduce<number[]>((arr, time, index) => {
    if (index !== times.length - 1) {
      if (time.endTime === times[index + 1].startTime && !time.isFreeTime) {
        if (time.startTime === 0) {
          return [time.startTime];
        }
        return arr;
      }

      return [...arr, time.startTime, time.endTime];
    } else {
      if (!time.isFreeTime) {
        return [...arr, time.endTime];
      }
      return [...arr, time.startTime, time.endTime];
    }
  }, []);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (selectedTime && selectedPitch) {
      const startTimeNumber = selectedTime[0];
      const startDayString = dayjs(selectedDate).format('MM-DD-YYYY');

      const endTimeNumber = selectedTime[1];
      const endDayString = dayjs(selectedDate).format('MM-DD-YYYY');

      const startTime = convertToDate(startDayString, startTimeNumber);
      const endTime = convertToDate(endDayString, endTimeNumber);

      createBookingMutate({
        startTime,
        endTime,
        pitch: selectedPitch.id,
      });
    }
  };

  useEffect(() => {
    refetchVenue();
  }, [slug, refetchVenue]);

  useEffect(() => {
    if (selectedPitch && selectedTime) {
      setTotalPrice(selectedPitch.price * (selectedTime[1] - selectedTime[0]));
    }
  }, [selectedPitch, selectedTime]);

  useEffect(() => {
    if (selectedDate && selectedPitch) {
      refetchBookings();
      setSelectedTime(null);
    }
  }, [selectedDate, selectedPitch, refetchBookings]);

  if (!profile) {
    navigate('/login', {
      state: {
        redirect: `${pathname}${search}`,
      },
    });
  }

  return (
    pitches &&
    pitches.data.length > 0 && (
      <Box>
        <Stepper steps={stepList} activeStep={step} sx={{ marginY: 4 }} />
        {step === 0 && (
          <>
            <Typography
              textAlign='center'
              variant='h5'
              marginY={4}
              bgcolor='secondary.light'
              paddingY={2}
              borderRadius={3}
            >
              {formatMessage({ id: 'app.booking.category' })}: {pitches.data[0].pitchCategory.name}
            </Typography>
            <Grid container border={1} borderRadius={3} borderColor='secondary.light' marginTop={1}>
              {pitches.data.map((item) => (
                <Grid item xs={4} md={3} position='relative' key={item.id} marginY={2} paddingX={4}>
                  <Box onClick={() => setSelectedPitch(item)}>
                    <Box
                      width='100%'
                      minWidth={100}
                      height={100}
                      borderRadius={3}
                      sx={{
                        objectFit: 'cover',
                        cursor: 'pointer',
                        ':hover': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        },
                        boxShadow: item === selectedPitch ? 10 : 0,
                      }}
                      border={1}
                      borderColor='primary.main'
                      bgcolor={item === selectedPitch ? 'primary.main' : 'inherit'}
                      display='flex'
                      justifyContent='center'
                      alignItems='center'
                    >
                      <Typography
                        fontSize={{ xs: 20, md: 24 }}
                        color={item === selectedPitch ? 'primary.contrastText' : 'inherit'}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box display='flex' justifyContent='center'>
              <DatePicker
                value={selectedDate ?? null}
                label={formatMessage({ id: 'app.booking.day-picker.placeholder' })}
                sx={{ marginY: 4 }}
                format='DD/MM/YYYY'
                disablePast
                onChange={(date) => setSelectedDate(date)}
              />
            </Box>
            <Box
              display='flex'
              width='100%'
              position='relative'
              borderColor='primary.dark'
              marginBottom={4}
              marginTop={2}
            >
              {times &&
                times.map((time) => (
                  <TimeSelect key={time.startTime} {...time} onSave={(value) => setSelectedTime(value)} />
                ))}
              {rangeTime?.map((time) => (
                <Typography
                  key={time}
                  position='absolute'
                  left={`${(time * 100) / 24}%`}
                  width='20px'
                  textAlign='center'
                  ml='-10px'
                  top='60px'
                >
                  {convertDecimalToTime(time)}
                </Typography>
              ))}
            </Box>
            {selectedTime && (
              <Alert severity='success' sx={{ margin: 2 }}>
                {}
                {`${formatMessage({ id: 'app.booking.time-picker.result' })} ${convertDecimalToTime(
                  selectedTime[0],
                )} - ${convertDecimalToTime(selectedTime[1])}`}
              </Alert>
            )}

            <Box display='flex' justifyContent='center' marginBottom={4}>
              <Button
                onClick={handleNextStep}
                variant='contained'
                disabled={!selectedPitch || !selectedDate || !selectedTime}
                size='large'
              >
                {formatMessage({ id: 'app.booking.button.continue' })}
              </Button>
            </Box>
          </>
        )}
        {step === 1 && (
          <Grid container spacing={8} marginY={4}>
            <Grid item xs={12} md={6} width='100%'>
              <StripeContainer currency='vnd' amount={totalPrice} onSubmit={handleSubmit} />
              <Button onClick={handleBackStep} variant='outlined' color='secondary'>
                {formatMessage({ id: 'app.booking.payment.button.return' })}
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                display='flex'
                marginBottom={2}
                position='relative'
                sx={{
                  ':before': {
                    content: '""',
                    width: '60%',
                    height: '1px',
                    position: 'absolute',
                    display: { xs: 'block', md: 'none' },
                    top: -30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'secondary.light',
                  },
                }}
              >
                <Box
                  component='img'
                  src={pitches.data[0].venue.imageList?.[0].imagePath}
                  alt='venue'
                  width='20%'
                  height='30%'
                  sx={{ objectFit: 'cover' }}
                  borderRadius={2}
                />
                <Box paddingX={2}>
                  <Typography fontWeight={500} variant='h5'>
                    {pitches.data?.[0].venue.name}
                  </Typography>
                  <Typography fontWeight={300} variant='body2' fontStyle='italic'>
                    {pitches.data?.[0].venue.address}
                  </Typography>
                </Box>
              </Box>

              <Box marginY={2}>
                <Box display='flex'>
                  <Typography fontWeight={500}>{formatMessage({ id: 'app.booking.info.category' })}:</Typography>
                  <Typography marginX={1}>{pitches.data?.[0].pitchCategory.name}</Typography>
                </Box>
                {selectedDate && (
                  <Box display='flex'>
                    <Typography fontWeight={500}>{formatMessage({ id: 'app.booking.info.day' })}:</Typography>
                    <Typography marginX={1}>{formatDate(selectedDate)}</Typography>
                  </Box>
                )}
                <Box display='flex'>
                  <Typography fontWeight={500}>{formatMessage({ id: 'app.booking.info.time' })}:</Typography>
                  {selectedTime && (
                    <Typography marginX={1}>
                      {convertDecimalToTime(selectedTime[0])} - {convertDecimalToTime(selectedTime[1])}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Divider sx={{ marginTop: 1 }} />
              <Box display='flex' justifyContent='space-between' paddingY={2}>
                <Typography fontWeight={500}>{formatMessage({ id: 'app.booking.info.price' })}:</Typography>
                <Typography>{selectedPitch && convertCurrency(selectedPitch.price)}</Typography>
              </Box>
              <Divider />
              <Box display='flex' justifyContent='space-between' paddingY={2}>
                <Typography fontWeight={500}>{formatMessage({ id: 'app.booking.info.total-price' })}:</Typography>
                <Typography fontWeight={700}>{convertCurrency(totalPrice)}</Typography>
              </Box>
              <Box display='flex' alignItems='center'>
                <ReportOutlined />
                <Typography variant='caption' marginX={1}>
                  {formatMessage({ id: 'app.booking.note-cancel' })}
                </Typography>
              </Box>
              <Box display='flex' alignItems='center'>
                <ReportOutlined />
                <Typography variant='caption' marginX={1}>
                  {formatMessage({ id: 'app.booking.note-rules' })}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    )
  );
};
