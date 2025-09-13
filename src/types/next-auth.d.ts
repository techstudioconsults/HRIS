import { AuthTokens, Employee, Role } from "@/lib/auth-types";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    employee: Employee;
    tokens: AuthTokens;
    role: Role;
    permissions: string[];
  }

  interface Session {
    user: {
      id: string;
      employee: Employee;
      role: Role;
      permissions: string[];
    } & DefaultSession["user"];
    tokens: AuthTokens;
    expires: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    employee: Employee;
    tokens: AuthTokens;
    role: Role;
    permissions: string[];
    iat: number;
    exp: number;
    jti: string;
  }
}
