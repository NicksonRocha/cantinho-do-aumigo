import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPetById } from "@/actions/getPetById";
import PetGalleryCarousel from "@/components/PetGalleryCarousel";
import ShareButton from "@/components/ShareButton";
import { formatAge } from "@/utils/formatAge";

type PageProps = { params: { id: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pet = await getPetById(Number(params.id));
  return {
    title: pet ? `${pet?.name} | Cantinho do AUmigo` : "Pet | Cantinho do AUmigo",
    description: pet?.description ?? (pet?.name ? `Perfil do pet ${pet.name}` : "Perfil do pet"),
  };
}

export default async function PetPage({ params }: PageProps) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const pet = await getPetById(id);
  if (!pet) notFound();

 // Botão WhatsApp
  const waMsg = `Olá! Tenho interesse em adotar o(a) ${pet.name}.`;
  const waLink = pet.contactPhone
    ? `https://wa.me/55${pet.contactPhone}?text=${encodeURIComponent(waMsg)}`
    : null;


  return (
    <main className="min-h-[calc(100vh-64px)] bg-neutral px-4 md:px-6 py-6">
      {/* CAIXA principal: galeria + características */}
      <div className="mx-auto max-w-5xl bg-white rounded-2xl shadow-sm border border-accent overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-4 md:p-6">
          {/* Galeria à esquerda */}
          <PetGalleryCarousel images={pet.images} alt={pet.name} />

          {/* Características à direita */}
          <section className="flex flex-col">
            <header className="mb-3">
              <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-secondary)]">
                {pet.name}
              </h1>
              <p className="text-sm text-[color:rgba(0,0,0,.55)]">
                Raça: <span className="font-medium text-[color:rgba(0,0,0,.75)]">{pet.breed}</span>
              </p>
              <p className="text-sm text-[color:rgba(0,0,0,.55)]">
                Idade:{" "}
                <span className="font-medium text-[color:rgba(0,0,0,.75)]">
                  {formatAge(pet.ageMonths)}
                </span>
              </p>
            </header>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6">
              {pet.size && (
                <>
                  <dt className="text-[color:rgba(0,0,0,.55)]">Porte</dt>
                  <dd className="text-[color:rgba(0,0,0,.85)] capitalize">{pet.size}</dd>
                </>
              )}
              {pet.sex && (
                <>
                  <dt className="text-[color:rgba(0,0,0,.55)]">Sexo</dt>
                  <dd className="text-[color:rgba(0,0,0,.85)]">{pet.sex}</dd>
                </>
              )}
              {pet.color && (
                <>
                  <dt className="text-[color:rgba(0,0,0,.55)]">Cor</dt>
                  <dd className="text-[color:rgba(0,0,0,.85)]">{pet.color}</dd>
                </>
              )}
              {typeof pet.weightKg === "number" && (
                <>
                  <dt className="text-[color:rgba(0,0,0,.55)]">Peso</dt>
                  <dd className="text-[color:rgba(0,0,0,.85)]">{pet.weightKg.toFixed(1)} kg</dd>
                </>
              )}
              {pet.temperament && (
                <>
                  <dt className="text-[color:rgba(0,0,0,.55)]">Temperamento</dt>
                  <dd className="text-[color:rgba(0,0,0,.85)] capitalize">{pet.temperament}</dd>
                </>
              )}
            </dl>

            <div className="mt-auto flex flex-wrap items-center gap-3">
                {waLink ? (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[var(--color-highlight)] text-[#2C140C] font-medium hover:opacity-90 transition"
                  >
                    Quero adotar 🐾
                  </a>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gray-300 text-gray-600 font-medium cursor-not-allowed"
                    title="Contato indisponível"
                  >
                    Contato indisponível
                  </button>
                )}

              <ShareButton
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-accent hover:bg-accent/10 transition text-[var(--color-secondary)]"
                label="Compartilhar"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Descrição FORA da caixinha */}
      {pet.description && (
        <section className="mx-auto max-w-5xl mt-4 px-1">
          <h2 className="sr-only">Descrição</h2>
          <p className="text-[color:rgba(0,0,0,.85)] leading-relaxed">
            {pet.description}
          </p>
        </section>
      )}
    </main>
  );
}
