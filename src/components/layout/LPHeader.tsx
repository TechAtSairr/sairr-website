"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useContactFormDialog } from "@/components/forms/ContactFormDialogProvider";
import { getLandingPage } from "@/data/landingPages";

export function LPHeader() {
  const pathname = usePathname();
  const { openContactForm } = useContactFormDialog();

  const handleOpenForm = () => {
    // Extract slug from /lp/[slug]
    const slug = pathname.replace(/^\/lp\/?/, "").split("/")[0];
    const lp = slug ? getLandingPage(slug) : undefined;

    openContactForm({
      destination: lp?.notifyDestination,
      intent: "interest",
      ctaClass: "cta-lp-header",
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-charcoal/8 bg-white/70 shadow-[0_2px_16px_rgba(27,29,31,0.04)] backdrop-blur-lg backdrop-saturate-125 supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Image
            src="/sairr-logo.webp"
            alt="Sairr"
            width={130.4}
            height={41.7}
            priority
            className="h-[22px] w-[68.8px] sm:h-[28px] sm:w-[87.5px] md:h-[33.36px] md:w-[104.32px]"
          />
        </div>

        <button
          type="button"
          onClick={handleOpenForm}
          className="inline-flex h-9 sm:h-10 cursor-pointer items-center justify-center rounded bg-[#ec575e] px-4 sm:px-5 font-sans text-xs sm:text-sm md:text-base font-semibold text-white shadow-sm transition-all duration-300 hover:scale-104 hover:bg-[#dc4850] active:scale-98"
        >
          I’m interested
        </button>
      </div>
    </header>
  );
}

