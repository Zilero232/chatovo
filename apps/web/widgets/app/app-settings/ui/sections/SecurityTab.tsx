'use client';

import { Separator } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';

import { ChangeEmailForm } from '@/features/auth/change-email';
import { ChangePasswordForm } from '@/features/auth/change-password';
import { DeleteAccountSection } from '@/features/auth/delete-account';
import { EmailVerificationNotice } from '@/features/auth/verify-email';

import s from '../AppSettingsButton.module.scss';

export const SecurityTab = () => {
  const t = useTranslations('settings.security');

  return (
    <div className={s.profilePanel}>
      <EmailVerificationNotice />

      <section className={s.profileSection}>
        <h3 className={s.profileSectionTitle}>{t('emailTitle')}</h3>
        <ChangeEmailForm />
      </section>

      <Separator />

      <section className={s.profileSection}>
        <h3 className={s.profileSectionTitle}>{t('passwordTitle')}</h3>
        <ChangePasswordForm />
      </section>

      <Separator />

      <section className={s.profileSection}>
        <h3 className={s.profileSectionTitle}>{t('deleteTitle')}</h3>
        <DeleteAccountSection />
      </section>
    </div>
  );
};
