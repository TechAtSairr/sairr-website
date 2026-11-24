"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useContactFormDialog } from "@/components/forms/ContactFormDialogProvider";
import type { DateCardData } from "@/components/shared/ExperienceDatesSection";
import type { DepartureDateRange } from "@/data/puri";
import type { PricingTier } from "@/data/destinationPages";
import type { TravelDestination } from "@/lib/validations/contact";
import { ctaClass } from "@/lib/cta";
import { scrollToSectionId, stripHashFromUrl } from "@/lib/section-nav";
import { cn } from "@/lib/utils";

const PILL_BOOK_EARLY = "bg-[#FFF1D2]";
const PILL_BEST_WEATHER = "bg-[#E1F6F8]";

function notePillClass(note: string) {
  return note.trim().toUpperCase() === "BEST WEATHER"
    ? PILL_BEST_WEATHER
    : PILL_BOOK_EARLY;
}

function BookingDateLabel({ range }: { range: DepartureDateRange }) {
  const { start, end } = range;

  return (
    <p className="min-w-0 flex-1 leading-tight text-charcoal">
      <span className="text-[15px] font-bold">{start.day}</span>
      <span className="text-[9px] font-normal">
        &nbsp;{start.month}&apos;{start.year}
      </span>
      <span className="mx-0.5 text-[11px] font-normal">–</span>
      <span className="text-[15px] font-bold">{end.day}</span>
      <span className="text-[9px] font-normal">
        &nbsp;{end.month}&apos;{end.year}
      </span>
    </p>
  );
}

export type DestinationBookingRailProps = {
  title: string;
  duration: string;
  groupSize: string;
  priceLabel: string;
  pricingTiers?: PricingTier[];
  pricingNotes?: string[];
  cards: DateCardData[];
  notifyDestination: TravelDestination;
  /** Page key for CTA classes, e.g. destination slug `puri`. */
  ctaPage: string;
};

