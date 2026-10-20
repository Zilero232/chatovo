import { SOUNDCLOUD } from '../config/music';

export const buildSoundcloudSrc = (trackUrl: string): string => {
  const src = new URL(SOUNDCLOUD.widgetUrl);

  src.search = new URLSearchParams({
    url: trackUrl,
    auto_play: 'false',
    visual: 'true',
    hide_related: 'true',
    show_comments: 'false',
    show_reposts: 'false',
    show_teaser: 'false',
    buying: 'false',
    sharing: 'false',
    download: 'false'
  }).toString();

  return src.toString();
};
