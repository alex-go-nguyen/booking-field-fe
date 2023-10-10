import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { LanguageImages } from '@/assets/images/language';
import { useLocalStorage, useMenu } from '@/hooks';
import { Locale, useLocale } from '@/locales';

export const LangueSwitcher = () => {
  const { formatMessage } = useLocale();

  const { storedValue: currentLocale, setValue: setCurrentLocale } = useLocalStorage<Locale>('locale', 'vi');

  const {
    anchorEl: anchorTranslationMenu,
    isOpen: isOpenTranslationMenu,
    onClose: closeTranslationMenu,
    onOpen: openTranslationMenu,
  } = useMenu();

  const menuItems: { locale: Locale; title: string }[] = [
    {
      locale: 'vi',
      title: formatMessage({
        id: 'app.home.header.translate.vi',
      }),
    },
    {
      locale: 'en_US',
      title: formatMessage({
        id: 'app.home.header.translate.en',
      }),
    },
  ];
  return (
    <>
      <Button variant='text' color='secondary' onClick={openTranslationMenu}>
        <Box
          component='img'
          src={LanguageImages[currentLocale]}
          alt={currentLocale}
          height={20}
          width={20}
          borderRadius='50%'
          sx={{ objectFit: 'cover' }}
          marginRight={1}
        />
        <ArrowDropDown />
      </Button>
      <Menu
        id='translation-menu'
        anchorEl={anchorTranslationMenu}
        open={isOpenTranslationMenu}
        onClose={closeTranslationMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            onClick={() => {
              closeTranslationMenu();
              setCurrentLocale(item.locale);
            }}
            key={item.locale}
          >
            <Box
              component='img'
              src={LanguageImages[item.locale]}
              alt={currentLocale}
              height={20}
              width={20}
              borderRadius='50%'
              sx={{ objectFit: 'cover' }}
              marginRight={1}
            />
            <Typography>{item.title}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