export function DestinationBookingRail({
  title,
  duration,
  groupSize,
  priceLabel,
  pricingTiers,
  pricingNotes = [],
  cards,
  notifyDestination,
  ctaPage,
}: DestinationBookingRailProps) {
  const { openContactForm } = useContactFormDialog();
  const [notesOpen, setNotesOpen] = useState(false);
  const railInterestedCta = ctaClass(ctaPage, "rail", "interested");
  const railTalkCta = ctaClass(ctaPage, "rail", "talk-to-us");

  return (
    <div id="pricing-dates" className="scroll-mt-16 flex flex-col gap-6">
      <h2 className="block sm:hidden text-3xl font-semibold text-black text-center">Pricing & Dates</h2>
      <article className="rounded-lg border-[0.5px] border-solid border-[#C8A867] bg-white p-5 shadow-[0_8px_30px_rgba(27,29,31,0.06)] overflow-hidden">
        <p className="text-xl font-semibold text-[#0E5E6F]">{title}</p>
        <div className="-mx-5 mt-2 border-b border-charcoal/10 px-5 pb-3">
          <p className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-[#5d5d5d]">
            <span className="flex items-center gap-1.5">
              <Image
                src="/destinations/gold-sun.svg"
                alt=""
                width={16}
                height={16}
                className="size-4"
              />
              {duration}
            </span>
            {groupSize ? (
              <span className="flex items-center gap-1.5">
                <Image
                  src="/destinations/gold-hero-people.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                />
                Group Size: {groupSize}
              </span>
            ) : null}
          </p>
        </div>

        {pricingTiers && pricingTiers.length > 0 ? (
          <div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="rounded-xl border border-charcoal/10 bg-white p-3 shadow-sm text-left flex flex-col justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-black">
                      {tier.title}
                    </p>
                    <p className="mt-1 text-[10px] text-[#767676]">
                      Starting from
                    </p>
                    <p className="mt-0.5 text-[19px] font-bold leading-tight text-[#0E5E6F]">
                      {tier.priceLabel}
                      <span className="text-[10px] font-normal text-[#0E5E6F]">/person</span>
                    </p>
                  </div>
                  <p className="mt-2 text-[10px] leading-snug text-[#767676]">
                    {tier.subtitle}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setNotesOpen((open) => !open)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal cursor-pointer hover:text-charcoal/80 transition-colors"
                aria-expanded={notesOpen}
              >
                <span>Check Pricing notes</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-[#EC575E] transition-transform duration-200",
                    notesOpen && "rotate-180",
                  )}
                />
              </button>
              <button
                type="button"
                onClick={() =>
                  openContactForm({
                    destination: notifyDestination,
                    intent: "interest",
                    ctaClass: railInterestedCta,
                  })
                }
                className={cn(
                  railInterestedCta,
                  "inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-[#EC575E] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#D04A52]",
                )}
              >
                I&apos;m Interested
              </button>
            </div>

            {notesOpen && pricingNotes.length > 0 ? (
              <ul className="mt-4 list-disc space-y-1.5 pl-4 text-[11px] leading-relaxed text-[#555]">
                {pricingNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-[9.51px]">
                Starting from
                <span className="block text-[20.3px] font-bold text-[#0E5E6F]">
                  {priceLabel}
                  <span className="text-[10px] font-normal">/person</span>
                </span>
              </p>
              <button
                type="button"
                onClick={() =>
                  openContactForm({
                    destination: notifyDestination,
                    intent: "interest",
                    ctaClass: railInterestedCta,
                  })
                }
                className={cn(
                  railInterestedCta,
                  "inline-flex h-10 cursor-pointer items-center justify-center rounded bg-[#EC575E] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#D04A52]",
                )}
              >
                I&apos;m Interested
              </button>
            </div>

            <div className={`mt-4 text-[10px] text-black flex flex-row gap-4 sm:gap-8 bg-[#F9F6F6] py-2 -mx-5 px-5`}>
              <div>• Based on Delhi/NCR as origin</div>
              <div>• Reserve your spot @ ₹0</div>
            </div>

            {pricingNotes.length > 0 ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setNotesOpen((open) => !open)}
                  className="flex w-full items-center justify-between text-left text-xs font-medium text-charcoal"
                  aria-expanded={notesOpen}
                >
                  Check Pricing notes
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 transition-transform",
                      notesOpen && "rotate-180",
                    )}
                  />
                </button>
                {notesOpen ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-[10px] leading-relaxed text-[#5d5d5d]">
                    {pricingNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </article>

      {cards.length > 0 ? (
        <div>
          <p className="text-[16.8px] text-[#0E5E6F] font-semibold">
            Choose your dates
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {cards.map((card) => {
              const dateCardCta = ctaClass(ctaPage, "rail", "date", card.id);
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() =>
                      openContactForm({
                        destination: notifyDestination,
                        intent: "interest",
                        ctaClass: dateCardCta,
                      })
                    }
                    className={cn(
                      dateCardCta,
                      "group flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border-[0.5px] border-solid border-[#C8A867] bg-white text-left shadow-[0_2px_8px_rgba(27,29,31,0.04)] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-2 hover:border-[#0E5E6F]/35 hover:bg-[#FDFBF2] hover:shadow-[0_8px_24px_rgba(27,29,31,0.1)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(27,29,31,0.06)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                    )}
                  >
                    <div className="flex min-h-0 items-center gap-1.5 sm:gap-2 border-b border-[#C8A867]/60 px-2.5 py-2.5">
                      <Image
                        src="/destinations/calender.svg"
                        alt=""
                        width={12}
                        height={12}
                        className="size-3 shrink-0"
                        aria-hidden
                      />
                      <BookingDateLabel range={card.bookingDates} />
                    </div>

                    <div className="flex min-h-[44px] items-center justify-between gap-2">
                      {card.note ? (
                        <span
                          className={cn(
                            "rounded-r-full py-1 pl-2.5 pr-2 text-[8px] font-semibold uppercase tracking-wide text-charcoal",
                            notePillClass(card.note),
                          )}
                        >
                          {card.note.toUpperCase()}
                        </span>
                      ) : (
                        <span aria-hidden />
                      )}
                      <Image
                        src="/destinations/right-red-arrow.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="mr-2 size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                        aria-hidden
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="border-b border-[#EC575E] pb-5 -mt-3">
        <div className="text-[16.8px] font-semibold text-[#0E5E6F]">
          <span className="mr-4">Prefer a different date?</span>
          <button
            type="button"
            onClick={() =>
              openContactForm({
                destination: notifyDestination,
                intent: "private-journey",
                ctaClass: railTalkCta,
              })
            }
            className={cn(
              railTalkCta,
              "mt-3 inline-flex h-10 items-center justify-center rounded bg-[#EC575E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#D04A52]",
            )}
          >
            Talk to us
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          stripHashFromUrl();
          scrollToSectionId("faqs");
        }}
        className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-heading text-base font-semibold text-charcoal"
      >
        <Image
          src="/destinations/faq-icon.svg"
          alt=""
          width={20}
          height={20}
          className="size-5"
        />
        FAQs - frequently asked questions
      </button>
    </div>
  );
}
