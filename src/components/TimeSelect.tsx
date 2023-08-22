import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { TimeSelection } from '.';
import { useBoolean } from '@/hooks';
import { FreeTimeBooking } from '@/utils/findBookingFreeTime';

export interface TimeSelectProps extends FreeTimeBooking {
  onSave: (value: number[]) => void;
}

export const TimeSelect = ({ onSave, startTime, endTime, _id }: TimeSelectProps) => {
  const isFreeTime = _id === -1;
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
        height='40px'
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
        onClick={setTrue}
        key={startTime}
      >
        {isFreeTime && 'Còn trống'}
      </Box>
      <TimeSelection isOpen={value} onClose={setFalse} onSave={onSave} timeRange={[startTime, endTime]} />
    </>
  );
};