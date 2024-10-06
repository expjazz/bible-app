import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { prisma } from '~/server/db';
import { getBibleBooks, getVerse } from '~/utils/bibleApi';

const BookValidation = z.object({
  abbrev: z.object({
    pt: z.string(),
    en: z.string(),
  }),
  author: z.string(),
  chapters: z.number(),
  comment: z.string().optional(),
  group: z.string(),
  name: z.string(),
  testament: z.string(),
  version: z.string().optional(),
});

export const appRouter = createTRPCRouter({
  userById: baseProcedure.input(z.string()).query(async ({ input }) => {
    const user = await prisma.user.findUnique({
      where: { id: input },
    });
    return user;
  }),
  bibleBooks: baseProcedure.query(async () => {
    const books = await getBibleBooks();
    return books;
  }),
  bibleVerse: baseProcedure.input(z.object({
    book: BookValidation,
    chapter: z.number(),
    version: z.string(),
  })).query(async ({ input }) => {
    const verse = await getVerse(input);
    return verse;
  }),
  getArticles: baseProcedure.input(z.object({
    userId: z.string(),
  })).query(async ({ input }) => {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
      },
      where: {
        userId: input.userId,
      },
    });
    return articles;
  }),
  getArticleById: baseProcedure.input(z.object({
    id: z.string(),
  })).query(async ({ input }) => {
    const article = await prisma.article.findUnique({
      where: {
        id: input.id,
      },
    });
    return article;
  }),
  getPdfTemplateById: baseProcedure.input(z.object({
    id: z.string(),
  })).query(async ({ input }) => {
    const pdfTemplate = await prisma.pdfTemplate.findUnique({
      where: {
        id: input.id,
      },
    });
    return pdfTemplate
  }),

});



// export type definition of API
export type AppRouter = typeof appRouter;