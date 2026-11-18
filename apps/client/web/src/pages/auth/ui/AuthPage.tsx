import { motion } from 'motion/react';
import { useState } from 'react';

import { useEnterMotion } from '@/shared/hooks';

import type { AuthMode } from '../model/types';

import {
  AuthBackdrop,
  AuthForm,
  AuthHeading,
  AuthLegalFooter,
  AuthModeSwitch,
  AuthPanel
} from './components';

import s from './AuthPage.module.scss';

export const AuthPage = () => {
  const enterMotion = useEnterMotion();

  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <div className={s.root}>
      <AuthBackdrop />

      <motion.section className={s.card} {...enterMotion}>
        <div className={s.formColumn}>
          <AuthHeading mode={mode} />

          <AuthForm mode={mode} onModeChange={setMode} />

          {mode !== 'forgot' && <AuthModeSwitch mode={mode} onModeChange={setMode} />}

          <AuthLegalFooter />
        </div>

        <AuthPanel mode={mode} />
      </motion.section>
    </div>
  );
};
