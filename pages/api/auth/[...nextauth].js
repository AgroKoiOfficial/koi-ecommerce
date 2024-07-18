import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import * as argon2 from "argon2";
import { prisma } from "@/prisma/prisma";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

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

        const isValid = await argon2.verify(user.password, credentials.password);

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
    encryption: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }

      // If the token is expired, refresh it
      const now = Math.floor(Date.now() / 1000);
      const maxAge = 30 * 24 * 60 * 60;
      if (token.exp && token.exp - now < maxAge / 2) {
        const userFromDb = await prisma.user.findUnique({
          where: { id: token.id },
        });

        if (userFromDb?.refreshToken) {
          try {
            jwt.verify(userFromDb.refreshToken, process.env.NEXTAUTH_SECRET);
            const newToken = jwt.sign({ id: userFromDb.id }, process.env.NEXTAUTH_SECRET, {
              expiresIn: maxAge,
            });
            token = { ...token, ...jwt.decode(newToken) };
          } catch (error) {
            return token;
          }
        }
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
    async signIn({ user }) {
      const refreshToken = uuidv4();
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });
      return true;
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
});
