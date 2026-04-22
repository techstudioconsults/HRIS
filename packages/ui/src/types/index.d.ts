declare global {
  interface NavLink {
    id: number;
    title: string;
    href: string;
    type: 'link' | 'dropdown';
    subLinks?: Array<{
      id: number;
      title: string;
      href: string;
      description: string;
    }> | null;
  }

  // interface Role {
  //   id: string;
  //   name: string;
  // }
  //
  // interface Employee {
  //   id: string;
  //   fullName: string;
  //   email: string;
  //   role: Role;
  // }
  //
  // interface Tokens {
  //   accessToken: string;
  //   refreshToken: string;
  // }
  //
  // interface AuthResponseData {
  //   employee: Employee;
  //   tokens: Tokens;
  //   permissions: string[];
  // }
  //
  // interface AuthResponse {
  //   success: boolean;
  //   data: AuthResponseData;
  // }
}
export {};
