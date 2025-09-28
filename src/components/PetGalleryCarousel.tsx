"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

export default function PetGalleryCarousel({ images, alt }: Props) {
  const [active, setActive] = useState<number>(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const handler = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setActive(i);
    };

    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  function goTo(index: number) {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  }

  if (images.length === 0) {
    return (
      <div className="relative w-full aspect-[4/5] bg-[var(--color-neutral)] grid place-items-center rounded-xl border">
        <span className="text-accent/60">Sem fotos</span>
      </div>
    );
  }

  return (
    // Wrapper relativo para ancorar setas
    <div className="relative w-full">
      {/* faixa principal (rolável) */}
      <div
  ref={trackRef}
  className="relative mx-auto w-full max-w-[320px] aspect-[4/5] overflow-x-auto no-scrollbar snap-x snap-mandatory flex rounded-xl border"
  style={{ scrollBehavior: "smooth" }}
>
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="min-w-full h-full relative snap-center snap-always">
            <Image
              src={src}
              alt={`${alt} - foto ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* setas FIXAS (fora do container rolável) */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-black rounded-full px-3 py-1.5 shadow"
            aria-label="Imagem anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-black rounded-full px-3 py-1.5 shadow"
            aria-label="Próxima imagem"
          >
            ›
          </button>
        </>
      )}

      {/* indicadores */}
      {images.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir para imagem ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === active ? "bg-[var(--color-highlight)]" : "bg-accent/40 hover:bg-accent"
              }`}
            />
          ))}
        </div>
      )}

      {/* thumbs */}
      {images.length > 1 && (
        <div className="mt-3 hidden md:flex justify-center gap-2">
          {images.map((src, i) => (
            <button
              key={`${src}-thumb-${i}`}
              type="button"
              onClick={() => goTo(i)}
              className={`relative h-16 w-24 rounded-lg overflow-hidden border ${
                i === active ? "ring-2 ring-[var(--color-highlight)]" : "border-accent/50"
              }`}
              aria-label={`Selecionar imagem ${i + 1}`}
            >
              <Image src={src} alt={`${alt} thumb ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
