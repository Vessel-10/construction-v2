interface SidebarGroupProps {
  title: string;
  children: React.ReactNode;
  collapsed?: boolean;
}

export default function SidebarGroup({
  title,
  children,
  collapsed = false,
}: SidebarGroupProps) {
  return (
    <div className="mt-6">
      {!collapsed && (
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          {title}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}