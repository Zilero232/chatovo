import { Switch } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import { useAppSettings } from '@/entities/app/settings';

import { CAMERA_QUALITIES, SCREEN_CONTENTS, SCREEN_QUALITIES } from '../../config';
import { DeviceSelect } from '../components/DeviceSelect/DeviceSelect';
import { QualitySelect } from '../components/QualitySelect/QualitySelect';
import { SettingRow } from '../components/SettingRow/SettingRow';
import { SettingsCard } from '../components/SettingsCard/SettingsCard';

import s from '../AppSettingsButton.module.scss';

export const VideoTab = () => {
  const t = useTranslations('settings.video');
  const tCards = useTranslations('settings.cards');
  const { settings, setGroup } = useAppSettings();

  const video = settings.video;

  return (
    <div className={s.tabPanel}>
      <SettingsCard title={tCards('camera')}>
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
          control={
            <Switch
              checked={video.mirrorVideo}
              onCheckedChange={(value) => setGroup('video', { mirrorVideo: value })}
            />
          }
          hint={t('mirrorHint')}
          label={t('mirror')}
        />
      </SettingsCard>

      <SettingsCard title={tCards('screen')}>
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
          stacked
          control={
            <QualitySelect
              options={SCREEN_CONTENTS.map((value) => ({
                value,
                label: t(`screenContentOptions.${value}`)
              }))}
              value={video.screenContent}
              onChange={(value) => setGroup('video', { screenContent: value })}
            />
          }
          hint={t('screenContentHint')}
          label={t('screenContent')}
        />
      </SettingsCard>
    </div>
  );
};
