// auth.config.ts
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(parsed.data.password, user.password);
        if (!ok) return null;

        // retorno precisa conter id, email e name
        return { id: String(user.id), email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // adiciona o id de forma tipada
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export default authConfig;
