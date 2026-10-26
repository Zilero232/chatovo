import { describe, expect, it, vi } from 'vitest';

import { toLiveAudioAdapter, toMediaElementAdapter } from '../player-adapters';

const mediaRejecting = (error: unknown) =>
  ({
    currentTime: 0,
    play: () => Promise.reject(error)
  }) as unknown as HTMLAudioElement;

describe('toMediaElementAdapter', () => {
  it('reports a browser autoplay refusal so the listener can be asked to press play', async () => {
    const onBlocked = vi.fn();
    const adapter = toMediaElementAdapter({
      media: mediaRejecting(new DOMException('', 'NotAllowedError')),
      onBlocked
    });

    adapter.play();

    await vi.waitFor(() => expect(onBlocked).toHaveBeenCalledOnce());
  });

  it('stays quiet when playback is interrupted for another reason', async () => {
    const onBlocked = vi.fn();
    const adapter = toMediaElementAdapter({
      media: mediaRejecting(new DOMException('', 'AbortError')),
      onBlocked
    });

    adapter.play();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onBlocked).not.toHaveBeenCalled();
  });
});

describe('toLiveAudioAdapter', () => {
  it('reports a browser autoplay refusal for a radio stream', async () => {
    const onBlocked = vi.fn();
    const adapter = toLiveAudioAdapter({
      audio: mediaRejecting(new DOMException('', 'NotAllowedError')),
      onBlocked
    });

    adapter.play();

    await vi.waitFor(() => expect(onBlocked).toHaveBeenCalledOnce());
  });
});
