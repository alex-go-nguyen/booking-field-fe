import { Delete } from '@mui/icons-material';
import { Backdrop, Box, CircularProgress, Grid, IconButton } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ConfirmBox } from '../ConfirmBox';
import { ImageUpload } from '../ImageUpload';
import { useBoolean, useVenueByCurrentUser, useVenueMutation } from '@/hooks';
import mediaService from '@/services/media/media.service';
import { VenueImage } from '@/services/venue/venue.dto';

export const ImagesManagement = () => {
  const { data: venue } = useVenueByCurrentUser();

  const { updateVenueMutation } = useVenueMutation();

  const [files, setFiles] = useState<FileList | null>();

  const [seletedImage, setSeletedImage] = useState<VenueImage | null>();

  const { value: isOpenConfirmBox, setTrue: openConfirmBox, setFalse: closeConfirmBox } = useBoolean(false);

  const { mutate: uploadImageMutation, isLoading: isUploading } = useMutation({
    mutationFn: mediaService.uploadImages,
    onSuccess: (data) => {
      venue &&
        updateVenueMutation({
          id: venue.id,
          data: {
            imageList: [
              ...(venue.imageList ? [...venue.imageList] : []),
              ...data.map((item) => {
                return {
                  imagePath: item.url,
                };
              }),
            ],
          },
        });
    },
  });

  const handleDelete = () => {
    if (venue) {
      const newImageList = venue.imageList.filter((item) => item !== seletedImage);

      updateVenueMutation({
        id: venue.id,
        data: {
          imageList: newImageList,
        },
      });

      closeConfirmBox();
    }
  };

  useEffect(() => {
    if (files) {
      uploadImageMutation(files);
      setFiles(null);
    }
  }, [files, uploadImageMutation]);

  return (
    venue && (
      <Grid container spacing={4}>
        {venue.imageList &&
          venue.imageList.map((item) => (
            <Grid item xs={6} md={3} key={item.imagePath}>
              <Box
                position='relative'
                sx={{
                  ':hover': {
                    div: {
                      display: 'block',
                    },
                  },
                  cursor: 'pointer',
                }}
                borderRadius={4}
                height={200}
                overflow='hidden'
                boxShadow={10}
              >
                <Box
                  component='img'
                  src={item.imagePath}
                  alt={item.imagePath}
                  width='100%'
                  sx={{ objectFit: 'cover' }}
                  height={200}
                  key={item.imagePath}
                />
                <Box
                  position='absolute'
                  display='none'
                  sx={{
                    inset: 0,
                    zIndex: 1,
                  }}
                  bgcolor='rgba(0, 0, 0, 0.4)'
                >
                  <IconButton
                    onClick={() => {
                      setSeletedImage(item);
                      openConfirmBox();
                    }}
                    sx={{ display: 'flex', float: 'right', margin: 1, bgcolor: 'primary.contrastText' }}
                  >
                    <Delete sx={{ color: 'error.main' }} fontSize='medium' />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        <Grid item xs={6} md={3}>
          <ImageUpload onChange={(files) => setFiles(files)} />
        </Grid>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isUploading}>
          <CircularProgress color='inherit' />
        </Backdrop>
        <ConfirmBox
          title='Bạn có chắc muốn xóa'
          subTitle='Bạn sẽ không thể khôi phục dữ liệu sau khi đã xóa'
          isOpen={isOpenConfirmBox}
          onClose={closeConfirmBox}
          onAccept={handleDelete}
        />
      </Grid>
    )
  );
};
