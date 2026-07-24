"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { serviceSchema } from "@/lib/validations/service";

interface Category {
  id: string;
  name: string;
}

interface ServiceFormProps {
  mode: "create" | "edit";
  serviceId?: string;
  initialValues?: {
    title: string;
    slug: string;
    description: string;
    image: string;
    price: string;
    categoryId: string;
  };
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  image: "",
  price: "",
  categoryId: "",
};

export default function ServiceForm({ mode, serviceId, initialValues }: ServiceFormProps) {
  const router = useRouter();

  const [form, setForm] = useState(initialValues || emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrors((prev) => ({ ...prev, image: "" }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        setErrors((prev) => ({ ...prev, image: data.message || "Upload failed." }));
        return;
      }

      setForm((prev) => ({ ...prev, image: data.url }));
    } catch {
      setErrors((prev) => ({ ...prev, image: "Upload failed. Please try again." }));
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function generateSlug() {
    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setForm({ ...form, slug });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerMessage("");

    const result = serviceSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("loading");

    try {
      const url = mode === "create" ? "/api/admin/services" : `/api/admin/services/${serviceId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setStatus("error");
        setServerMessage(data.message || "Something went wrong.");
        return;
      }

      router.push("/dashboard/services");
      router.refresh();
    } catch {
      setStatus("error");
      setServerMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          onBlur={() => !form.slug && generateSlug()}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring"
        />
        {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="block text-sm font-medium text-muted-foreground">Slug</label>
          <button type="button" onClick={generateSlug} className="text-xs text-primary hover:underline">
            Generate from title
          </button>
        </div>
        <input
          type="text"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="kitchen-renovation"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring"
        />
        {errors.slug && <p className="mt-1 text-xs text-destructive">{errors.slug}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Category</label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="mt-1 text-xs text-destructive">{errors.categoryId}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring"
        />
        {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Image (optional)</label>

        {form.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.image}
            alt="Preview"
            className="mb-3 h-32 w-full rounded-lg border border-border object-cover"
          />
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageUpload}
          disabled={uploading}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
        />
        {uploading && <p className="mt-1 text-xs text-muted-foreground">Uploading...</p>}
        {errors.image && <p className="mt-1 text-xs text-destructive">{errors.image}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Price (optional)</label>
        <input
          type="text"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Starting from MK 2,500,000"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring"
        />
        {errors.price && <p className="mt-1 text-xs text-destructive">{errors.price}</p>}
      </div>

      {status === "error" && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverMessage}
        </div>
      )}

      <Button type="submit" disabled={status === "loading"} className="h-12 w-full text-base">
        {status === "loading" ? "Saving..." : mode === "create" ? "Create Service" : "Save Changes"}
      </Button>
    </form>
  );
}