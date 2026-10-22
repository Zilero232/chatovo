import type { CSSProperties } from 'react';

export const GLOBAL_ERROR_STYLES = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '1.5rem',
    textAlign: 'center',
    color: '#f5ecdf',
    background: '#1e1724'
  },
  title: {
    margin: 0,
    fontFamily: "Lora, Georgia, 'Times New Roman', serif",
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.2
  },
  description: { margin: 0, maxWidth: '28rem', color: '#b8acbf', lineHeight: 1.6 },
  button: {
    padding: '0.625rem 1.375rem',
    border: 'none',
    borderRadius: '9999px',
    color: '#2a1015',
    background: '#e38f6f',
    fontWeight: 600,
    cursor: 'pointer'
  }
} satisfies Record<string, CSSProperties>;
