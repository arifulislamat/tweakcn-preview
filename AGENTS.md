---
description: "Use when creating or editing UI components, theming tokens, CSS variables, or any file in this tweakcn-preview project. Covers component authoring with CVA + Radix UI, Tailwind 4 theming with oklch colors, dark mode conventions, and general TypeScript project rules."
applyTo: "**/*.tsx, **/*.ts, **/*.css"
---

# tweakcn-preview Conventions

> **Self-updating rule**: When you introduce a new pattern, refactor a convention, or notice these instructions no longer match the codebase, update this file to reflect the current state.

---

## General Project

- Package manager: **pnpm** (workspace). Never use npm or yarn commands.
- Dev server runs on port **3002** (`pnpm dev`).
- Path alias `@/` maps to the workspace root. Use it for all internal imports.
- `"use client"` is required for any component that uses hooks or browser APIs.

### TypeScript

- Use `React.ComponentProps<"element">` for component props, not `React.HTMLAttributes<HTMLElement>`.
- Always spread `...props` onto the root element so consumers can extend behavior.
- Use `VariantProps<typeof xVariants>` from `class-variance-authority` to infer variant prop types.

### File & Export Conventions

- Named exports using `function` declarations — no default exports, no `const` arrow components at the top level.
- Primitive UI components → `components/ui/`
- Demo/example pages → `components/examples/`
- App routes and layouts → `app/`

---

## Component Authoring

### Anatomy of a UI component

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui"; // NOT @radix-ui/react-slot
import { cn } from "@/lib/utils";

const thingVariants = cva("base-classes-go-here", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});

function Thing({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof thingVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="thing"
      data-variant={variant}
      data-size={size}
      className={cn(thingVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

### Rules

- **`data-slot="component-name"`** on every root element — used for CSS selectors and debugging.
- **`data-variant` / `data-size`** on components that use those CVA axes.
- **`asChild`** prop with `Slot.Root` from `radix-ui` for polymorphic composition.
- **`cn()`** from `@/lib/utils` for all class merging — never use template literals to concatenate Tailwind classes.
- Simple wrapper components (no variants) use `React.ComponentProps<"div">` directly, no CVA needed.
- Import Radix primitives from `radix-ui` (the meta-package), not individual `@radix-ui/*` packages.

---

## Theming & CSS Variables

### Color format

All colors **must** use `oklch()`. Never hardcode hex, rgb, or hsl values.

```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

### Semantic tokens

Always reference semantic CSS variables — never use raw color values inline.

| Token family | Variables                                 |
| ------------ | ----------------------------------------- |
| Surfaces     | `background`, `card`, `popover`           |
| Text         | `foreground`, `*-foreground`              |
| Interactive  | `primary`, `secondary`, `accent`, `muted` |
| State        | `destructive`                             |
| Chrome       | `border`, `input`, `ring`                 |
| Charts       | `chart-1` … `chart-5`                     |
| Sidebar      | `sidebar`, `sidebar-foreground`, …        |

### Tailwind 4

- Import syntax: `@import "tailwindcss";` — no `tailwind.config.js`.
- CSS variables are exposed to Tailwind via `@theme inline { --color-primary: var(--primary); … }` in `globals.css`.
- Use theme tokens as Tailwind utilities: `bg-primary`, `text-foreground`, `border-border`, etc.
- Radius scale: `rounded-sm` / `rounded-md` / `rounded-lg` / `rounded-xl` (computed from `--radius` in `:root`).
- Shadow scale: `shadow-2xs` → `shadow-2xl` (custom tokens mapped in `@theme inline`).

### Dark mode

- Dark mode is a **class-based custom variant**: `@custom-variant dark (&:is(.dark *));`
- Use the `dark:` Tailwind prefix normally — it resolves via the `.dark` class on an ancestor.
- Managed by `next-themes`. Never use `prefers-color-scheme` media queries.

---

## Class Utilities

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- `cn()` is the **only** approved way to build className strings in components.
