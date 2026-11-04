"use client";

import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSectionHeader } from "@/components/shared/AnimatedSectionHeader";
import { FadeIn } from "@/components/shared/FadeIn";
import { cn } from "@/lib/utils";

const DAY_LABEL_COLOR = "#E44928";

export type ItineraryIncludedItem = {
  icon: ReactNode;
  title: string;
  details: string;
};

export type ItineraryDayItem = {
  day: number | string;
  location: string;
  desc: string;
  para1?: string;
  para2?: string;
  summary?: string;
  activities1?: readonly { loc: string; desc: string }[];
  activities2?: readonly { loc: string; desc: string }[];
  details?: string[];
  /** Large image shown when expanded. */
  image: StaticImageData | string;
  /** Compact preview shown while the day is collapsed. */
  smallImage?: StaticImageData | string;
  imageAlt?: string;
  included: ItineraryIncludedItem[];
};

export type TimelineItineraryProps = {
  heading: string;
  description?: string;
  carouselData: ItineraryDayItem[];
  id?: string;
  className?: string;
  flush?: boolean;
};

function TimelineNode({ isFirst }: { isFirst: boolean }) {
  return (
    <div className="relative w-3 shrink-0 self-stretch" aria-hidden>
      {!isFirst ? (
        <div
          className="absolute left-1/2 top-0 h-1.5 w-0 -translate-x-1/2 border-l border-dashed border-charcoal/30"
        />
      ) : null}
      <div className="relative z-10 size-3 rounded-full bg-gold" />
      <div
        className="absolute left-1/2 top-6 bottom-0 w-0 -translate-x-1/2 border-l border-dashed border-charcoal/30"
      />
    </div>
  );
}

function ItineraryImage({
  image,
  alt,
  variant,
  className,
}: {
  image: StaticImageData | string;
  alt: string;
  variant: "collapsed" | "expanded";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg",
        variant === "collapsed"
          ? "aspect-[288/156.8] w-full max-w-[288px]"
          : "aspect-[738.84/404.35] w-full",
        className,
      )}
    >
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        sizes={
          variant === "collapsed"
            ? "(max-width: 640px) min(calc(100vw - 5rem), 288px), 288px"
            : "(max-width: 1024px) 100vw, 850px"
        }
      />
    </div>
  );
}

function DayHeader({
  day,
  location,
  desc,
}: Pick<ItineraryDayItem, "day" | "location" | "desc">) {
  return (
    <div className="min-w-0 flex-1 pr-10 text-left sm:pr-4">
      <p
        className="text-sm font-medium"
        style={{ color: DAY_LABEL_COLOR }}
      >
        Day {day}
      </p>
      <h3 className="mt-1 font-heading text-xl sm:text-2xl" style={{ color: "#0E5E6F" }}>
        <span className="font-semibold">{location}: </span>
        <span className="font-normal">{desc}</span>
      </h3>
    </div>
  );
}

