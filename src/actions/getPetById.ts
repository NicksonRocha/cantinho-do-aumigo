// src/actions/getPetById.ts
"use server";

import prisma from "../../lib/prisma";
import type { PetDetail } from "@/types/pet";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;

function cUrl(publicId: string): string {
  if (!CLOUD) throw new Error("CLOUDINARY_CLOUD_NAME não definido no .env.local");
  const pid = publicId.replace(/^\/+/, "");
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${pid}`;
}

export async function getPetById(id: number): Promise<PetDetail | null> {
  const pet = await prisma.pet.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { position: "asc" },
        select: { publicId: true, position: true },
      },
    },
  });
  if (!pet) return null;

  const imgs = pet.images.map((img: { publicId: string }) => cUrl(img.publicId));
  if (imgs.length === 0 && pet.imageUrl) imgs.push(pet.imageUrl);

  return {
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    color: pet.color ?? null,
    size: (pet.size as PetDetail["size"]) ?? null,
    sex: (pet.sex as PetDetail["sex"]) ?? null,
    ageMonths: pet.ageMonths,
    weightKg: typeof pet.weightKg === "number" ? pet.weightKg : null,
    temperament: pet.temperament ?? null,
    description: pet.description ?? null,
    images: imgs,
    contactPhone: pet.contactPhone ?? null,
  };
}
