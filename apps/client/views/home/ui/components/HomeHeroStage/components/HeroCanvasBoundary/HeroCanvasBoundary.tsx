'use client';

import { Component } from 'react';

import type { HeroCanvasBoundaryProps, HeroCanvasBoundaryState } from './HeroCanvasBoundary.types';

export class HeroCanvasBoundary extends Component<
  HeroCanvasBoundaryProps,
  HeroCanvasBoundaryState
> {
  state: HeroCanvasBoundaryState = { hasFailed: false };

  static getDerivedStateFromError(): HeroCanvasBoundaryState {
    return { hasFailed: true };
  }

  render() {
    return this.state.hasFailed ? null : this.props.children;
  }
}
