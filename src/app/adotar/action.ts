// app/adopt/new/action.ts
"use server";

import { ZodError } from "zod";
import prisma from "../../../lib/prisma";
import { createPetSchema, type CreatePetInput } from "@/schemas/pet";
import { auth } from "../../../auth";

export type CreatePetState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createPet(
  _: CreatePetState,
  formData: FormData
): Promise<CreatePetState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { ok: false, message: "Você precisa estar autenticado para cadastrar um pet." };
    }
    const userId = Number(session.user.id);

    const publicIds = formData
      .getAll("imagePublicIds[]")
      .map(String)
      .filter(Boolean)
      .slice(0, 4);

    const data: CreatePetInput = {
      name: String(formData.get("name") ?? ""),
      breed: String(formData.get("breed") ?? ""),
      color: String(formData.get("color") ?? ""),
      size: String(formData.get("size") ?? "") as CreatePetInput["size"],
      sex: String(formData.get("sex") ?? "") as CreatePetInput["sex"],
      ageMonths: Number(formData.get("ageMonths") ?? 0),
      weightKg: formData.get("weightKg") ? Number(formData.get("weightKg")) : undefined,
      description: String(formData.get("description") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      vaccinated: formData.get("vaccinated") === "on",
      neutered: formData.get("neutered") === "on",
      dewormed: formData.get("dewormed") === "on",
      temperament: String(formData.get("temperament") ?? ""),
      // 👇 novo
      contactPhone: String(formData.get("contactPhone") ?? ""),
    };

    const parsed = createPetSchema.parse(data);

    await prisma.$transaction(async (tx) => {
      const pet = await tx.pet.create({
        data: {
          name: parsed.name,
          breed: parsed.breed,
          color: parsed.color,
          size: parsed.size,
          sex: parsed.sex,
          ageMonths: parsed.ageMonths,
          weightKg: parsed.weightKg,
          description: parsed.description,
          imageUrl: parsed.imageUrl,
          vaccinated: !!parsed.vaccinated,
          neutered: !!parsed.neutered,
          dewormed: !!parsed.dewormed,
          temperament: parsed.temperament,
          contactPhone: parsed.contactPhone, // 👈 salvar já normalizado (só dígitos)
          authorId: userId,
        },
      });

      if (publicIds.length) {
        await tx.petImage.createMany({
          data: publicIds.map((publicId, idx) => ({
            petId: pet.id,
            publicId,
            position: idx + 1,
          })),
        });
      }
    });

    return { ok: true, message: "Pet cadastrado com sucesso!" };
  } catch (e) {
    if (e instanceof ZodError) {
      return { ok: false, errors: e.flatten().fieldErrors };
    }
    console.error(e);
    return { ok: false, message: "Erro ao cadastrar pet. Tente novamente." };
  }
}
