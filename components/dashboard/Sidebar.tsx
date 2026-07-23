"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Wrench,
  FolderKanban,
  Users,
  Mail,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import SidebarGroup from "./SidebarGroup";
import LogoutButton from "./LogoutButton";

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRole(data.role);
      })
      .catch(() => {});
  }, []);

  const isAdmin = role === "ADMIN";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex min-h-screen flex-col border-r border-sidebar-border bg-sidebar p-5 transition-all duration-200 lg:static lg:z-auto ${
        collapsed ? "lg:w-20" : "lg:w-64"
      } w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <button
        onClick={onCloseMobile}
        className="absolute right-4 top-4 text-muted-foreground lg:hidden"
      >
        <X size={20} />
      </button>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 hidden h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-muted-foreground transition hover:text-primary lg:flex"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <h2
        className={`font-bold text-sidebar-foreground transition-all ${
          collapsed ? "lg:text-center lg:text-sm" : "text-xl"
        }`}
      >
        {collapsed ? <span className="hidden lg:inline">CC</span> : null}
        <span className={collapsed ? "lg:hidden" : ""}>Construction CMS</span>
      </h2>

      <SidebarGroup title="Main" collapsed={collapsed}>
        <SidebarItem label="Dashboard" href="/dashboard" icon={LayoutDashboard} collapsed={collapsed} />
      </SidebarGroup>

      <SidebarGroup title="Content" collapsed={collapsed}>
        <SidebarItem label="Services" href="/dashboard/services" icon={Wrench} collapsed={collapsed} />
        <SidebarItem label="Projects" href="/dashboard/projects" icon={FolderKanban} collapsed={collapsed} />
        <SidebarItem label="Team" href="/dashboard/team" icon={Users} collapsed={collapsed} />
      </SidebarGroup>

      <SidebarGroup title="Communication" collapsed={collapsed}>
        <SidebarItem label="Messages" href="/dashboard/messages" icon={Mail} collapsed={collapsed} />
        <SidebarItem label="Quotes" href="/dashboard/quotes" icon={FileText} collapsed={collapsed} />
      </SidebarGroup>

      {isAdmin && (
        <SidebarGroup title="System" collapsed={collapsed}>
          <SidebarItem label="Settings" href="/dashboard/settings" icon={Settings} collapsed={collapsed} />
        </SidebarGroup>
      )}

      <div className="mt-auto border-t border-sidebar-border pt-4">
        <LogoutButton collapsed={collapsed} />
      </div>
    </aside>
  );
}