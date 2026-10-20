'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { clsx } from 'clsx';

import type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps } from './Tabs.types';

import s from './Tabs.module.scss';

const Tabs = ({ className, ...props }: TabsProps) => (
  <BaseTabs.Root className={clsx(s.root, className)} data-slot='tabs' {...props} />
);

const TabsList = ({ className, ...props }: TabsListProps) => (
  <BaseTabs.List className={clsx(s.list, className)} data-slot='tabs-list' {...props} />
);

const TabsTrigger = ({ className, ...props }: TabsTriggerProps) => (
  <BaseTabs.Tab className={clsx(s.trigger, className)} data-slot='tabs-trigger' {...props} />
);

const TabsContent = ({ className, ...props }: TabsContentProps) => (
  <BaseTabs.Panel className={clsx(s.content, className)} data-slot='tabs-content' {...props} />
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
