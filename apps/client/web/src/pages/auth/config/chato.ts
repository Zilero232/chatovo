import type { ChatoPose } from '@chatovo/ui-kit';

import type { AuthMode } from '../model/types';

export const AUTH_CHATO_POSE: Record<AuthMode, ChatoPose> = {
  signin: 'wave',
  signup: 'wave',
  forgot: 'peek'
};
