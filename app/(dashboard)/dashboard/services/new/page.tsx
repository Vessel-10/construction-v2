import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ServiceForm from "@/components/dashboard/ServiceForm";

export default function NewServicePage() {
  return (
    <div>
      <Link
        href="/dashboard/services"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Services
      </Link>
      <h1 className="mb-6 text-xl font-bold text-foreground">New Service</h1>
      <div className="max-w-xl">
        <ServiceForm mode="create" />
      </div>
    </div>
  );
}