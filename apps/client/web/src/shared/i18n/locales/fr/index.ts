import { uiMessages } from '@chatovo/ui-kit/messages';

import admin from './admin.json';
import app from './app.json';
import auth from './auth.json';
import common from './common.json';
import room from './room.json';
import social from './social.json';

export const fr = {
  ...uiMessages.fr,
  ...common,
  ...auth,
  ...room,
  ...social,
  ...app,
  ...admin
};
