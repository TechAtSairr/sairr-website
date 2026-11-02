# Sairr Website — Google Sheets & Lead Alert Integration

- **Project**: `sairr-website`
- **Date**: 2 November 2026
- **Scope**: Google Sheets Append, Email Alert Notification with Lead ID, and Thank-You Page Redirection

---

## 📌 Part 1: Form Integration with Google Sheets & Email Alerts

### 👤 User Prompt

> I am planning to integrate google sheet with our nextjs form. When user fills the form, data is send to google sheet with "/api/send-data-to-sheet" api, when it returns 200 user will be redirected to "/thank-you" page and at the same time send an email with all information which user filled in form alongwith date and time to marketing@sairr.in and tanmay@sairr.in using api "/api/send-email-alert"

### 🤖 Assistant Response & Implementation

The Google Sheets and email alert integration flow is configured and verified.

#### Workflow Architecture

```mermaid
flowchart TD
    A["User submits form<br/>(ContactForm / ContactUsForm)"] --> B["POST /api/send-data-to-sheet"]
    B -->|Google Sheets API (200 OK)| C["Sheet Appends Row"]
    C --> D["router.push('/thank-you')"]
    C -->|Simultaneously with keepalive: true| E["POST /api/send-email-alert"]
    E --> F["Email delivered to<br/>marketing@sairr.in & tanmay@sairr.in"]
```

#### Key Implementation Details

1. **Google Sheets Endpoint (`/api/send-data-to-sheet`)**
   - Receives form data (`tabName`: `"Leads"` or `"ContactUs"`, formatted row `values`, and column bounds).
   - Authenticates using Google Service Account credentials (`GOOGLE_SERVICE_ACCOUNT_EMAIL` & `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`).
   - Appends the row to the target spreadsheet (`GOOGLE_SHEET_ID`) and responds with `{ success: true }` (status 200).
   - Verified against spreadsheet `"Sairr Leads - Tech"` tabs `Leads` & `ContactUs`.

2. **Redirect to `/thank-you` & Simultaneous Email Alert**
   - In `src/components/forms/ContactForm.tsx` and `src/components/forms/ContactUsForm.tsx`:
     ```ts
     await submitToGoogleSheet({
       tabName: "Leads",
       values: formatContactRowForSheet(payload),
     });

     // Sheet API returned 200 OK — fire email alert and redirect to /thank-you at the same time
     const emailContent = frameLeadEmail(payload);
     sendEmailAlert(emailContent).catch((err) => {
       console.error("Failed to send lead alert email:", err);
     });

     onSubmitted?.();
     router.push("/thank-you");
     ```
   - In `src/lib/send-email-alert.ts`, `fetch` includes `keepalive: true` so the POST request completes in the background without delaying the user's redirection to `/thank-you`.

3. **Email Alert Endpoint (`/api/send-email-alert`)**
   - In `src/app/api/send-email-alert/route.ts`:
     - **Recipients**: Defaults to `marketing@sairr.in, tanmay@sairr.in` (overridable via `LEAD_ALERT_EMAIL_TO` or request body).
     - **Date & Time**: Formats submission timestamp in Indian Standard Time (`dd/mm/yyyy hh:mm AM/PM`).
     - **Form Information**: Formats every filled field (Name, WhatsApp Phone, Destination, Journey Type, Departure City, Preferred Month, Message, and Page URL) into both plaintext and a clean HTML table.
     - **SMTP Authentication**: Supports both `GMAIL_APP_PASSWORD` and `GMAIL_PASS` with automatic whitespace and hyphen cleaning to ensure reliable SMTP authentication.

