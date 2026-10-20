import { clsx } from 'clsx';

import type { ChatoProps } from './Chato.types';

import { CHATO_EYES, CHATO_HEAD_TRANSFORM, CHATO_PEEK_HEAD_TRANSFORM } from './Chato.constants';
import {
  ChatoBody,
  ChatoHead,
  ChatoHeadphones,
  ChatoLedge,
  ChatoNotes,
  ChatoSleepMarks,
  ChatoWavingPaw
} from './components';

import s from './Chato.module.scss';

export const Chato = ({ pose = 'wink', title, className, ...props }: ChatoProps) => {
  const eyes = CHATO_EYES[pose];
  const isPeek = pose === 'peek';

  return (
    <svg
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={clsx(s.root, className)}
      data-pose={pose}
      role={title ? 'img' : undefined}
      viewBox='0 0 200 200'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      {!isPeek && <ChatoBody />}
      {pose === 'wave' && <ChatoWavingPaw />}
      <ChatoHead
        eyes={eyes}
        transform={isPeek ? CHATO_PEEK_HEAD_TRANSFORM : CHATO_HEAD_TRANSFORM}
      />
      {isPeek && <ChatoLedge />}
      {pose === 'listen' && (
        <>
          <ChatoHeadphones />
          <ChatoNotes />
        </>
      )}
      {pose === 'sleep' && <ChatoSleepMarks />}
    </svg>
  );
};
