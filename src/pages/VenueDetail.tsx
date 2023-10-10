import { Favorite } from '@mui/icons-material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import PlaceIcon from '@mui/icons-material/Place';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import StarIcon from '@mui/icons-material/Star';
import { Box, Button, Divider, Grid, LinearProgress, Rating, Stack, Tab, Tabs, Typography } from '@mui/material';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RATING_PAGE_LIMIT } from '@/common/constants';
import { ImageLibrary, LoadingContainer, Seo, useGoogleMapApi } from '@/components';
import NotFound from '@/components/NotFound';
import { useAuth } from '@/hooks';
import { useLocale } from '@/locales';
import { pitchKeys } from '@/services/pitch/pitch.query';
import { ratingKeys } from '@/services/rating/rating.query';
import { UpdateUserPayload } from '@/services/user/user.dto';
import userService from '@/services/user/user.service';
import { venueKeys } from '@/services/venue/venue.query';
import {
  averageQualityRate,
  averageRate,
  averageServiceRate,
  convertCurrency,
  convertToAMPM,
  formatDate,
  groupBy,
} from '@/utils';

const defaultLocation = { lat: 10.161512, lng: 106.23212311 };
export const VenueDetail = () => {
  const { formatMessage } = useLocale();

  const { profile, refetch: refetchAuth } = useAuth();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [tab, setTab] = useState(0);

  const { slug } = useParams();

  const venueInstance = venueKeys.detail(slug);
  const {
    data: venue,
    isLoading: isLoadingVenue,
    isFetched,
  } = useQuery({
    ...venueInstance,
    enabled: !!slug,
  });

  const pitchInstance = pitchKeys.list({ venueId: venue?.id });
  const { data: pitches } = useQuery({ ...pitchInstance, enabled: !!venue });

  const ratingInstance = ratingKeys.list({ venueId: venue?.id, page: 1, limit: RATING_PAGE_LIMIT });
  const { data: ratings } = useQuery({ ...ratingInstance, enabled: !!venue });

  const { isLoaded } = useGoogleMapApi();

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const { mutate: mutateUpdateUser } = useMutation({
    mutationFn: ({ id, data }: UpdateUserPayload) => userService.updateUserInfo(id, data),
    onSuccess: () => {
      toast.success('Update your favorites successfully');
      refetchAuth();
    },
  });

  const handleFavourite = () => {
    if (!profile) {
      navigate('/login', { state: { redirect: pathname } });
    } else {
      if (profile.favorites?.find((item) => item.id === venue?.id)) {
        const filterFavorite = profile.favorites.filter((item) => item.id !== venue?.id);
        mutateUpdateUser({ id: profile.id, data: { favorites: filterFavorite } });
      } else {
        venue && mutateUpdateUser({ id: profile.id, data: { favorites: [...(profile.favorites || []), venue] } });
      }
    }
  };

  const groupByCategory = pitches && groupBy(pitches.data, (item) => item.pitchCategory.name);

  if (!venue && isLoadingVenue) {
    return <LoadingContainer />;
  }

  if (!venue && isFetched) {
    return <NotFound />;
  }

  return (
    venue && (
      <Box marginY={2}>
        <Seo title={venue.name} description={venue.description} />
        <Grid container spacing={1}>
          <Grid item xs={12} md={10} order={1}>
            <Typography variant='h3'>{venue.name}</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={2}
            order={2}
            display='flex'
            alignItems='center'
            justifyContent={{ xs: 'start', md: 'end' }}
            onClick={handleFavourite}
            sx={{ cursor: 'pointer' }}
          >
            {profile?.favorites?.find((item) => item.id === venue.id) ? (
              <Favorite color='primary' sx={{ marginRight: 1 }} />
            ) : (
              <FavoriteBorderIcon
                sx={{
                  marginRight: 1,
                  ':hover': {
                    color: 'primary.main',
                  },
                }}
              />
            )}
            <Typography variant='body1'>{formatMessage({ id: 'app.venue.favorite' })}</Typography>
          </Grid>
          <Grid item xs={12} md={10} order={3} display='flex'>
            <PlaceIcon sx={{ marginRight: 1, color: 'primary.main' }} />
            <Typography variant='body1'>{venue.address}</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={2}
            order={4}
            display='flex'
            justifyContent={{ xs: 'start', md: 'end' }}
            alignItems='center'
          >
            <StarIcon sx={{ marginRight: 1, color: 'primary.main' }} />
            <Typography variant='body1'>{ratings && averageRate(ratings.data)}/5</Typography>
          </Grid>
          {venue.imageList && venue.imageList.length > 0 && (
            <Grid item xs={12} md={12} order={{ xs: 0, md: 5 }} marginY={2}>
              <ImageLibrary imageList={venue.imageList} />
            </Grid>
          )}
          <Grid item order={4}>
            <Stack direction='row' divider={<Divider orientation='vertical' flexItem />} spacing={2}>
              <Box display='flex' alignItems='center' gap={1} flexDirection={{ xs: 'column', md: 'row' }}>
                <Typography>{formatMessage({ id: 'app.venue.work-time.open' })}:</Typography>
                <Typography fontWeight={500} variant='body1'>
                  {convertToAMPM(venue.openAt)}
                </Typography>
              </Box>
              <Box display='flex' alignItems='center' gap={1} flexDirection={{ xs: 'column', md: 'row' }}>
                <Typography>{formatMessage({ id: 'app.venue.work-time.close' })}:</Typography>
                <Typography fontWeight={500} variant='body1'>
                  {convertToAMPM(venue.closeAt)}
                </Typography>
              </Box>
              <Box display='flex' alignItems='center' gap={1} flexDirection={{ xs: 'column', md: 'row' }}>
                <Typography>{formatMessage({ id: 'app.venue.work-time.time' })}:</Typography>
                <Typography fontWeight={500} variant='body1'>
                  Cả tuần
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} order={5}>
            {venue.description}
          </Grid>
        </Grid>

        <Box position='sticky' marginY={2} top={0} bgcolor='primary.contrastText' zIndex={1}>
          <Tabs value={tab} onChange={handleChange} variant='scrollable'>
            <Tab label={formatMessage({ id: 'app.venue.tab.pitch-list' })} LinkComponent='a' href='#pitches' />
            <Tab label={formatMessage({ id: 'app.venue.tab.rating' })} LinkComponent='a' href='#rating' />
            <Tab label={formatMessage({ id: 'app.venue.tab.address' })} LinkComponent='a' href='#address' />
          </Tabs>
        </Box>
        <Box marginY={4} id='pitches'>
          <Typography variant='h4'>{formatMessage({ id: 'app.venue.pitches.title' })}</Typography>
          {groupByCategory &&
            groupByCategory.map((item) => (
              <Grid
                container
                paddingY={4}
                spacing={2}
                borderBottom={1}
                borderColor='footer.dark'
                sx={{
                  ':last-child': {
                    borderBottom: 0,
                  },
                }}
                key={item.key}
              >
                <Grid item xs={12} md={3}>
                  <Box
                    bgcolor='primary.main'
                    color='primary.contrastText'
                    width={{ xs: '100%', md: '80%' }}
                    height={200}
                    borderRadius={3}
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    fontSize={24}
                  >
                    {item.key}
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography marginBottom={2} fontWeight={500}>
                    {formatMessage({ id: 'app.venue.pitches.item.info' })}
                  </Typography>
                  <Box>
                    <Box display='flex' alignItems='center' marginY={2}>
                      <SportsSoccerIcon />
                      <Typography marginLeft={1}>
                        {formatMessage({ id: 'app.venue.pitches.item.info.ball' })}
                      </Typography>
                    </Box>
                    <Box display='flex' alignItems='center' marginY={2}>
                      <LocalDrinkIcon />
                      <Typography marginLeft={1}>
                        {formatMessage({ id: 'app.venue.pitches.item.info.drink' })}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3} textAlign={{ xs: 'right', md: 'left' }}>
                  <Typography marginBottom={2} fontWeight={500}>
                    {formatMessage({ id: 'app.venue.pitches.item.amount' })}
                  </Typography>
                  <Box
                    display='inline-flex'
                    paddingX={4}
                    paddingY={1}
                    borderRadius={2}
                    border={1}
                    borderColor='primary.main'
                    color='primary.main'
                  >
                    {item.values.length}
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography marginBottom={2} fontWeight={500}>
                    {formatMessage({ id: 'app.venue.pitches.item.price' })}
                  </Typography>
                  <Box>
                    <Typography variant='body1' color='primary.main' fontWeight={500} marginY={2}>
                      {formatMessage({ id: 'app.venue.pitches.item.price.unit' })}
                    </Typography>
                    <Typography variant='h5' fontWeight={500} marginY={2}>
                      {convertCurrency(item.values[0].price)}
                    </Typography>
                  </Box>
                  <Button
                    variant='contained'
                    sx={{ marginY: 2 }}
                    onClick={() => navigate(`/booking/${venue.slug}?pitchCategory=${item.values[0].pitchCategory.id}`)}
                  >
                    {formatMessage({ id: 'app.venue.pitches.item.book' })}
                  </Button>
                </Grid>
              </Grid>
            ))}
        </Box>

        <Box marginY={4} id='rating'>
          <Typography variant='h4'> {formatMessage({ id: 'app.venue.ratings.title' })}</Typography>
          {ratings && ratings.data.length > 0 ? (
            <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={6}>
              <Box flex={{ xs: 1, md: 5 }}>
                <Box display='flex' alignItems='center' gap={2}>
                  <Typography variant='h1' fontWeight={500}>
                    {averageRate(ratings.data)}
                  </Typography>
                  <Box>
                    <Rating
                      name='rating'
                      value={Number(averageRate(ratings.data))}
                      readOnly
                      sx={{ color: 'primary.main' }}
                      size='large'
                    />
                    <Typography color='secondary' sx={{ opacity: 0.8 }}>
                      Base on {ratings.data.length} ratings
                    </Typography>
                  </Box>
                </Box>
                <Box marginY={2}>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography>{formatMessage({ id: 'app.venue.ratings.quality' })}</Typography>
                    <Typography fontWeight={500}>{averageQualityRate(ratings.data)}</Typography>
                  </Box>
                  <LinearProgress
                    variant='determinate'
                    value={(Number(averageQualityRate(ratings.data)) / 5) * 100}
                    sx={{ height: 8, borderRadius: 2 }}
                  />
                </Box>
                <Box marginY={2}>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography>{formatMessage({ id: 'app.venue.ratings.services' })}</Typography>
                    <Typography fontWeight={500}>{averageServiceRate(ratings.data)}</Typography>
                  </Box>
                  <LinearProgress
                    variant='determinate'
                    value={(Number(averageServiceRate(ratings.data)) / 5) * 100}
                    sx={{ height: 8, borderRadius: 2 }}
                  />
                </Box>
              </Box>
              <Box flex={{ xs: 1, md: 7 }}>
                {ratings.data.map((rating) => (
                  <Box pb={4} key={rating.id}>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                      <Typography
                        fontWeight={500}
                      >{`${rating.booking.user.lastName} ${rating.booking.user.firstName}`}</Typography>
                      <Typography variant='body2' sx={{ opacity: 0.8 }}>
                        {formatDate(rating.createdAt)}
                      </Typography>
                    </Box>
                    <Rating
                      name='rating'
                      value={(rating.serviceRate + rating.qualityRate) / 2}
                      readOnly
                      sx={{ color: 'primary.main' }}
                      size='medium'
                    />
                    <Typography fontWeight={500} fontStyle='italic'>
                      {`${rating.booking.pitch.pitchCategory.name} - ${rating.booking.pitch.name}`}
                    </Typography>
                    <Typography>{rating.content}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Box marginY={2}> {formatMessage({ id: 'app.venue.ratings.no-result' })}</Box>
          )}
        </Box>

        <Box marginY={4} id='address'>
          <Typography variant='h4'> {formatMessage({ id: 'app.venue.address.title' })}</Typography>
          {isLoaded && (
            <Box borderRadius={4} overflow='hidden' marginY={2}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '50vh' }}
                center={venue.location || defaultLocation}
                zoom={10}
              >
                {venue.location && <MarkerF position={{ lat: venue.location.lat, lng: venue.location.lng }} />}
              </GoogleMap>
            </Box>
          )}
        </Box>
      </Box>
    )
  );
};
