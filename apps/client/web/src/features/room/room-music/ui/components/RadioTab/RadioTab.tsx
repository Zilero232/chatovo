import { ScrollArea } from '@chatovo/ui-kit';
import { match, P } from 'ts-pattern';

import type { RadioTabProps } from './RadioTab.types';

import { GenreChips } from '../GenreChips/GenreChips';
import { LinkCandidate } from '../LinkCandidate/LinkCandidate';
import { MusicQueryField } from '../MusicQueryField/MusicQueryField';
import { StationResults } from '../StationResults/StationResults';
import { TabOnlyHint } from '../TabOnlyHint/TabOnlyHint';

import s from '../MusicLibrary/MusicLibrary.module.scss';

export const RadioTab = ({ field, stations, onOpenMine }: RadioTabProps) => (
  <>
    <MusicQueryField field={field} isBusy={stations.isSearching} kind='radio' />

    <ScrollArea className={s.scroll}>
      <div className={s.sections}>
        <GenreChips activeQuery={field.value} onPick={({ query }) => field.setValue(query)} />

        {match(field.query)
          .with({ kind: P.union('idle', 'search') }, ({ kind }) => (
            <StationResults
              isError={stations.isError}
              isPopular={kind === 'idle'}
              isSearching={stations.isSearching}
              stations={stations.stations}
              onPlay={stations.playStation}
            />
          ))
          .with({ kind: 'link' }, ({ link }) => (
            <LinkCandidate isPending={field.isAdding} link={link} onAdd={field.addLink} />
          ))
          .with({ kind: 'tab-only' }, ({ service }) => (
            <TabOnlyHint service={service} onOpenMine={onOpenMine} />
          ))
          .exhaustive()}
      </div>
    </ScrollArea>
  </>
);
