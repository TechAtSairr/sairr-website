"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, ChevronDown } from "lucide-react";
import {
  buildContactFormDefaults,
  contactFormSchema,
  destinationCatalog,
  DESTINATION_SOMEWHERE_ELSE,
  formatContactRowForSheet,
  formatJourneyTypeForSubmission,
  getPreferredMonthOptions,
  journeyTypeOptions,
  type ContactFormData,
  type ContactFormFieldValues,
  type ContactFormIntent,
  type TravelDestination,
} from "@/lib/validations/contact";
import { submitToGoogleSheet } from "@/lib/submit-to-sheet";
import {
  formatSubmissionTimestamp,
  generateLeadId,
  sendEmailAlert,
} from "@/lib/send-email-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getStoredUtmParams } from "@/lib/utm";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const fieldClassName =
  "h-12 rounded-xl border-border/60 bg-mist/80 px-4 text-base shadow-none transition-colors placeholder:text-[#5d5d5d]/70 focus-visible:border-brand focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand/15 md:text-sm";

const labelClassName =
  "text-xs font-medium uppercase tracking-[0.14em] text-charcoal";

const errorClassName = "text-sm text-destructive";

const textareaClassName =
  "min-h-32 rounded-xl border-border/60 bg-mist/80 px-4 py-3 text-base shadow-none transition-colors placeholder:text-[#5d5d5d]/70 focus-visible:border-brand focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand/15 md:text-sm";

type ContactFormProps = {
  intent?: ContactFormIntent;
  defaultDestination?: TravelDestination;
  /** `cta-*` class from the button that opened this form (modal flow). */
  ctaClass?: string;
  onSubmitted?: () => void;
};

function SelectChevron() {
  return (
    <ChevronDown
      className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#5d5d5d]"
      aria-hidden
    />
  );
}

function frameLeadEmail(
  data: ContactFormData & { page_url?: string; leadId?: string },
  leadId?: string,
) {
  const timestamp = formatSubmissionTimestamp();
  const finalLeadId = leadId ?? data.leadId ?? generateLeadId();
  const subject = `New Lead Received (${finalLeadId})`;

  const destDisplay =
    data.destination === DESTINATION_SOMEWHERE_ELSE && data.otherDestination
      ? `Somewhere else (${data.otherDestination.trim()})`
      : data.destination || "-";

  const text = `${subject}

Date & Time: ${timestamp}
Name: ${data.name || "-"}
Lead ID: ${finalLeadId}
Phone: ${data.phone || "-"}
Destination: ${destDisplay}
Journey Type: ${formatJourneyTypeForSubmission(data.journeyType) || "-"}
Departure City: ${data.departureCity || "-"}
Preferred Month: ${data.preferredMonth || "-"}
Message: ${data.message || "-"}${data.page_url ? `\nPage URL: ${data.page_url}` : ""}`;

  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #1c2a26; max-width: 600px; line-height: 1.6;">
      <h2 style="color: #ec575e; margin-bottom: 16px;">New Lead Received (${finalLeadId})</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Date & Time</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${timestamp}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name || "-"}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Lead ID</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #ec575e;">${finalLeadId}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${data.phone}" style="color: #1c2a26;">${data.phone || "-"}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Destination</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${destDisplay}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Journey Type</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formatJourneyTypeForSubmission(data.journeyType) || "-"}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Departure City</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.departureCity || "-"}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Preferred Month</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.preferredMonth || "-"}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Message</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.message || "-"}</td></tr>
        ${
          data.page_url
            ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Page URL</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="${data.page_url}">${data.page_url}</a></td></tr>`
            : ""
        }
      </table>
    </div>
  `;

  return { subject, text, html };
}

