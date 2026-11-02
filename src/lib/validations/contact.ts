import { z } from "zod";

const utmField = z.string().max(200).optional();

export const DESTINATION_SOMEWHERE_ELSE = "Somewhere else";

export const destinationCatalog = [
  { value: "Puri & Bhubaneswar", status: "live" },
  { value: "Rameshwaram", status: "coming-soon" },
  { value: "Andaman & Nicobar", status: "coming-soon" },
  { value: "Bali", status: "coming-soon" },
] as const;

export const travelDestinations = destinationCatalog.map((d) => d.value);

export type TravelDestination = (typeof destinationCatalog)[number]["value"];

export type DestinationStatus = (typeof destinationCatalog)[number]["status"];

export type ContactFormIntent =
  | "interest"
  | "private-journey"
  | "contact"
  | "callback";

export type JourneyType = "group" | "custom";

export const journeyTypeOptions: { value: JourneyType; label: string }[] = [
  { value: "group", label: "Group journey with Sairr" },
  { value: "custom", label: "Customized private journey" },
];

const destinationFieldValues = [
  ...travelDestinations,
  DESTINATION_SOMEWHERE_ELSE,
] as const;

export function getDestinationStatus(
  destination: string,
): DestinationStatus | null {
  const match = destinationCatalog.find((entry) => entry.value === destination);
  return match?.status ?? null;
}

export function isLiveDestination(destination: string) {
  return getDestinationStatus(destination) === "live";
}

export function isComingSoonDestination(destination: string) {
  return getDestinationStatus(destination) === "coming-soon";
}

export function getPreferredMonthOptions(now = new Date()) {
  const options: string[] = [];
  for (let offset = 0; offset < 6; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    options.push(
      date.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    );
  }
  options.push("Not sure yet");
  return options;
}

export function getContactFormCopy(
  intent: ContactFormIntent,
  destination?: TravelDestination,
) {
  switch (intent) {
    case "interest":
      return {
        title: destination
          ? `Interested in ${destination}?`
          : "Interested in travelling with Sairr?",
        description:
          "Tell us a little about your plans and we'll take it from there.",
      };
    case "private-journey":
      return {
        title: "Different dates, or your own group?",
        description:
          "Tell us what you have in mind and we'll work out a plan.",
      };
    case "callback":
      return {
        title: "Get a callback",
        description:
          "Leave your number and one of our experts will call you.",
      };
    default:
      return {
        title: "Get in touch",
        description: "Ask us anything about travelling with Sairr.",
      };
  }
}

export function buildContactFormDefaults(
  intent: ContactFormIntent = "contact",
  destination?: TravelDestination,
) {
  let journeyType = "" as JourneyType | "";

  if (
    intent === "interest" &&
    destination &&
    isLiveDestination(destination)
  ) {
    journeyType = "group";
  }

  return {
    name: "",
    phone: "",
    destination: destination ?? "",
    otherDestination: "",
    journeyType,
    departureCity: "",
    preferredMonth: "",
    message: "",
  };
}

export const contactFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number"),
    destination: z
      .string()
      .min(1, "Please select a destination")
      .refine(
        (value) =>
          destinationFieldValues.includes(
            value as (typeof destinationFieldValues)[number],
          ),
        { message: "Please select a destination" },
      ),
    otherDestination: z.string().max(200, "Response is too long").optional(),
    journeyType: z
      .union([z.enum(["group", "custom"]), z.literal("")])
      .optional()
      .transform((value) => (value === "" ? undefined : value)),
    departureCity: z.string().max(200, "Response is too long").optional(),
    preferredMonth: z.string().max(50).optional(),
    message: z.string().max(1000, "Message is too long").optional(),
    utm_source: utmField,
    utm_subsource: utmField,
    utm_medium: utmField,
    utm_id: utmField,
    utm_content: utmField,
    utm_term: utmField,
    utm_campaign: utmField,
    gclid: utmField,
    fbclid: utmField,
    ad_id: utmField,
    adset_id: utmField,
    campaign_id: utmField,
    ad_name: utmField,
    adset_name: utmField,
    campaign_name: utmField,
    placement: utmField,
    site_source_name: utmField,
    page_url: z.string().max(2048).optional(),
    cta_class: z.string().max(120).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.destination === DESTINATION_SOMEWHERE_ELSE &&
      !data.otherDestination?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please tell us which destination you have in mind",
        path: ["otherDestination"],
      });
    }

    if (!data.journeyType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please choose your journey type",
        path: ["journeyType"],
      });
    }
  });

export type ContactFormFieldValues = z.input<typeof contactFormSchema>;
export type ContactFormData = z.output<typeof contactFormSchema>;

/** Column C — dropdown value (including "Somewhere else"). */
export function formatWhereToTravelForSheet(data: ContactFormData) {
  return data.destination;
}

/** Column D — free-text only when "Somewhere else" is selected. */
export function formatWhichDestinationForSheet(data: ContactFormData) {
  if (data.destination !== DESTINATION_SOMEWHERE_ELSE) {
    return "";
  }
  return data.otherDestination?.trim() ?? "";
}

export function formatJourneyTypeForSubmission(journeyType?: JourneyType) {
  if (!journeyType) return "";
  return (
    journeyTypeOptions.find((option) => option.value === journeyType)?.label ??
    journeyType
  );
}

/** Leads tab columns A–AC (fixed order matching sheet). */
export function formatContactRowForSheet(
  data: ContactFormData & { leadId?: string },
  leadId?: string,
  submittedAt = new Date(),
) {
  const finalLeadId = leadId ?? data.leadId ?? "";
  return [
    data.name,
    finalLeadId,
    data.phone,
    formatWhereToTravelForSheet(data),
    formatWhichDestinationForSheet(data),
    formatJourneyTypeForSubmission(data.journeyType),
    data.departureCity ?? "",
    data.preferredMonth ?? "",
    data.message ?? "",
    data.utm_source ?? "",
    data.utm_subsource ?? "",
    data.utm_medium ?? "",
    data.utm_id ?? "",
    data.utm_content ?? "",
    data.utm_term ?? "",
    data.utm_campaign ?? "",
    submittedAt.toISOString(),
    data.gclid ?? "",
    data.fbclid ?? "",
    data.ad_id ?? "",
    data.adset_id ?? "",
    data.campaign_id ?? "",
    data.ad_name ?? "",
    data.adset_name ?? "",
    data.campaign_name ?? "",
    data.placement ?? "",
    data.site_source_name ?? "",
    data.page_url ?? "",
    data.cta_class ?? "",
  ];
}
