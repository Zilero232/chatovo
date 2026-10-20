import type { AudioProcessorOptions, Track, TrackProcessor } from 'livekit-client';

import type { VoiceGateParams } from './voice-gate-detector';

import { VOICE_GATE_TICK_MS, VoiceGateDetector } from './voice-gate-detector';

const ANALYSER_FFT_SIZE = 2048;
const ANALYSER_SMOOTHING = 0.8;
const ATTACK_TIME = 0.008;
const RELEASE_TIME = 0.12;
const GATE_OPEN = 1;
const GATE_CLOSED = 0;

const measureVolume = (analyser: AnalyserNode, buffer: Uint8Array<ArrayBuffer>) => {
  analyser.getByteFrequencyData(buffer);

  let sum = 0;
  for (const amplitude of buffer) {
    sum += (amplitude / 255) ** 2;
  }

  return Math.sqrt(sum / buffer.length);
};

const resumeContext = (context: AudioContext) => {
  if (context.state === 'suspended') {
    void context.resume();
  }
};

export class VoiceGateProcessor implements TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> {
  name = 'voice-gate';

  processedTrack?: MediaStreamTrack;

  private params: VoiceGateParams;
  private onLevel?: (level: number, open: boolean) => void;

  private context?: AudioContext;
  private analyser?: AnalyserNode;
  private gain?: GainNode;
  private nodes: AudioNode[] = [];
  private levelBuffer?: Uint8Array<ArrayBuffer>;

  private readonly detector = new VoiceGateDetector();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private resumeContext = () => {
    if (this.context) {
      resumeContext(this.context);
    }
  };

  constructor(params: VoiceGateParams, onLevel?: (level: number, open: boolean) => void) {
    this.params = params;
    this.onLevel = onLevel;
  }

  async init(opts: AudioProcessorOptions) {
    this.start(opts.audioContext, opts.track);
  }

  async restart(opts: AudioProcessorOptions) {
    const context = opts.audioContext ?? this.context;

    await this.destroy();
    this.start(context, opts.track);
  }

  update(params: VoiceGateParams) {
    this.params = params;
  }

  async destroy() {
    this.stopTickLoop();
    this.detachContextKeepAlive();

    for (const node of this.nodes) {
      node.disconnect();
    }

    this.nodes = [];
    this.context = undefined;
    this.analyser = undefined;
    this.gain = undefined;
    this.levelBuffer = undefined;
    this.processedTrack = undefined;
    this.detector.reset();
  }

  private start(context: AudioContext | undefined, track: MediaStreamTrack) {
    if (!context) {
      this.processedTrack = track;

      return;
    }

    this.buildGraph(context, track);
    this.attachContextKeepAlive(context);
    this.startTickLoop();
  }

  private buildGraph(context: AudioContext, track: MediaStreamTrack) {
    const source = context.createMediaStreamSource(new MediaStream([track]));

    const analyser = context.createAnalyser();
    analyser.fftSize = ANALYSER_FFT_SIZE;
    analyser.smoothingTimeConstant = ANALYSER_SMOOTHING;
    analyser.minDecibels = -100;
    analyser.maxDecibels = -80;

    const gain = context.createGain();
    gain.gain.value = GATE_CLOSED;

    const destination = context.createMediaStreamDestination();

    source.connect(gain);
    source.connect(analyser);
    gain.connect(destination);

    this.context = context;
    this.analyser = analyser;
    this.gain = gain;
    this.levelBuffer = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
    this.nodes = [source, analyser, gain];
    this.processedTrack = destination.stream.getAudioTracks()[0];
  }

  private attachContextKeepAlive(context: AudioContext) {
    document.addEventListener('visibilitychange', this.resumeContext);
    context.addEventListener('statechange', this.resumeContext);
    resumeContext(context);
  }

  private detachContextKeepAlive() {
    document.removeEventListener('visibilitychange', this.resumeContext);
    this.context?.removeEventListener('statechange', this.resumeContext);
  }

  private startTickLoop() {
    this.stopTickLoop();
    this.intervalId = setInterval(this.tick, VOICE_GATE_TICK_MS);
  }

  private stopTickLoop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick = () => {
    if (!this.context || !this.analyser || !this.gain || !this.levelBuffer) {
      return;
    }

    resumeContext(this.context);

    const level = measureVolume(this.analyser, this.levelBuffer);
    const open = this.detector.step(level, this.params);
    const target = open ? GATE_OPEN : GATE_CLOSED;
    const speed = open ? ATTACK_TIME : RELEASE_TIME;

    this.gain.gain.setTargetAtTime(target, this.context.currentTime, speed);
    this.onLevel?.(level, open);
  };
}