export function TimelineItinerary({
  heading,
  description,
  carouselData,
  id,
  className,
  flush = false,
}: TimelineItineraryProps) {
  const defaultValue = carouselData[0] ? ["day-0"] : [];

  return (
    <section
      id={id}
      className={cn("scroll-mt-24 bg-[#FDFBF2]", className)}
    >
      <div
        className={cn(
          "py-6 sm:py-16 lg:pb-12 lg:pt-4",
          flush ? "w-full px-0" : "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
        )}
      >
        <AnimatedSectionHeader
          heading={heading}
          description={description}
          headingClassName="-mb-3 font-heading text-3xl font-semibold tracking-tight text-black sm:text-4xl"
        />

        <FadeIn delay={0.1}>
          <Accordion
            defaultValue={defaultValue}
            className="mt-10 sm:mt-10"
          >
            {carouselData.map((item, index) => {
              const value = `day-${index}`;
              const imageAlt = item.imageAlt ?? item.location;
              const isFirst = index === 0;
              return (
                <div
                  key={value}
                  className="flex items-start gap-4 border-b border-gold/50 py-5 first:pt-0 last:border-b-0 sm:gap-6 sm:py-6"
                >
                  <TimelineNode isFirst={isFirst} />

                  <AccordionItem
                    value={value}
                    className="min-w-0 flex-1 border-0 not-last:border-b-0"
                  >
                    <AccordionTrigger
                      className="relative w-full flex-col items-stretch justify-start gap-3 p-0 hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden"
                    >
                      <DayHeader
                        day={item.day}
                        location={item.location}
                        desc={item.desc}
                      />

                      {item.included.length > 0 ? (
                        <div className="flex w-full flex-wrap gap-x-[14px] sm:gap-x-4 gap-y-1 pr-8 text-[10px] italic text-[#5d5d5d] sm:text-xs">
                          {item.included.map((included) => (
                            <span
                              key={`${included.title}-${included.details}`}
                              className="flex items-center gap-1"
                            >
                              <span className="flex size-4.5 shrink-0 items-center justify-center text-gold">
                                {included.icon}
                              </span>
                              {included.title} {included.details}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="w-full max-w-[288px]">
                        <ItineraryImage
                          image={item.smallImage ?? item.image}
                          alt={imageAlt}
                          variant="collapsed"
                          className="group-aria-expanded/accordion-trigger:hidden"
                        />
                      </div>

                      <span className="absolute top-0 right-0 flex size-8 items-center justify-center text-[#ec575e]">
                        <ChevronDown
                          className="size-5 md:size-6 group-aria-expanded/accordion-trigger:hidden"
                          aria-hidden
                        />
                        <ChevronUp
                          className="hidden size-5 md:size-6 group-aria-expanded/accordion-trigger:block"
                          aria-hidden
                        />
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className="px-0 pb-0">
                      <div className="mt-4 w-full">
                        <ItineraryImage
                          image={item.image}
                          alt={imageAlt}
                          variant="expanded"
                          className="mb-4"
                        />

                        <div className="w-full">
                          {item.para1 && (
                            <p className="mb-4 text-xs leading-relaxed sm:text-sm" style={{ color: "#5D5D5D" }}>{item.para1}</p>
                          )}

                          {item.activities1 && item.activities1.length > 0 && (
                            <ul className="mb-4 space-y-2 text-xs leading-relaxed sm:text-sm ml-2">
                              {item.activities1.map((activity, index) => (
                                <li key={index} className="flex gap-2">
                                  <span
                                    className="mt-2 size-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: "#0E5E6F" }}
                                    aria-hidden
                                  />
                                  <div>
                                    {activity.loc && (
                                      <span className="font-semibold" style={{ color: "#0E5E6F" }}>{activity.loc}: </span>
                                    )}
                                    <span style={{ color: "#5D5D5D" }}>{activity.desc}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}

                          {item.para2 && (
                            <p className="mb-4 text-xs leading-relaxed sm:text-sm" style={{ color: "#5D5D5D" }}>{item.para2}</p>
                          )}

                          {item.activities2 && item.activities2.length > 0 && (
                            <ul className="mb-4 space-y-2 text-xs leading-relaxed sm:text-sm ml-2">
                              {item.activities2.map((activity, index) => (
                                <li key={index} className="flex gap-3">
                                  <span
                                    className="mt-2.5 size-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: "#0E5E6F" }}
                                    aria-hidden
                                  />
                                  <div>
                                    {activity.loc && (
                                      <span className="font-semibold" style={{ color: "#0E5E6F" }}>{activity.loc}: </span>
                                    )}
                                    <span style={{ color: "#5D5D5D" }}>{activity.desc}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}

                          {item.summary && (
                            <p className="text-xs leading-relaxed sm:text-sm" style={{ color: "#5D5D5D" }}>{item.summary}</p>
                          )}

                          {item.details && item.details.length > 0 && (
                            <ul className="space-y-1 text-xs leading-relaxed text-[#5d5d5d] sm:text-sm">
                              {item.details.map((detail) => (
                                <li key={detail} className="flex gap-3">
                                  <span
                                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand"
                                    aria-hidden
                                  />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </div>
              );
            })}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
