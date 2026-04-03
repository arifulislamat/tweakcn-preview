"use client";

import { useEffect, useState } from "react";

const CSS_VARS = [
  { group: "Base", vars: ["background", "foreground"] },
  { group: "Primary", vars: ["primary", "primary-foreground"] },
  { group: "Secondary", vars: ["secondary", "secondary-foreground"] },
  { group: "Accent", vars: ["accent", "accent-foreground"] },
  { group: "Muted", vars: ["muted", "muted-foreground"] },
  { group: "Card", vars: ["card", "card-foreground"] },
  { group: "Popover", vars: ["popover", "popover-foreground"] },
  { group: "Destructive", vars: ["destructive", "destructive-foreground"] },
  { group: "Utility", vars: ["border", "input", "ring"] },
  { group: "Charts", vars: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
  {
    group: "Sidebar",
    vars: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
];

function useCssVar(name: string) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${name}`)
      .trim();
    setValue(v);
  }, [name]);

  return value;
}

function ColorSwatch({ name }: { name: string }) {
  const value = useCssVar(name);

  return (
    <div className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/40 transition-colors group">
      <div
        className="size-12 shrink-0 rounded-md border border-border shadow-sm"
        style={{ backgroundColor: `var(--${name})` }}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">
          {name
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")}
        </p>
        <p className="text-xs text-muted-foreground font-mono truncate">{value}</p>
      </div>
    </div>
  );
}

export function ColorPalette() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Color Palette</h1>
        <p className="text-muted-foreground text-sm">
          All CSS custom properties currently applied to this theme.
        </p>
      </div>
      {CSS_VARS.map(({ group, vars }) => (
        <div key={group} className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
            {group}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
            {vars.map((v) => (
              <ColorSwatch key={v} name={v} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
