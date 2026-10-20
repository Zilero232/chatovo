import type { Tabs } from '@base-ui/react/tabs';
import type { ComponentProps } from 'react';

export type TabsProps = Omit<ComponentProps<typeof Tabs.Root>, 'className'> & {
  className?: string;
};

export type TabsListProps = Omit<ComponentProps<typeof Tabs.List>, 'className'> & {
  className?: string;
};

export type TabsTriggerProps = Omit<ComponentProps<typeof Tabs.Tab>, 'className'> & {
  className?: string;
};

export type TabsContentProps = Omit<ComponentProps<typeof Tabs.Panel>, 'className'> & {
  className?: string;
};
