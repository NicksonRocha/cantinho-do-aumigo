
"use server";

import prisma from "../../lib/prisma";

type PetFilters = {
  breed?: string[];
  color?: string[];
  size?: string[];
  sex?: string[];
  temperament?: string[];
};

export async function getPets(limit?: number, filters?: PetFilters) {
  return prisma.pet.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      breed: filters?.breed ? { in: filters.breed } : undefined,
      color: filters?.color ? { in: filters.color } : undefined,
      size: filters?.size ? { in: filters.size } : undefined,
      sex: filters?.sex ? { in: filters.sex } : undefined,
      temperament: filters?.temperament ? { in: filters.temperament } : undefined,

    },
    select: {
      id: true,
      name: true,
      breed: true,
      color: true,
      size: true,
      sex: true,
      ageMonths: true,
      weightKg: true,
      temperament: true,
      imageUrl: true,
      description: true,
    },
    take: limit,
  });
}
