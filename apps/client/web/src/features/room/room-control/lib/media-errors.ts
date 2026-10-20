const isDomError = (err: unknown, name: string) => err instanceof DOMException && err.name === name;

export const isCancelled = (err: unknown) => isDomError(err, 'NotAllowedError');

export const isOverconstrained = (err: unknown) => isDomError(err, 'OverconstrainedError');
