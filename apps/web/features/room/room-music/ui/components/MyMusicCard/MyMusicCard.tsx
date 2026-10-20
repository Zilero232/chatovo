import { Button } from '@chatovo/ui-kit';
import { AppWindow, FolderOpen } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useShareMusicPanel } from '../../../model/hooks';
import { ShareStatus } from '../ShareStatus/ShareStatus';

import s from './MyMusicCard.module.scss';

export const MyMusicCard = () => {
  const t = useTranslations('room.music.share');

  const { share, canShareTab, pickFiles } = useShareMusicPanel();

  if (share.state.mode !== 'idle') {
    return <ShareStatus />;
  }

  return (
    <section className={s.root}>
      <div className={s.text}>
        <h3 className={s.title}>{t('title')}</h3>
        <p className={s.hint}>{t('hint')}</p>
      </div>

      <div className={s.actions}>
        <Button
          disabled={!canShareTab}
          size='sm'
          variant='secondary'
          onClick={() => void share.shareTab()}
        >
          <AppWindow aria-hidden />
          {t('tab')}
        </Button>
        <Button size='sm' variant='secondary' onClick={pickFiles}>
          <FolderOpen aria-hidden />
          {t('files')}
        </Button>
      </div>

      <p className={s.note}>{canShareTab ? t('tabHint') : t('tabUnsupported')}</p>
    </section>
  );
};
