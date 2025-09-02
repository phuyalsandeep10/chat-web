export const getPasswordValidationStatus = (password: string) => {
  return {
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasMinLength: password.length >= 8,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=~`|]/.test(password),
  };
};
