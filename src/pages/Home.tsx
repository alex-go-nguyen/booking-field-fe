import { Box, Card, CardContent, CardMedia, ImageList, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { SearchBox } from '@/components/SearchBox';
import { Slider } from '@/components/Slider';
import { getAllPitchCategories } from '@/services/category/category.service';

export const Home = () => {
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getAllPitchCategories, staleTime: 1000 });

  const SliderSettings = {
    dots: false,
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    swipeToSlide: true,
  };

  return (
    categories && (
      <>
        <Box position='relative' marginBottom={14}>
          <Box component='img' sx={{ width: '100%' }} alt='san co nhan tao so 1' src='banner.jpg' />
          <Box position='absolute' width='100%' bottom={-40}>
            <SearchBox />
          </Box>
        </Box>
        <Box marginY={2}>
          <Slider {...SliderSettings}>
            {categories.data.map((category) => (
              <Box display='flex' justifyContent='center' paddingX={2} height={250} width={100} key={category._id}>
                <Box
                  component='img'
                  borderRadius={4}
                  width='100%'
                  height='100%'
                  overflow='hidden'
                  alt={category.name}
                  src={category.thumbnail}
                />
              </Box>
            ))}
          </Slider>
        </Box>

        <Box marginY={10}>
          <Typography variant='h5' marginY={2}>
            Danh mục sân bóng
          </Typography>
          <ImageList sx={{ width: 'full', height: 400 }} cols={categories.data.length} rowHeight={100}>
            {categories.data.map((category) => (
              <Card sx={{ maxWidth: 345, borderRadius: 4 }} key={category._id}>
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
            ))}
          </ImageList>
        </Box>
      </>
    )
  );
};
