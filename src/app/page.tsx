
import PetsExplorer from "@/components/PetsExplorer";
import { getPets } from "@/actions/getPets"; 

export default async function Home() {
  const initialPets = await getPets(20); 
  return (
    <main className="min-h-screen bg-neutral px-6 py-8">
      <PetsExplorer initialPets={initialPets} />
    </main>
  );
}
