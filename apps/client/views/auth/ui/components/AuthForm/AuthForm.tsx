'use client';

import { motion } from 'motion/react';
import { match } from 'ts-pattern';

import { ForgotPasswordForm } from '@/features/auth/forgot-password';
import { SignInForm } from '@/features/auth/sign-in';
import { SignUpForm } from '@/features/auth/sign-up';
import { useEnterMotion } from '@/shared/hooks';

import type { AuthFormProps } from './AuthForm.types';

export const AuthForm = ({ mode, onModeChange }: AuthFormProps) => {
  const enterMotion = useEnterMotion();

  return (
    <motion.div key={mode} {...enterMotion}>
      {match(mode)
        .with('signup', () => <SignUpForm />)
        .with('forgot', () => <ForgotPasswordForm onBack={() => onModeChange('signin')} />)
        .with('signin', () => <SignInForm onForgotPassword={() => onModeChange('forgot')} />)
        .exhaustive()}
    </motion.div>
  );
};
