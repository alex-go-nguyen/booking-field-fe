import { ArrowDropDown, ArrowDropUp, Delete, FolderOffOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { OrderEnum } from '@/common/enums/order.enum';
import { ConfirmBox, LoadingContainer } from '@/components';
import { useAuth, useBoolean } from '@/hooks';
import { Booking } from '@/services/booking/booking.dto';
import { bookingKeys } from '@/services/booking/booking.query';
import bookingService from '@/services/booking/booking.service';
import { formatDate, formatDateToTime } from '@/utils';

const BOOKING_PAGE_LIMIT = 10;
export const BookingManagement = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { profile } = useAuth();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [page, setPage] = useState<number>(1);
  const [searchDate, setSearchDate] = useState<Date | null>(null);

  const { value: isOpenConfirmBox, setFalse: closeConfirmBox, setTrue: openConfirmBox } = useBoolean(false);

  const [currentField, setCurrentField] = useState<string>('createdAt');
  const [order, setOrder] = useState<OrderEnum>(OrderEnum.Desc);

  const bookingInstance = bookingKeys.list({
    venueId: profile?.venue.id,
    page: page,
    limit: BOOKING_PAGE_LIMIT,
    ...(searchDate && {
      date: dayjs(searchDate).format('YYYY-MM-DD'),
    }),
    sorts: [{ field: currentField, order }],
  });
  const { data, refetch, isFetching } = useQuery({ ...bookingInstance, enabled: Boolean(profile) });

  const { mutate: mutateDeleteBooking } = useMutation({
    mutationFn: (id: number) => bookingService.delete(id),
    onSuccess: () => {
      toast.success('Delete booking successfully');
      closeConfirmBox();
      refetch();
    },
  });

  const handleDeleteBooking = () => selectedBooking && mutateDeleteBooking(selectedBooking.id);

  if (!profile?.username) {
    navigate('/login', {
      state: {
        redirect: pathname,
      },
    });
  }

  const handleToggleOrder = () => {
    if (order === OrderEnum.Asc) {
      setOrder(OrderEnum.Desc);
    } else {
      setOrder(OrderEnum.Asc);
    }
  };

  const handleSort = (field: string) => {
    if (field === currentField) {
      handleToggleOrder();
    } else {
      setCurrentField(field);
      setOrder(OrderEnum.Desc);
    }
  };

  useEffect(() => {
    refetch();
  }, [page, refetch, currentField, order]);

  return (
    profile &&
    data && (
      <Box>
        <Box display='flex' gap={2}>
          <DatePicker
            slotProps={{
              textField: {
                size: 'small',
              },
            }}
            onChange={setSearchDate}
          />
          <Button
            variant='contained'
            onClick={() => {
              refetch();
            }}
          >
            Search
          </Button>
        </Box>
        <Table size='small' sx={{ marginY: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Sân</TableCell>
              <TableCell>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleSort('pitchCategory')}
                >
                  <Typography>Loại</Typography>
                  {order === OrderEnum.Asc && currentField === 'pitchCategory' ? <ArrowDropDown /> : <ArrowDropUp />}
                </Box>
              </TableCell>
              <TableCell>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleSort('createdAt')}
                >
                  <Typography>Ngày</Typography>
                  {order === OrderEnum.Asc && currentField === 'createdAt' ? <ArrowDropDown /> : <ArrowDropUp />}
                </Box>
              </TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Người đặt</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.pitch.name}</TableCell>
                <TableCell>{booking.pitch.pitchCategory.name}</TableCell>
                <TableCell>{formatDate(booking.startTime)}</TableCell>
                <TableCell>{`${formatDateToTime(booking.startTime)} - ${formatDateToTime(booking.endTime)}`}</TableCell>
                <TableCell>{`${booking.user.lastName} ${booking.user.firstName}`}</TableCell>
                <TableCell>
                  <Box display='flex' gap={2}>
                    <IconButton
                      color='primary'
                      onClick={() => {
                        setSelectedBooking(booking);
                        openConfirmBox();
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isFetching ? (
          <LoadingContainer />
        ) : (
          data.data.length <= 0 && (
            <Box display='flex' alignItems='center' flexDirection='column' justifyContent='center' width='100%' my={1}>
              <FolderOffOutlined fontSize='large' />
              <Typography>No data result</Typography>
            </Box>
          )
        )}

        {data.pageInfo.pageCount > 1 && (
          <Pagination
            sx={{ display: 'flex', justifyContent: 'center' }}
            count={data.pageInfo.pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        )}
        <ConfirmBox
          title='Bạn có chắc muốn xóa'
          subTitle='Bạn sẽ không thể khôi phục dữ liệu sau khi đã xóa'
          isOpen={isOpenConfirmBox}
          onClose={closeConfirmBox}
          onAccept={handleDeleteBooking}
        />
      </Box>
    )
  );
};
