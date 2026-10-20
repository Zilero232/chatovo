export type YoutubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

export type YoutubePlayerEvent = {
  data: number;
};

export type YoutubePlayerOptions = {
  host: string;
  videoId: string;
  width: string;
  height: string;
  playerVars: Record<string, number>;
  events: {
    onReady: (event: { target: YoutubePlayer }) => void;
    onStateChange: (event: YoutubePlayerEvent) => void;
    onError: (event: YoutubePlayerEvent) => void;
  };
};

export type YoutubeApi = {
  Player: new (element: HTMLElement, options: YoutubePlayerOptions) => YoutubePlayer;
};

export type MountYoutubePlayerInput = {
  host: HTMLElement;
  videoId: string;
  events: YoutubePlayerOptions['events'];
};

export type YoutubeWindow = Window & {
  YT?: Partial<YoutubeApi>;
  onYouTubeIframeAPIReady?: () => void;
};
