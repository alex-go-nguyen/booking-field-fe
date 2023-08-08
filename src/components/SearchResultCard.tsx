import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import { Box, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from './Link';
import { SearchVenueData } from '@/services/venue/venue.dto';
import convertToAMPM from '@/utils/convertTimestamp';

export interface ISearchResultCardProps {
  data: SearchVenueData;
}

export const SearchResultCard = ({ data, ...props }: ISearchResultCardProps) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.3,
      }}
    >
      <Link href={`/venue/${data.slug}`}>
        <Grid container bgcolor='primary.contrastText' borderRadius={2} padding={2} marginY={2} {...props}>
          <Grid item md={3}>
            <Link href='/'>
              <Box
                component='img'
                height={200}
                width={200}
                sx={{ objectFit: 'cover' }}
                borderRadius={2}
                src='https://shopconhantao.com.vn/assets/cms/uploads/images/chi-phi-lam-san-bong/chi-phi-lam-san-bong-co-nhan-tao3.jpg'
                alt='hihihi'
              />
            </Link>
          </Grid>
          <Grid item md={9} paddingX={2} display='flex' flexDirection='column' justifyContent='space-between'>
            <Box>
              <Typography variant='h6'>{data.name}</Typography>
              <Box display='flex' gap={2} marginY={1} flexWrap='wrap'>
                <Typography variant='body2'>Sân 5</Typography>
                <Typography variant='body2'>Sân 7</Typography>
                <Typography variant='body2'>Sân 11</Typography>
                <Typography variant='body2'>Sân Futsal</Typography>
              </Box>
              <Box>
                <Typography variant='body2'>Open: {convertToAMPM(data.openAt)}</Typography>
                <Typography variant='body2'>Close: {convertToAMPM(data.closeAt)}</Typography>
              </Box>
            </Box>

            <Box>
              <Box display='flex' justifyContent='space-between'>
                <Box display='flex' alignItems='center' marginY={1}>
                  <StarIcon sx={{ color: 'primary.main', marginRight: 1 }} />
                  {data.rating}
                  <Typography marginX={1}>({data.totalReview} Đánh giá)</Typography>
                </Box>
                <Typography variant='body1' color='primary.main'>
                  1 giờ
                </Typography>
              </Box>
              <Box display='flex' justifyContent='space-between'>
                <Box display='flex' alignItems='center'>
                  <PlaceIcon sx={{ marginRight: 1 }} />
                  {data.district}
                </Box>
                <Typography variant='body1' fontWeight={500}>
                  {data.price.toLocaleString('vi')}đ
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Link>
    </Box>
  );
};
