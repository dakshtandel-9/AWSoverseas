export const PASSWORD_RULES = "At least 8 characters, with an uppercase letter, a number, and a special character.";

export type PasswordCheck = { key: string; label: string; met: boolean };

/** Per-rule pass/fail — drives the live red/green checklist under the password field. */
export function checkPassword(password: string): PasswordCheck[] {
  return [
    { key: "length", label: "At least 8 characters", met: password.length >= 8 },
    { key: "upper", label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { key: "number", label: "One number", met: /[0-9]/.test(password) },
    { key: "special", label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];
}

/** Shared by sign-up and password-reset — one definition of "valid password". */
export function passwordError(password: string): string | null {
  const failed = checkPassword(password).find((c) => !c.met);
  return failed ? `Password must have: ${failed.label.toLowerCase()}.` : null;
}
