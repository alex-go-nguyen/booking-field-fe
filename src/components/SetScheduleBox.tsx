import { AccessTime, Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SetTimeSchedule } from './SetTimeSchedule';
import { OrderEnum } from '@/common/enums/order.enum';
import { useBoolean } from '@/hooks';
import { useLocale } from '@/locales';
import { CreateBookingDto } from '@/services/booking/booking.dto';
import { bookingKeys } from '@/services/booking/booking.query';
import { pitchKeys } from '@/services/pitch/pitch.query';
import { Tournament } from '@/services/tournament/tournament.dto';
import { Venue } from '@/services/venue/venue.dto';
import { venueKeys } from '@/services/venue/venue.query';
import { convertDecimalToTime, convertToDate, findFreeTime } from '@/utils';

export type SetScheduleBoxProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBookingDto) => void;
  data: Venue;
  tournament: Tournament;
};

export const SetScheduleBox = ({ data, tournament, isOpen, onClose, onSubmit }: SetScheduleBoxProps) => {
  const { formatMessage } = useLocale();

  const { value, setTrue, setFalse } = useBoolean(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>();
  const [selectedTime, setSelectedTime] = useState<number[] | null>();
  const [selectedPitch, setSelectedPitch] = useState<number>();

  const venueInstance = venueKeys.detail(data.slug);
  const { data: venue } = useQuery({ ...venueInstance });

  const pitchInstance = pitchKeys.list({ venueId: venue?.id, pitchCategoryId: tournament.pitchCategory.id });
  const { data: pitches } = useQuery({
    ...pitchInstance,
    enabled: !!venue,
  });

  const bookingInstance = bookingKeys.list({
    pitchId: 2,
    date: dayjs(selectedDate).format('YYYY-MM-DD'),
    sorts: [{ field: 'startTime', order: OrderEnum.Asc }],
  });
  const { data: bookings, refetch: bookingsRefetch } = useQuery({
    ...bookingInstance,
    enabled: !!selectedPitch && !!selectedDate,
  });

  const times = bookings && venue && findFreeTime(bookings.data, venue);

  const handleSubmit = () => {
    if (selectedTime && selectedPitch) {
      const startTimeNumber = selectedTime[0];
      const startDayString = dayjs(selectedDate).format('MM-DD-YYYY');

      const endTimeNumber = selectedTime[1];
      const endDayString = dayjs(selectedDate).format('MM-DD-YYYY');

      const startTime = convertToDate(startDayString, startTimeNumber);
      const endTime = convertToDate(endDayString, endTimeNumber);

      onSubmit({ startTime, endTime, pitch: selectedPitch });
    }
  };
  useEffect(() => {
    if (selectedDate && selectedPitch) {
      bookingsRefetch();
      setSelectedTime(null);
    }
  }, [selectedDate, selectedPitch, bookingsRefetch]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby='parent-modal-title'
      aria-describedby='parent-modal-description'
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        minWidth={400}
        bgcolor='primary.contrastText'
        borderRadius={4}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.3,
        }}
      >
        <Box>
          <Box display='flex' alignItems='center' justifyContent='space-between' paddingBottom={2} padding={2}>
            <Typography id='parent-modal-title' textAlign='center' variant='h5' fontWeight={700}>
              {formatMessage({ id: 'app.tournament.match.update-schedule.box.title' })}
            </Typography>
            <Close
              onClick={onClose}
              sx={{
                cursor: 'pointer',
                ':hover': { opacity: 0.7 },
              }}
            />
          </Box>
          <Divider />
          <Box padding={4}>
            <Box marginBottom={2}>
              <Typography>{formatMessage({ id: 'app.tournament.match.update-schedule.box.pitch' })}</Typography>
              {pitches && (
                <Select fullWidth onChange={(e) => setSelectedPitch(Number(e.target.value))} size='small'>
                  {pitches.data.map((pitch) => (
                    <MenuItem value={pitch.id} key={pitch.id}>
                      {pitch.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Box>
            <Box marginY={2}>
              <Typography>{formatMessage({ id: 'app.tournament.match.update-schedule.box.day' })}</Typography>
              <DatePicker
                value={selectedDate ?? null}
                sx={{ width: '100%' }}
                format='DD/MM/YYYY'
                disablePast
                slotProps={{ textField: { size: 'small' } }}
                onChange={(date) => setSelectedDate(date)}
              />
            </Box>
            <Box marginY={3}>
              <Typography>{formatMessage({ id: 'app.tournament.match.update-schedule.box.time' })}</Typography>
              <OutlinedInput
                size='small'
                fullWidth
                id='outlined-choose-time'
                readOnly
                value={
                  selectedTime
                    ? `${convertDecimalToTime(selectedTime[0])} - ${convertDecimalToTime(selectedTime[1])}`
                    : ''
                }
                placeholder='hh:mm'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton aria-label='toggle password visibility' onClick={setTrue} edge='end'>
                      <AccessTime />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Box>
            <Box marginY={2} display='flex'>
              <Button
                type='submit'
                variant='contained'
                sx={{
                  marginX: 'auto',
                  width: {
                    xs: '100%',
                    md: 'fit-content',
                  },
                }}
                disabled={!selectedTime}
                onClick={handleSubmit}
              >
                {formatMessage({ id: 'app.tournament.match.update-schedule.box.submit' })}
              </Button>
            </Box>
          </Box>
        </Box>
        {times && (
          <SetTimeSchedule
            isOpen={value}
            onClose={setFalse}
            data={times}
            onSave={(value) => {
              setSelectedTime(value);
              setFalse();
            }}
          />
        )}
      </Box>
    </Modal>
  );
};
