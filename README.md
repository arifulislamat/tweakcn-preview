# tweakcn Preview

A live theme preview environment for [tweakcn](https://tweakcn.com) — paste your generated CSS variables and instantly see them applied across real shadcn/ui component examples.

## What It Does

tweakcn lets you design custom themes for shadcn/ui components. This preview app gives you a full-page sandbox to test those themes before dropping them into your own project.

- **Paste & preview** — open the floating CSS panel, paste your tweakcn-generated CSS, and hit Apply
- **Multiple layouts** — Cards, Dashboard, Mail, Pricing, Typography, and Color Palette tabs
- **Dark mode toggle** — switch between light and dark with one click
- **Live reset** — clear the injected CSS and return to the default theme at any time

## Tech Stack

- [Next.js 16](https://nextjs.org) · [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) components (Radix UI + CVA)
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode
- oklch color space for all theme tokens

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

To preview a theme:

1. Go to [tweakcn.com](https://tweakcn.com) and design your theme
2. Copy the generated CSS variables
3. Click the **paste icon** in the bottom-right corner of this app
4. Paste and click **Apply**

## Project Structure

```
app/              # Next.js app router (layout, page, globals.css)
components/
  ui/             # Primitive UI components (Button, Card, Input, …)
  examples/       # Demo layouts (cards, dashboard, mail, pricing, typography)
  css-injector    # Floating CSS paste panel
  color-palette   # Token color grid
lib/
  utils.ts        # cn() class utility
```

## Author

**Ariful Islam** — [arifulislamat.com](https://arifulislamat.com)

## License

MIT
