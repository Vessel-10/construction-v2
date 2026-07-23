"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  collapsed?: boolean;
}

export default function LogoutButton({ collapsed = false }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      title={collapsed ? "Logout" : undefined}
      className="flex w-full items-center gap-3 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
    >
      <LogOut size={18} className="shrink-0" />
      {!collapsed && <span>{loading ? "Logging out..." : "Logout"}</span>}
    </button>
  );
}