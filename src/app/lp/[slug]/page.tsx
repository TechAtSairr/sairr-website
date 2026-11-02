import { notFound } from "next/navigation";
import { PuriHero, PuriHeroDetails } from "@/components/puri/PuriHero";
import { PuriMoments } from "@/components/puri/PuriMoments";
import { PuriItinerary } from "@/components/puri/PuriItinerary";
import { PuriIncluded } from "@/components/puri/PuriIncluded";
import { DestinationBookingRail } from "@/components/puri/DestinationBookingRail";
import { PuriWords } from "@/components/puri/PuriWords";
import { PuriFaqs } from "@/components/puri/PuriFaqs";
import { PuriCta } from "@/components/puri/PuriCta";
import { PuriStickyBar } from "@/components/puri/PuriStickyBar";
import { TripGallerySection } from "@/components/home/TripGallerySection";
import { GroupTravelSection } from "@/components/shared/GroupTravelSection";
import { JsonLd } from "@/components/shared/JsonLd";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site";
import {
  getLandingPage,
  getLandingPageParams,
} from "@/data/landingPages";
import { SetFloatingCallMessage } from "@/components/layout/SetFloatingCallMessage";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getLandingPageParams();
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const destination = getLandingPage(slug);
  if (!destination) return {};

  return createMetadata({
    title: destination.title,
    description: destination.description,
    path: `/lp/${slug}`,
  });
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const destination = getLandingPage(slug);
  if (!destination) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: destination.jsonLdName,
    description: destination.description,
    touristType: "Senior travellers and families",
    itinerary: {
      "@type": "ItemList",
      itemListElement: destination.itinerary.map((day) => ({
        "@type": "ListItem",
        position: day.day,
        name: `Day ${day.day} · ${day.location}`,
        description: day.desc,
      })),
    },
    offers: {
      "@type": "Offer",
      price: destination.offerPrice,
      priceCurrency: "INR",
    },
    provider: {
      "@type": "TravelAgency",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  const bookingRail = (
    <DestinationBookingRail
      title={destination.hero.summaryTitle}
      duration={destination.hero.duration}
      groupSize={destination.hero.groupSize}
      priceLabel={destination.stickyPriceLabel}
      pricingNotes={destination.dates.pricingNotes}
      cards={destination.dates.cardsData}
      notifyDestination={destination.notifyDestination}
      ctaPage={`lp-${slug}`}
    />
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <SetFloatingCallMessage
        message={`Hi, I'd like to know more about the ${
          destination.notifyDestination === "Puri & Bhubaneswar"
            ? "Puri"
            : destination.notifyDestination
        } journey.`}
      />
      <div className="bg-[#FDFBF2] pb-0">
        <PuriHero sectionData={destination.hero} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start lg:gap-[3.625rem]">
            <div className="min-w-0">
              <PuriHeroDetails sectionData={destination.hero} />
              <PuriMoments
                flush
                heading={destination.moments.heading}
                cards={destination.moments.cards}
              />
              <PuriItinerary
                flush
                heading={destination.itineraryHeading}
                carouselData={destination.itinerary}
              />
              <div className="pb-8 lg:hidden">{bookingRail}</div>
              <GroupTravelSection
                flush
                heading="Traveling with your own group?"
                description="We create private journeys for families and friends, tailored around your dates, interests and trip duration."
                imageSrc="/destinations/your-own-group1.webp"
                imageAlt="Friends enjoying a trip together"
                buttonLabel="Talk to us"
                contactDestination={destination.notifyDestination}
                ctaPage={`lp-${slug}`}
              />
              <PuriWords flush {...destination.words} />
              <PuriIncluded flush {...destination.included} />
            </div>

            <aside className="hidden self-stretch lg:block">
              <div className="sticky top-24 pt-8 pb-4">
                {bookingRail}
              </div>
            </aside>
          </div>
        </div>
        <div className="mt-6 sm:mt-10" />
        <TripGallerySection
          heading={destination.gallery.heading}
          para={destination.gallery.para}
          images={destination.gallery.images}
          variant="destination"
          showBird
        />
        <PuriFaqs id="faqs" {...destination.faqs} />
        <PuriCta
          className="!bg-[#0E5E6F]"
          sectionData={destination.cta}
          ctaPage={`lp-${slug}`}
          notifyDestination={destination.notifyDestination}
          hrefTxt={`Hi, I'd like to know more about the ${
            destination.notifyDestination === "Puri & Bhubaneswar"
              ? "Puri"
              : destination.notifyDestination
          } journey.`}
        />
        <PuriStickyBar
          priceLabel={destination.stickyPriceLabel}
          notifyDestination={destination.notifyDestination}
          ctaPage={`lp-${slug}`}
        />
      </div>
    </>
  );
}

