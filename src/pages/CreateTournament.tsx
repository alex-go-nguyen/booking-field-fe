import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { number, string } from 'yup';
import { ImageUpload } from '@/components';
import { CreateTournamentPayload } from '@/services/tournament/tournament.dto';
import { TournamentTypeEnum } from '@/utils/createTournament';

export enum StateEnum {
  private = 'private',
  public = 'public',
}

const state = [
  {
    label: 'Riêng tư',
    value: StateEnum.private,
  },
  {
    label: 'Công khai',
    value: StateEnum.public,
  },
];

const schema = Object({
  name: string(),
  phone: string(),
  cover: string(),
  mode: string(),
  totalTeams: number(),
  type: string(),
  venue: number(),
  totalLineup: number(),
});

export const CreateTournament = () => {
  const { register, handleSubmit, getValues } = useForm<CreateTournamentPayload>({
    resolver: yupResolver(schema),
  });
  const [files, setFiles] = useState<FileList | null>(null);

  const [selectedTournamentType, setSelectedTournamentType] = useState(TournamentTypeEnum.Knockout);

  const onSubmitHandler = (data: CreateTournamentPayload) => {
    console.log(data);
  };

  return (
    <Box component='form' onSubmit={handleSubmit(onSubmitHandler)} padding={4}>
      <Typography variant='h5'>Tạo giải</Typography>
      <Typography variant='caption' fontStyle='italic'>
        Vui lòng nhập thông tin hợp lệ cho các trường được yêu cầu
      </Typography>
      <Grid container spacing={4} paddingY={2}>
        <Grid item xs={4}>
          <Typography variant='body2'>Hình giải đấu</Typography>
          <Box width='100%'>
            <ImageUpload onChange={setFiles} />
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant='body2'
                sx={{
                  ':after': {
                    content: '"*"',
                    color: 'error.main',
                  },
                }}
              >
                Tên giải đấu
              </Typography>
              <TextField fullWidth size='small' {...register('name')} required />
            </Grid>
            <Grid item xs={9}>
              <Typography
                variant='body2'
                sx={{
                  ':after': {
                    content: '"*"',
                    color: 'error.main',
                  },
                }}
              >
                Số điện thoại
              </Typography>
              <TextField size='small' fullWidth {...register('phone')} required />
            </Grid>
            <Grid item xs={3}>
              <Typography variant='body2'>Chế độ</Typography>
              <Select defaultValue={StateEnum.private} size='small' fullWidth {...register('mode')} required>
                {state.map((item) => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant='body2'
                sx={{
                  ':after': {
                    content: '"*"',
                    color: 'error.main',
                  },
                }}
              >
                Địa điểm
              </Typography>
              <TextField size='small' fullWidth disabled defaultValue='Sân bóng trương văn thành' />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography
            sx={{
              ':after': {
                content: '"*"',
                color: 'error.main',
              },
            }}
          >
            Hình thức thi đấu
          </Typography>
          <Box display='flex' gap={2}>
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              width={150}
              height={100}
              bgcolor='primary.dark'
              borderRadius={4}
              padding={2}
              sx={{ color: 'primary.contrastText' }}
            >
              Loại trực tiếp
            </Box>
          </Box>
          <Typography
            sx={{
              ':after': {
                content: '"*"',
                color: 'error.main',
              },
            }}
            marginTop={2}
          >
            Số đội tham gia [2 - 128]
          </Typography>
          <TextField fullWidth type='number' size='small' defaultValue={2} {...register('totalTeams')} required />
          <Typography marginY={2} paddingY={1} paddingX={2} bgcolor='secondary.light' borderRadius={1}>
            Đối với cấu hình này thì số trận đấu của giải là {getValues('totalTeams') - 1}
          </Typography>
          <Box>
            <Typography
              sx={{
                ':after': {
                  content: '"*"',
                  color: 'error.main',
                },
              }}
            >
              Số lượng người mỗi đội
            </Typography>
            <Typography variant='caption'>Số lượng người thi đấu trên sân của mỗi đội.</Typography>
            <TextField type='number' size='small' fullWidth defaultValue={5} {...register('totalLineup')} required />
          </Box>
          <Button variant='contained' sx={{ marginY: 2 }} type='submit'>
            Tạo giải
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
