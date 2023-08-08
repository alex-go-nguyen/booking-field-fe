import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectBox } from './SelectBox';
import { DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE } from '@/common/constants';
import { DefaultLocations } from '@/common/datas/location.data';
import { getAllPitchCategories } from '@/services/category/category.service';
import { getVenues } from '@/services/venue/venue.service';

export const SearchBox = () => {
  const navigate = useNavigate();

  const [pitchCategory, setPitchCategory] = useState<string>('');

  const [searchPitchCategory, setSearchPitchCategory] = useState<string>('');
  const [searchAdress, setSearchAdress] = useState<string>('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllPitchCategories,
    staleTime: Infinity,
  });

  const { data: venues, mutate: getVenuesMutate } = useMutation({
    mutationKey: ['venues'],
    mutationFn: (value: string) => getVenues({ keyword: value }),
  });

  const searchHandler = () => {
    if (DefaultLocations.some((item) => item === searchAdress)) {
      navigate(
        `/search?location=${searchAdress || DefaultLocations[0]}&pitchCategory=${
          searchPitchCategory || categories?.data[0]._id
        }&minPrice=${DEFAULT_MIN_PRICE}&maxPrice=${DEFAULT_MAX_PRICE}`,
      );
    }
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      if (searchAdress !== '') {
        getVenuesMutate(searchAdress);
      }
    }, 1000);

    return () => clearTimeout(getData);
  }, [searchAdress, getVenuesMutate]);

  return (
    categories && (
      <Box display='flex' paddingY={1} marginX={20} borderRadius={4} boxShadow={4} bgcolor='primary.contrastText'>
        <Grid container marginX={8} marginY={4} borderRadius={50} border={1} paddingY={1}>
          <Grid item xs={4} display='flex' justifyContent='center' alignItems='center'>
            <RoomOutlinedIcon />
            <Box marginLeft={2}>
              <Typography variant='caption'>Địa điểm</Typography>
              <SelectBox
                value={searchAdress}
                onChange={(value) => setSearchAdress(value)}
                placeHolder='Bạn muốn đặt sân ở đâu'
              >
                {searchAdress === '' ? (
                  DefaultLocations.map((item) => (
                    <Box
                      onClick={() => setSearchAdress(item)}
                      display='flex'
                      alignItems='center'
                      padding={1}
                      sx={{ cursor: 'pointer', ':hover': { bgcolor: '#ccc' } }}
                      key={item}
                    >
                      <RoomOutlinedIcon sx={{ fontSize: 20, opacity: 0.7, marginRight: 1 }} />
                      {item}
                    </Box>
                  ))
                ) : (
                  <>
                    <Typography variant='body2' paddingX={1} paddingY={2} fontWeight={700}>
                      Sân bóng
                    </Typography>
                    {venues?.data.map((item) => (
                      <Box
                        onClick={() => setSearchAdress(item.name)}
                        display='flex'
                        alignItems='center'
                        padding={1}
                        sx={{ cursor: 'pointer', ':hover': { bgcolor: '#ccc' }, ':focus': { bgcolor: '#ccc' } }}
                        key={item._id}
                      >
                        <SportsSoccerIcon sx={{ opacity: 0.7, fontSize: 20, marginRight: 1 }} />
                        <Box>
                          <Typography>{item.name}</Typography>
                          <Typography variant='caption'>{`${item.district}, ${item.province}`}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </>
                )}
              </SelectBox>
            </Box>
            <CancelOutlinedIcon
              sx={{ cursor: 'pointer', fontSize: 16, marginLeft: 1 }}
              onClick={() => setSearchAdress('')}
            />
          </Grid>
          <Grid item xs={4} display='flex' justifyContent='center' alignItems='center'>
            <CategoryOutlinedIcon />
            <Box marginLeft={2}>
              <Typography variant='caption'>Loại sân</Typography>
              <SelectBox
                value={pitchCategory}
                onChange={(data) => setPitchCategory(data)}
                placeHolder='Loại sân bạn muốn đặt'
              >
                {categories.data.map((item) => (
                  <Box
                    onClick={() => {
                      setSearchPitchCategory(item._id);
                      setPitchCategory(item.name);
                    }}
                    display='flex'
                    alignItems='center'
                    padding={1}
                    sx={{ cursor: 'pointer', ':hover': { bgcolor: '#ccc' } }}
                    key={item._id}
                  >
                    <RoomOutlinedIcon sx={{ fontSize: 20, opacity: 0.7, marginRight: 1 }} />
                    {item.name}
                  </Box>
                ))}
              </SelectBox>
            </Box>
          </Grid>
          <Grid item xs={4} display='flex' justifyContent='end' paddingX={1} alignItems='center'>
            <Button variant='contained' onClick={searchHandler} sx={{ borderRadius: 12, height: '100%', paddingX: 4 }}>
              <SearchIcon /> Tìm kiếm
            </Button>
          </Grid>
        </Grid>
      </Box>
    )
  );
};
