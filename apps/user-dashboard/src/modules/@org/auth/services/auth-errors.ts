import { AxiosError } from 'axios';
import { getApiErrorMessage } from '@/lib/tools/api-error-message';

type AuthContext =
  | 'login'
  | 'register'
  | 'otp-request'
  | 'otp-verify'
  | 'forgot-password'
  | 'reset-password';

const STATUS_MESSAGES: Record<AuthContext, Partial<Record<number, string>>> = {
  register: {
    400: 'Invalid registration details. Please check your inputs and try again.',
    409: 'An account with this email or company domain already exists.',
    422: 'Some fields are invalid. Please review and correct them.',
    429: 'Too many registration attempts. Please wait a moment and try again.',
  },
  login: {
    400: 'Invalid credentials. Please check your email and password.',
    401: 'No employee account found with these credentials. Please check your email and password.',
    403: 'Your account has been deactivated. Please contact your administrator.',
    404: 'No employee account found with this email address.',
    429: 'Too many login attempts. Please wait a moment and try again.',
  },
  'otp-request': {
    400: 'Please enter a valid work email address.',
    401: 'No employee account found with this email address.',
    404: 'No employee account found with this email address.',
    429: 'OTP request limit reached. Please wait before requesting another code.',
  },
  'otp-verify': {
    400: 'The OTP entered is incorrect. Please check and try again.',
    401: 'Invalid or expired OTP. Please request a new code.',
    429: 'Too many attempts. Please request a new OTP.',
  },
  'forgot-password': {
    400: 'Please enter a valid work email address.',
    401: 'No employee account found with this email address.',
    404: 'No employee account found with this email address.',
  },
  'reset-password': {
    400: 'Invalid or expired reset token. Please request a new password reset.',
    401: 'Your password reset link has expired. Please request a new one.',
    404: 'Password reset request not found. Please request a new reset link.',
  },
};

export const getAuthErrorMessage = (
  error: unknown,
  context: AuthContext
): string => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const contextMessages = STATUS_MESSAGES[context];
    if (status !== undefined && contextMessages[status]) {
      return contextMessages[status]!;
    }
  }
  return getApiErrorMessage(
    error,
    'An unexpected error occurred. Please try again.'
  );
};
