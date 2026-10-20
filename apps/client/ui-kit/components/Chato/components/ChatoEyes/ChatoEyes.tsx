import { match } from 'ts-pattern';

import type { ChatoEyesProps, ChatoOpenEyeProps } from './ChatoEyes.types';

import s from '../../Chato.module.scss';

const OpenEye = ({ cx }: ChatoOpenEyeProps) => (
  <>
    <circle className={s.ink} cx={cx} cy='54' r='6.6' />
    <circle className={s.shine} cx={cx + 2.3} cy='51.4' r='2.2' />
  </>
);

export const ChatoEyes = ({ eyes }: ChatoEyesProps) =>
  match(eyes)
    .with('closed', () => (
      <g className={s.stroke}>
        <path d='M34 55 Q40 59 46 55' />
        <path d='M54 55 Q60 59 66 55' />
      </g>
    ))
    .with('happy', () => (
      <g className={s.stroke}>
        <path d='M34 56 Q40 49 46 56' />
        <path d='M54 56 Q60 49 66 56' />
      </g>
    ))
    .with('open', () => (
      <>
        <OpenEye cx={40} />
        <OpenEye cx={60} />
      </>
    ))
    .with('wink', () => (
      <>
        <OpenEye cx={40} />
        <path className={s.stroke} d='M54 54 Q60 49 66 54' />
      </>
    ))
    .exhaustive();
