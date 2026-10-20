import type { TokenRequest, TokenResponse } from '@chatovo/schemas';

import { api } from '../http';

export const fetchLiveKitToken = async (body: TokenRequest): Promise<TokenResponse> => {
  const { data } = await api.post('/livekit/token', body);

  return data;
};
