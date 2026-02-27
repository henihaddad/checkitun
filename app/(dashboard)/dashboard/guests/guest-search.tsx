"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useTransition } from "react";

export function GuestSearch({ defaultValue }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      if (value.trim()) {
        router.push(`${pathname}?q=${encodeURIComponent(value.trim())}`);
      } else {
        router.push(pathname);
      }
    });
  }

  function handleClear() {
    setValue("");
    startTransition(() => router.push(pathname));
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, maxWidth: 440 }}>
      <div style={{ flex: 1, position: "relative" }}>
        <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by name, passport, nationality…"
          style={{
            width: "100%",
            padding: "11px 40px 11px 40px",
            borderRadius: 10,
            border: "1.5px solid var(--border)",
            background: "#fff",
            fontSize: 14,
            color: "var(--ink)",
            outline: "none",
            fontFamily: "DM Sans, sans-serif",
            transition: "border-color 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
        {value && (
          <button type="button" onClick={handleClear}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 2 }}
          >
            <X size={14} />
          </button>
        )}
      </div>
      <button type="submit"
        style={{ padding: "11px 20px", borderRadius: 10, border: "none", background: "var(--olive)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap", transition: "background 0.2s" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--olive-mid)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--olive)")}
      >
        Search
      </button>
    </form>
  );
}
