import { dateToTimeFloat } from './dateToTimeFloat';
import { timeStringToFloat } from '.';
import { Booking } from '@/services/booking/booking.dto';
import { Venue } from '@/services/venue/venue.dto';
export type FreeTimeBooking = {
  isFreeTime: boolean;
  startTime: number;
  endTime: number;
};

export const findFreeTime = (bookings: Booking[], venue: Venue) => {
  const open = timeStringToFloat(venue.openAt);
  const close = timeStringToFloat(venue.closeAt);

  const freeTime: FreeTimeBooking[] = [
    {
      isFreeTime: false,
      startTime: 0,
      endTime: open,
    },
  ];

  if (bookings.length === 0) {
    freeTime.push({
      isFreeTime: true,
      startTime: open,
      endTime: close,
    });
  } else {
    const freeTimeBookings: FreeTimeBooking[] = bookings.reduce(
      (acc: FreeTimeBooking[], booking: Booking, index: number, bookings: Booking[]) => {
        const { startTime, endTime } = booking;

        const start = dateToTimeFloat(new Date(startTime));

        if (index === 0) {
          if (start > open) {
            acc.push({
              isFreeTime: true,
              startTime: open,
              endTime: start,
            });
          }
        } else {
          const previousBooking = bookings[index - 1];
          const previousEndTime = dateToTimeFloat(new Date(previousBooking.endTime));

          if (start > previousEndTime) {
            acc.push({
              isFreeTime: true,
              startTime: previousEndTime,
              endTime: start,
            });
          }
        }

        acc.push({
          isFreeTime: false,
          startTime: dateToTimeFloat(new Date(booking.startTime)),
          endTime: dateToTimeFloat(new Date(endTime)) === 0 ? 24 : dateToTimeFloat(new Date(endTime)),
        });

        return acc;
      },
      [],
    );

    const lastInterval = bookings[bookings.length - 1];
    const lastEndTime =
      dateToTimeFloat(new Date(lastInterval.endTime)) === 0 ? 24 : dateToTimeFloat(new Date(lastInterval.endTime));

    if (lastEndTime < close) {
      freeTimeBookings.push({
        isFreeTime: true,
        startTime: lastEndTime,
        endTime: close,
      });
    }

    freeTime.push(...freeTimeBookings);
  }

  freeTime.push({
    isFreeTime: false,
    startTime: close,
    endTime: 24,
  });

  return freeTime;
};
