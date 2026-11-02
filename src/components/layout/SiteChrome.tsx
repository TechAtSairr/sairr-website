"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { FloatingCallButton } from "@/components/layout/FloatingCallButton";
import { FloatingCallProvider } from "@/components/layout/FloatingCallContext";
import { Header } from "@/components/layout/Header";
import { LPHeader } from "@/components/layout/LPHeader";
import { LPFooter } from "@/components/layout/LPFooter";
import {
  consumeScheduledSectionScroll,
  scrollToSectionId,
} from "@/lib/section-nav";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Only scroll to homepage sections when on the homepage
    if (pathname !== "/") return;

    const scheduled = consumeScheduledSectionScroll();
    const hash =
      typeof window !== "undefined" && window.location.hash
        ? window.location.hash.replace("#", "")
        : null;
    const urlParams =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("section")
        : null;

    const targetId = scheduled || hash || urlParams;
    if (!targetId) return;

    // Clean address bar so no ugly hash or query param remains
    if (hash || urlParams) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    let attempts = 0;
    const maxAttempts = 50; // poll for up to 4 seconds
    const interval = setInterval(() => {
      attempts++;
      const el = document.getElementById(targetId);
      if (el) {
        clearInterval(interval);
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [pathname]);

  const isLp = pathname.startsWith("/lp");

  return (
    <FloatingCallProvider>
      {isLp ? <LPHeader /> : <Header />}
      <main className="flex-1">{children}</main>
      {isLp ? <LPFooter /> : <Footer />}
      <FloatingCallButton />
    </FloatingCallProvider>
  );
}
