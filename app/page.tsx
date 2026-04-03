"use client";

import { lazy, Suspense, useState, useRef, useCallback, useEffect } from "react";
import { CssInjector } from "@/components/css-injector";
import { ColorPalette } from "@/components/color-palette";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const DemoCards = lazy(() => import("@/components/examples/cards"));
const DemoDashboard = lazy(() => import("@/components/examples/dashboard"));
const DemoMail = lazy(() => import("@/components/examples/mail"));
const DemoPricing = lazy(() => import("@/components/examples/pricing/pricing"));
const TypographyDemo = lazy(() => import("@/components/examples/typography/typography-demo"));

type ExampleId = "cards" | "dashboard" | "mail" | "pricing" | "typography" | "colors";

const EXAMPLES: { id: ExampleId; label: string }[] = [
  { id: "cards", label: "Cards" },
  { id: "dashboard", label: "Dashboard" },
  { id: "mail", label: "Mail" },
  { id: "pricing", label: "Pricing" },
  { id: "typography", label: "Typography" },
  { id: "colors", label: "Color Palette" },
];

function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function ExampleContent({ id }: { id: ExampleId }) {
  switch (id) {
    case "cards":
      return (
        <ScrollArea className="h-full w-full">
          <div className="@container min-w-[900px]">
            <DemoCards />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      );
    case "dashboard":
      return (
        <ScrollArea className="h-full w-full">
          <div className="@container min-w-[1400px]">
            <DemoDashboard />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      );
    case "mail":
      return (
        <ScrollArea className="h-full w-full">
          <div className="@container min-w-[1300px] rounded-lg border">
            <DemoMail />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      );
    case "pricing":
      return (
        <ScrollArea className="h-full w-full">
          <div className="@container">
            <DemoPricing />
          </div>
        </ScrollArea>
      );
    case "typography":
      return (
        <ScrollArea className="h-full w-full">
          <div className="@container">
            <TypographyDemo />
          </div>
        </ScrollArea>
      );
    case "colors":
      return (
        <ScrollArea className="h-full w-full">
          <ColorPalette />
        </ScrollArea>
      );
  }
}

export default function PreviewPage() {
  const [active, setActive] = useState<ExampleId>("dashboard");
  const [isDark, setIsDark] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const showOverlay = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setOverlayVisible(true);
  }, []);

  const scheduleHide = useCallback(() => {
    hideTimerRef.current = setTimeout(() => {
      setOverlayVisible(false);
    }, 300);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  const handleSelect = useCallback((id: ExampleId) => {
    setActive(id);
    setOverlayVisible(false);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Hover trigger zone */}
      <div
        className="absolute top-0 left-0 right-0 z-40 h-10"
        onMouseEnter={showOverlay}
        onMouseLeave={scheduleHide}
      />

      {/* Overlay switcher bar */}
      <div
        className={[
          "absolute top-0 left-0 right-0 z-50 flex items-center justify-center gap-1 px-4 py-2",
          "bg-background/90 backdrop-blur-md border-b border-border shadow-sm",
          "transition-all duration-200 ease-out",
          overlayVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
        onMouseEnter={cancelHide}
        onMouseLeave={scheduleHide}
      >
        <span className="text-xs text-muted-foreground mr-3 font-mono select-none">
          tweakcn preview
        </span>
        {EXAMPLES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            className={[
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
              active === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Example content */}
      <div className="h-full w-full">
        <Suspense fallback={<LoadingFallback />}>
          <ExampleContent id={active} />
        </Suspense>
      </div>

      {/* Floating controls */}
      <CssInjector isDark={isDark} onToggleDark={() => setIsDark((v) => !v)} />
    </div>
  );
}

