import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "~/server/db";
import bcrypt from 'bcrypt';
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "exemplo@exemplo.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req)
      {
        if (!credentials) return null;
        console.log('inside authorize')
        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        console.log('user', user)
        if (!user) return null;
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        console.log("isValid", isPasswordValid)

        if (user && isPasswordValid) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }