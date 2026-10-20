import { match } from 'ts-pattern';

import type { MusicTrackPlayback } from '../../../model/types';

import { FileFrame } from '../FileFrame/FileFrame';
import { SoundcloudFrame } from '../SoundcloudFrame/SoundcloudFrame';
import { VimeoFrame } from '../VimeoFrame/VimeoFrame';
import { YoutubeFrame } from '../YoutubeFrame/YoutubeFrame';

export const TrackPlayer = ({ music, track }: MusicTrackPlayback) =>
  match(track.source)
    .with('youtube', () => <YoutubeFrame music={music} track={track} />)
    .with('soundcloud', () => <SoundcloudFrame music={music} track={track} />)
    .with('vimeo', () => <VimeoFrame music={music} track={track} />)
    .with('file', () => <FileFrame music={music} track={track} />)
    .with('radio', () => null)
    .exhaustive();
