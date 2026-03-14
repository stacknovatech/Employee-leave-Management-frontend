
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Calendar,
  Users,
  ClipboardList,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const employeeLinks = [
  { to: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employee/apply-leave", label: "Apply Leave", icon: PlusCircle },
  { to: "/employee/my-leaves", label: "My Leaves", icon: FileText },
  { to: "/employee/calendar", label: "Calendar", icon: Calendar },
];

const managerLinks = [
  { to: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/manager/requests", label: "Team Requests", icon: ClipboardList },
  { to: "/manager/calendar", label: "Calendar", icon: Calendar },
];

function Sidebar({ isOpen, onClose }) {
  const { isManager } = useAuth();
  const links = isManager ? managerLinks : employeeLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 border-r border-[var(--border-main)] bg-[var(--bg-card)] transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <span className="font-semibold text-[var(--text-primary)]">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {links.map((link) => {
            const IconComponent = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  )
                }
              >
                <IconComponent className="h-4 w-4 shrink-0" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-4">
          <div className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-hover)] p-3 text-center">
            <p className="text-xs text-[var(--text-secondary)]">Logged in as</p>
            <p className="text-sm font-semibold text-brand-400 capitalize mt-0.5">
              {isManager ? "Manager" : "Employee"}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
