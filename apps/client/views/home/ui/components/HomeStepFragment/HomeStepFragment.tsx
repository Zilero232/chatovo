import { Copy, Mic, Plus } from 'lucide-react';
import { match } from 'ts-pattern';

import type { HomeStepFragmentProps } from './HomeStepFragment.types';

import { HOME_INVITE_LINK } from '../../../config';

import s from './HomeStepFragment.module.scss';

export const HomeStepFragment = ({ step, labels }: HomeStepFragmentProps) => (
  <div aria-hidden className={s.root}>
    {match(step)
      .with('create', () => (
        <span className={s.button}>
          <Plus />
          {labels.create}
        </span>
      ))
      .with('share', () => (
        <span className={s.link}>
          <span className={s.linkText}>{HOME_INVITE_LINK}</span>
          <Copy />
        </span>
      ))
      .with('talk', () => (
        <span className={s.mic}>
          <Mic />
          {labels.talk}
          <span className={s.toggle} />
        </span>
      ))
      .exhaustive()}
  </div>
);
