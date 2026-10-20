'use client';

import { SITE } from '@/shared/config';

import { GLOBAL_ERROR_STYLES } from './global-error.styles';
import { GlobalErrorGlyph } from './GlobalErrorGlyph';

import 'modern-normalize/modern-normalize.css';
import './globals.scss';

type GlobalErrorProps = {
  reset: () => void;
};

const GlobalError = ({ reset }: GlobalErrorProps) => (
  <html lang={SITE.locale.split('_')[0]}>
    <body>
      <main style={GLOBAL_ERROR_STYLES.main}>
        <GlobalErrorGlyph />

        <h1 style={GLOBAL_ERROR_STYLES.title}>Что-то пошло не так</h1>

        <p style={GLOBAL_ERROR_STYLES.description}>
          Приложение не смогло загрузиться. Попробуйте обновить страницу.
        </p>

        <button style={GLOBAL_ERROR_STYLES.button} type='button' onClick={reset}>
          Обновить
        </button>
      </main>
    </body>
  </html>
);

export default GlobalError;
