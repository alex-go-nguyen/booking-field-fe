import { AccessTime, LocationOn } from '@mui/icons-material';
import { Box, Divider, Rating, Tab, Tabs, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DefaultImage } from './DefaultImage';
import { commonImages } from '@/assets/images/common';
import { useLocale } from '@/locales';
import { ratingKeys } from '@/services/rating/rating.query';
import { SearchVenueData } from '@/services/venue/venue.dto';
import { formatDate } from '@/utils';

export type VenueInfoMapPopupProps = {
  data: SearchVenueData;
};
export const VenueInfoMapPopup = ({ data }: VenueInfoMapPopupProps) => {
  const { formatMessage } = useLocale();

  const [mapTabIndex, setMapTabIndex] = useState(0);

  const ratingInstance = ratingKeys.list({ venueId: data.id, page: 1, limit: 0 });
  const { data: ratings } = useQuery({ ...ratingInstance });

  return (
    <Box borderColor='secondary.light'>
      <Box height={200} borderRadius={3}>
        {data.imageList?.length > 0 ? (
          <Box
            component='img'
            height='100%'
            width='100%'
            sx={{ objectFit: 'cover' }}
            src={data.imageList?.[0].imagePath}
            alt={data.name}
          />
        ) : (
          <DefaultImage />
        )}
      </Box>
      <Box paddingX={2} mt={2}>
        <Typography fontWeight={500} fontSize={20}>
          {data.name}
        </Typography>
        <Typography>{data.description}</Typography>
        {data.totalReview > 0 && (
          <Box display='flex' gap={1} alignItems='center'>
            <Typography>{((data.averageQualityRate + data.averageServiceRate) / 2).toFixed(1)}</Typography>
            <Rating value={(data.averageQualityRate + data.averageServiceRate) / 2} readOnly size='small' />
            <Typography>({data.totalReview})</Typography>
          </Box>
        )}
        <Box display='flex' justifyContent='center' marginTop={2}>
          <Tabs value={mapTabIndex} onChange={(_, value) => setMapTabIndex(value)} sx={{ display: 'flex', gap: 2 }}>
            <Tab label={formatMessage({ id: 'search.map.info.overview' })} />
            <Tab label={formatMessage({ id: 'search.map.info.review' })} />
            <Tab label={formatMessage({ id: 'search.map.info.about' })} />
          </Tabs>
        </Box>
      </Box>
      <Divider />
      <Box>
        {mapTabIndex === 0 && (
          <Box p={2}>
            <Box display='flex' alignItems='center' gap={2} marginY={1}>
              <LocationOn color='primary' />
              <Typography>{data.address}</Typography>
            </Box>
            <Box display='flex' alignItems='center' gap={2} marginY={1}>
              <AccessTime color='primary' />
              <Typography>{`${data.openAt} - ${data.closeAt}`}</Typography>
            </Box>
          </Box>
        )}
        {mapTabIndex === 1 && (
          <Box px={2}>
            {ratings && ratings.data.length > 0 ? (
              ratings.data.map((rating) => (
                <Box display='flex' justifyContent='space-between' paddingY={2} key={rating.id}>
                  <Box>
                    <Typography
                      fontWeight={500}
                    >{`${rating.booking.user.lastName} ${rating.booking.user.firstName}`}</Typography>
                    <Typography>{rating.content}</Typography>
                  </Box>
                  <Box>
                    <Rating value={(rating.serviceRate + rating.qualityRate) / 2} size='small' />
                    <Typography variant='body2' textAlign='right'>
                      {formatDate(rating.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Box textAlign='center' p={2}>
                <Box component='img' src={commonImages.noResult.src} alt={commonImages.noResult.name} height={40} />
                <Typography>{formatMessage({ id: 'app.venue.ratings.no-result' })}</Typography>
              </Box>
            )}
          </Box>
        )}
        {mapTabIndex === 2 && (
          <Box>
            <Typography p={2}>{data.description}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
