"use client";

import { useState } from "react";
import type { PetFilters } from "@/types/pet";

const breedOptions = ["Labrador", "Poodle", "Vira-lata"] as const;
const sizeOptions = ["pequeno", "medio", "grande"] as const;
const sexOptions = ["M", "F"] as const;
const temperamentOptions = ["calmo", "agitado", "brincalhão"] as const;

const ageOptions = [
  { label: "Filhote (0–12m)", min: 0,  max: 12 },
  { label: "Adulto (1–7a)",   min: 13, max: 84 },
  { label: "Idoso (7a+)",     min: 85, max: 600 },
] as const;

type Props = { onChange: (filters: PetFilters) => void };

export default function PetFilters({ onChange }: Props) {
  const [filters, setFilters] = useState<PetFilters>({
    breed: [],
    size: [],
    sex: [],
    temperament: [],
    ageRange: null,
  });

  function toggleFilter<K extends keyof PetFilters>(
    category: K,
    value: K extends "ageRange" ? { min: number; max: number } | null : string
  ) {
    setFilters((prev) => {
      let next: PetFilters;

      if (category === "ageRange") {
        next = { ...prev, ageRange: value as PetFilters["ageRange"] };
      } else {
        const key = category as Exclude<K, "ageRange">;
        const current = new Set(prev[key] as string[]);
        const val = value as string;
        current.has(val) ? current.delete(val) : current.add(val);
        next = { ...prev, [key]: Array.from(current) };
      }

      onChange(next);
      return next;
    });
  }

  return (
    <aside className="w-64 p-4 space-y-5 bg-white rounded-xl shadow-sm border border-accent">
      <h3 className="text-base font-semibold text-[var(--color-secondary)]">Filtros</h3>

      <div>
        <p className="text-sm font-semibold mb-1 text-accent">Raça</p>
        <div className="flex flex-wrap gap-2">
          {breedOptions.map((b) => {
            const id = `breed-${b}`;
            const checked = filters.breed.includes(b);
            return (
              <div key={b} className="inline-block">
                <input
                  id={id}
                  type="checkbox"
                  className="peer sr-only"
                  checked={checked}
                  onChange={() => toggleFilter("breed", b)}
                />
                <label
                  htmlFor={id}
                  className="
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer select-none
                    border border-accent/40 bg-accent/10 hover:bg-accent/15
                    text-[var(--color-secondary)] transition
                    peer-checked:bg-primary peer-checked:text-[#2C140C] peer-checked:border-accent
                    peer-checked:ring-2 peer-checked:ring-[var(--color-highlight)] peer-checked:ring-offset-0
                  "
                >
                  {b}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1 text-accent">Porte</p>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((s) => {
            const id = `size-${s}`;
            const checked = filters.size.includes(s);
            return (
              <div key={s} className="inline-block">
                <input
                  id={id}
                  type="checkbox"
                  className="peer sr-only"
                  checked={checked}
                  onChange={() => toggleFilter("size", s)}
                />
                <label
                  htmlFor={id}
                  className="
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer select-none
                    border border-accent/40 bg-accent/10 hover:bg-accent/15
                    text-[var(--color-secondary)] transition
                    peer-checked:bg-primary peer-checked:text-[#2C140C] peer-checked:border-accent
                    peer-checked:ring-2 peer-checked:ring-[var(--color-highlight)]
                  "
                >
                  {s}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1 text-accent">Sexo</p>
        <div className="flex flex-wrap gap-2">
          {sexOptions.map((s) => {
            const id = `sex-${s}`;
            const checked = filters.sex.includes(s);
            return (
              <div key={s} className="inline-block">
                <input
                  id={id}
                  type="checkbox"
                  className="peer sr-only"
                  checked={checked}
                  onChange={() => toggleFilter("sex", s)}
                />
                <label
                  htmlFor={id}
                  className="
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer select-none
                    border border-accent/40 bg-accent/10 hover:bg-accent/15
                    text-[var(--color-secondary)] transition
                    peer-checked:bg-primary peer-checked:text-[#2C140C] peer-checked:border-accent
                    peer-checked:ring-2 peer-checked:ring-[var(--color-highlight)]
                  "
                >
                  {s}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1 text-accent">Temperamento</p>
        <div className="flex flex-wrap gap-2">
          {temperamentOptions.map((t) => {
            const id = `temp-${t}`;
            const checked = filters.temperament.includes(t);
            return (
              <div key={t} className="inline-block">
                <input
                  id={id}
                  type="checkbox"
                  className="peer sr-only"
                  checked={checked}
                  onChange={() => toggleFilter("temperament", t)}
                />
                <label
                  htmlFor={id}
                  className="
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer select-none
                    border border-accent/40 bg-accent/10 hover:bg-accent/15
                    text-[var(--color-secondary)] transition
                    peer-checked:bg-primary peer-checked:text-[#2C140C] peer-checked:border-accent
                    peer-checked:ring-2 peer-checked:ring-[var(--color-highlight)]
                  "
                >
                  {t}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1 text-accent">Idade</p>
        <div className="flex flex-col gap-1 text-sm">
          {ageOptions.map((opt) => {
            const id = `age-${opt.min}-${opt.max}`;
            const checked =
              filters.ageRange?.min === opt.min &&
              filters.ageRange?.max === opt.max;
            return (
              <label key={id} htmlFor={id} className="flex items-center gap-2">
                <input
                  id={id}
                  type="radio"
                  name="ageRange"
                  className="h-4 w-4 accent-[var(--color-highlight)]"
                  checked={checked}
                  onChange={() => toggleFilter("ageRange", { min: opt.min, max: opt.max })}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}

          <label className="flex items-center gap-2 mt-1">
            <input
              type="radio"
              name="ageRange"
              className="h-4 w-4 accent-[var(--color-highlight)]"
              checked={filters.ageRange === null}
              onChange={() => toggleFilter("ageRange", null)}
            />
            <span>Qualquer idade</span>
          </label>
        </div>
      </div>

      <button
        type="button"
        className="w-full bg-highlight text-white px-4 py-2 rounded-lg font-semibold shadow hover:opacity-90 transition"
      >
        Aplicar filtros
      </button>
    </aside>
  );
}
