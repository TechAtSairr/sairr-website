import Image, { type StaticImageData } from "next/image";
import type { ExperienceHeroSectionData } from "@/components/puri/PuriHero";
import type { ItineraryDayItem } from "@/components/puri/PuriItinerary";
import type { IncludedExcludedItem } from "@/components/puri/PuriIncluded";
import type { PuriDatesProps } from "@/components/puri/PuriDates";
import type { PuriWordsProps } from "@/components/puri/PuriWords";
import type { PuriFaqsProps } from "@/components/puri/PuriFaqs";
import type { ExperienceCtaSectionData } from "@/components/puri/PuriCta";
import type { DestinationPageContent, PricingTier } from "@/data/destinationPages";
import type { Faq } from "@/data/faqs";
import { puriGalleryImages } from "@/data/gallery";

// Moment Images
import moments1 from "@/public/destinations/moment-1.webp";
import moments2 from "@/public/destinations/puri-moments-2.webp";
import moments3 from "@/public/destinations/puri-moments-3.webp";
import moments4 from "@/public/destinations/moment-4.webp";
import moments5 from "@/public/destinations/puri-moments-5.webp";
import moments6 from "@/public/destinations/moment-6.webp";

// Itinerary Images
import itinerary1Big from "@/public/experience/itinerary-1-big.webp";
import itinerary1Small from "@/public/experience/itinerary-1-small.webp";
import itinerary2Big from "@/public/experience/itinerary-2-big.webp";
import itinerary2Small from "@/public/experience/itinerary-2-small.webp";
import itinerary3Big from "@/public/experience/itinerary-3-big.webp";
import itinerary3Small from "@/public/experience/itinerary-3-big.webp";
import itinerary4Big from "@/public/experience/itinerary-4-big2.webp";
import itinerary4Small from "@/public/experience/itinerary-4-big2.webp";

// Service & Included Icons
import carIcon from "@/public/destinations/car.svg";
import flightIcon from "@/public/destinations/flight.svg";
import foodIcon from "@/public/destinations/food.svg";
import profileIcon from "@/public/destinations/profile.svg";
import ticketsIcon from "@/public/destinations/tickets.svg";
import templeIcon from "@/public/destinations/temple.svg";
import included2 from "@/public/destinations/seaside-view.svg";

// Dates Background Image
import puriDateBgImg from "@/public/experience/puriDatedBg.webp";

/* -------------------------------------------------------------------------- */
/* Departure Types & Helpers                                                  */
/* -------------------------------------------------------------------------- */

export type DepartureStatus = "live" | "upcoming";

export type DepartureDatePart = {
  day: string;
  month: string;
  year: string;
};

export type DepartureDateRange = {
  start: DepartureDatePart;
  end: DepartureDatePart;
};

export type Departure = {
  id: string;
  dates: DepartureDateRange;
  price: number | null;
  seatsAvailable: string;
  status: DepartureStatus;
  origin: string;
  duration: string;
  note?: string;
};

const MONTH_ABBREV_TO_FULL: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

export function formatDeparturePart(part: DepartureDatePart): string {
  return `${part.day} ${part.month}' ${part.year}`;
}

export function formatDepartureRange(range: DepartureDateRange): string {
  return `${formatDeparturePart(range.start)} - ${formatDeparturePart(range.end)}`;
}

export function departureToExperienceDateFields(range: DepartureDateRange): {
  dateRange: string;
  year: string;
} {
  const fullStart =
    MONTH_ABBREV_TO_FULL[range.start.month] ?? range.start.month;
  const fullEnd = MONTH_ABBREV_TO_FULL[range.end.month] ?? range.end.month;
  const year = `20${range.start.year}`;

  if (
    range.start.month === range.end.month &&
    range.start.year === range.end.year
  ) {
    return {
      dateRange: `${range.start.day}-${range.end.day} ${fullStart}`,
      year,
    };
  }

  return {
    dateRange: `${range.start.day} ${fullStart} - ${range.end.day} ${fullEnd}`,
    year,
  };
}

