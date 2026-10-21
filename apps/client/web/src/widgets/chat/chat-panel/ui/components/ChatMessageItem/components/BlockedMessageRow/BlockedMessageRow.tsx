import { EyeOff } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useChatMessage } from '../../../../../model/contexts';

import s from './BlockedMessageRow.module.scss';

export const BlockedMessageRow = () => {
  const t = useTranslations('blocks');

  const { reveal } = useChatMessage();

  return (
    <div className={s.root}>
      <EyeOff aria-hidden className={s.icon} />
      <span className={s.text}>{t('hiddenMessage')}</span>
      <span aria-hidden>·</span>
      <button className={s.show} type='button' onClick={reveal}>
        {t('showMessage')}
      </button>
    </div>
  );
};
