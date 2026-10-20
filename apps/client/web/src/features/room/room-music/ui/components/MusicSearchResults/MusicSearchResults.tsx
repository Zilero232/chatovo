import { AnimatePresence, motion } from 'motion/react';
import { match } from 'ts-pattern';

import { ENTER_ANIMATE, ENTER_INITIAL, ENTER_TRANSITION } from '@/shared/config';

import type { MusicSearchProps } from '../MusicSearchField/MusicSearchField.types';

import { GenreChips } from '../GenreChips/GenreChips';
import { LinkCandidate } from '../LinkCandidate/LinkCandidate';
import { StationResults } from '../StationResults/StationResults';
import { TabOnlyHint } from '../TabOnlyHint/TabOnlyHint';

export const MusicSearchResults = ({ search }: MusicSearchProps) => {
  const { query, stations, isSearching, isError, isAdding, setValue, addLink, playStation } =
    search;

  return (
    <AnimatePresence initial={false} mode='wait'>
      <motion.div
        key={query.kind}
        animate={ENTER_ANIMATE}
        exit={{ opacity: 0 }}
        initial={ENTER_INITIAL}
        transition={ENTER_TRANSITION}
      >
        {match(query)
          .with({ kind: 'idle' }, () => (
            <GenreChips onPick={({ query: genre }) => setValue(genre)} />
          ))
          .with({ kind: 'link' }, ({ link }) => (
            <LinkCandidate isPending={isAdding} link={link} onAdd={addLink} />
          ))
          .with({ kind: 'tab-only' }, ({ service }) => <TabOnlyHint service={service} />)
          .with({ kind: 'search' }, () => (
            <StationResults
              isError={isError}
              isSearching={isSearching}
              stations={stations}
              onPlay={playStation}
            />
          ))
          .exhaustive()}
      </motion.div>
    </AnimatePresence>
  );
};
