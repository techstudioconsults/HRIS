import type {
  User,
  Tokens,
  AuthResponseData,
} from '../../_domain/models/entities';

export const mockUser: User = {
  id: 'emp_01',
  firstName: 'Amara',
  lastName: 'Okafor',
  fullName: 'Amara Okafor',
  email: 'amara@acme.com',
  role: 'owner',
  createdAt: '2025-01-15T09:00:00Z',
  updatedAt: '2025-06-01T10:00:00Z',
};

export const mockTokens: Tokens = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-access-token',
  refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-refresh-token',
};

export const mockAuthResponse: AuthResponseData = {
  user: mockUser,
  tokens: mockTokens,
  permissions: ['admin:admin'],
};

export const mockEmployeeAuthResponse: AuthResponseData = {
  user: {
    ...mockUser,
    id: 'emp_02',
    firstName: 'Bola',
    lastName: 'Adeyemi',
    fullName: 'Bola Adeyemi',
    email: 'bola@acme.com',
    role: 'employee',
  },
  tokens: mockTokens,
  permissions: ['leave:read', 'leave:create', 'payroll:read'],
};

// Valid test credentials
export const VALID_EMAIL = 'amara@acme.com';
export const VALID_PASSWORD = 'SecurePass123!';
export const VALID_OTP = '123456';
