"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { homeHeroHref, navLinks, siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { navigateToPageSection } from "@/lib/section-nav";
import Image from "next/image";
import underlineImg from "@/public/homepage/underline.png";

function getSectionTarget(href: string) {
  if (href === homeHeroHref) return { path: "/", id: "home" };
  if (href === "/#destinations") return { path: "/", id: "destinations" };
  return null;
}

function isNavLinkActive(
  pathname: string,
  href: string,
  activeSection: string,
) {
  const sectionTarget = getSectionTarget(href);
  if (sectionTarget) {
    return pathname === sectionTarget.path && activeSection === sectionTarget.id;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const router = useRouter();

  const navigateToSection = useCallback(
    (href: string) => {
      const sectionTarget = getSectionTarget(href);
      if (!sectionTarget) return;

      setOpen(false);
      setActiveSection(sectionTarget.id);

      navigateToPageSection(
        sectionTarget.path,
        sectionTarget.id,
        pathname,
        router.push,
      );
    },
    [pathname, router],
  );

  const isHomePage = pathname === "/";
  const [heroBannerInView, setHeroBannerInView] = useState(false);

  useEffect(() => {
    if (!isHomePage) {
      const frame = requestAnimationFrame(() => {
        setHeroBannerInView(false);
      });
      return () => cancelAnimationFrame(frame);
    }

    const heroes = document.querySelectorAll("[data-header-hero]");

    if (heroes.length === 0) {
      const frame = requestAnimationFrame(() => {
        setHeroBannerInView(false);
      });
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setHeroBannerInView(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0 },
    );

    heroes.forEach((hero) => observer.observe(hero));
    return () => observer.disconnect();
  }, [isHomePage]);

  const homeHeaderOverHero = isHomePage && heroBannerInView;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        isHomePage
          ? homeHeaderOverHero
            ? "border-white/30 bg-white/15 shadow-[0_4px_24px_rgba(27,29,31,0.06)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/10"
            : "border-charcoal/8 bg-white/45 shadow-[0_2px_16px_rgba(27,29,31,0.04)] backdrop-blur-lg backdrop-saturate-125 supports-[backdrop-filter]:bg-white/35"
          : "border-charcoal/8 bg-white/90 shadow-[0_2px_16px_rgba(27,29,31,0.04)] backdrop-blur-lg backdrop-saturate-125 supports-[backdrop-filter]:bg-white/85",
      )}
    >
      <div className="mx-auto flex h-12 sm:h-16 max-w-7xl items-center justify-between pl-5 pr-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setActiveSection("home")}
          className="font-heading text-2xl font-semibold tracking-tight text-brand"
        >
          {/* {siteConfig.name} */}
          <Image
            src="/sairr-logo.webp"
            alt="sairr-logo"
            width={130.4}
            height={41.7}
            className="w-[65.2px] h-[20.85px] md:w-[104.32px] md:h-[33.36px]"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const sectionTarget = getSectionTarget(link.href);
            const isActive = isNavLinkActive(pathname, link.href, activeSection);
            const className = cn(
              "relative inline-block text-sm font-medium transition-colors md:text-lg text-[#1b1d1f] hover:text-brand hover:font-bold",
              isActive &&
              (homeHeaderOverHero
                ? "font-bold text-[#0E5E6F]"
                : "font-bold text-brand"),
            );
            const content = (
              <>
                {link.label}
                {isActive && (
                  <Image
                    src={underlineImg}
                    alt=""
                    width={82}
                    height={6}
                    aria-hidden
                    className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 h-[8px] w-[50px]"
                  />
                )}
              </>
            );

            return (
              sectionTarget ? (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => navigateToSection(link.href)}
                  className={className}
                >
                  {content}
                </button>
              ) : (
                <Link key={link.href} href={link.href} className={className}>
                  {content}
                </Link>
              )
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="hidden h-10 cursor-pointer items-center justify-center rounded bg-[#ec575e] px-4 font-sans text-sm font-semibold text-white transition-all duration-300 hover:scale-104 hover:bg-[#dc4850] tab-0.98 md:inline-flex md:text-base"
        >
          Contact Us
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="text-charcoal hover:bg-charcoal/10 hover:text-charcoal"
              >
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent side="right" className="w-[300px] bg-mist">
            <SheetHeader>
              <SheetTitle className="text-left">
                <Image
                  src="/sairr-logo.webp"
                  alt={siteConfig.name}
                  width={130.4}
                  height={41.7}
                  className="h-[20.85px] w-[65.2px]"
                />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-4">
              {navLinks.map((link) => {
                const sectionTarget = getSectionTarget(link.href);
                const isActive = isNavLinkActive(pathname, link.href, activeSection);
                const className = cn(
                  "inline-block rounded-lg px-3 py-2 text-left text-base transition-colors hover:bg-sand hover:text-brand hover:font-bold",
                  isActive && "font-bold text-brand",
                );

                return (
                  sectionTarget ? (
                    <button
                      key={link.href}
                      type="button"
                      onClick={() => navigateToSection(link.href)}
                      className={className}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={className}
                    >
                      {link.label}
                    </Link>
                  )
                );
              })}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className={cn(
                  "inline-block rounded-lg px-3 py-2 text-base transition-colors hover:bg-sand hover:text-brand hover:font-bold",
                  pathname === "/contact" && "font-bold text-brand",
                )}
              >
                Contact Us
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