4. **Environment Variables Configured in `.env`**
   - `GOOGLE_SHEET_ID`: Spreadsheet ID
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Service account email
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`: Service account private key
   - `GMAIL_USER`: `tech@sairr.in`
   - `GMAIL_PASS` / `GMAIL_APP_PASSWORD`: Google App Password
   - `LEAD_ALERT_EMAIL_TO`: `"marketing@sairr.in, tanmay@sairr.in"`

---

## 📌 Part 2: Unique Lead ID Generation & Email Template Updates

### 👤 User Prompt

> Can you generate a unique lead id. Add it in body below name and in red header "New Lead Received (Sairr Leads)". Replace red header (Sairr Leads) with lead id.

### 🤖 Assistant Response & Implementation

A unique Lead ID generator was added, and both the email subject, red header, and body table were updated.

#### Changes Made

1. **Unique Lead ID Generator (`src/lib/send-email-alert.ts`)**
   - Added `generateLeadId(prefix = "SL")`:
     ```ts
     /**
      * Generates a unique lead ID (e.g. "SL-8K9P2X").
      * Uses characters that avoid visual ambiguity (no 0/O or 1/I).
      */
     export function generateLeadId(prefix = "SL"): string {
       const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
       let randomPart = "";
       for (let i = 0; i < 6; i++) {
         randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
       }
       return `${prefix}-${randomPart}`;
     }
     ```

2. **Updated Red Header & Subject (`src/components/forms/ContactForm.tsx`)**
   - **Red Header**: Changed from `"New Lead Received (Sairr Leads)"` to:
     ```html
     <h2 style="color: #ec575e; margin-bottom: 16px;">New Lead Received (SL-8K9P2X)</h2>
     ```
   - **Email Subject**: Updated to `New Lead Received (SL-8K9P2X)` so every lead has its own searchable thread in Gmail.

3. **Lead ID in Email Body Below Name (`src/components/forms/ContactForm.tsx`)**
   - Added a dedicated row right under **Name** in both HTML table and plaintext:
     ```html
     <tr>
       <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td>
       <td style="padding: 8px; border-bottom: 1px solid #eee;">...</td>
     </tr>
     <tr>
       <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Lead ID</td>
       <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #ec575e;">SL-8K9P2X</td>
     </tr>
     <tr>
       <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td>
       <td style="padding: 8px; border-bottom: 1px solid #eee;">...</td>
     </tr>
     ```

---

## 📌 Part 3: LeadId Column Added to Google Sheets ("Leads" & "ContactUs" Tabs)

### 👤 User Prompt

> Added leadId in google sheet. Now columns are from A to AC : Name, LeadId, Phone, Where would you like to travel?, Which Destination?, Choose your journey type, Departure City, Preferred Month, Anything else we should know?, utm_source, utm_subsource, utm_medium, utm_id, utm_content, utm_term, utm_campaign, Timestamp, gclid, fbclid, ad_id, adset_id, campaign_id, ad_name, adset_name, campaign_name, placement, site_source_name, page_url, cta_class for "Leads" tab. In "ContactUs" tab, columns are : Name, LeadId, Phone, Email, What is this about? , Anything else you'd like to tell us?, Number of travellers, Preferred date, How did you hear about us?, Timestamp, page_url.

### 🤖 Assistant Response & Implementation

The row formatting functions and form submit handlers have been updated so that the generated `leadId` is written to Column B of both tabs, ensuring exact 1:1 synchronization between the Google Sheet and the Email Alert.

#### Changes Made

1. **"Leads" Tab Mapping (Columns A–AC, 29 columns)**
   - File: `src/lib/validations/contact.ts` ([`formatContactRowForSheet`](file:///Users/aaa/Documents/sairr-website/src/lib/validations/contact.ts#L216-L255)):
     - Column A: `Name`
     - **Column B: `LeadId`** *(new)*
     - Column C: `Phone`
     - Columns D–AC: `Where would you like to travel?` through `cta_class`.
   - File: `src/components/forms/ContactForm.tsx`:
     - Generates `leadId = generateLeadId()` on form submission.
     - Calls `submitToGoogleSheet` with `columns: "A:AC"` and passes `leadId` to both sheet append and email alert.

2. **"ContactUs" Tab Mapping (Columns A–K, 11 columns)**
   - File: `src/lib/validations/contact-us.ts` ([`formatContactUsRowForSheet`](file:///Users/aaa/Documents/sairr-website/src/lib/validations/contact-us.ts#L120-L141)):
     - Column A: `Name`
     - **Column B: `LeadId`** *(new)*
     - Column C: `Phone`
     - Column D: `Email`
     - Columns E–K: `What is this about?` through `page_url`.
   - File: `src/components/forms/ContactUsForm.tsx`:
     - Calls `submitToGoogleSheet` with `columns: "A:K"` and passes `leadId` to both sheet append and email alert.

3. **Google Sheets Range Support**
   - File: `src/lib/google-sheets.ts`: Default append range expanded to `A:AZ` to seamlessly support multi-character column spans.
