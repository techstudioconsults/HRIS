export const VALID_EMAIL = 'amara@acme.com';
export const VALID_PASSWORD = 'SecurePass123!';
export const VALID_OTP = '123456';
export const VALID_RESET_TOKEN = 'valid-reset-token-abc123';

export const fixtureAuthUser = {
  id: 'emp_01',
  firstName: 'Amara',
  lastName: 'Okafor',
  fullName: 'Amara Okafor',
  email: VALID_EMAIL,
  role: 'owner',
  createdAt: '2025-01-15T09:00:00Z',
  updatedAt: '2025-06-01T10:00:00Z',
};

export const fixtureTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

/**
 * Matches the real backend AuthResponse shape:
 * { success: boolean; data: { employee, tokens, permissions } }
 */
export const fixtureLoginResponse = {
  success: true,
  data: {
    employee: fixtureAuthUser,
    tokens: fixtureTokens,
    permissions: ['admin:admin'],
  },
};

export const fixtureRegisterPayload = {
  companyName: 'Acme Corp',
  domain: 'acme',
  firstName: 'Amara',
  lastName: 'Okafor',
  email: 'new@newco.com',
  password: VALID_PASSWORD,
  confirmPassword: VALID_PASSWORD,
};
