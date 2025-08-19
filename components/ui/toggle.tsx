"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

// Custom Switch-style Toggle for the VISA dashboard
const SwitchToggle = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentPropsWithoutRef<"input">, "onChange"> & {
    label?: string
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
  }
>(({ className, label, checked, onCheckedChange, ...props }, ref) => (
  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
    <input
      type="checkbox"
      className="peer hidden"
      ref={ref}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
    <span className="w-10 h-6 rounded-full transition-all duration-200 bg-slate-300 border border-slate-400 relative after:content-[''] after:absolute after:top-1/2 after:left-0.5 after:-translate-y-1/2 after:w-5 after:h-5 after:bg-background after:border after:border-slate-300 after:rounded-full after:transition-all after:duration-200 after:shadow-sm peer-checked:bg-primary peer-checked:border-primary peer-checked:after:translate-x-4 peer-checked:after:border-primary/20 peer-checked:after:shadow-md hover:bg-slate-400 hover:border-slate-500 peer-checked:hover:bg-primary/90 dark:bg-slate-600 dark:border-slate-500 dark:after:bg-background dark:hover:bg-slate-500 dark:hover:border-slate-400" />
    {label && <span className="text-sm text-foreground whitespace-nowrap">{label}</span>}
  </label>
))

SwitchToggle.displayName = "SwitchToggle"

export { Toggle, toggleVariants, SwitchToggle }
