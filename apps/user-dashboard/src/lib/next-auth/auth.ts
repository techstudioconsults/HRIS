import axios from "axios";
import NextAuth, { CredentialsSignin, Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
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

          // If response is not successful, throw error with message from response
          const errorMessage = response.data?.message || "Login failed. Please try again.";
          throw new CredentialsSignin(errorMessage);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Invalid email or password";
            throw new CredentialsSignin(message);
          }

          // Re-throw if it's already a CredentialsSignin error
          if (error instanceof CredentialsSignin) {
            throw error;
          }

          throw new CredentialsSignin("Login failed. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
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

      // Update triggered from client (e.g., after token refresh)
      if (trigger === "update" && session) {
        return {
          ...token,
          tokens: session.tokens || token.tokens,
          employee: session.employee || token.employee,
        };
      }

      return token;
    },

    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          employee: token.employee,
          permissions: token.permissions || [],
        },
        tokens: token.tokens,
        expires: session.expires,
      } as Session;
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
