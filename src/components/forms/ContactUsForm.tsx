"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, ChevronDown } from "lucide-react";
import {
  buildContactUsFormDefaults,
  contactUsFormSchema,
  contactUsTopicOptions,
  formatContactUsRowForSheet,
  howDidYouHearOptions,
  type ContactUsFormData,
  type ContactUsFormFieldValues,
} from "@/lib/validations/contact-us";
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
  "h-10 rounded-xl border-border/60 bg-mist/80 px-4 text-base shadow-none transition-colors placeholder:text-[#5d5d5d]/70 focus-visible:border-brand focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand/15 md:text-sm";

const labelClassName =
  "text-xs font-medium uppercase tracking-[0.14em] text-charcoal";

const errorClassName = "text-sm text-destructive";

const textareaClassName =
  "min-h-32 rounded-xl border-border/60 bg-mist/80 px-4 py-3 text-base shadow-none transition-colors placeholder:text-[#5d5d5d]/70 focus-visible:border-brand focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand/15 md:text-sm";

function SelectChevron() {
  return (
    <ChevronDown
      className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#5d5d5d]"
      aria-hidden
    />
  );
}

type ContactUsFormProps = {
  onSubmitted?: () => void;
  /**
   * Prefill any fields (visible or hidden). Hidden reserved fields always map to
   * sheet columns F–H regardless of whether they are shown in the UI.
   */
  prefill?: Partial<ContactUsFormFieldValues>;
  /** Show reserved sheet columns F–H in the UI (default: hidden inputs only). */
  showReservedFields?: boolean;
  /** Teal panel styling for the contact page. */
  appearance?: "default" | "teal";
};