export function ContactForm({
  intent = "contact",
  defaultDestination,
  ctaClass,
  onSubmitted,
}: ContactFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const preferredMonths = useMemo(() => getPreferredMonthOptions(), []);

  const defaultValues = useMemo(
    () => buildContactFormDefaults(intent, defaultDestination),
    [intent, defaultDestination],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormFieldValues, unknown, ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  const selectedDestination = useWatch({ control, name: "destination" });
  const selectedJourneyType = useWatch({ control, name: "journeyType" });
  const selectedPreferredMonth = useWatch({ control, name: "preferredMonth" });
  const showOtherDestination = selectedDestination === DESTINATION_SOMEWHERE_ELSE;

  useEffect(() => {
    reset(buildContactFormDefaults(intent, defaultDestination));
  }, [defaultDestination, intent, reset]);

  async function onSubmit(data: ContactFormData) {
    try {
      const leadId = generateLeadId();
      const payload = {
        ...data,
        leadId,
        ...getStoredUtmParams(),
        page_url: window.location.href,
        cta_class: ctaClass ?? "",
      };

      await submitToGoogleSheet({
        tabName: "Leads",
        columns: "A:AC",
        values: formatContactRowForSheet(payload, leadId),
      });

      // Sheet API returned 200 OK — send email alert and redirect to /thank-you at the same time
      const emailContent = frameLeadEmail(payload, leadId);
      sendEmailAlert(emailContent).catch((err) => {
        console.error("Failed to send lead alert email:", err);
      });

      onSubmitted?.();
      const isLp = pathname.startsWith("/lp");
      const baseLpPath = pathname
        .replace(/\/thank-you\/?$/, "")
        .replace(/\/+$/, "");
      const thankYouUrl = isLp ? `${baseLpPath}/thank-you` : "/thank-you";
      router.push(thankYouUrl);
    } catch (error) {
      toast.error("Something went wrong", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to send your enquiry. Please try again or contact us directly.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className={labelClassName}>
            Name
          </Label>
          <Input
            id="name"
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            className={cn(fieldClassName, errors.name && "border-destructive")}
            {...register("name")}
          />
          {errors.name && (
            <p className={errorClassName}>{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className={labelClassName}>
            Phone number
          </Label>
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="Your 10-digit WhatsApp no."
            maxLength={10}
            aria-invalid={!!errors.phone}
            className={cn(fieldClassName, errors.phone && "border-destructive")}
            {...register("phone", {
              onChange: (event) => {
                event.target.value = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);
              },
            })}
          />
          {errors.phone && (
            <p className={errorClassName}>{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border/80" aria-hidden />
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
            About the journey
          </p>
          <div className="h-px flex-1 bg-border/80" aria-hidden />
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="destination" className={labelClassName}>
              Where would you like to go?
            </Label>
            <div className="relative">
              <select
                id="destination"
                aria-invalid={!!errors.destination}
                className={cn(
                  fieldClassName,
                  "w-full appearance-none pr-10",
                  !selectedDestination ? "text-[#999]" : "text-gray-900",
                  errors.destination && "border-destructive",
                )}
                {...register("destination")}
              >
                <option value="" disabled>
                  Select a destination
                </option>
                {destinationCatalog.map((entry) => (
                  <option key={entry.value} value={entry.value}>
                    {entry.value}
                    {entry.status === "coming-soon" ? " (coming soon)" : ""}
                  </option>
                ))}
                <option value={DESTINATION_SOMEWHERE_ELSE}>
                  {DESTINATION_SOMEWHERE_ELSE}
                </option>
              </select>
              <SelectChevron />
            </div>
            {errors.destination && (
              <p className={errorClassName}>{errors.destination.message}</p>
            )}
          </div>

          {showOtherDestination ? (
            <div className="space-y-2">
              <Label htmlFor="otherDestination" className={labelClassName}>
                Which destination?
              </Label>
              <Input
                id="otherDestination"
                placeholder="One place, or a few you're considering"
                aria-invalid={!!errors.otherDestination}
                className={cn(
                  fieldClassName,
                  errors.otherDestination && "border-destructive",
                )}
                {...register("otherDestination")}
              />
              {errors.otherDestination && (
                <p className={errorClassName}>
                  {errors.otherDestination.message}
                </p>
              )}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="journeyType" className={labelClassName}>
              Choose your journey type
            </Label>
            <div className="relative">
              <select
                id="journeyType"
                aria-invalid={!!errors.journeyType}
                className={cn(
                  fieldClassName,
                  "w-full appearance-none pr-10",
                  !selectedJourneyType ? "text-[#999]" : "text-gray-900",
                  errors.journeyType && "border-destructive",
                )}
                {...register("journeyType")}
              >
                <option value="" disabled>Select group or private journey</option>
                {journeyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
            {errors.journeyType && (
              <p className={errorClassName}>{errors.journeyType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="departureCity" className={labelClassName}>
              Departure city{" "}
              <span className="normal-case tracking-normal text-[#5d5d5d]">
                (optional)
              </span>
            </Label>
            <Input
              id="departureCity"
              placeholder="Delhi, Bangalore, Mumbai, or anywhere else"
              aria-invalid={!!errors.departureCity}
              className={cn(
                fieldClassName,
                errors.departureCity && "border-destructive",
              )}
              {...register("departureCity")}
            />
            {errors.departureCity && (
              <p className={errorClassName}>{errors.departureCity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredMonth" className={labelClassName}>
              Preferred month{" "}
              <span className="normal-case tracking-normal text-[#5d5d5d]">
                (optional)
              </span>
            </Label>
            <div className="relative">
              <select
                id="preferredMonth"
                aria-invalid={!!errors.preferredMonth}
                className={cn(
                  fieldClassName,
                  "w-full appearance-none pr-10",
                  !selectedPreferredMonth ? "text-[#999]" : "text-gray-900",
                  errors.preferredMonth && "border-destructive",
                )}
                {...register("preferredMonth")}
              >
                <option value="" disabled>Select a month</option>
                {preferredMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
            {errors.preferredMonth && (
              <p className={errorClassName}>{errors.preferredMonth.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className={labelClassName}>
              Anything else we should know?{" "}
              <span className="normal-case tracking-normal text-[#5d5d5d]">
                (optional)
              </span>
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us who's travelling, how many, your preferences, or anything else you'd like us to know"
              rows={5}
              aria-invalid={!!errors.message}
              className={cn(
                textareaClassName,
                errors.message && "border-destructive",
              )}
              {...register("message")}
            />
            {errors.message && (
              <p className={errorClassName}>{errors.message.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-border/60 pt-6">
        <p className="text-[10px] sm:text-xs text-center text-[#5d5d5d]-500">By submitting, you agree to be contacted by Sairr via phone or WhatsApp.</p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 rounded bg-brand px-8 text-sm font-semibold hover:bg-forest sm:min-w-[12rem]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
