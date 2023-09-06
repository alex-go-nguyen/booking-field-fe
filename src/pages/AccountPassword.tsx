import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { object, ref, string } from 'yup';
import { UserAccountLayout } from '@/components';
import { ChangePasswordPayload } from '@/services/user/user.dto';
import userService from '@/services/user/user.service';

const schema = object({
  currentPassword: string().required('Vui lòng nhập trường này'),
  newPassword: string().required('Vui lòng nhập trường này'),
  confirmPassword: string()
    .required('Vui lòng nhập trường này')
    .oneOf([ref('newPassword')], 'Mật khẩu nhập lại không khớp'),
});
export const AccountPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate } = useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      toast.success('Cập nhật mật khẩu thành công');
      reset();
    },
  });

  const onSubmitHandler = (data: ChangePasswordPayload) => {
    mutate(data);
  };
  return (
    <UserAccountLayout>
      <Box marginLeft={4} component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Box marginY={2}>
          <Typography>Mật khẩu cũ</Typography>
          <TextField type='password' fullWidth placeholder='Nhập mật khẩu cũ' {...register('currentPassword')} />
          {errors.currentPassword && (
            <Typography sx={{ color: 'error.main' }} variant='body2'>
              *{errors.currentPassword.message}
            </Typography>
          )}
        </Box>
        <Box marginY={2}>
          <Typography>Mật khẩu Mới</Typography>
          <TextField type='password' fullWidth placeholder='Nhập mật khẩu mới' {...register('newPassword')} />
          {errors.newPassword && (
            <Typography sx={{ color: 'error.main' }} variant='body2'>
              *{errors.newPassword.message}
            </Typography>
          )}
        </Box>
        <Box marginY={2}>
          <Typography>Nhập lại mật khẩu Mới</Typography>
          <TextField type='password' fullWidth placeholder='Nhập lại mật khẩu mới' {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <Typography sx={{ color: 'error.main' }} variant='body2'>
              *{errors.confirmPassword.message}
            </Typography>
          )}
        </Box>
        <Button variant='contained' type='submit'>
          Đổi mật khẩu
        </Button>
      </Box>
    </UserAccountLayout>
  );
};