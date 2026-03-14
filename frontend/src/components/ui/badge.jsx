// =============================================
// Badge Component (shadcn-style)
// Used for status labels like "Approved", "Pending", "Rejected"
// =============================================

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-500/10 text-brand-400",
        success: "border-transparent bg-emerald-500/10 text-emerald-400",
        warning: "border-transparent bg-amber-500/10 text-amber-400",
        destructive: "border-transparent bg-red-500/10 text-red-400",
        outline: "border-[var(--border-main)] text-[var(--text-secondary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
