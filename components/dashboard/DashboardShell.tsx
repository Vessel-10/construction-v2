"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      <div className="flex-1 bg-background">
        <div className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-foreground"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="font-semibold text-foreground">Construction CMS</span>
        </div>

        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}