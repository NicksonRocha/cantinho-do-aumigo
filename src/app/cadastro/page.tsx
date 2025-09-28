"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { cadastrar, type CadastroState } from "./actions";
import { cadastroSchema } from "@/schemas/user";

const initialState: CadastroState = { ok: false };

export default function CadastroPage() {
  const [state, formAction] = useFormState(cadastrar, initialState);
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    // 1) Validação no cliente com Zod
    const parsed = cadastroSchema.safeParse({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });

    if (!parsed.success) {
      setClientErrors(parsed.error.flatten().fieldErrors);
      return; // bloqueia envio ao servidor
    }

    setClientErrors({});
    setSubmitting(true);

    try {
      // 2) Se passou no cliente, envia para a Server Action
      await formAction(formData);
      // Obs.: se o servidor redirecionar, a página muda.
      // Se ele retornar erros, `state` será atualizado.
    } finally {
      setSubmitting(false);
    }
  }

  const getError = (field: string) =>
    clientErrors?.[field]?.[0] ?? state.fieldErrors?.[field as keyof CadastroState["fieldErrors"]]?.[0];

  return (
    <main className="flex items-center justify-center px-6">
      <section className="w-full max-w-md bg-white text-black rounded-xl shadow p-6 mt-[20px] border-t-4 border-[var(--color-primary)]">
        <h1 className="text-2xl font-semibold text-center mb-6">Cadastre-se</h1>

        <form
          action={handleSubmit}
          className="space-y-4"
          noValidate
        >
          <div>
            <label htmlFor="name" className="block text-sm mb-1">Nome completo</label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
              placeholder="Seu nome"
              required
              minLength={2}
              aria-invalid={!!getError("name")}
              autoComplete="name"
            />
            {getError("name") && <p className="text-red-600 text-xs mt-1">{getError("name")}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-1">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
              placeholder="seuemail@exemplo.com"
              required
              aria-invalid={!!getError("email")}
              autoComplete="email"
              inputMode="email"
            />
            {getError("email") && <p className="text-red-600 text-xs mt-1">{getError("email")}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
              placeholder="••••••••"
              required
              minLength={6}
              aria-invalid={!!getError("password")}
              autoComplete="new-password"
            />
            {getError("password") && <p className="text-red-600 text-xs mt-1">{getError("password")}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm mb-1">Confirmar senha</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
              placeholder="••••••••"
              required
              aria-invalid={!!getError("confirmPassword")}
              autoComplete="new-password"
            />
            {getError("confirmPassword") && <p className="text-red-600 text-xs mt-1">{getError("confirmPassword")}</p>}
          </div>

          {state.message && <p className="text-sm text-center text-red-600">{state.message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 rounded-md px-4 py-2 bg-[var(--color-highlight)] text-white hover:opacity-90 transition cursor-pointer disabled:opacity-60"
          >
            {submitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Já tem conta? <a href="/entrar" className="text-[var(--color-highlight)] underline">Entrar</a>
        </p>
      </section>
    </main>
  );
}
