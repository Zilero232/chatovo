import { AppWindow, FolderOpen } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useShareMusicPanel } from '../../../model/hooks';
import { ShareOption } from '../ShareOption/ShareOption';
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
      <p className={s.lead}>{t('hint')}</p>

      <div className={s.options}>
        <ShareOption
          description={canShareTab ? t('tabHint') : t('tabUnsupported')}
          icon={<AppWindow />}
          isDisabled={!canShareTab}
          title={t('tab')}
          onSelect={() => void share.shareTab()}
        />
        <ShareOption
          description={t('filesHint')}
          icon={<FolderOpen />}
          title={t('files')}
          onSelect={pickFiles}
        />
      </div>
    </section>
  );
};
