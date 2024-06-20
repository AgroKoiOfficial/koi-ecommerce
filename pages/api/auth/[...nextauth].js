import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import * as argon2 from "argon2";
import { prisma } from "@/prisma/prisma";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          return null;
        }

        const isValid = await argon2.verify(
          user.password,
          credentials.password
        );

        if (!isValid) {
          return null;
        }
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.role = token.role;

      session.user.isAdmin = token.role === "ADMIN";

      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith("/") ? `${baseUrl}${url}` : url;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/",
    newUser: "/register",
    verifyRequest: "/register",
    newSession: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  adapter: prisma,
});
