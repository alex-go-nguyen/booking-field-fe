import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { venueKeys } from '@/services/venue/venue.query';
import venueService from '@/services/venue/venue.service';

export const useVenueMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateVenueMutation,
    isLoading: isUpdating,
    reset: resetUpdateState,
  } = useMutation({
    mutationFn: venueService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(venueKeys.currentUsers());
      toast.success('Update venue successfully');
    },
  });

  return { updateVenueMutation, isUpdating, resetUpdateState };
};
