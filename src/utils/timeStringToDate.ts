import dayjs from 'dayjs';

export const timeStringToDate = (time: string) => {
  const [h, m] = time.split(':');

  const date = new Date();

  date.setHours(Number(h));
  date.setMinutes(Number(m));

  const tdate = dayjs(date);

  return tdate;
};
