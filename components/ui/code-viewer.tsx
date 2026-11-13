"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
  code: string;
  language?: string;
  caption?: string;
  className?: string;
}

export function CodeViewer({
  code,
  language = "python",
  caption,
  className,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy code", e);
    }
  };

  return (
    <div
      className={cn(
        "my-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm tabular-nums",
        className
      )}
    >
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-700" />
          <span className="font-semibold uppercase tracking-wider text-slate-300 font-mono">
            {language}
          </span>
          {caption && <span className="text-slate-500 font-sans">— {caption}</span>}
        </div>
        <button
          onClick={handleCopy}
          aria-label="Sao chép mã"
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Đã sao chép</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Sao chép</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-xs sm:text-sm leading-relaxed text-slate-100 font-mono tabular-nums">
        <code>{code}</code>
      </pre>
    </div>
  );
}
