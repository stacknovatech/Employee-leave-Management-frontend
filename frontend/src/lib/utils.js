
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and resolves Tailwind conflicts.
 * Example: cn("px-4 py-2", isActive && "bg-brand-500")
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
