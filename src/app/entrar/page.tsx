"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { login, type LoginState } from "./actions";
import { loginSchema } from "@/schemas/user";


const initialState: LoginState = { ok: false };

type FieldName = "email" | "password";

export default function EntrarPage() {
  const [state, formAction] = useFormState(login, initialState);
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const getError = (field: FieldName) =>
    clientErrors?.[field]?.[0] ?? state.fieldErrors?.[field]?.[0];

  async function handleSubmit(formData: FormData) {

    const parsed = loginSchema.safeParse({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    if (!parsed.success) {
      setClientErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setClientErrors({});
    setSubmitting(true);
    try {
      await formAction(formData);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex items-center justify-center px-6">
      <section className="w-full max-w-md bg-white text-black rounded-xl shadow p-6 mt-[20px] border-t-4 border-[var(--color-primary)]">
        <h1 className="text-2xl font-semibold text-center mb-6">Entrar</h1>

        <form action={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              E-mail
            </label>
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
            {getError("email") && (
              <p className="text-red-600 text-xs mt-1">{getError("email")}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
              placeholder="••••••••"
              required
              aria-invalid={!!getError("password")}
              autoComplete="current-password"
            />
            {getError("password") && (
              <p className="text-red-600 text-xs mt-1">{getError("password")}</p>
            )}
          </div>

          {state.message && (
            <p className="text-sm text-center text-red-600">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 rounded-md px-4 py-2 bg-[var(--color-highlight)] text-white hover:opacity-90 transition cursor-pointer disabled:opacity-60"
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Não tem conta?{" "}
          <a href="/cadastro" className="text-[var(--color-highlight)] underline">
            Cadastre-se
          </a>
        </p>
      </section>
    </main>
  );
}
