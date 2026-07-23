import LoginForm from "@/components/auth/LoginForm";
import { siteConfig } from "@/lib/constants/site";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center sm:mb-8">
          {siteConfig.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={siteConfig.logoUrl}
              alt={siteConfig.companyName}
              className="mx-auto mb-4 h-12 w-auto object-contain"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-lg font-bold text-primary">
              {siteConfig.companyName
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
          )}

          <p className="text-sm font-medium text-muted-foreground">
            {siteConfig.companyName}
          </p>
          <h1 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
            Welcome back
          </h1>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}