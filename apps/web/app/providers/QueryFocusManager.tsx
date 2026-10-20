'use client';

import { focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';

export const QueryFocusManager = () => {
  useEffect(
    () =>
      focusManager.setEventListener((handleFocus) => {
        const onVisibilityChange = () => {
          handleFocus(document.visibilityState === 'visible');
        };

        // eslint-disable-next-line react/web-api-no-leaked-event-listener -- both are removed in the cleanup returned to focusManager below
        document.addEventListener('visibilitychange', onVisibilityChange, false);
        // eslint-disable-next-line react/web-api-no-leaked-event-listener -- see above
        window.addEventListener('focus', onVisibilityChange, false);

        return () => {
          document.removeEventListener('visibilitychange', onVisibilityChange);
          window.removeEventListener('focus', onVisibilityChange);
        };
      }),
    []
  );

  return null;
};
