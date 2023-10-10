import { Box, Modal, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { TimeSelect } from './TimeSelect';
import { convertDecimalToTime, FreeTimeBooking } from '@/utils';
export type SetTimeScheduleProps = {
  isOpen: boolean;
  onClose: () => void;
  data: FreeTimeBooking[];
  onSave: (value: number[]) => void;
};

export const SetTimeSchedule = ({ isOpen, onClose, onSave, data }: SetTimeScheduleProps) => {
  const rangeTime = data.reduce<number[]>((arr, time, index) => {
    if (index !== data.length - 1) {
      if (time.endTime === data[index + 1].startTime && !time.isFreeTime) {
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

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby='parent-modal-title'
      aria-describedby='parent-modal-description'
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        minWidth='90vw'
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
        <Typography textAlign='center' fontWeight={500} variant='h5' paddingTop={4}>
          Danh sách thời gian trống
        </Typography>

        <Box display='flex' margin={4} paddingY={4} position='relative'>
          {data.map((time) => (
            <TimeSelect key={time.startTime} {...time} onSave={onSave} />
          ))}
          <Box display='flex'>
            {rangeTime.map((time) => (
              <Typography
                key={time}
                position='absolute'
                left={`${(time * 100) / 24}%`}
                width='20px'
                textAlign='center'
                ml='-10px'
                top='100px'
              >
                {convertDecimalToTime(time)}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
