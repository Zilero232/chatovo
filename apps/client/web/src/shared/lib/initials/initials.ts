import { isEmpty } from 'remeda';

export const getInitials = (name: string): string => {
  const trimmed = name.trim();

  if (isEmpty(trimmed)) {
    return '?';
  }

  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
};

export const getAvatarColor = (name: string) => {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }

  return `hsl(${Math.abs(hash) % 360} 55% 45%)`;
};
