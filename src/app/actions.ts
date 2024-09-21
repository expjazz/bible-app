"use server";
import bcrypt from 'bcrypt';

import { prisma } from "~/server/db";

export async function signup(name: string, email: string, password: string)
{
  console.log("signup", name, email, password)
  const hash = await bcrypt.hash(password, 10)
    return prisma.user.create({
      data: {
        name,
        email,
        password: hash
      },
    })
}