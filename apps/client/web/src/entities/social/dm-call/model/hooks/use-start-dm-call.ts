import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { startDmCall } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import { buildRoomSearch } from '@/shared/lib';

export const useStartDmCall = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: startDmCall,
    onSuccess: (call) => {
      navigate({
        to: ROUTES.room,
        search: buildRoomSearch(call.roomId, { title: call.peer.name })
      });
    }
  });
};
