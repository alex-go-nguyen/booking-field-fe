import { Box, Card, CardContent, CardMedia, Grid, Typography, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE } from '@/common/constants';
import { defaultLocations } from '@/common/datas/location.data';
import { SearchBox, Slider } from '@/components';
import { useLocale } from '@/locales';
import { pitchCategoryKeys } from '@/services/pitch_category/pitch-category.query';
import { theme } from '@/styles/theme';

export const Home = () => {
  const navigate = useNavigate();

  const pitchCategoryInstance = pitchCategoryKeys.list({});
  const { formatMessage } = useLocale();

  const { data } = useQuery({ ...pitchCategoryInstance, staleTime: Infinity });

  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const SliderSettings = {
    dots: false,
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: matches ? 1 : 3,
    swipeToSlide: true,
  };

  return (
    data && (
      <>
        <Box position='relative' marginBottom={14}>
          <Box
            component='img'
            sx={{ width: '100%', objectFit: 'cover' }}
            minHeight={300}
            alt='san co nhan tao so 1'
            src='https://www.sfy.org.uk/wp-content/uploads/2021/02/Football-3x1-WEB-scaled.jpg'
          />
          <Box position='absolute' left={0} width='100%' bottom={-40}>
            <SearchBox />
          </Box>
        </Box>
        <Box marginY={2}>
          <Slider {...SliderSettings}>
            {data.data.map((category) => (
              <Box
                display='flex'
                justifyContent='center'
                height={{ xs: 300, md: 300, lg: 200 }}
                paddingX={4}
                key={category.id}
              >
                <Box
                  borderRadius={4}
                  overflow='hidden'
                  position='relative'
                  width='100%'
                  height='100%'
                  margin='auto'
                  sx={{
                    ':before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      display: 'none',
                    },
                    ':hover': {
                      ':before': {
                        display: 'block',
                      },
                    },
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    component='img'
                    width='100%'
                    height='100%'
                    overflow='hidden'
                    sx={{ objectFit: 'cover' }}
                    alt={category.name}
                    src={category.thumbnail}
                  />
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>

        <Box marginY={10}>
          <Typography variant='h5' marginY={2}>
            {formatMessage({ id: 'app.home.category-list.title' })}
          </Typography>
          <Grid container sx={{ width: '100%' }} spacing={4} justifyContent='center'>
            {data.data.map((category) => (
              <Grid item xs={12} md={6} lg={3} key={category.id}>
                <Card
                  sx={{
                    width: {
                      md: '100%',
                    },
                    minHeight: 400,
                    borderRadius: 4,
                  }}
                  key={category.id}
                >
                  <Box
                    position='relative'
                    sx={{
                      ':before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                        display: 'none',
                        zIndex: 1,
                      },
                      ':hover': {
                        ':before': {
                          display: 'block',
                        },
                      },
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      navigate(
                        `/search?location=${defaultLocations[0]}&pitchCategory=${category.id}&minPrice=${DEFAULT_MIN_PRICE}&maxPrice=${DEFAULT_MAX_PRICE}`,
                      )
                    }
                  >
                    <CardMedia sx={{ height: 200 }} image={category.thumbnail} title={category.name} />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      {category.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </>
    )
  );
};
