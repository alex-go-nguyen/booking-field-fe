import { useState, MouseEvent } from 'react';

interface UseMenuOutput {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onOpen: (event: MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
}

export const useMenu = (): UseMenuOutput => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const onOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(null);
  };

  return { anchorEl, isOpen, onOpen, onClose };
};
