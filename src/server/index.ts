import { prisma } from './db';
import { publicProcedure, router } from './trpc';
 
const appRouter = router({
  userList: publicProcedure
    .query(async () => {
      const users = await prisma.user.findMany();
      return users;
    }),
});