"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Login failed.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-muted-foreground">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-muted-foreground">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </div>

      <Button type="submit" disabled={loading} className="h-12 w-full text-base">
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}