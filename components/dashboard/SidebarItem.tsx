"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  collapsed?: boolean;
}

export default function SidebarItem({
  label,
  href,
  icon: Icon,
  collapsed = false,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`group flex items-center gap-3 rounded-md border-l-4 px-3 py-2 text-sm transition ${
        isActive
          ? "border-primary bg-primary/10 text-primary"
          : "border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground"
      }`}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}