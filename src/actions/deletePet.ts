"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma";
import { auth } from "../../auth";

export async function deletePet(petId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado.");
  }

  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    select: { id: true, authorId: true },
  });

  if (!pet) {
    throw new Error("Pet não encontrado.");
  }

  if (String(pet.authorId) !== String(session.user.id)) {
    throw new Error("Você não tem permissão para deletar este post.");
  }

  await prisma.pet.delete({ where: { id: petId } });

  revalidatePath("/");          
  revalidatePath("/adota");     
  revalidatePath(`/pet/${petId}`); 

  redirect("/meus-posts");
}
