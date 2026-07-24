import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().trim().min(2, "Name is required.").max(150),
    slug: z
        .string()
        .trim()
        .min(2, "Slug is required.")
        .max(150)
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    description: z.string().trim().max(500).optional().or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;