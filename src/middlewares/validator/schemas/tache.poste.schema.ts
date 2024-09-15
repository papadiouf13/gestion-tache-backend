import { z } from "zod";

export const tachePostSchema = z.object({
  libelle: z.string({
    required_error: "Le libelle est obligatoire",
  }).min(1, "Le libelle ne peut pas être vide"),

  statut: z.string({
    required_error: "Le statut est obligatoire",
  }).min(1, "Le statut ne peut pas être vide"),

  etat: z.boolean({
    required_error: "L'état est obligatoire",
  }),
});
