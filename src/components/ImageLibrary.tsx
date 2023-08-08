import { Close } from '@mui/icons-material';
import { Box, Fab, Grid, IconButton, Modal } from '@mui/material';
import { useState } from 'react';
import { Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { useBoolean } from '@/hooks';
import { VenueImage } from '@/services/venue/venue.dto';

export interface IImageLibraryProps {
  imageList: VenueImage[];
}

export const ImageLibrary = ({ imageList }: IImageLibraryProps) => {
  const { value, setTrue, setFalse } = useBoolean(false);
  const [swiper, setSwiper] = useState<SwiperType>();

  return (
    <Grid container borderRadius={4} overflow='hidden' marginY={4} height={500}>
      <Grid item xs={8}>
        <Box
          component='img'
          src={imageList[0].imagePath}
          alt={imageList[0].imagePath}
          width='100%'
          height='100%'
          sx={{ objectFit: 'cover' }}
        />
      </Grid>
      <Grid item xs={4} height='100%' position='relative' paddingLeft={2}>
        <Box width='100%' height='100%'>
          {imageList.slice(1, 4).map((item) => (
            <Box
              component='img'
              width='100%'
              height='33%'
              sx={{ objectFit: 'cover' }}
              src={item.imagePath}
              key={item.imagePath}
            />
          ))}
        </Box>
        <Fab
          variant='extended'
          sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 12, fontSize: 12 }}
          onClick={setTrue}
        >
          Xem tất cả
        </Fab>
      </Grid>
      <Modal
        open={value}
        onClose={setFalse}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Box maxWidth={800} maxHeight={800} paddingX={3} paddingY={3} bgcolor='primary.contrastText' borderRadius={4}>
          <Box maxHeight={500} overflow='hidden' borderRadius={4} position='relative'>
            <Swiper
              spaceBetween={50}
              slidesPerView={1}
              centeredSlides={true}
              modules={[Navigation, Thumbs]}
              thumbs={{ swiper }}
            >
              {imageList.map((item) => (
                <SwiperSlide key={item.imagePath}>
                  <Box component='img' src={item.imagePath} width='100%' />
                </SwiperSlide>
              ))}
            </Swiper>
            <IconButton
              sx={{
                top: 0,
                right: 0,
                zIndex: 10,
                position: 'absolute',
                bgcolor: 'primary.contrastText',
                color: '#000',
              }}
              onClick={setFalse}
            >
              <Close color='inherit' />
            </IconButton>
          </Box>
          <Box maxHeight={50} overflow='hidden' marginTop={4}>
            <Swiper
              spaceBetween={10}
              slidesPerView={8}
              modules={[Navigation, Thumbs]}
              onSwiper={(swiper) => setSwiper(swiper)}
            >
              {imageList.map((item) => (
                <SwiperSlide key={item.imagePath}>
                  <Box component='img' src={item.imagePath} width='100%' height='100%' sx={{ cursor: 'pointer' }} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};
