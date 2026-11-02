"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/shared/FadeIn";
import { CardRevealCarouselItem } from "@/components/shared/CardReveal";
import { TextReveal } from "@/components/shared/TextReveal";
import { CarouselSection } from "@/components/shared/CarouselSection";
import { JourneyCard, type Journey } from "@/components/home/JourneyCard";
import { useContactFormDialog } from "@/components/forms/ContactFormDialogProvider";
import { ctaClass } from "@/lib/cta";
import type { TravelDestination } from "@/lib/validations/contact";
import puri from "@/public/homepage/journey-puri-1-2.png";
import puri2 from "@/public/homepage/journey-puri-2.webp";
import puri3 from "@/public/homepage/journey-puri-3.webp";
import rameshwaram from "@/public/homepage/journey-rameshwaram.webp";
import andaman from "@/public/homepage/journey-andaman.webp";
import bali from "@/public/homepage/journey-bali.webp";
const JOURNEYS_BG_DESKTOP = "/homepage/journeySection-bg-img.webp";
const JOURNEYS_BG_MOBILE = "/homepage/Bg-Destination-Home-mob2.webp";
import { drawLine } from "@/lib/motion";
import bannerUnderlineImg from "@/public/homepage/underline-journey.png";

const journeys: Journey[] = [
  {
    slug: "puri",
    title: "Puri & Bhubaneswar",
    category: "Pilgrimage",
    description: "Temple bells, ocean air, and unhurried mornings.",
    image: puri,
    images: [puri, puri2, puri3],
    status: "booking-open",
    destination: "Puri & Bhubaneswar",
    perks: ["VIP darshan", "Beach-facing stay", "Dedicated host"],
    href: "/destinations/puri",
  },
  {
    slug: "rameshwaram",
    title: "Rameshwaram",
    category: "Pilgrimage",
    description: "Where the mainland ends and faith begins.",
    image: rameshwaram,
    status: "coming-soon",
    destination: "Rameshwaram",
    notifyMessage:
      "I'd like to be notified when Rameshwaram journey dates are announced.",
  },
  {
    slug: "andaman",
    title: "Andaman & Nicobar",
    category: "Domestic",
    description: "Turquoise water, white sand, and island beauty.",
    image: andaman,
    status: "coming-soon",
    destination: "Andaman & Nicobar",
    notifyMessage:
      "I'd like to be notified when Andaman & Nicobar journey dates are announced.",
  },
  {
    slug: "bali",
    title: "Bali",
    category: "International",
    description: "Emerald terraces, volcanic peaks, and endless golden hours.",
    image: bali,
    status: "coming-soon",
    destination: "Bali",
    notifyMessage:
      "I'd like to be notified when Bali journey dates are announced.",
  },
];

function HeroUnderline() {
  return (
    <motion.span
      variants={drawLine}
      className="pointer-events-none absolute -bottom-1 left-1/5 block h-auto w-full origin-left"
    >
      <Image
        src={bannerUnderlineImg}
        alt=""
        width={231}
        height={8}
        aria-hidden
        className="h-[4.51px] w-[147.46px]"
      />
    </motion.span>
  );
}

export function JourneysSection() {
  const { openContactForm } = useContactFormDialog();

  function handleNotifyMe(destination: TravelDestination, journeySlug: string) {
    const journeyCta = ctaClass("home", "journey", journeySlug);
    openContactForm({
      destination,
      intent: "interest",
      ctaClass: journeyCta,
    });
  }

  return (
    <section
      id="destinations"
      className="relative z-0 -mt-16 scroll-mt-16 bg-[#FDFBF2]"
    >
      <div className="mx-auto max-w-7xl px-4 pt-0 sm:px-6 md:px-0 lg:pt-2">
        {/* <FadeIn> */}
        <div className="mx-auto max-w-4xl text-center">
          <TextReveal
            as="h2"
            text="Journeys to look forward to"
            className="font-heading text-[28px] leading-[1.1] font-semibold tracking-tight text-black sm:text-4xl lg:leading-tight"
          />
          <p className="mt-0 text-base leading-relaxed text-[#5d5d5d] sm:text-xl">
            There should always be another place worth discovering. Choose
            yours.
          </p>
        </div>
        {/* </FadeIn> */}
      </div>

      <div className="relative isolate w-full">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 w-full aspect-[393/354] md:aspect-[4410/1773]"
          aria-hidden
        >
          <Image
            src={JOURNEYS_BG_MOBILE}
            alt=""
            fill
            className="object-cover object-bottom md:hidden"
            sizes="100vw"
          />
          <Image
            src={JOURNEYS_BG_DESKTOP}
            alt=""
            fill
            className="hidden object-cover object-bottom md:block"
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-0">
          <CarouselSection
            className="mt-2 lg:mt-6"
            trackWrapperClassName="-mx-4 pl-4 pr-0 sm:-mx-6 md:mx-0 md:pl-0 md:pr-0"
            slideClassName="py-6 last:mr-4 sm:last:mr-6 md:last:mr-0"
            items={journeys}
            getKey={(journey) => journey.slug}
            renderItem={(journey, index) => (
              <CardRevealCarouselItem
                index={index}
                direction="left"
                hover={false}
              >
                <JourneyCard journey={journey} onNotifyMe={handleNotifyMe} />
              </CardRevealCarouselItem>
            )}
            slidesPerView={{ mobile: 1.15, tablet: 2, desktop: 4 }}
            ariaLabel="Featured journeys"
            autoplay={false}
          />

          <FadeIn delay={0.2}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto flex w-full max-w-3xl items-center justify-center gap-3 px-4 pb-10 pt-4 sm:gap-4 sm:px-6 md:max-w-4xl lg:max-w-5xl lg:gap-6 lg:pb-12 lg:pt-8"
            >
              <div className="relative text-center">
                <p className="mb-1 shrink-0 text-center font-heading text-sm font-semibold leading-snug text-[#0E5E6F] sm:text-base">
                  More destinations launching soon
                </p>
                <HeroUnderline />
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