function frameContactUsEmail(
  data: ContactUsFormData & { page_url?: string; leadId?: string },
  leadId?: string,
) {
  const timestamp = formatSubmissionTimestamp();
  const finalLeadId = leadId ?? data.leadId ?? generateLeadId("CU");
  const subject = `New Contact Inquiry (${finalLeadId})`;

  const text = `${subject}

Date & Time: ${timestamp}
Name: ${data.name || "-"}
Lead ID: ${finalLeadId}
Phone: ${data.phone || "-"}
Email: ${data.email || "-"}
Topic: ${data.topic || "-"}
Number of Travellers: ${data.numberOfTravellers != null ? data.numberOfTravellers : "-"}
Preferred Date: ${data.preferredDate || "-"}
How Did You Hear: ${data.howDidYouHear || "-"}
Message: ${data.message || "-"}${data.page_url ? `\nPage URL: ${data.page_url}` : ""}`;

  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #1c2a26; max-width: 600px; line-height: 1.6;">
      <h2 style="color: #1f3a34; margin-bottom: 16px;">${subject}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 170px;">Date & Time</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${timestamp}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name || "-"}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Lead ID</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #0E5E6F;">${finalLeadId}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${data.phone}" style="color: #1c2a26;">${data.phone || "-"}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email || "-"}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Topic</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.topic || "-"}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Number of Travellers</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.numberOfTravellers != null ? data.numberOfTravellers : "-"}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Preferred Date</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.preferredDate || "-"}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">How Did You Hear</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.howDidYouHear || "-"}</td></tr>
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

export function ContactUsForm({
  onSubmitted,
  prefill,
  showReservedFields = false,
  appearance = "default",
}: ContactUsFormProps) {
  const isTeal = appearance === "teal";
  const labels = isTeal
    ? "text-[9px] md:text-[11px] font-medium uppercase tracking-[0.12em] text-white"
    : labelClassName;
  const fields = isTeal
    ? "h-8 md:h-10 rounded-[4px] md:rounded-[8px] border-0 bg-white px-2 md:px-4 text-base text-charcoal shadow-none transition-colors placeholder:text-[11px] md:placeholder:text-sm placeholder:text-[#5d5d5d]/70 focus-visible:ring-2 focus-visible:ring-white/30 md:text-sm"
    : fieldClassName;
  const textareas = isTeal
    ? "min-h-16 rounded-[4px] md:rounded-[8px] border-0 bg-white px-2 md:px-4 py-3 text-base text-charcoal shadow-none transition-colors placeholder:text-[11px] md:placeholder:text-sm placeholder:text-[#5d5d5d]/70 focus-visible:ring-2 focus-visible:ring-white/30 md:text-sm"
    : textareaClassName;
  const optionalMuted = isTeal
    ? "normal-case tracking-normal text-white/70"
    : "normal-case tracking-normal text-[#5d5d5d]";
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactUsFormFieldValues, unknown, ContactUsFormData>({
    resolver: zodResolver(contactUsFormSchema),
    defaultValues: { ...buildContactUsFormDefaults(), ...prefill },
  });

  useEffect(() => {
    reset({ ...buildContactUsFormDefaults(), ...prefill });
  }, [prefill, reset]);

  const selectedTopic = useWatch({ control, name: "topic" });

  async function onSubmit(data: ContactUsFormData) {
    try {
      const leadId = generateLeadId("CU");
      const payload = {
        ...data,
        leadId,
        ...getStoredUtmParams(),
        page_url: window.location.href,
      };

      await submitToGoogleSheet({
        tabName: "ContactUs",
        columns: "A:K",
        values: formatContactUsRowForSheet(payload, leadId),
      });

      // Sheet API returned 200 OK — send email alert and redirect to /thank-you at the same time
      const emailContent = frameContactUsEmail(payload, leadId);
      sendEmailAlert(emailContent).catch((err) => {
        console.error("Failed to send contact inquiry alert email:", err);
      });

      onSubmitted?.();
      router.push("/thank-you");
    } catch (error) {
      toast.error("Something went wrong", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to send your message. Please try again or contact us directly.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      {!showReservedFields ? (
        <>
          <input type="hidden" {...register("preferredDate")} />
          <input type="hidden" {...register("howDidYouHear")} />
          <input
            type="hidden"
            {...register("numberOfTravellers", { valueAsNumber: true })}
          />
        </>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="cu-travellers" className={labels}>
                Number of travellers
              </Label>
              <Input
                id="cu-travellers"
                type="number"
                min={1}
                max={999}
                className={fields}
                {...register("numberOfTravellers", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cu-preferred-date" className={labels}>
                Preferred date
              </Label>
              <Input
                id="cu-preferred-date"
                type="date"
                className={fields}
                {...register("preferredDate")}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="cu-how-hear" className={labels}>
              How did you hear about us?
            </Label>
            <div className="relative">
              <select
                id="cu-how-hear"
                className={cn(
                  fields,
                  "w-full appearance-none pr-10",
                )}
                {...register("howDidYouHear")}
              >
                <option value="">Select an option</option>
                {howDidYouHearOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>
        </div>
      )}

      {/* Name + Phone */}
      <div className="grid gap-3 md:gap-6 grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="cu-name" className={labels}>
            Name
          </Label>
          <Input
            id="cu-name"
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            className={cn(fields, errors.name && "border-destructive")}
            {...register("name")}
          />
          {errors.name && (
            <p className={errorClassName}>{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="cu-phone" className={labels}>
            Phone number
          </Label>
          <Input
            id="cu-phone"
            type="tel"
            inputMode="numeric"
            placeholder="Your 10 digit WhatsApp no."
            maxLength={10}
            aria-invalid={!!errors.phone}
            className={cn(fields, errors.phone && "border-destructive")}
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

      {/* Email (optional) */}
      <div className="space-y-1">
        <Label htmlFor="cu-email" className={labels}>
          Email{" "}
          <span className={optionalMuted}>
            (optional)
          </span>
        </Label>
        <Input
          id="cu-email"
          type="email"
          inputMode="email"
          placeholder="Your email address"
          aria-invalid={!!errors.email}
          className={cn(fields, errors.email && "border-destructive")}
          {...register("email")}
        />
        {errors.email && (
          <p className={errorClassName}>{errors.email.message}</p>
        )}
      </div>

      {/* Topic */}
      <div className="space-y-1">
        <Label htmlFor="cu-topic" className={labels}>
          What is this about?
        </Label>
        <div className="relative">
          <select
            id="cu-topic"
            aria-invalid={!!errors.topic}
            className={cn(
              fields,
              "w-full appearance-none pr-10 !text-[11px] md:!text-sm",
              !selectedTopic ? "text-[#999]" : "text-gray-900",
              errors.topic && "border-destructive",
            )}
            {...register("topic")}
          >
            <option value="" disabled>
              Select a topic
            </option>
            {contactUsTopicOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <SelectChevron />
        </div>
        {errors.topic && (
          <p className={errorClassName}>{errors.topic.message}</p>
        )}
      </div>

      {/* Message (optional) */}
      <div className="space-y-1">
        <Label htmlFor="cu-message" className={labels}>
          Anything else you&apos;d like to tell us?{" "}
          <span className={optionalMuted}>
            (optional)
          </span>
        </Label>
        <Textarea
          id="cu-message"
          placeholder="Tell us little more"
          rows={5}
          aria-invalid={!!errors.message}
          className={cn(
            textareas,
            errors.message && "border-destructive",
          )}
          {...register("message")}
        />
        {errors.message && (
          <p className={errorClassName}>{errors.message.message}</p>
        )}
      </div>

      <div
        className={cn(
          "flex flex-col gap-4 pt-2",
          !isTeal && "border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "h-10 px-8 text-sm font-semibold",
            isTeal
              ? "w-[12rem] rounded-[4px] bg-[#EC575E] px-6 text-white hover:bg-[#EC575E]/90"
              : "rounded bg-brand hover:bg-forest sm:min-w-[12rem]",
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
