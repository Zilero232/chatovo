import { Text } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import { useLegalLinks } from '@/entities/app/locale';
import { handleExternalLinkClick } from '@/shared/lib';

import s from './AuthLegalFooter.module.scss';

export const AuthLegalFooter = () => {
  const t = useTranslations('legal');
  const links = useLegalLinks();

  return (
    <Text align='center' className={s.root} size='xs' tone='inherit'>
      <a
        className={s.link}
        href={links.privacy}
        rel='noopener noreferrer'
        target='_blank'
        onClick={(event) => handleExternalLinkClick({ event, url: links.privacy })}
      >
        {t('privacy')}
      </a>
      <span aria-hidden className={s.sep}>
        ·
      </span>
      <a
        className={s.link}
        href={links.terms}
        rel='noopener noreferrer'
        target='_blank'
        onClick={(event) => handleExternalLinkClick({ event, url: links.terms })}
      >
        {t('terms')}
      </a>
    </Text>
  );
};
