"use server";

import { signIn } from "../../../auth";
import { redirect } from "next/navigation";
import { loginSchema } from "@/schemas/user";

export type LoginState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<"email" | "password", string[]>>;
};

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return { ok: false, fieldErrors, message: "Verifique os campos." };
  }

  const data = {
    email: parsed.data.email.toLowerCase(),
    password: parsed.data.password,
  };

  try {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      return {
        ok: false,
        fieldErrors: {
          email: ["E-mail ou senha inválidos."],
          password: ["E-mail ou senha inválidos."],
        },
        message: "Não foi possível entrar.",
      };
    }

  
  } catch {
    return { ok: false, message: "Erro ao autenticar. Tente novamente." };
  }  
  
  redirect("/");
}
