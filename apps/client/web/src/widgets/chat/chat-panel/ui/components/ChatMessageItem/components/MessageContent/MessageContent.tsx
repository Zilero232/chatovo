import type { Components } from 'react-markdown';

import { clsx } from 'clsx';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { useTranslations } from 'use-intl';

import { useAppSettings } from '@/entities/app/settings';
import { handleExternalLinkClick } from '@/shared/lib';

import { useChatMessage } from '../../../../../model/contexts';
import { normalizeMessage, remarkCensorProfanity } from '../../../../../model/lib';

import s from './MessageContent.module.scss';

const REMARK_PLUGINS = [remarkGfm, remarkBreaks];
const FILTERED_REMARK_PLUGINS = [...REMARK_PLUGINS, remarkCensorProfanity];

export const MessageContent = () => {
  const t = useTranslations('chat');
  const { message, isOwn, isEdited } = useChatMessage();
  const { settings } = useAppSettings();

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
      <Markdown
        components={components}
        remarkPlugins={settings.chat.filterProfanity ? FILTERED_REMARK_PLUGINS : REMARK_PLUGINS}
      >
        {normalizeMessage(message.message)}
      </Markdown>
      {isEdited && <span className={s.edited}>{t('edited')}</span>}
    </div>
  );
};
