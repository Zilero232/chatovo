export type ResolvePasswordGateInput = {
  isPrivate: boolean;
  tokenFailed: boolean;
  tokenError: unknown;
  password: string | undefined;
};

export type PasswordGate = {
  showPasswordForm: boolean;
  passwordError: unknown;
};
