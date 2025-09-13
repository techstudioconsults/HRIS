import axios from "axios";
import NextAuth, { CredentialsSignin, Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  // debug: process.env.NODE_ENV === "development",
  providers: [
    // conventional credentials
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;
        if (!email || !password) {
          throw new CredentialsSignin("Please provide both email and password");
        }

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login/password`, {
            email,
            password,
          });

          if (response.status === 200 && response.data.success) {
            const { employee, tokens, permissions } = response.data.data;

            return {
              id: employee.id,
              employee,
              tokens,
              permissions,
            } as User;
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Invalid email or password";
            throw new CredentialsSignin(message);
          }
          throw new CredentialsSignin("Login failed. Please try again.");
        }

        throw new CredentialsSignin("Login failed. Please try again.");
      },
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          id: user.id,
          employee: user.employee,
          tokens: user.tokens,
          permissions: user.permissions,
        };
      }

      // Update triggered from client
      if (trigger === "update" && session) {
        return {
          ...token,
          tokens: session.tokens,
        };
      }

      return token;
    },

    session({ session, token }): Promise<Session> {
      // Ensure we have the correct structure
      const sessionData = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          employee: token.employee,
          permissions: token.permissions || [],
        },
        tokens: token.tokens,
        expires: session.expires,
      };

      return Promise.resolve(sessionData);
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
});