export const puriDepartures: Departure[] = [
  {
    id: "dec-2026-2",
    dates: {
      start: { day: "17", month: "Dec", year: "26" },
      end: { day: "20", month: "Dec", year: "26" },
    },
    price: 55000,
    seatsAvailable: "12–20 travellers",
    status: "live",
    origin: "Delhi/NCR",
    duration: "3N/4D",
    note: "BOOK EARLY",
  },
  {
    id: "jan-2027",
    dates: {
      start: { day: "7", month: "Jan", year: "27" },
      end: { day: "10", month: "Jan", year: "27" },
    },
    price: 55000,
    seatsAvailable: "12–20 travellers",
    status: "live",
    origin: "Delhi/NCR",
    duration: "3N/4D",
    note: "BOOK EARLY",
  },
  {
    id: "jan-2027-1",
    dates: {
      start: { day: "21", month: "Jan", year: "27" },
      end: { day: "24", month: "Jan", year: "27" },
    },
    price: 55000,
    seatsAvailable: "12–20 travellers",
    status: "live",
    origin: "Delhi/NCR",
    duration: "3N/4D",
    note: "BOOK EARLY",
  },
  {
    id: "feb-2027-1",
    dates: {
      start: { day: "3", month: "Feb", year: "27" },
      end: { day: "6", month: "Feb", year: "27" },
    },
    price: 55000,
    seatsAvailable: "12–20 travellers",
    status: "live",
    origin: "Delhi/NCR",
    duration: "3N/4D",
    note: "BEST WEATHER",
  },
  {
    id: "feb-2027-2",
    dates: {
      start: { day: "18", month: "Feb", year: "27" },
      end: { day: "21", month: "Feb", year: "27" },
    },
    price: 55000,
    seatsAvailable: "12–20 travellers",
    status: "live",
    origin: "Delhi/NCR",
    duration: "3N/4D",
    note: "BEST WEATHER",
  },
  {
    id: "mar-2027-1",
    dates: {
      start: { day: "4", month: "Mar", year: "27" },
      end: { day: "7", month: "Mar", year: "27" },
    },
    price: 55000,
    seatsAvailable: "12–20 travellers",
    status: "live",
    origin: "Delhi/NCR",
    duration: "3N/4D",
    note: "BEST WEATHER",
  }
];

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getLiveDepartures() {
  return puriDepartures.filter((d) => d.status === "live" && d.price != null);
}

export function getLowestLivePrice() {
  const prices = getLiveDepartures().map((d) => d.price as number);
  return Math.min(...prices);
}

export const lowestLivePriceLabel = formatInr(getLowestLivePrice());

export const PURI_PRICING_TIERS: PricingTier[] = [
  {
    id: "without-flight",
    title: "Without Flights",
    subtitle: "Bhubaneswar airport pickup to drop-off",
    price: 35000,
    priceLabel: "₹35,000",
    note: "• Bhubaneswar airport pickup to drop-off",
  },
  {
    id: "with-flight",
    title: "With Flights",
    subtitle: "Door-to-door. Fares based on Delhi/NCR",
    price: 57500,
    priceLabel: "₹57,500",
    note: "• Door-to-door. Fares based on Delhi/NCR",
  },
];

/* -------------------------------------------------------------------------- */
/* Hero Section Data                                                          */
/* -------------------------------------------------------------------------- */

export const puriCopy = {
  heroEyebrow: "Puri, July 2026.",
  heroTitle: "Bhubaneswar & Jagannath Puri · 3N/4D",
  heroTagline: "A journey of temples, sea & serenity.",
  heroBody:
    "Thoughtfully designed for the way you travel after 50. Temple mornings, ancient sites, an afternoon at Konark, evenings by the sea — unhurried.",
  heroCaption: "Puri, July 2026 — first Sairr journey",
  category: "Pilgrimage",
  seoDescription:
    "A 3N/4D journey to Bhubaneswar and Jagannath Puri for 50+ travellers. VIP darshan, sea-facing stays, and door-to-door care.",
} as const;

