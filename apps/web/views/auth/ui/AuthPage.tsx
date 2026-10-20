import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { useState } from 'react';

import { useEnterMotion } from '@/shared/hooks';
import { LanguageSwitcher } from '@/widgets/app/language-switcher';

import type { AuthMode } from '../model/types';

import { AuthForm, AuthHeading, AuthLegalFooter, AuthModeSwitch, AuthScene } from './components';

import s from './AuthPage.module.scss';

export const AuthPage = () => {
  const enterMotion = useEnterMotion();

  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <div className={clsx(s.root, 'inset-page-x', 'inset-page-y')}>
      <header className={s.topBar}>
        <LanguageSwitcher />
      </header>

      <div className={s.shell}>
        <AuthScene mode={mode} />

        <motion.section className={s.card} {...enterMotion}>
          <AuthHeading mode={mode} />

          <AuthForm mode={mode} onModeChange={setMode} />

          {mode !== 'forgot' && <AuthModeSwitch mode={mode} onModeChange={setMode} />}

          <AuthLegalFooter />
        </motion.section>
      </div>
    </div>
  );
};
