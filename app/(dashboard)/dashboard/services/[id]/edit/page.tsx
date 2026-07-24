import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ServiceForm from "@/components/dashboard/ServiceForm";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/dashboard/services"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Services
      </Link>
      <h1 className="mb-6 text-xl font-bold text-foreground">Edit Service</h1>
      <div className="max-w-xl">
        <ServiceForm
          mode="edit"
          serviceId={service.id}
          initialValues={{
            title: service.title,
            slug: service.slug,
            description: service.description,
            image: service.image || "",
            price: service.price || "",
            categoryId: service.categoryId,
          }}
        />
      </div>
    </div>
  );
}