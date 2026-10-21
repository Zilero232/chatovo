import { useTranslations } from 'use-intl';

import s from '../../FriendProfileActions.module.scss';

export const BlockedNotice = () => {
  const t = useTranslations('blocks');

  return <p className={s.label}>{t('notice')}</p>;
};
