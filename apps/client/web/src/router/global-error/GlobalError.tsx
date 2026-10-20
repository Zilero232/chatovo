import type { ErrorComponentProps } from '@tanstack/react-router';

import { GLOBAL_ERROR_STYLES } from './global-error.styles';
import { GlobalErrorGlyph } from './GlobalErrorGlyph';

export const GlobalError = ({ reset }: ErrorComponentProps) => (
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
);
