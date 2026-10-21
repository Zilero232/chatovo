export type ResolvePasswordGateInput = {
  isPrivate: boolean;
  tokenFailed: boolean;
  tokenError: unknown;
  password: string | undefined;
};

export type PasswordGate = {
  isRefused: boolean;
  showPasswordForm: boolean;
  passwordError: unknown;
};
