import { ArrowDropDown, Sort, Tune } from '@mui/icons-material';
import { Box, Button, Grid, Pagination, Skeleton, Typography } from '@mui/material';
import { GoogleMap, OverlayViewF, OverlayView } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { commonImages } from '@/assets/images/common';
import { DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE } from '@/common/constants';
import { OrderEnum } from '@/common/enums/order.enum';
import { SearchFilter, SearchResultCard, SearchSort, VenueInfoMapPopup, useGoogleMapApi } from '@/components';
import { useBoolean } from '@/hooks';
import { pitchCategoryKeys } from '@/services/pitch_category/pitch-category.query';
import { LocationMap, SearchVenueData } from '@/services/venue/venue.dto';
import { venueKeys } from '@/services/venue/venue.query';

const STALE_TIME = 5 * 1000;
const PAGE_LIMIT = 10;
const defaultCenter = { lat: 106.02532, lng: 10.023321 };
export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPosition, setCurrentPosition] = useState<LocationMap>();

  const { formatMessage } = useIntl();

  const categoryParams = searchParams.get('pitchCategory') || '1';
  const locationParams = searchParams.get('location') || 'Hồ Chí Minh';
  const sortParams = searchParams.get('sort') || OrderEnum.Asc;
  const minPrice = Number(searchParams.get('minPrice')) || DEFAULT_MIN_PRICE;
  const maxPrice = Number(searchParams.get('maxPrice')) || DEFAULT_MAX_PRICE;

  const { value: isOpenSortModal, setTrue: openSortModal, setFalse: closeSortModal } = useBoolean(false);
  const { value: isOpenFilterModal, setTrue: openFilterModal, setFalse: closeFilterModal } = useBoolean(false);

  const [page, setPage] = useState(1);

  const pitchCategoryInstace = pitchCategoryKeys.list();
  const { data: pitchCategories } = useQuery({ ...pitchCategoryInstace, staleTime: STALE_TIME });

  locationParams === 'nearBy' &&
    navigator.geolocation.getCurrentPosition((position) =>
      setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude }),
    );

  const venueInstance = venueKeys.search({
    ...(locationParams === 'nearBy'
      ? {
          currentLat: currentPosition?.lat,
          currentLng: currentPosition?.lng,
          maxDistance: 10000,
        }
      : { location: locationParams }),
    page,
    limit: PAGE_LIMIT,
    sorts: [
      {
        field: 'price',
        order: sortParams as OrderEnum,
      },
    ],
    pitchCategory: Number(categoryParams),
    minPrice,
    maxPrice,
  });
  const { data: venues, refetch: venueRefetch, isLoading: isVenueLoading } = useQuery(venueInstance);

  const { isLoaded } = useGoogleMapApi();

  const [activeMarker, setActiveMarker] = useState<SearchVenueData | null>(null);

  const handleActiveMarker = (marker: SearchVenueData) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const handleOnLoad = (map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();
    venues?.data.forEach(({ location }) => bounds.extend(location));
    map.fitBounds(bounds);
  };

  useEffect(() => {
    venueRefetch();
  }, [searchParams, venueRefetch, page]);

  return (
    <>
      <Grid container display='flex' justifyContent='space-between' marginBottom={2}>
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            paddingBottom: {
              xs: 2,
              md: 0,
            },
          }}
          display='flex'
          gap={2}
        >
          {pitchCategories?.data.map((category) => (
            <Button
              variant={Number(categoryParams) == category.id ? 'contained' : 'outlined'}
              key={category.id}
              onClick={() => {
                searchParams.set('pitchCategory', category.id.toString());
                setSearchParams((prev) => [...prev]);
              }}
            >
              {category.name}
            </Button>
          ))}
        </Grid>
        <Grid item xs={12} md={4} display='flex' justifyContent='end' gap={2}>
          <Button variant='contained' onClick={openFilterModal}>
            <Tune sx={{ marginRight: 1 }} /> {formatMessage({ id: 'search.tool.filter.title' })}
          </Button>
          <Button variant='contained' onClick={openSortModal}>
            <Sort sx={{ marginRight: 1 }} />
            {formatMessage({ id: 'search.tool.sort.title' })}
          </Button>
        </Grid>
      </Grid>
      <Grid container borderTop={1} paddingY={2} bgcolor='footer.light' justifyContent='center'>
        <Grid item xs={12} md={12} lg={8} padding={2} alignItems='center'>
          {!venues || isVenueLoading ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Skeleton variant='rectangular' height={200} sx={{ borderRadius: 3 }} />
              </Grid>
              <Grid item xs={12} md={9}>
                <Skeleton variant='rectangular' height={30} sx={{ borderRadius: 2 }} />
                <Box display='flex' gap={1} marginY={2}>
                  <Skeleton variant='rectangular' height={20} width={60} sx={{ borderRadius: 2 }} />
                  <Skeleton variant='rectangular' height={20} width={60} sx={{ borderRadius: 2 }} />
                  <Skeleton variant='rectangular' height={20} width={60} sx={{ borderRadius: 2 }} />
                </Box>
                <Skeleton variant='rectangular' height={20} width={60} sx={{ marginY: 2, borderRadius: 2 }} />
                <Skeleton variant='rectangular' height={20} width={60} sx={{ marginY: 2, borderRadius: 2 }} />
                <Box display='flex' justifyContent='space-between' marginY={1}>
                  <Skeleton variant='rectangular' height={20} width={100} sx={{ borderRadius: 2 }} />
                  <Skeleton variant='rectangular' height={20} width={100} sx={{ borderRadius: 2 }} />
                </Box>
                <Box display='flex' justifyContent='space-between'>
                  <Skeleton variant='rectangular' height={20} width={100} sx={{ borderRadius: 2 }} />
                  <Skeleton variant='rectangular' height={20} width={100} sx={{ borderRadius: 2 }} />
                </Box>
              </Grid>
            </Grid>
          ) : venues.data.length > 0 ? (
            <>
              <Typography variant='body2'>
                {formatMessage({ id: 'search.result.result.title' }, { total: venues.pageInfo.count })}
              </Typography>
              <Box>
                {venues.data.map((item) => (
                  <SearchResultCard data={item} key={item.id} />
                ))}
              </Box>
              {venues.pageInfo.pageCount > 1 && (
                <Pagination
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  count={venues.pageInfo.pageCount}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                />
              )}
            </>
          ) : (
            <Box textAlign='center'>
              <Box
                component='img'
                src={commonImages.noResult.src}
                alt={commonImages.noResult.name}
                width={150}
                height={150}
                marginBottom={2}
              />
              <Typography variant='body1' fontWeight={700}>
                {formatMessage({ id: 'search.result.no-result.title' })}
              </Typography>
              <Typography variant='body2'>{formatMessage({ id: 'search.result.no-result.sub-title' })}</Typography>
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={4}
          height={{
            md: 700,
            xs: 400,
          }}
          position='sticky'
          top={10}
          overflow='hidden'
          borderRadius={2}
          border={1}
          borderColor='secondary.light'
        >
          {isLoaded && (
            <GoogleMap
              onLoad={handleOnLoad}
              mapContainerStyle={{ width: '100%', height: '100%', borderRadius: 10 }}
              zoom={14}
              center={venues?.data?.[0]?.location || defaultCenter}
            >
              {venues &&
                venues.data.map(
                  (item) =>
                    item.location && (
                      <OverlayViewF
                        key={item.id}
                        position={item.location}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >
                        <Box
                          bgcolor={activeMarker === item ? 'primary.main' : 'primary.contrastText'}
                          sx={{ color: activeMarker === item ? 'primary.contrastText' : 'inherit', cursor: 'pointer' }}
                          p={1}
                          borderRadius={2}
                          fontSize={12}
                          fontWeight={500}
                          onClick={() => handleActiveMarker(item)}
                        >
                          {(item.price / 1000).toFixed(0)}K
                        </Box>
                      </OverlayViewF>
                    ),
                )}
            </GoogleMap>
          )}
          {activeMarker && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: '100%' }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
              }}
              position='absolute'
              width='100%'
              height='60%'
              bgcolor='primary.contrastText'
              bottom={0}
            >
              <Box position='relative' height='100%'>
                <Box
                  display='flex'
                  alignItems='center'
                  position='absolute'
                  bgcolor='primary.contrastText'
                  paddingX={8}
                  left='50%'
                  sx={{
                    transform: 'translateX(-50%)',
                    cursor: 'pointer',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                  top={-24}
                  borderTop={1}
                  borderLeft={1}
                  borderRight={1}
                  borderColor='secondary.light'
                  onClick={() => setActiveMarker(null)}
                >
                  <ArrowDropDown />
                </Box>
                <Box
                  sx={{
                    overflowY: 'scroll',
                    '::-webkit-scrollbar': {
                      width: '5px',
                      bgcolor: 'primary.contrastText',
                    },
                    '::-webkit-scrollbar-thumb': {
                      bgcolor: 'primary.main',
                    },
                  }}
                  height='100%'
                >
                  <VenueInfoMapPopup data={activeMarker} />
                </Box>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>

      <SearchSort isOpen={isOpenSortModal} sortParams={sortParams} onClose={closeSortModal} />
      <SearchFilter isOpen={isOpenFilterModal} priceRange={[minPrice, maxPrice]} onClose={closeFilterModal} />
    </>
  );
};
