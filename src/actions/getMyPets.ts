
"use server";

import prisma from "../../lib/prisma";
import { auth } from "../../auth";

export type MyPet = {
  id: number;
  name: string;
  breed: string;
  ageMonths: number;
  imageUrl?: string | null;
  description?: string | null;
};

export async function getMyPets(): Promise<MyPet[]> {
  const session = await auth();
  const idFromSession = session?.user?.id;

  if (!idFromSession) {
    return [];
  }

  const authorId = Number(idFromSession);

  return prisma.pet.findMany({
    orderBy: { createdAt: "desc" },
    where: { authorId }, 
    select: {
      id: true,
      name: true,
      breed: true,
      ageMonths: true,
      imageUrl: true,
      description: true,
    },
  });
}
