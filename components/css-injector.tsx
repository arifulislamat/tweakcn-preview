"use client";

import { useState, useRef, useCallback } from "react";
import { ClipboardPaste, X, Check, RefreshCw, Moon, Sun } from "lucide-react";

interface CssInjectorProps {
  isDark: boolean;
  onToggleDark: () => void;
}

const STYLE_TAG_ID = "tweakcn-injected-theme";

export function CssInjector({ isDark, onToggleDark }: CssInjectorProps) {
  const [open, setOpen] = useState(false);
  const [css, setCss] = useState("");
  const [status, setStatus] = useState<"idle" | "applied" | "error">("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyCSS = useCallback(() => {
    try {
      let tag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
      if (!tag) {
        tag = document.createElement("style");
        tag.id = STYLE_TAG_ID;
        document.head.appendChild(tag);
      }
      tag.textContent = css;
      setStatus("applied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [css]);

  const resetCSS = useCallback(() => {
    const tag = document.getElementById(STYLE_TAG_ID);
    if (tag) tag.remove();
    setCss("");
    setStatus("idle");
  }, []);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCss(text);
    } catch {
      textareaRef.current?.focus();
    }
  }, []);

  return (
    <>
      {/* Floating controls - bottom right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
        {/* CSS panel */}
        {open && (
          <div className="w-[420px] max-w-[calc(100vw-2.5rem)] rounded-xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold">Paste Theme CSS</p>
                <p className="text-xs text-muted-foreground">
                  Copy CSS from tweakcn → paste here → Apply
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={css}
                onChange={(e) => setCss(e.target.value)}
                placeholder={`:root {\n  --background: oklch(...);\n  --primary: oklch(...);\n  ...\n}`}
                className="w-full h-52 resize-none p-4 font-mono text-xs bg-background text-foreground outline-none placeholder:text-muted-foreground/60"
                spellCheck={false}
              />
              {css === "" && (
                <button
                  onClick={handlePaste}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md px-2 py-1 bg-muted/60 hover:bg-muted"
                >
                  <ClipboardPaste className="size-3" />
                  Paste from clipboard
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-muted/20">
              <button
                onClick={resetCSS}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
              >
                <RefreshCw className="size-3" />
                Reset
              </button>
              <div className="flex-1" />
              <button
                onClick={applyCSS}
                disabled={!css.trim()}
                className="flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors px-4 py-1.5 rounded-md"
              >
                {status === "applied" ? (
                  <>
                    <Check className="size-3" /> Applied!
                  </>
                ) : status === "error" ? (
                  "Error"
                ) : (
                  "Apply CSS"
                )}
              </button>
            </div>
          </div>
        )}

        {/* FAB row */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="size-10 rounded-full border border-border bg-background shadow-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {/* CSS injector button */}
          <button
            onClick={() => setOpen((v) => !v)}
            title="Paste theme CSS"
            className="h-10 rounded-full border border-border bg-background shadow-lg flex items-center gap-2 px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <ClipboardPaste className="size-4" />
            Paste CSS
          </button>
        </div>
      </div>
    </>
  );
}
