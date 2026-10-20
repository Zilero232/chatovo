import { Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { EXTERNAL_LINKS } from '@/shared/constants';
import { GithubIcon, Text } from '@/ui-kit';

import type { SupportContactProps } from './SupportContact.types';

import s from '../../SupportPage.module.scss';

export const SupportContact = async ({ locale }: SupportContactProps) => {
  const t = await getTranslations({ locale, namespace: 'support.contact' });

  return (
    <div className={s.contact}>
      <Text as='h2' className={s.contactHeading} weight='semibold'>
        {t('heading')}
      </Text>
      <Text size='sm' tone='muted'>
        {t('description')}
      </Text>

      <div className={s.contactActions}>
        <a className={s.contactLink} href={EXTERNAL_LINKS.supportEmail}>
          <Mail />
          {t('email')}
        </a>

        <a
          className={s.contactLink}
          href={EXTERNAL_LINKS.issues}
          rel='noopener noreferrer'
          target='_blank'
        >
          <GithubIcon />
          {t('issues')}
        </a>
      </div>
    </div>
  );
};
