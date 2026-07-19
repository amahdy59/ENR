import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "press-scale group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-interactive-focus-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform hover:[&_svg]:scale-110",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--color-interactive-primary)] text-white shadow-sm hover:bg-[color:var(--color-interactive-primary-hover)] hover:shadow-md",
        cta: "cta-glow bg-[color:var(--color-interactive-cta)] text-[color:var(--color-interactive-cta-text)] shadow-sm hover:brightness-95",
        destructive:
          "bg-[color:var(--color-status-error-vivid)] text-white shadow-sm hover:brightness-95 hover:shadow-md",
        outline:
          "border border-[color:var(--color-border-brand)] bg-transparent text-[color:var(--color-text-brand)] hover:border-[color:var(--color-border-accent)] hover:bg-[color:var(--color-brand-primary-tint)]",
        secondary:
          "bg-[color:var(--color-brand-primary-tint)] text-[color:var(--color-text-brand)] hover:brightness-95 hover:shadow-sm",
        ghost:
          "text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-background-muted)]",
        link: "link-underline text-[color:var(--color-text-brand)] underline-offset-4",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
