import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { TimeSelection } from '.';
import { useBoolean } from '@/hooks';
import { FreeTimeBooking } from '@/utils/findBookingFreeTime';

export interface TimeSelectProps extends FreeTimeBooking {
  onSave: (value: number[]) => void;
}

export const TimeSelect = ({ onSave, startTime, endTime, isFreeTime }: TimeSelectProps) => {
  const { value, setTrue, setFalse } = useBoolean();

  return (
    <>
      <Box
        component={motion.div}
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
        height='60px'
        display='flex'
        justifyContent='center'
        alignItems='center'
        color='primary.contrastText'
        width={`${((endTime - startTime) * 100) / 24}%`}
        bgcolor={isFreeTime ? 'primary.main' : 'primary.light'}
        position='relative'
        sx={{
          ':hover': isFreeTime
            ? {
                border: 1,
                borderColor: 'primary.dark',
                bgcolor: 'primary.dark',
                boxShadow: 10,
              }
            : {},
          cursor: isFreeTime ? 'pointer' : 'not-allowed',
        }}
        onClick={() => isFreeTime && setTrue()}
        key={startTime}
      >
        {isFreeTime && (
          <Box
            component='img'
            src='https://cdn-icons-png.flaticon.com/512/5278/5278681.png'
            height='80%'
            maxWidth='80%'
          />
        )}
      </Box>
      <TimeSelection isOpen={value} onClose={setFalse} onSave={onSave} timeRange={[startTime, endTime]} />
    </>
  );
};
