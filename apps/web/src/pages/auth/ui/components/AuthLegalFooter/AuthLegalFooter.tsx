import { Text } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import { EXTERNAL_LINKS } from '@/shared/constants';
import { handleExternalLinkClick } from '@/shared/lib';

import s from './AuthLegalFooter.module.scss';

export const AuthLegalFooter = () => {
  const t = useTranslations('legal');

  return (
    <Text align='center' className={s.root} size='xs' tone='inherit'>
      <a
        className={s.link}
        href={EXTERNAL_LINKS.privacy}
        rel='noopener noreferrer'
        target='_blank'
        onClick={(event) => handleExternalLinkClick({ event, url: EXTERNAL_LINKS.privacy })}
      >
        {t('privacy')}
      </a>
      <span aria-hidden className={s.sep}>
        ·
      </span>
      <a
        className={s.link}
        href={EXTERNAL_LINKS.terms}
        rel='noopener noreferrer'
        target='_blank'
        onClick={(event) => handleExternalLinkClick({ event, url: EXTERNAL_LINKS.terms })}
      >
        {t('terms')}
      </a>
    </Text>
  );
};
