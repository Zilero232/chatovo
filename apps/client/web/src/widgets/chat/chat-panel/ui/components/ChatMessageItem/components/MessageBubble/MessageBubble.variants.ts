import { cva } from 'class-variance-authority';

import s from './MessageBubble.module.scss';

export const bubbleVariants = cva(s.bubble, {
  variants: {
    owner: {
      own: s.own,
      other: s.other
    },
    display: {
      bare: s.bare,
      padded: s.padded
    },
    tail: {
      true: null,
      false: null
    }
  },
  compoundVariants: [
    { owner: 'own', display: 'padded', className: s.ownPadded },
    { owner: 'other', display: 'padded', className: s.otherPadded },
    { owner: 'own', display: 'padded', tail: true, className: s.ownTail },
    { owner: 'other', display: 'padded', tail: true, className: s.otherTail }
  ]
});
