type CallServiceMessage =
  { type: 'start'; title: string; text: string; channel: string } | { type: 'stop' };

type CallServiceBridge = {
  postMessage: (data: string) => void;
};

export const postCallServiceMessage = (message: CallServiceMessage) => {
  const bridge = (globalThis as { chatovoCall?: CallServiceBridge }).chatovoCall;

  bridge?.postMessage(JSON.stringify(message));
};
