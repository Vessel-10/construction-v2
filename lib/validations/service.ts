import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(150),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(150)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().trim().min(10, "Description is too short.").max(2000),
  image: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || val.startsWith("/") || /^https?:\/\//.test(val),
      "Must be a valid image path or URL."
    )
    .optional()
    .or(z.literal("")),
  price: z.string().trim().max(100).optional().or(z.literal("")),
  categoryId: z.string().trim().min(1, "Please select a category."),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;