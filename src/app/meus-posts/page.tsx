
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import PetCard from "@/components/PetCard";
import { getMyPets } from "@/actions/getMyPets";

export const metadata = {
  title: "Meus Posts | Cantinho do AUmigo",
};

export default async function MeusPostsPage() {
  const session = await auth();

  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/meus-posts")}`);
  }

  const pets = await getMyPets();

  return (
    <main className="min-h-screen bg-neutral px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[var(--color-secondary)]">
            Meus posts
          </h1>

        </header>

        {pets.length === 0 ? (
          <p className="text-[color:rgba(0,0,0,.65)]">
            Você ainda não publicou nenhum pet.
          </p>
        ) : (
          <section className="flex flex-col gap-5">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
