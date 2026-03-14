// =============================================
// Button Component (shadcn-style)
// Reusable button with multiple variants
// =============================================

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// all button styles defined here - easy to customize later
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-brand-500 text-white hover:bg-brand-600 shadow-sm",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline:
          "border border-[var(--border-main)] bg-transparent hover:bg-[var(--bg-hover)] text-[var(--text-primary)]",
        secondary:
          "bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)]",
        ghost: "hover:bg-[var(--bg-hover)] text-[var(--text-primary)]",
        link: "text-brand-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// asChild lets you pass a custom element (like Link) as the button
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
