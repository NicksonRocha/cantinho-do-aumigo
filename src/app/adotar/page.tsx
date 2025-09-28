
"use client";
import { useFormState } from "react-dom";
import { createPet, type CreatePetState } from "./action";
import { petSizes, petSexes } from "@/schemas/pet";
import { useEffect, useState } from "react";

type Preview = { file?: File; previewUrl: string; publicId?: string };

const initialState: CreatePetState = { ok: false };

export default function NewAdoptionPostPage() {
  const [state, formAction] = useFormState(createPet, initialState);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [previews, setPreviews] = useState<Preview[]>([]);

  useEffect(() => {
    return () =>
      previews.forEach((p) => {
        if (p.previewUrl.startsWith("blob:")) URL.revokeObjectURL(p.previewUrl);
      });
  }, [previews]);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const selected = files.slice(0, 4);
    const locals = selected.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPreviews(locals);

    const fd = new FormData();
    selected.forEach((f) => fd.append("file", f));
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();

    const arr =
      Array.isArray(data?.files)
        ? data.files
        : data?.public_id
        ? [{ public_id: data.public_id, secure_url: data.secure_url }]
        : [];

    if (!arr.length) {
      alert(data.error ?? "Erro ao enviar imagem");
      return;
    }

    setPreviews((prev) =>
      prev.map((p, i) => ({
        ...p,
        previewUrl: arr[i]?.secure_url ?? p.previewUrl,
        publicId: arr[i]?.public_id,
      }))
    );

    setImageUrl(arr[0]?.secure_url ?? "");
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    if (imageUrl) formData.set("imageUrl", imageUrl);
    const result = await formAction(formData);
    setSubmitting(false);
    return result;
  }

  const fe = state.errors ?? {};

  return (
    <main className="min-h-screen bg-neutral px-4 py-8 flex justify-center">
      <section className="w-full max-w-2xl bg-white text-black rounded-xl shadow p-6 border-t-4 border-[var(--color-primary)]">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Cadastrar pet para adoção
        </h1>

        {state.ok && (
          <div className="mb-4 rounded-md border border-green-300 bg-green-50 p-3 text-green-800">
            {state.message ?? "Cadastro realizado!"}
          </div>
        )}
        {state.message && !state.ok && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-red-800">
            {state.message}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">

          <div>
            <label htmlFor="name" className="block text-sm mb-1">Nome do pet</label>
            <input id="name" name="name" type="text" className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight" placeholder="Ex.: Thor" required />
            {fe.name?.length ? <p className="text-sm text-red-600 mt-1">{fe.name[0]}</p> : null}
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm mb-1">
              WhatsApp para contato (obrigatório)
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              inputMode="tel"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
              placeholder="(DDD) 9 9999-9999 ou +55 82 9 9999-9999"
              required
            />
            {fe.contactPhone?.length ? (
              <p className="text-sm text-red-600 mt-1">{fe.contactPhone[0]}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Dica: pode incluir +55. Vamos limpar os caracteres e salvar só os dígitos.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="weightKg" className="block text-sm mb-1">Peso (kg)</label>
            <input id="weightKg" name="weightKg" type="number" step="0.1" min={0} className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight" placeholder="Ex.: 8.5" />
            {fe.weightKg?.length ? <p className="text-sm text-red-600 mt-1">{fe.weightKg[0]}</p> : null}
          </div>

          <div>
            <label htmlFor="breed" className="block text-sm mb-1">Raça</label>
            <input id="breed" name="breed" type="text" className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight" placeholder="Ex.: SRD, Poodle, Labrador…" required />
            {fe.breed?.length ? <p className="text-sm text-red-600 mt-1">{fe.breed[0]}</p> : null}
          </div>

          <div>
            <label htmlFor="size" className="block text-sm mb-1">Porte</label>
            <select id="size" name="size" className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight bg-white" required defaultValue="">
              <option value="" disabled>Selecione o porte</option>
              {petSizes.map((s) => (
                <option key={s} value={s}>
                  {s === "pequeno" ? "Pequeno" : s === "medio" ? "Médio" : "Grande"}
                </option>
              ))}
            </select>
            {fe.size?.length ? <p className="text-sm text-red-600 mt-1">{fe.size[0]}</p> : null}
          </div>

          <div>
            <label htmlFor="color" className="block text-sm mb-1">Cor</label>
            <input id="color" name="color" type="text" className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight" placeholder="Ex.: Caramelo, Branco e preto…" required />
            {fe.color?.length ? <p className="text-sm text-red-600 mt-1">{fe.color[0]}</p> : null}
          </div>

          <div>
            <span className="block text-sm mb-1">Sexo</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="sex" value={petSexes[0]} required /> Macho
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="sex" value={petSexes[1]} /> Fêmea
              </label>
            </div>
            {fe.sex?.length ? <p className="text-sm text-red-600 mt-1">{fe.sex[0]}</p> : null}
          </div>

          <div>
            <label htmlFor="ageMonths" className="block text-sm mb-1">Idade (em meses)</label>
            <input id="ageMonths" name="ageMonths" type="number" min={0} className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight" placeholder="Ex.: 10" required />
            {fe.ageMonths?.length ? <p className="text-sm text-red-600 mt-1">{fe.ageMonths[0]}</p> : null}
          </div>

          <div>
            <label htmlFor="temperament" className="block text-sm mb-1">Temperamento</label>
            <input id="temperament" name="temperament" type="text" className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight" placeholder="Ex.: dócil, brincalhão, calmo…" />
            {fe.temperament?.length ? <p className="text-sm text-red-600 mt-1">{fe.temperament[0]}</p> : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="vaccinated" /> Vacinado
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="neutered" /> Castrado
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="dewormed" /> Vermifugado
            </label>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm mb-1">Descrição / História</label>
            <textarea id="description" name="description" className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight min-h-28" placeholder="Conte um pouco sobre o pet…" required />
            {fe.description?.length ? <p className="text-sm text-red-600 mt-1">{fe.description[0]}</p> : null}
          </div>

          <div>
            <label className="block text-sm mb-1">Fotos do pet (até 4)</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full border rounded-md px-3 py-2" />
            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {previews.map((p, idx) => (
                  <div key={idx} className="relative">
                    <img src={p.previewUrl} alt={`Pré-visualização ${idx + 1}`} className="h-28 w-full object-cover rounded-md border" />
                    {!p.publicId && (
                      <span className="absolute bottom-1 left-1 text-[10px] bg-white/90 px-1 rounded">Enviando…</span>
                    )}
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 text-[10px] bg-white/90 px-1 rounded border">Capa</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <input type="hidden" name="imageUrl" value={imageUrl} />
            {previews.filter((p) => p.publicId).map((p, i) => (
              <input key={i} type="hidden" name="imagePublicIds[]" value={p.publicId!} />
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <a href="/adopt" className="px-4 py-2 rounded-md border hover:bg-gray-50 transition">Voltar</a>
            <button disabled={submitting} className="bg-[var(--color-highlight)] text-white px-5 py-2 rounded-md hover:opacity-90 transition disabled:opacity-60">
              {submitting ? "Cadastrando..." : "Cadastrar pet"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
