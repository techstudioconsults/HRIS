/* eslint-disable no-console */
import NextAuth from "next-auth";

import "next-auth/jwt";

import Credentials from "next-auth/providers/credentials";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await fetch(`${`https://hrdev.techstudioacademy.com/api/v1`}/auth/login/password`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            console.error("Login failed:", response.status, response.statusText);
            return null;
          }

          const data = await response.json();

          if (data.success) {
            return {
              id: data.data.employee.id,
              name: data.data.employee.fullName,
              email: data.data.employee.email,
              role: data.data.employee.role,
              accessToken: data.data.tokens.accessToken,
              refreshToken: data.data.tokens.refreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name;
      if (session) {
        token.accessToken = session.accessToken;
        token.refreshToken = session.refreshToken;
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken ?? "";
      session.refreshToken = token.refreshToken ?? "";
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/not-found", // Redirect to login on errors
  },
  // skipCSRFCheck: "true",
  secret: process.env.AUTH_SECRET,
});
