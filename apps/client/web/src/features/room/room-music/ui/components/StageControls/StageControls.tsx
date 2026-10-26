import type { StageControlsProps } from './StageControls.types';

import { useStageControls } from '../../../model/hooks';
import { MusicTransport } from '../MusicTransport/MusicTransport';
import { MusicVolumeButton } from '../MusicVolumeButton/MusicVolumeButton';
import { MusicVolumeSlider } from '../MusicVolumeSlider/MusicVolumeSlider';
import { PlaybackProgress } from '../PlaybackProgress/PlaybackProgress';
import { PlaybackTime } from '../PlaybackTime/PlaybackTime';
import { StageMenu } from '../StageMenu/StageMenu';

import s from './StageControls.module.scss';

export const StageControls = ({ music, track }: StageControlsProps) => {
  const { progress, controls } = useStageControls({ music, track });

  return (
    <div className={s.root}>
      {!progress.isLive && <PlaybackProgress progress={progress} />}

      <div className={s.bar}>
        <MusicTransport
          className={s.transport}
          isPending={controls.isPending}
          isPlaying={controls.isPlaying}
          size='regular'
          onNext={controls.next}
          onPrevious={controls.previous}
          onTogglePlay={controls.togglePlay}
        />

        <MusicVolumeSlider className={s.volume} />
        <MusicVolumeButton className={s.volumeButton} />

        <PlaybackTime className={s.time} progress={progress} />

        <StageMenu track={track} />
      </div>
    </div>
  );
};
