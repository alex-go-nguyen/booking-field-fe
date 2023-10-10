import { yupResolver } from '@hookform/resolvers/yup';
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mixed, number, object, string } from 'yup';
import { UploadImage } from '@/components';
import { useAuth, useDebounce } from '@/hooks';
import { useLocale } from '@/locales';
import { pitchCategoryKeys } from '@/services/pitch_category/pitch-category.query';
import { CreateTournamentDto, TournamentTypeEnum } from '@/services/tournament/tournament.dto';
import tournamentService from '@/services/tournament/tournament.service';
import { Venue } from '@/services/venue/venue.dto';
import { venueKeys } from '@/services/venue/venue.query';

export enum StateEnum {
  Private = 'private',
  Public = 'public',
}

const schema = object({
  name: string().required('Please fill out this field'),
  cover: mixed<FileList>(),
  mode: string().oneOf(Object.values(StateEnum)).required('Please select this field'),
  totalTeam: number().min(2).max(128).required('Please fill out this field'),
  type: string().oneOf(Object.values(TournamentTypeEnum)).required('Please select tournament type'),
  venue: number().required(),
  pitchCategory: number().required('Please select pitch category'),
});

export const CreateTournament = () => {
  const { formatMessage } = useLocale();

  const { pathname, search } = useLocation();

  const { profile } = useAuth();

  const navigate = useNavigate();

  const [searchParam, setSearchParams] = useSearchParams();

  const tournamentType = searchParam.get('type') as TournamentTypeEnum;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTournamentDto>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: tournamentType,
    },
  });

  const [files, setFiles] = useState<FileList | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const pitchCategoryInstance = pitchCategoryKeys.list({ venueId: Number(selectedVenue?.id) });
  const { data: pitchCategories } = useQuery({
    ...pitchCategoryInstance,
    enabled: Boolean(selectedVenue),
  });

  const debounceSearchKeyword = useDebounce(searchKeyword);
  const venueInstance = venueKeys.search({ location: debounceSearchKeyword });

  const { data: venues } = useQuery({
    ...venueInstance,
    enabled: !!debounceSearchKeyword,
  });

  const { mutate: mutateCreateTournament, isLoading } = useMutation({
    mutationFn: (data: CreateTournamentDto) => tournamentService.create(data),
    onSuccess: (data) => {
      reset();
      navigate(`/league/${data.data.id}/schedule`);
      toast.success('Create tournament success');
    },
  });

  const state = [
    {
      label: formatMessage({ id: 'app.tournament.create-tournament.mode.private' }),
      value: StateEnum.Private,
    },
    {
      label: formatMessage({ id: 'app.tournament.create-tournament.mode.public' }),
      value: StateEnum.Public,
    },
  ];

  const humanTournamentTypeName = {
    [TournamentTypeEnum.Knockout]: formatMessage({ id: 'app.tournament.create-tournament.type.knockout' }),
    [TournamentTypeEnum.RoundRobin]: formatMessage({ id: 'app.tournament.create-tournament.type.round_robin' }),
  };

  const onSubmitHandler = (data: CreateTournamentDto) => mutateCreateTournament(data);

  const totalMatches = (numTeams: number, type: TournamentTypeEnum) => {
    if (type === TournamentTypeEnum.Knockout) return numTeams - 1;

    if (type === TournamentTypeEnum.RoundRobin) return (numTeams * (numTeams - 1)) / 2;
  };

  if (!profile) {
    navigate('/login', {
      state: {
        redirect: `${pathname}${search}`,
      },
    });
  }

  return (
    <Box component='form' onSubmit={handleSubmit(onSubmitHandler)} padding={4}>
      <Typography variant='h5'>{formatMessage({ id: 'app.tournament.create-tournament.heading' })}</Typography>
      <Typography variant='caption' fontStyle='italic'>
        {formatMessage({ id: 'app.tournament.create-tournament.sub-heading' })}
      </Typography>
      <Grid container spacing={4} paddingY={2}>
        <Grid item xs={12} md={4} height={240}>
          <Typography variant='body2'>{formatMessage({ id: 'app.tournament.create-tournament.cover' })} </Typography>
          <Box width='100%' height='100%' paddingBottom={2}>
            <UploadImage
              files={files}
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  setFiles(files);
                  setValue('cover', files);
                }
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
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
                {formatMessage({ id: 'app.tournament.create-tournament.name' })}
              </Typography>
              <TextField fullWidth size='small' {...register('name')} />
              {errors.name && (
                <Typography variant='caption' color='error'>
                  {errors.name.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6} md={9}>
              <Typography
                variant='body2'
                sx={{
                  ':after': {
                    content: '"*"',
                    color: 'error.main',
                  },
                }}
              >
                {formatMessage({ id: 'app.tournament.create-tournament.phone' })}
              </Typography>
              <TextField size='small' fullWidth />
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography
                variant='body2'
                sx={{
                  ':after': {
                    content: '"*"',
                    color: 'error.main',
                  },
                }}
              >
                {formatMessage({ id: 'app.tournament.create-tournament.mode' })}
              </Typography>
              <Select defaultValue={StateEnum.Private} size='small' fullWidth {...register('mode')}>
                {state.map((item) => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.mode && (
                <Typography variant='caption' color='error'>
                  {errors.mode.message}
                </Typography>
              )}
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
                {formatMessage({ id: 'app.tournament.create-tournament.address' })}
              </Typography>
              <Autocomplete
                id='venue-select'
                options={venues?.data || []}
                onInputChange={(_, value) => setSearchKeyword(value)}
                onChange={(_, value) => {
                  setValue('venue', Number(value?.id));
                  setSelectedVenue(value);
                }}
                getOptionLabel={(option) => option.name}
                size='small'
                fullWidth
                renderOption={(props, option) => (
                  <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Box>
                      <Typography>{option.name}</Typography>
                      <Typography variant='caption' fontStyle='italic'>
                        {option.address}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password',
                    }}
                  />
                )}
              />
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
            marginBottom={1}
          >
            {formatMessage({ id: 'app.tournament.create-tournament.type' })}
          </Typography>
          {errors.type && (
            <Typography variant='caption' color='error'>
              {errors.type.message}
            </Typography>
          )}
          <Box
            display='flex'
            gap={2}
            sx={{
              overflowX: 'scroll',
              '&::-webkit-scrollbar': {
                width: 0,
              },
            }}
          >
            {Object.entries(TournamentTypeEnum).map(([_, value]) => (
              <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                width={150}
                height={100}
                bgcolor={watch('type') === value ? 'primary.main' : ''}
                borderRadius={4}
                padding={2}
                border={1}
                borderColor='primary.main'
                sx={{ color: watch('type') === value ? 'primary.contrastText' : 'inherit', cursor: 'pointer' }}
                onClick={() => {
                  setValue('type', value);
                  searchParam.set('type', value);
                  setSearchParams((prev) => [...prev]);
                }}
                key={value}
              >
                {humanTournamentTypeName[value]}
              </Box>
            ))}
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
            {`${formatMessage({ id: 'app.tournament.create-tournament.participant' })} [2 - 128]`}
          </Typography>
          <TextField fullWidth type='number' size='small' defaultValue={2} {...register('totalTeam')} />
          {errors.totalTeam && (
            <Typography variant='caption' color='error'>
              {errors.totalTeam.message}
            </Typography>
          )}
          {watch('type') && (
            <Typography marginY={2} paddingY={1} paddingX={2} bgcolor='secondary.light' borderRadius={1}>
              {formatMessage({ id: 'app.tournament.create-tournament.total-match' })}{' '}
              {totalMatches(watch('totalTeam'), watch('type'))}
            </Typography>
          )}
          <Box marginY={2}>
            <Typography
              sx={{
                ':after': {
                  content: '"*"',
                  color: 'error.main',
                },
              }}
            >
              {formatMessage({ id: 'app.tournament.create-tournament.pitch.type.title' })}
            </Typography>
            <Typography variant='caption'>
              {formatMessage({ id: 'app.tournament.create-tournament.pitch.type.sub-title' })}
            </Typography>
            {pitchCategories && pitchCategories.data.length > 0 && (
              <Select defaultValue={pitchCategories.data[0].id} {...register('pitchCategory')} fullWidth size='small'>
                {pitchCategories.data.map((item) => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            )}
            {errors.pitchCategory && (
              <Typography variant='caption' color='error'>
                {errors.pitchCategory.message}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
      <Button
        variant='contained'
        sx={{
          marginY: 1,
          width: {
            xs: '100%',
            md: 'fit-content',
          },
        }}
        type='submit'
        disabled={!pitchCategories}
      >
        {formatMessage({ id: 'app.tournament.create-tournament.button.create' })}
      </Button>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Box>
  );
};
