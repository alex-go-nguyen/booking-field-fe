import { Box, Card, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bannerImages } from '@/assets/images/banner';
import { tournamentImages } from '@/assets/images/tournament';
import { DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE } from '@/common/constants';
import { defaultLocations } from '@/common/datas/location.data';
import { Link, SearchBox, Slider, SliderProps } from '@/components';
import { VenueCard } from '@/components/VenueCard';
import { useAuth } from '@/hooks';
import { useLocale } from '@/locales';
import { pitchCategoryKeys } from '@/services/pitch_category/pitch-category.query';
import { LocationMap } from '@/services/venue/venue.dto';
import { venueKeys } from '@/services/venue/venue.query';

const maxDistance = 6000;
export const Home = () => {
  const { profile } = useAuth();

  const navigate = useNavigate();

  const { formatMessage } = useLocale();

  const pitchCategoryInstance = pitchCategoryKeys.list();
  const { data, isLoading } = useQuery({ ...pitchCategoryInstance, staleTime: Infinity });

  const [currentPosition, setCurrentPosition] = useState<LocationMap | undefined | null>();

  useMemo(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (_) => {
          setCurrentPosition(null);
        },
      );
    }
  }, []);

  const venueInstance = venueKeys.search({ page: 1, limit: 10, isProminant: true });
  const { data: prominantVenues, isLoading: isLoadingProminantVenues } = useQuery(venueInstance);

  const venueNearByInstance = venueKeys.search({
    currentLat: currentPosition?.lat,
    currentLng: currentPosition?.lng,
    maxDistance,
    page: 1,
    limit: 20,
  });
  const { data: nearByVenues, isLoading: isLoadingNearbyVenues } = useQuery({
    ...venueNearByInstance,
    enabled: Boolean(currentPosition),
  });

  const sliderSettings: SliderProps = {
    dots: false,
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    swipeToSlide: true,
  };

  const sliderVenueSettings: SliderProps = {
    dots: false,
    autoplay: false,
    infinite: false,
    slidesToShow: 4,
    speed: 500,
    initialSlide: 0,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 780,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    swipeToSlide: true,
    sx: {
      '.slick-slide': {
        px: 1.5,
      },
      '.slick-list': {
        mx: -1.5,
      },
      '.slick-track': {
        margin: 0,
      },
    },
  };

  return (
    <>
      <Box position='relative' marginBottom={14}>
        <Box>
          <Slider {...sliderSettings}>
            {bannerImages.map((item, index) => (
              <Box display='flex' justifyContent='center' key={index} height={{ xs: 300, md: 500 }}>
                <Box
                  borderRadius={3}
                  component='img'
                  width='100%'
                  height='100%'
                  overflow='hidden'
                  sx={{ objectFit: 'cover' }}
                  src={item}
                  alt={item}
                />
              </Box>
            ))}
          </Slider>
        </Box>
        <Box position='absolute' left={0} width='100%' bottom={{ xs: -180, md: -40 }}>
          <SearchBox />
        </Box>
      </Box>
      <Box marginTop={{ xs: 30, md: 10 }} marginBottom={10}>
        <Typography variant='h5' marginY={2}>
          {formatMessage({ id: 'app.home.tournament.title' })}
        </Typography>
        <Grid container spacing={3}>
          {tournamentImages.map((item) => (
            <Grid
              item
              xs={6}
              width='100%'
              height={{ xs: 200, md: 300 }}
              onClick={() => {
                if (profile) {
                  navigate(`/league/create-tournament?type=${item.label}`);
                } else {
                  navigate('/login', {
                    state: {
                      redirect: `/league/create-tournament?type=${item.label}`,
                    },
                  });
                }
              }}
              sx={{
                cursor: 'pointer',
                ':hover': {
                  zIndex: 1,
                  transform: 'scale(1.1)',
                },
                transition: '0.2s ease all',
              }}
              key={item.label}
              position='relative'
            >
              <Box
                component='img'
                src={item.src}
                width='100%'
                height='100%'
                sx={{
                  objectFit: 'cover',
                }}
                borderRadius={3}
              />
              <Typography
                fontSize={{ xs: 24, md: 40 }}
                textAlign='center'
                color='primary.contrastText'
                position='absolute'
                top='50%'
                left='50%'
                sx={{
                  transform: 'translate(-50%, -50%)',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6), -2px -2px 4px rgba(0, 0, 0, 0.6)',
                }}
              >
                {formatMessage({ id: `app.tournament.create-tournament.type.${[item.label]}` as any })}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box marginY={10}>
        <Typography variant='h5' marginY={2}>
          {formatMessage({ id: 'app.home.category-list.title' })}
        </Typography>
        <Grid container spacing={3} justifyContent='center'>
          {isLoading || !data
            ? Array(4)
                .fill(null)
                .map((_, index) => (
                  <Grid item xs={12} md={6} lg={3} key={index}>
                    <Box width='100%' height={400} borderRadius={3} overflow='hidden'>
                      <Skeleton variant='rectangular' width='100%' height={200} />
                      <Skeleton variant='rectangular' width='20%' height={20} sx={{ marginY: 2 }} />
                      <Skeleton variant='rectangular' width='100%' height={20} sx={{ marginY: 1 }} />
                      <Skeleton variant='rectangular' width='100%' height={20} sx={{ marginY: 1 }} />
                      <Skeleton variant='rectangular' width='100%' height={20} sx={{ marginY: 1 }} />
                      <Skeleton variant='rectangular' width='100%' height={20} sx={{ marginY: 1 }} />
                    </Box>
                  </Grid>
                ))
            : data.data.map((category) => (
                <Grid item xs={12} md={6} lg={3} key={category.id}>
                  <Link
                    href={`/search?location=${defaultLocations[0]}&pitchCategory=${category.id}&minPrice=${DEFAULT_MIN_PRICE}&maxPrice=${DEFAULT_MAX_PRICE}`}
                  >
                    <Card
                      variant='outlined'
                      sx={{
                        width: {
                          md: '100%',
                        },
                        minHeight: 400,
                        borderRadius: 3,
                        ':hover': {
                          boxShadow: 10,
                        },
                      }}
                      key={category.id}
                    >
                      <CardMedia sx={{ height: 200 }} image={category.thumbnail} title={category.name} />
                      <CardContent>
                        <Typography gutterBottom variant='h5' component='div'>
                          {category.name}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {category.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
        </Grid>
      </Box>
      <Box marginY={10}>
        <Typography variant='h5' my={2}>
          {formatMessage({ id: 'app.home.prominant.title' })}
        </Typography>
        <Slider {...sliderVenueSettings}>
          {!prominantVenues || isLoadingProminantVenues
            ? Array(4)
                .fill(null)
                .map((index) => (
                  <Box width='100%' height={400} borderRadius={3} overflow='hidden' key={index}>
                    <Skeleton variant='rectangular' width='100%' height={200} />
                    <Skeleton variant='rectangular' width='50%' height={20} sx={{ marginY: 2 }} />
                    <Skeleton variant='rectangular' width='100%' height={20} sx={{ marginY: 1 }} />
                  </Box>
                ))
            : prominantVenues.data.map((venue) => <VenueCard data={venue} key={venue.id} />)}
        </Slider>
      </Box>
      <Box marginY={10}>
        <Typography variant='h5' my={2}>
          {formatMessage({ id: 'app.home.nearby.title' })}
        </Typography>
        <Slider {...sliderVenueSettings}>
          {isLoadingNearbyVenues && Boolean(currentPosition)
            ? Array(4)
                .fill(null)
                .map((index) => (
                  <Box width='100%' height={400} borderRadius={3} overflow='hidden' key={index}>
                    <Skeleton variant='rectangular' width='100%' height={200} />
                    <Skeleton variant='rectangular' width='50%' height={20} sx={{ marginY: 2 }} />
                    <Skeleton variant='rectangular' width='100%' height={20} sx={{ marginY: 1 }} />
                  </Box>
                ))
            : nearByVenues?.data.map((venue) => <VenueCard data={venue} key={venue.id} />)}
        </Slider>
        {currentPosition === null && (
          <Box textAlign='center'>
            <Box
              component='img'
              src='https://static.vecteezy.com/system/resources/thumbnails/001/265/747/small/blue-pin-in-showing-location-on-white-map.jpg'
              alt='maps'
              sx={{ objectFit: 'cover', height: 100 }}
            />
            <Typography my={1}>{formatMessage({ id: 'app.home.nearby.suggest' })}</Typography>
          </Box>
        )}
      </Box>
    </>
  );
};
