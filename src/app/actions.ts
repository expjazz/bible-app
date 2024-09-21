"use server";
import bcrypt from 'bcrypt';
import { signIn } from 'next-auth/react';

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