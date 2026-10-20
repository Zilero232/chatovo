import { Switch } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { ScreenQuality, VideoQuality } from '@/entities/app/settings';

import { useAppSettings } from '@/entities/app/settings';

import { DeviceSelect } from '../components/DeviceSelect/DeviceSelect';
import { QualitySelect } from '../components/QualitySelect/QualitySelect';
import { SettingRow } from '../components/SettingRow/SettingRow';

import s from '../AppSettingsButton.module.scss';

const CAMERA_QUALITIES: VideoQuality[] = ['720p', '1080p', '1440p', '4k'];
const SCREEN_QUALITIES: ScreenQuality[] = ['1080p15', '1080p30', '1440p30', '4k30'];

export const VideoTab = () => {
  const t = useTranslations('settings.video');
  const { settings, setGroup } = useAppSettings();

  const video = settings.video;

  return (
    <div className={s.tabPanel}>
      <SettingRow
        stacked
        control={<DeviceSelect kind='videoinput' />}
        hint={t('cameraHint')}
        label={t('camera')}
      />

      <SettingRow
        stacked
        control={
          <QualitySelect
            options={CAMERA_QUALITIES.map((value) => ({
              value,
              label: t(`cameraQualityOptions.${value}`)
            }))}
            value={video.cameraQuality}
            onChange={(value) => setGroup('video', { cameraQuality: value })}
          />
        }
        hint={t('cameraQualityHint')}
        label={t('cameraQuality')}
      />

      <SettingRow
        stacked
        control={
          <QualitySelect
            options={SCREEN_QUALITIES.map((value) => ({
              value,
              label: t(`screenQualityOptions.${value}`)
            }))}
            value={video.screenQuality}
            onChange={(value) => setGroup('video', { screenQuality: value })}
          />
        }
        hint={t('screenQualityHint')}
        label={t('screenQuality')}
      />

      <SettingRow
        control={
          <Switch
            checked={video.mirrorVideo}
            onCheckedChange={(value) => setGroup('video', { mirrorVideo: value })}
          />
        }
        hint={t('mirrorHint')}
        label={t('mirror')}
      />
    </div>
  );
};
