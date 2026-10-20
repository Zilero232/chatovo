'use client';

import type { Components } from 'react-markdown';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

import { handleExternalLinkClick } from '@/shared/lib';

import { useChatMessage } from '../../../../../model/contexts';
import { normalizeMessage } from '../../../../../model/lib';

import s from './MessageContent.module.scss';

export const MessageContent = () => {
  const t = useTranslations('chat');
  const { message, isOwn, isEdited } = useChatMessage();

  const components: Components = {
    a: ({ href, children }) => (
      <a
        className={clsx({ [s.linkOwn]: isOwn, [s.linkOther]: !isOwn })}
        href={href}
        rel='noopener noreferrer'
        target='_blank'
        onClick={(event) => handleExternalLinkClick({ event, url: href })}
      >
        {children}
      </a>
    ),
    code: ({ children }) => <code className={s.code}>{children}</code>,
    pre: ({ children }) => <pre className={s.pre}>{children}</pre>
  };

  return (
    <div className={s.root}>
      <Markdown components={components} remarkPlugins={[remarkGfm, remarkBreaks]}>
        {normalizeMessage(message.message)}
      </Markdown>
      {isEdited && <span className={s.edited}>{t('edited')}</span>}
    </div>
  );
};
