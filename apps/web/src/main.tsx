import { CatchBoundary, RouterProvider } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';

import { router } from './router';
import { GlobalError } from './router/global-error';

import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/manrope';

import '@fontsource-variable/lora/wght.css';
import '@fontsource-variable/lora/wght-italic.css';
import 'modern-normalize/modern-normalize.css';
import './styles/globals.scss';

const container = document.getElementById('root');

if (!container) {
  throw new Error('The #root element is missing from index.html.');
}

// Strict mode stays off: its double effect mount tears down the LiveKit room connection.
createRoot(container).render(
  <CatchBoundary errorComponent={GlobalError} getResetKey={() => 'app'}>
    <RouterProvider router={router} />
  </CatchBoundary>
);