export const puriHeroSectionData: ExperienceHeroSectionData = {
  heading: "Jagannath Puri & Bhubaneswar",
  summaryTitle: "Bhubaneswar & Puri",
  duration: "4 days · 3 nights",
  groupSize: "10–15 travellers",
  tagline: "Thoughtfully designed for travel after 50",
  body: "Two cities, very different in character, one shaped by centuries of temples and history, the other by the coast and the Jagannath Temple. You'll move between ancient sites, sacred rituals, local culture, and the shores of Puri, with good food and a little unplanned time in between. All of it, unhurried.",
  facts: [
    {
      icon: "/destinations/gold-sun.svg",
      label: "4 days · 3 nights",
    },
    {
      icon: "/destinations/gold-hero-people.svg",
      label: "Group Size: 10–15 travellers",
    },
    {
      icon: "/destinations/gold-hero-heart.svg",
      label: "Thoughtfully designed for travel after 50",
    },
  ],
  images: [
    {
      src: "/destinations/puriBanner-1-1.webp",
      alt: "Jagannath Temple in Puri at sunset",
    },
    {
      src: "/destinations/puriBanner-2-2.webp",
      alt: "Konark Sun Temple",
    },
    {
      src: "/destinations/puriBanner-3-1.webp",
      alt: "Puri beach",
    },
    {
      src: "/destinations/puriBanner-4-1.webp",
      alt: "White stupa in Bhubaneswar",
    },
  ],
  highlights: [
    {
      icon: "/destinations/flight.svg",
      title: "Return flights",
      detail: "Origin ↔ Bhubaneswar",
    },
    {
      icon: "/destinations/seaside-view.svg",
      title: "4-star & above stay",
      detail: "Sea-facing in Puri",
    },
    {
      icon: "/destinations/food.svg",
      title: "All 3 meals",
      detail: "Breakfast · Lunch · Dinner",
    },
    {
      icon: "/destinations/temple.svg",
      title: "Pandit-led VIP darshan",
      detail: "Jagannath Temple",
    },
    {
      icon: "/destinations/car.svg",
      title: "Door-to-door AC transfers",
      detail: "Home ↔ Airport ↔ Every stop",
    },
    {
      icon: "/destinations/profile.svg",
      title: "Dedicated Sairr host",
      detail: "Taking care of the details, throughout the journey",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Moments Section Data                                                       */
/* -------------------------------------------------------------------------- */

export type PuriMomentCard = {
  id: string;
  title: string;
  line: string;
  image: StaticImageData;
  alt: string;
};

export const puriMoments = [
  {
    id: "darshan",
    title: "The long queue, skipped.",
    line: "VIP darshan at the Jagannath Temple, with a Pandit to guide you through its rituals, traditions and significance as you go.",
    imageSeed: "puri-moment-darshan",
    alt: "VIP darshan at the Jagannath Temple",
  },
  {
    id: "mahaprasad",
    title: "Simple, sacred, wholesome.",
    line: "Mahaprasad, prepared in earthen pots, first offered to Lord Jagannath, then shared by everyone.",
    imageSeed: "puri-moment-mahaprasad",
    alt: "Mahaprasad shared together",
  },
  {
    id: "flag",
    title: "A flag, changed by hand, 215 feet up.",
    line: "No harness, just the climb to the Nila Chakra, every evening, for centuries.",
    imageSeed: "puri-moment-nila-chakra",
    alt: "Nila Chakra flag-changing ceremony",
  },
  {
    id: "beach",
    title: "No plan for this one.",
    line: "An evening walk along Puri beach, with the sea, good company and nowhere else to be.",
    imageSeed: "puri-moment-beach",
    alt: "Evening walk on Puri beach",
  },
  {
    id: "konark",
    title: "A chariot, carved entirely from stone.",
    line: "24 wheels and seven horses, standing at Konark for more than 700 years, with a local guide bringing its stories to life.",
    imageSeed: "puri-moment-konark",
    alt: "Konark Sun Temple",
  },
  {
    id: "evening",
    title: "Strangers on day one.",
    line: "Friends by the end of the trip. Music, conversation, and an evening together that somehow goes on a little longer than planned.",
    imageSeed: "puri-moment-evening",
    alt: "An evening together with fellow travellers",
  },
] as const;

const momentImages: Record<(typeof puriMoments)[number]["id"], StaticImageData> = {
  darshan: moments1,
  mahaprasad: moments2,
  flag: moments3,
  beach: moments4,
  konark: moments5,
  evening: moments6,
};

export const puriMomentsSectionData = {
  heading: "Moments that make Puri",
  cards: puriMoments.map((moment) => ({
    id: moment.id,
    title: moment.title,
    line: moment.line,
    alt: moment.alt,
    image: momentImages[moment.id],
  })) satisfies PuriMomentCard[],
};

/* -------------------------------------------------------------------------- */
/* Itinerary Section Data                                                     */
/* -------------------------------------------------------------------------- */

export const puriDays = [
  {
    day: 1,
    place: "Bhubaneswar",
    desc: "Welcome to the City of Temples",
    para1:
      "We pick you up from home for the flight to Bhubaneswar, where a Sairr host receives you and walks with you for the rest of the journey. From there, it's check-in, lunch, and a little time to settle in before the city opens up for the afternoon.",
    activities1: [
      {
        loc: "Lingaraj Temple",
        desc: "An 11th-century temple of Kalinga architecture, dedicated to Lord Shiva. Rising 180 feet above a complex of 150 smaller shrines, it is the largest temple in Bhubaneswar, second only to the Jagannath Temple you'll visit in Puri. A Pandit accompanies you inside, sharing its history and significance along the way.",
      },
      {
        loc: "Udayagiri & Khandagiri Caves",
        desc: "More than 2,000 years old, this group of 33 caves was carved into two hills for Jain monks. A guide walks you through the carvings and inscriptions, and what they reveal about the monks who lived here.",
      },
      {
        loc: "If time permits, the ISKCON Temple",
        desc: "a quieter, more contemporary stop to round off the evening.",
      },
    ],
    para2: "Followed by dinner and an overnight stay in Bhubaneswar.",
    activities2: [],
    summary: "",
    pictures: "Lingaraj Temple · Udayagiri & Khandagiri Caves",
    pictureCount: 2,
    meals: "Lunch, Dinner",
    images: [
      { seed: "puri-day1-lingaraj", alt: "Lingaraj Temple" },
      { seed: "puri-day1-caves", alt: "Udayagiri and Khandagiri Caves" },
    ],
  },
  {
    day: 2,
    place: "Puri",
    desc: "The Sacred City by the Sea",
    para1:
      "After breakfast, we leave Bhubaneswar for Puri, about 65km and around an hour and a half away. The drive takes you from Odisha's temple city to the coast, where the Jagannath Temple has shaped life for centuries. Along the way, we make two short stops.",
    activities1: [
      {
        loc: "Dhauli Shanti Stupa",
        desc: "A quiet stop on the way, marking the site associated with the Kalinga War. It's said Emperor Ashoka stood here, looked at what the battle had cost, and gave up violence for good. The white dome, with statues of Buddha set around it, was built in 1972 in memory of that change of heart.",
      },
      {
        loc: "If time permits, Sakshi Gopal Temple",
        desc: "A temple dedicated to Krishna as Sakshi Gopal, where local tradition tells of him walking to the village to prove a devotee's broken promise true, staying on as its witness ever since.",
      },
    ],
    para2:
      "From there, we continue to Puri, arriving in time for lunch and check-in at the sea-facing resort. After some time to settle in, we head out to experience the city's spiritual heart. The Jagannath Temple dates back to around the 12th century and is one of Hinduism's four sacred Char Dham pilgrimage sites.",
    activities2: [
      {
        loc: "VIP darshan at the Jagannath Temple",
        desc: "You skip the long queue and go straight in for darshan, with a Pandit alongside you to explain the rituals, traditions and significance of Lord Jagannath as you go.",
      },
      {
        loc: "Mahaprasad",
        desc: "Rice, dal and sweets, offered to Jagannath first and then shared with you. You'll also visit the temple's kitchen, where meals for thousands are cooked daily in stacked earthen pots over an open fire, the top pot always cooking first. Wholesome, simple, and a meal that stays with you.",
      },
      {
        loc: "The Nila Chakra",
        desc: "As evening falls, the temple's flag is changed by hand, hundreds of feet up, the same way it has been for centuries.",
      },
    ],
    summary:
      "The day closes the way it should: dinner, conversations, and a quiet walk along Puri beach, no plan, no rush.",
    pictures:
      "Dhauli Shanti Stupa · The Jagannath Temple, from outside (exterior only)",
    pictureCount: 2,
    meals: "Breakfast, Lunch, Dinner",
    images: [
      { seed: "puri-day2-dhauli", alt: "Dhauli Shanti Stupa" },
      {
        seed: "puri-day2-jagannath-exterior",
        alt: "The Jagannath Temple, from outside",
      },
    ],
  },
  {
    day: 3,
    place: "Konark & Puri",
    desc: "Morning by the Sea, Sun Temple & Local Artisans",
    para1:
      "Today is the lightest day of the trip, with plenty of time to slow down. After breakfast, the morning is yours: spend it by the pool, take a walk along the beach, or simply enjoy a quiet few hours at the resort. Anyone who'd like a second VIP darshan can also head to the Jagannath Temple this morning. After lunch at the resort, we set out for Konark in the afternoon.",
    activities1: [
      {
        loc: "Konark Sun Temple",
        desc: "Built in the 13th century as a monumental chariot for the Sun God, with twelve pairs of intricately carved wheels and seven horses. A UNESCO World Heritage Site, its wheels aren't just decoration, each one works as a sundial, still telling the time by shadow. A guide brings its stories, symbolism and extraordinary craftsmanship to life as you explore.",
      },
      {
        loc: "Raghurajpur",
        desc: "A heritage crafts village nearby, known for Pattachitra, a centuries-old style of cloth painting still practised by artisan families in their own homes. Meet them at work, and browse or take home a piece of Odisha's artistic heritage.",
      },
    ],
    para2:
      "Back at the resort, conversations continue around the dinner table. It's our last evening together, and by now, this feels less like a group of travellers and more like a group of friends.",
    activities2: [],
    summary: "",
    pictures: "Konark Sun Temple · Raghurajpur, an artisan at work",
    pictureCount: 2,
    meals: "Breakfast, Lunch, Dinner",
    images: [
      {
        seed: "puri-day3-konark-alt",
        alt: "Konark Sun Temple, a different frame",
      },
      {
        seed: "puri-day3-raghurajpur",
        alt: "An artisan at work in Raghurajpur",
      },
    ],
  },
  {
    day: 4,
    place: " Departure",
    desc: "Home, with a Few Good Stories",
    para1: "",
    activities1: [],
    para2: "",
    activities2: [],
    summary:
      "Pack up after breakfast and check out of the resort. We drive to Bhubaneswar airport, where your Sairr host sees you off. Once you land, we'll take you all the way back to your doorstep, with a few good stories, plenty of memories, and a camera roll full of pictures.",
    pictures: "The return — dropped at your doorstep",
    pictureCount: 1,
    meals: "Breakfast",
    images: [{ seed: "puri-day4-return", alt: "Dropped at your doorstep" }],
  },
] as const;

const itineraryImagesByDay: Record<
  number,
  { image: StaticImageData; smallImage: StaticImageData }
> = {
  1: { image: itinerary1Big, smallImage: itinerary1Small },
  2: { image: itinerary2Big, smallImage: itinerary2Small },
  3: { image: itinerary3Big, smallImage: itinerary3Small },
  4: { image: itinerary4Big, smallImage: itinerary4Small },
};

const serviceIcons = {
  car: carIcon,
  flight: flightIcon,
  host: profileIcon,
  transfers: carIcon,
  tickets: ticketsIcon,
  temple: templeIcon,
  meals: foodIcon,
} as const;

type IncludedRow = readonly [keyof typeof serviceIcons, string, string];

const includedByDay: Record<number, readonly IncludedRow[]> = {
  1: [
    ["car", "Home pickup & Transfers", ""],
    ["flight", "Flight", ""],
    ["host", "Dedicated host", ""],
    ["tickets", "Guide & entry tickets", ""],
    ["meals", "", "Lunch · Dinner"],
  ],
  2: [
    ["host", "Dedicated host", ""],
    ["transfers", "Transfers", ""],
    ["temple", "VIP Darshan", ""],
    ["meals", "", "Breakfast · Lunch · Dinner"],
  ],
  3: [
    ["host", "Dedicated host", ""],
    ["transfers", "Transfers", ""],
    ["tickets", "Guide & entry tickets", ""],
    ["meals", "", "Breakfast · Lunch · Dinner"],
  ],
  4: [
    ["host", "Dedicated host", ""],
    ["flight", "Flight", ""],
    ["meals", "", "Breakfast"],
    ["car", "Home drop-off", ""],
  ],
};

function ServiceIcon({ src }: { src: StaticImageData }) {
  const isProfile = src === profileIcon;
  return (
    <Image
      src={src}
      alt=""
      width={22}
      height={22}
      className={
        isProfile ? "size-[14px] object-contain" : "size-[22px] object-contain"
      }
      aria-hidden
    />
  );
}

export const puriItineraryData: ItineraryDayItem[] = puriDays.map((day) => {
  const media = itineraryImagesByDay[day.day];
  const includedRows = includedByDay[day.day];

  return {
    day: day.day,
    location: day.place,
    desc: day.desc,
    para1: day.para1,
    para2: day.para2,
    summary: day.summary,
    activities1: day.activities1,
    activities2: day.activities2,
    image: media.image,
    smallImage: media.smallImage,
    included: includedRows.map(([iconKey, title, details]) => ({
      icon: <ServiceIcon src={serviceIcons[iconKey]} />,
      title,
      details,
    })),
  };
});

/* -------------------------------------------------------------------------- */
/* What's Included Section Data                                               */
/* -------------------------------------------------------------------------- */

export const puriIncluded = [
  {
    id: "flights",
    icon: "plane" as const,
    text: "Return flights from your origin city to Bhubaneswar, with meals included (Flight package only)",
  },
  {
    id: "stay",
    icon: "building" as const,
    text: "3 nights in 4-star & above hotels or resorts (1N in Bhubaneswar, 2N in Puri), including a sea-facing stay in Puri",
  },
  {
    id: "meals",
    icon: "plate" as const,
    text: "Breakfast, lunch and dinner throughout the journey, at hotels or curated restaurants",
  },
  {
    id: "transfers",
    icon: "car" as const,
    text: "Door-to-door transfers in private AC vehicles",
  },
  {
    id: "ticket",
    icon: "ticket" as const,
    text: "Entry tickets & local guides at key sites like Konark Sun Temple and Udayagiri & Khandagiri Caves",
  },
  {
    id: "darshan",
    icon: "praying" as const,
    text: "VIP darshan at the Jagannath Temple with a Pandit, including Mahaprasad and the Nila Chakra flag changing experience",
  },
  {
    id: "coordinator",
    icon: "person" as const,
    text: "A dedicated Sairr host throughout the journey, with round-the-clock support whenever you need it",
  },
] as const;

export const puriNotIncluded =
  `Personal shopping and tips · Room service / in-room dining · Temple offerings and donations · Alcohol and mini-bar · Any activities or services not mentioned in "What's included"`;

export const puriPricingNotes = [
  "Price per person, based on double occupancy",
  "Price based on flight fares from Delhi/NCR",
  "Prices for other origin cities may vary with flight fares",
  "Prices across dates may vary by season",
  "Early booking recommended for better pricing",
  "Reserve your spot @ ₹0, pay only once your departure is confirmed",
] as const;

const includedIcons = [
  flightIcon,
  included2,
  foodIcon,
  carIcon,
  ticketsIcon,
  templeIcon,
  profileIcon,
];

function itemIcon(src: StaticImageData, index: number) {
  const isProfile = index === 6;
  const isPlane = index === 0;
  return (
    <Image
      src={src}
      alt=""
      width={40}
      height={40}
      className={
        isProfile || isPlane
          ? "size-5 object-contain"
          : "size-10 object-contain"
      }
      aria-hidden
    />
  );
}

export const puriIncludedSectionData = {
  heading: "",
  para: "",
  included: puriIncluded.map(
    (item, index): IncludedExcludedItem => ({
      icon: itemIcon(includedIcons[index], index),
      text: item.text,
    }),
  ),
  excluded: puriNotIncluded.split(" · ").map(
    (text): IncludedExcludedItem => ({
      text: text.trim(),
    }),
  ),
};

/* -------------------------------------------------------------------------- */
/* Dates Section Data                                                         */
/* -------------------------------------------------------------------------- */

const liveCards = getLiveDepartures().map((departure) => {
  const { dateRange, year } = departureToExperienceDateFields(departure.dates);

  return {
    id: departure.id,
    dateRange,
    year,
    bookingDates: departure.dates,
    duration: departure.duration,
    travellers: departure.seatsAvailable,
    price: departure.price != null ? formatInr(departure.price) : undefined,
    note: departure.note,
    selected: departure.id === "nov-2026-1",
  };
});

const upcomingDeparture = puriDepartures.find((d) => d.status === "upcoming");

export const puriDatesSectionData: PuriDatesProps = {
  id: "dates",
  heading: "Choose Your Dates",
  cardsData: liveCards,
  upcomingBar: upcomingDeparture
    ? { label: formatDepartureRange(upcomingDeparture.dates) }
    : undefined,
  pricingNotes: [...puriPricingNotes],
  backgroundImage: puriDateBgImg,
};

/* -------------------------------------------------------------------------- */
/* Words & Testimonials Data                                                  */
/* -------------------------------------------------------------------------- */

export const puriTestimonialYoutubeId =
  "https://youtu.be/tB0D96AZFdw?si=U1EPNnOs6QgkGJLj";

export const puriWordsSectionData: PuriWordsProps = {
  heading: "Puri, in their words",
  para: "",
  videoUrl: puriTestimonialYoutubeId,
  videoTitle: "Puri traveller film",
  thumbnail: "/destinations/purivideothumbnail.webp",
};

/* -------------------------------------------------------------------------- */
/* FAQs Section Data                                                          */
/* -------------------------------------------------------------------------- */

export const puriFaqs: Faq[] = [
  {
    question: "What's included in the trip?",
    answer:
      "Return flights from your origin city, 4-star & above stays in Bhubaneswar and Puri, sea-facing accommodation in Puri, VIP darshan with a Pandit at the Jagannath Temple, local guides and entry tickets for all sightseeing, all meals at hotels or carefully curated restaurants, and door-to-door transfers in private AC vehicles. \nNot included: personal shopping, temple offerings, room service, liquor and the mini-bar.",
  },
  {
    question: "What's the pace of the trip like?",
    answer:
      "Unhurried, by design. This is a trip built for the way you travel after 50, not a race through a checklist. We keep it to no more than three activities a day, so there's always time to enjoy where you are, not just get through it.",
  },
  {
    question: "What's the darshan & sightseeing experience like?",
    answer: (
      <div className="space-y-3 text-sm leading-relaxed sm:text-[0.95rem] sm:leading-[1.7]">
        <p>
          <strong>Darshan:</strong> At the Jagannath Temple, you skip the long
          queue and go straight in for VIP darshan, with a Pandit alongside you
          to explain the rituals, traditions and significance as you go.
          You&apos;ll also experience Mahaprasad and witness the evening flag
          change at the Nila Chakra.
        </p>
        <p>
          <strong>Sightseeing:</strong> We don&apos;t believe sightseeing
          should mean arriving, taking a photo, and moving on. From Lingaraj
          Temple and the Udayagiri & Khandagiri Caves to the Konark Sun Temple,
          every major stop is guided, with local experts sharing the stories,
          history and significance behind each place.
        </p>
      </div>
    ),
  },
  {
    question: "What kind of stay can I expect in Bhubaneswar & Puri?",
    answer:
      "All our stays in Bhubaneswar and Puri are at 4-star & above properties. We thoughtfully curate 2–3 properties in each city, all vetted by our on-ground team for their food, service, room quality, location and overall experience. In Puri, all our curated properties are sea-facing, so you can enjoy the coast even when you're back at the hotel.\nWe book your stay based on availability around your travel dates, but whichever property you stay at, the standard remains the same.",
  },
  {
    question: "Is the Puri trip only for travellers over 50?",
    answer:
      "Puri group trips are designed for travellers over 50: people at a similar stage of life, moving at a similar pace. But we also run private trips, where a family or a group of friends, across ages, can travel together with the same standard of planning and care.",
  },
  {
    question: "What's the group size for the Puri trip?",
    answer:
      "Our scheduled Puri trips for travellers over 50 typically have 10–15 people. We keep our groups small enough to feel personal, without becoming a large tour group.\nFor private Puri trips, we typically recommend 10 or more travellers to deliver the same standard of experience and service. Smaller groups are welcome too. The experience doesn't change. Just get in touch and we'll work out what's best for you.",
  },
  {
    question: "Does Sairr only offer group Puri trips?",
    answer:
      "No. Our group Puri trips run on scheduled dates and durations for travellers over 50, with itineraries designed around what works best for them.\nWe also do private Puri trips, where a family or a group of friends, across ages, can travel together on dates and for as long as suits them.",
  },
  {
    question: "Can I travel solo to Puri with Sairr?",
    answer:
      "Yes. You'll have plenty of company along the way. You join as an individual, alongside others at a similar stage of life, all discovering a new place together. The people you meet can become just as much a part of the experience as the places you see. A Sairr host is with the group the whole way, coordinating the trip, so you're never really on your own, even though you started that way.",
  },
  {
    question: "Can I customise the Puri trip?",
    answer:
      "Yes, if you're travelling privately with friends or family. We can tailor the trip around your dates, interests and preferred duration, while keeping the same standard of planning and care.\nWe usually recommend adding a few days to one of our existing itineraries rather than cutting it down, because they're built around the places and experiences we believe are worth doing when you're there. But tailored doesn't mean we'll say yes to everything, if we don't think something adds real value, we'll tell you. \nOur group trips to Puri aren't individually tailored; they're thoughtfully designed around the right pace and experiences for travellers over 50.",
  },
  {
    question: "What happens after I submit the form?",
    answer:
      "One of our travel expert will personally reach out to you, to confirm availability, answer your questions, and help you plan the next steps.",
  },
  {
    question: "What is the payment & cancellation policy?",
    answer: (
      <div className="space-y-3 text-sm leading-relaxed sm:text-[0.95rem] sm:leading-[1.7]">
        <h4 className="font-heading text-sm font-semibold text-charcoal sm:text-base">
          Payment Policy
        </h4>
        <p>
          Secure your spot at no cost and pay only once the trip is confirmed.
          Once your departure meets the minimum group size and is confirmed to
          run, we collect a 50% advance to secure your flights, stay, transport
          and other arrangements. We&apos;ll keep you updated on your
          departure&apos;s status until then.
        </p>
        <p>
          The remaining 50% is due 21 days before departure. If you book within
          21 days of departure, full payment is required upfront.
        </p>
        <p>
          Please note: If the balance payment is not received by the due date,
          the booking will be treated as a cancellation as of that date, and the
          cancellation charges applicable at that time will apply.
        </p>
        <h4 className="font-heading text-sm font-semibold text-charcoal sm:text-base border-t border-charcoal/10 pt-3">
          Cancellation Policy
        </h4>
        <ul className="list-disc space-y-1.5 pl-5 marker:text-charcoal/60">
          <li>
            30 days or more before departure: Full refund, minus any applicable
            flight cancellation charges.
          </li>
          <li>
            15–29 days before departure: 50% of the trip cost is retained as a
            cancellation fee.
          </li>
          <li>
            8–14 days before departure: 75% of the trip cost is retained as a
            cancellation fee.
          </li>
          <li>7 days or less before departure: The trip cost is non-refundable.</li>
        </ul>
      </div>
    ),
  },
];

export const puriFaqsSectionData: PuriFaqsProps = {
  heading: "FAQs - Frequently asked questions ",
  faqData: puriFaqs,
};

/* -------------------------------------------------------------------------- */
/* CTA Section Data                                                           */
/* -------------------------------------------------------------------------- */

export const puriCtaSectionData: ExperienceCtaSectionData = {
  heading: "Ready for a few good days in Puri?",
  para: "Pick your dates, and we'll take it from there.",
  primaryCtaLabel: "I'm Interested",
  whatsappLabel: "WhatsApp us",
  whatsappMessage: "Hi Sairr — I'm interested in the Puri journey.",
};

/* -------------------------------------------------------------------------- */
/* Consolidated Puri Landing Page Object                                      */
/* -------------------------------------------------------------------------- */

export const puriLpPage: DestinationPageContent = {
  slug: "jagannath-puri",
  title: `${puriCopy.heroTitle} — ${puriCopy.heroTagline}`,
  description: puriCopy.seoDescription,
  jsonLdName: "Bhubaneswar & Jagannath Puri",
  offerPrice: "35000",
  stickyPriceLabel: "₹35,000",
  pricingTiers: PURI_PRICING_TIERS,
  notifyDestination: "Puri & Bhubaneswar",
  hero: puriHeroSectionData,
  moments: puriMomentsSectionData,
  itineraryHeading: "Itinerary",
  itinerary: puriItineraryData,
  included: puriIncludedSectionData,
  dates: puriDatesSectionData,
  words: puriWordsSectionData,
  faqs: puriFaqsSectionData,
  gallery: {
    heading: "The journey, in frames",
    para: "",
    images: puriGalleryImages,
  },
  cta: puriCtaSectionData,
};

export const puriPage = puriLpPage;

