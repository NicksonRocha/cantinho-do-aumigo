import { z } from "zod";

export const petSizes = ["pequeno", "medio", "grande"] as const;
export const petSexes = ["M", "F"] as const;

const enumField = <T extends readonly [string, ...string[]]>(
  values: T,
  message: string
) =>
  z.custom<T[number]>(
    (v) => typeof v === "string" && (values as readonly string[]).includes(v),
    { message }
  );

const phoneBr = z
  .string()
  .min(10, "Telefone obrigatório")
  .max(20, "Telefone muito longo")
  .transform((s) => s.replace(/\D/g, ""))
  .refine((d) => d.length >= 10 && d.length <= 13, {
    message: "Telefone inválido",
  });

const toOptionalNumber = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : Number(v);

export const createPetSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  breed: z.string().min(2, "Raça obrigatória"),
  color: z.string().min(2, "Cor obrigatória"),

  size: enumField(petSizes, "Selecione o porte"),
  sex: enumField(petSexes, "Selecione o sexo"),

  ageMonths: z.coerce.number().int().min(0, "Idade inválida"),

  weightKg: z
    .preprocess(toOptionalNumber, z.number().positive("Peso deve ser maior que 0").max(120, "Peso muito alto"))
    .optional(),

  description: z
    .string()
    .min(10, "Conte a história/descrição com pelo menos 10 caracteres"),

  imageUrl: z
    .string()
    .url("Informe uma URL válida de imagem")
    .or(z.literal("").transform(() => undefined))
    .optional(),

  imagePublicIds: z
    .array(z.string().min(1, "ID da imagem inválido"))
    .max(4, "Máximo de 4 imagens")
    .optional(),

  vaccinated: z.coerce.boolean().optional().default(false),
  neutered: z.coerce.boolean().optional().default(false),
  dewormed: z.coerce.boolean().optional().default(false),

  temperament: z
    .string()
    .max(120, "Máximo de 120 caracteres")
    .optional()
    .transform((v) => (v?.trim() ? v : undefined)),

  contactPhone: phoneBr,
});

export type CreatePetInput = z.infer<typeof createPetSchema>;
