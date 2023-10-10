import { RoomOutlined } from '@mui/icons-material';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { DefaultImage } from './DefaultImage';
import { Link } from './Link';
import { useLocale } from '@/locales';
import { SearchVenueData } from '@/services/venue/venue.dto';
import { convertDistance } from '@/utils';
export type VenueCardProps = {
  data: SearchVenueData;
};
export const VenueCard = ({ data }: VenueCardProps) => {
  const { formatMessage } = useLocale();

  return (
    <Link
      href={`/venue/${data.slug}`}
      borderColor='secondary.light'
      sx={{
        ':hover': {
          cursor: 'pointer',
        },
      }}
    >
      <Card
        variant='outlined'
        sx={{
          borderRadius: 3,
        }}
      >
        <CardMedia sx={{ height: 200 }}>
          {data.imageList?.length > 0 ? (
            <Box
              component='img'
              src={data.imageList[0].imagePath}
              width='100%'
              height='100%'
              sx={{ objectFit: 'cover' }}
            />
          ) : (
            <DefaultImage />
          )}
        </CardMedia>
        <CardContent>
          <Typography fontWeight={500} fontSize={16}>
            {data.name}
          </Typography>
          <Box display='flex' alignItems='center'>
            <RoomOutlined fontSize='small' />
            <Typography variant='body2'>{data.province}</Typography>
          </Box>
          {data.distance && (
            <Typography color='primary.main' variant='body2' textAlign='right'>
              {formatMessage(
                { id: 'app.home.nearby.result.card.distance' },
                { distance: convertDistance(data.distance) },
              )}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
