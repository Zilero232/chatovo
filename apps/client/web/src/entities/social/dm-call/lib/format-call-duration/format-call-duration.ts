const pad = (value: number) => String(value).padStart(2, '0');

export const formatCallDuration = (totalSeconds: number): string => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(rest)}`;
  }

  return `${minutes}:${pad(rest)}`;
};
