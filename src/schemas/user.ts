import { z } from "zod";

export const cadastroSchema = z.object({
  name: z.string().trim().min(2, "Informe pelo menos 2 caracteres."),
  email: z.string().trim().email("E-mail inválido."),
  password: z.string().min(6, "Mínimo de 6 caracteres."),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  path: ["confirmPassword"],
  message: "As senhas não conferem.",
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe sua senha."),
});

export type CadastroInput = z.infer<typeof cadastroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
