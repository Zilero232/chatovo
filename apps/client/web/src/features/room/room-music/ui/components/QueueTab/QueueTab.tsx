import { ScrollArea } from '@chatovo/ui-kit';
import { match } from 'ts-pattern';

import type { QueueTabProps } from './QueueTab.types';

import { LinkCandidate } from '../LinkCandidate/LinkCandidate';
import { MusicQueryField } from '../MusicQueryField/MusicQueryField';
import { MusicQueue } from '../MusicQueue/MusicQueue';
import { RadioSearchPrompt } from '../RadioSearchPrompt/RadioSearchPrompt';
import { TabOnlyHint } from '../TabOnlyHint/TabOnlyHint';

import s from '../MusicLibrary/MusicLibrary.module.scss';

export const QueueTab = ({ field, onOpenMine, onOpenRadio, onSearchRadio }: QueueTabProps) => (
  <>
    <MusicQueryField field={field} isBusy={field.isAdding} kind='link' />

    <ScrollArea className={s.scroll}>
      <div className={s.sections}>
        {match(field.query)
          .with({ kind: 'idle' }, () => null)
          .with({ kind: 'link' }, ({ link }) => (
            <LinkCandidate isPending={field.isAdding} link={link} onAdd={field.addLink} />
          ))
          .with({ kind: 'tab-only' }, ({ service }) => (
            <TabOnlyHint service={service} onOpenMine={onOpenMine} />
          ))
          .with({ kind: 'search' }, ({ query }) => (
            <RadioSearchPrompt query={query} onSearch={onSearchRadio} />
          ))
          .exhaustive()}

        <MusicQueue onOpenRadio={onOpenRadio} />
      </div>
    </ScrollArea>
  </>
);
