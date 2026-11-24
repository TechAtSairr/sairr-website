import type { ExperienceHeroSectionData } from "@/components/puri/PuriHero";
import type { ItineraryDayItem } from "@/components/puri/PuriItinerary";
import type { PuriDatesProps } from "@/components/puri/PuriDates";
import type { PuriWordsProps } from "@/components/puri/PuriWords";
import type { PuriFaqsProps } from "@/components/puri/PuriFaqs";
import type { ExperienceCtaSectionData } from "@/components/puri/PuriCta";
import type { TravelDestination } from "@/lib/validations/contact";
import type { GalleryImage } from "@/data/gallery";
import type { PuriMomentCard } from "@/data/puri";
import type { IncludedExcludedItem } from "@/components/puri/PuriIncluded";
import { puriPage } from "@/data/puri";

export type PricingTier = {
  id: "with-flight" | "without-flight";
  title: string;
  subtitle: string;
  price: number;
  priceLabel: string;
  note: string;
};

export type DestinationPageContent = {
  slug: string;
  title: string;
  description: string;
  jsonLdName: string;
  offerPrice: string;
  stickyPriceLabel: string;
  pricingTiers?: PricingTier[];
  notifyDestination: TravelDestination;
  hero: ExperienceHeroSectionData;
  moments: {
    heading: string;
    cards: PuriMomentCard[];
  };
  itineraryHeading: string;
  itinerary: ItineraryDayItem[];
  included: {
    heading: string;
    para: string;
    included: IncludedExcludedItem[];
    excluded: IncludedExcludedItem[];
  };
  dates: PuriDatesProps;
  words: PuriWordsProps;
  faqs: PuriFaqsProps;
  gallery: {
    heading: string;
    para: string;
    images: GalleryImage[];
  };
  cta: ExperienceCtaSectionData;
};

const destinationPages: DestinationPageContent[] = [puriPage];

export function getDestinationPage(slug: string) {
  return destinationPages.find((page) => page.slug === slug);
}

export function getDestinationPageParams() {
  return destinationPages.map((page) => ({ slug: page.slug }));
}
