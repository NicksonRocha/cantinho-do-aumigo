
"use client";

import { useEffect, useMemo, useState } from "react";
import PetFilters from "@/components/PetFilters";
import PetCard from "@/components/PetCard";
import type { PetFilters as Filters, PetListItem } from "@/types/pet";

export default function PetsExplorer({ initialPets }: { initialPets: PetListItem[] }) {
  const [pets, setPets] = useState<PetListItem[]>(initialPets);
  const [filters, setFilters] = useState<Filters>({
    breed: [],
    size: [],
    sex: [],
    temperament: [],
    ageRange: null,
  });

  const apiUrl = useMemo(() => {
    const url = new URL("/api/pets", window.location.origin);

    const pushArr = (key: keyof Omit<Filters, "ageRange">) =>
      filters[key].forEach((v) => url.searchParams.append(key, v));

    pushArr("breed");
    pushArr("size");
    pushArr("sex");
    pushArr("temperament");

    if (filters.ageRange) {
      url.searchParams.set("ageMin", String(filters.ageRange.min));
      url.searchParams.set("ageMax", String(filters.ageRange.max));
    }

    url.searchParams.set("take", "20");
    return url.toString();
  }, [filters]);

  useEffect(() => {
    const abort = new AbortController();
    fetch(apiUrl, { signal: abort.signal })
      .then((r) => r.json())
      .then((data: PetListItem[]) => setPets(data))
      .catch((e) => {
        if (e.name !== "AbortError") console.error(e);
      });
    return () => abort.abort();
  }, [apiUrl]);

  return (
    <div className="flex gap-6">
      <PetFilters onChange={setFilters} />
      <section className="flex-1 flex flex-col gap-6 max-w-2xl mx-auto">
        {pets.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum pet encontrado.</p>
        ) : (
          pets.map((p) => <PetCard key={p.id} pet={p} ratio="4:5" />)
        )}
      </section>
    </div>
  );
}
