import { z } from "zod";
import prisma from "../../../core/impl/prisma.model";

// Fonction pour vérifier si le nom d'utilisateur est unique
export const verifiUsername = async (value: string) => {
  const count = await prisma.user.count({
    where: { username: value },
  });
  return count < 1;
};

export const userPostSchema = z.object({
  username: z.string({
    required_error: "Le nom d'utilisateur est obligatoire",
  })
  .min(1, "Le nom d'utilisateur ne peut pas être vide")
  .refine(verifiUsername, "Le nom d'utilisateur existe déjà"),

  password: z.string({
    required_error: "Le mot de passe est obligatoire",
  })
  .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});
