export type FocusCaptureController = {
  setFocusBehavior: (behavior: 'focus-captured-surface' | 'no-focus-change') => void;
};

export type CaptureControllerHost = {
  CaptureController?: new () => FocusCaptureController;
};
