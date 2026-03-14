// =============================================
// Select / Dropdown Component (simple version)
// Uses native <select> styled to match theme
// Simpler than Radix Select for form usage
// =============================================

import * as React from "react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-[var(--border-main)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors appearance-none cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

export { Select };
