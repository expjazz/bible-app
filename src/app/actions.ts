"use server";
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';

import { prisma } from "~/server/db";

export async function signup(name: string, email: string, password: string)
{
  const hash = await bcrypt.hash(password, 10)
    return prisma.user.create({
      data: {
        name,
        email,
        password: hash
      },
    })
}

export async function login(email: string, password: string)
{
  return signIn("credentials", { email, password })
}

export async function createArticle({
  title,
  content,
  userId,
}: {
  title: string;
  content: Prisma.InputJsonValue;
  userId: string;
}) {
  const article = await prisma.article.create({
    data: {
      title,
      content: content as Prisma.InputJsonValue,
      userId,
    },
  });
  redirect(`/${article.id}`);
}

export async function updateArticle({
  id,
  title,
  content,
}: {
  id: string;
  title: string;
  content: Prisma.InputJsonValue;
}) {
  return prisma.article.update({
    where: { id },
    data: {
      title,
      content: content as Prisma.InputJsonValue,
    },
  });
}