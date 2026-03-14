

import { cn } from "@/lib/utils";

/**
 * @param {string} title - Card heading (e.g. "Leave Balance")
 * @param {string|number} value - Main number to display
 * @param {string} subtitle - Small description text
 * @param {React.Component} icon - Lucide icon component
 * @param {string} iconColor - Tailwind text color class for icon
 * @param {string} className - Extra classes
 */
function DashboardCard({ title, value, subtitle, icon: Icon, iconColor = "text-brand-400", className }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] p-5 transition-all duration-300 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5",
        className
      )}
    >
      {/* Subtle gradient glow on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          {subtitle && (
            <p className="text-xs text-[var(--text-secondary)] mt-1">{subtitle}</p>
          )}
        </div>

        {/* Icon container */}
        {Icon && (
          <div className={cn("p-2.5 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-main)]", iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCard;
