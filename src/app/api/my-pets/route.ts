
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  const idFromSession = session?.user?.id;
  if (!idFromSession) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const authorId = Number(idFromSession);

  const breed = url.searchParams.getAll("breed");
  const size = url.searchParams.getAll("size");
  const sex = url.searchParams.getAll("sex");
  const temperament = url.searchParams.getAll("temperament");

  const ageMin = url.searchParams.get("ageMin");
  const ageMax = url.searchParams.get("ageMax");
  const name = url.searchParams.get("name")?.trim();
  const take = Number(url.searchParams.get("take") ?? 20);

  const where = {
    authorId,
    ...(breed.length ? { breed: { in: breed } } : {}),
    ...(size.length ? { size: { in: size } } : {}),
    ...(sex.length ? { sex: { in: sex } } : {}),
    ...(temperament.length ? { temperament: { in: temperament } } : {}),
    ...(ageMin && ageMax ? { ageMonths: { gte: Number(ageMin), lte: Number(ageMax) } } : {}),
    ...(name ? { name: { contains: name, mode: "insensitive" as const } } : {}),
  };

  const pets = await prisma.pet.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      breed: true,
      ageMonths: true,
      imageUrl: true,
      description: true,
      color: true,
      size: true,
      sex: true,
      weightKg: true,
      temperament: true,
    },
    take,
  });

  return NextResponse.json(pets);
}
