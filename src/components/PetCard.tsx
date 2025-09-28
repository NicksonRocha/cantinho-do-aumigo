import Image from "next/image";
import Link from "next/link";
import { formatAge } from "@/utils/formatAge";

type Pet = {
  id: number;
  name: string;
  breed: string;
  ageMonths: number;
  imageUrl?: string | null;
  description?: string | null;
};

type Props = {
  pet: Pet;
  ratio?: "4:5" | "16:9";
};

export default function PetCard({ pet, ratio = "4:5" }: Props) {
  const aspectClass = ratio === "16:9" ? "aspect-video" : "aspect-[4/5]";

  return (
    <article className="w-full bg-white rounded-2xl shadow-sm border border-accent hover:shadow-md transition overflow-hidden">
      <div className="flex gap-0 md:gap-4">
       
        <div className={`relative shrink-0 w-[180px] md:w-[240px] ${aspectClass} bg-[var(--color-neutral)]`}>
          {pet.imageUrl ? (
            <Image
              src={pet.imageUrl}
              alt={pet.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 180px, 240px"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-accent/50">
              sem foto
            </div>
          )}
        </div>

        <div className="flex-1 p-4 md:p-5">
          <Link
            href={`/pets/${pet.id}`}
            className="text-xl font-semibold text-[var(--color-secondary)]">
            {pet.name}
          </Link>
          <p className="text-sm text-[color:rgba(0,0,0,.55)]">Raça: {pet.breed}</p>
          <p className="text-sm text-[color:rgba(0,0,0,.55)] mb-2">Idade: {formatAge(pet.ageMonths)}</p>

          {pet.description && (
            <p
              className="text-[color:rgba(0,0,0,.75)] mb-3"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              title={pet.description ?? undefined}
            >
              {pet.description}
            </p>
          )}

          <Link
            href={`/pets/${pet.id}`}
            className="inline-block text-highlight font-medium hover:opacity-80"
          >
            Saiba mais →
          </Link>
        </div>
      </div>
    </article>
  );
}
