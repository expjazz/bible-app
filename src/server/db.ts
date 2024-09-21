import { Prisma, PrismaClient } from "@prisma/client";
import { env } from "~/env";
import bcrypt from 'bcrypt';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends({
    model: {
      user: {
        async signUp(email: string, password: string) {
          const hash = await bcrypt.hash(password, 10)
          return prisma.user.create({
            data: {
              email,
              password: {
                create: {
                  hash,
                },
              },
            },
          })
        },
        async logIn(email: string, password: string) {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;
          const isPasswordValid = await bcrypt.compare(password, user.password);
          return isPasswordValid ? user : null;

        },
      }
    }
  })





if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

