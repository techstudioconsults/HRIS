import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    employee?: {
      role?: {
        name?: string;
      };
    };
    permissions?: string[];
  }

  interface Session {
    user: {
      id: string;
      employee?: {
        role?: {
          name?: string;
        };
      };
      permissions?: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    employee?: {
      role?: {
        name?: string;
      };
    };
    permissions?: string[];
  }
}
