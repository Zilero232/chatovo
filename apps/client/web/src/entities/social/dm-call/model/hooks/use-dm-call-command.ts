import { useMutation } from '@tanstack/react-query';

import { sendDmCallCommand } from '@/shared/api';

export const useDmCallCommand = () => useMutation({ mutationFn: sendDmCallCommand });
