const BANNER = [
  '  ___ _         _',
  ' / __| |_  __ _| |_ _____ _____',
  "| (__| ' \\/ _` |  _/ _ \\ V / _ \\",
  ' \\___|_||_\\__,_|\\__\\___/\\_/\\___/'
].join('\n');

export const printConsoleGreeting = () => {
  // eslint-disable-next-line no-console -- the console IS the output channel here
  console.info(
    `%c${BANNER}`,
    'color: oklch(70% 0.22 295deg); font-family: monospace; font-size: 12px;'
  );
  // eslint-disable-next-line no-console -- see above
  console.info(
    '%cFound a bug or want to help? https://github.com/Zilero232/Chatovo',
    'color: oklch(82% 0.16 200deg); font-size: 13px;'
  );
};
