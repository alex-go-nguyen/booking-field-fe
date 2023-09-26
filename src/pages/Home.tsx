import { Box, Card, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'react-slick';
import { bannerImages } from '@/assets/images/banner';
import { tournamentImages } from '@/assets/images/tournament';
import { DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE } from '@/common/constants';
import { defaultLocations } from '@/common/datas/location.data';
import { Link, SearchBox, Slider } from '@/components';
import { useAuth } from '@/hooks';
import { useLocale } from '@/locales';
import { pitchCategoryKeys } from '@/services/pitch_category/pitch-category.query';

export const Home = () => {
  const { profile } = useAuth();

  const navigate = useNavigate();

  const { formatMessage } = useLocale();

  const pitchCategoryInstance = pitchCategoryKeys.list();
  const { data, isLoading } = useQuery({ ...pitchCategoryInstance, staleTime: Infinity });

  const sliderSettings: Settings = {
    dots: false,
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    swipeToSlide: true,
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
                  navigate('/league/create-tournament');
                } else {
                  navigate('/login', {
                    state: {
                      redirect: '/league/create-tournament',
                    },
                  });
                }
              }}
              sx={{ cursor: 'pointer' }}
              key={item}
            >
              <Box
                component='img'
                src={item}
                width='100%'
                height='100%'
                sx={{
                  objectFit: 'cover',
                  ':hover': {
                    transform: 'scale(1.1)',
                  },
                  transition: '0.2s ease all',
                }}
                borderRadius={3}
              />
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
    </>
  );
};
