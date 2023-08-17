import { CloudUpload } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

export interface IImageUploadProps {
  onChange: (files: FileList) => void;
}
export const ImageUpload = ({ onChange }: IImageUploadProps) => {
  return (
    <Box
      component='label'
      htmlFor='file-upload'
      width='100%'
      height={200}
      display='flex'
      justifyContent='center'
      alignItems='center'
      border={1}
      borderRadius={4}
      bgcolor='primary.contrastText'
      sx={{
        ':hover': {
          bgcolor: 'secondary.light',
        },
        cursor: 'pointer',
      }}
    >
      <Box textAlign='center'>
        <CloudUpload />
        <Typography>Thêm mới</Typography>
      </Box>
      <input
        hidden
        type='file'
        id='file-upload'
        onChange={(e) => e.target.files && onChange(e.target.files)}
        multiple
        accept='image/*'
      />
    </Box>
  );
};
