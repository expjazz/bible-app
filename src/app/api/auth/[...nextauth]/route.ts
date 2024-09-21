import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "~/server/db";
import bcrypt from 'bcrypt';
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email", placeholder: "exemplo@exemplo.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req)
      {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        console.log("isValid", isPasswordValid)

        if (user && isPasswordValid) {
          return user
        } else {
          return null
        }
      }
    })
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }