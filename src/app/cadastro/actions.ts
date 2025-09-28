"use server";

import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";
import { signIn } from "../../../auth";
import { redirect } from "next/navigation";
import { cadastroSchema } from "@/schemas/user";

export type CadastroState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<"name"|"email"|"password"|"confirmPassword", string[]>>;
};

export async function cadastrar(_: CadastroState, formData: FormData): Promise<CadastroState> {
  const parsed = cadastroSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return { ok: false, fieldErrors, message: "Verifique os campos." };
  }

  const data = {
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    password: parsed.data.password,
  };

  try {
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) {
      return { ok: false, fieldErrors: { email: ["E-mail já cadastrado."] } };
    }

    const hash = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: { name: data.name, email: data.email, password: hash },
    });

    await signIn("credentials", { redirect: false, email: data.email, password: data.password });
    
  } catch {
    return { ok: false, message: "Erro ao cadastrar. Tente novamente." };
  }
   redirect("/");
}
