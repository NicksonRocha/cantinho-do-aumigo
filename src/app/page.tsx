// app/page.tsx (exemplo)
import PetsExplorer from "@/components/PetsExplorer";
import { getPets } from "@/actions/getPets"; // se já existir

export default async function Home() {
  const initialPets = await getPets(20); // ou prisma direto
  return (
    <main className="min-h-screen bg-neutral px-6 py-8">
      <PetsExplorer initialPets={initialPets} />
    </main>
  );
}
