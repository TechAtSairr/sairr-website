"use client";

import whatsapp from "@/public/whatsappLogo.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useFloatingCall } from "@/components/layout/FloatingCallContext";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "919971737186"; // include country code, no +

function isDestinationDetailPath(pathname: string) {
  return /^\/destinations\/[^/]+$/.test(pathname);
}

export function FloatingCallButton() {
  const pathname = usePathname();
  const { message } = useFloatingCall();
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const onDestinationDetail = isDestinationDetailPath(pathname ?? "");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "fixed right-5 z-50 rounded-full shadow-lg sm:right-8 sm:bottom-8 bottom-16",
      )}
    >
      <Image
        src={whatsapp}
        alt="WhatsApp"
        width={65}
        height={65}
        className="w-[50px] h-[50px]"
      />
    </a>
  );
}
