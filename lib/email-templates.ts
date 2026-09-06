import type { Booking } from "@/types/booking";

function formatRupee(amount: number | string): string {
  const n = Number(amount || 0);
  return "₹" + n.toLocaleString("en-IN");
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * GUEST BOOKING CONFIRMATION EMAIL TEMPLATE
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function getGuestConfirmationEmailHtml(booking: Booking, siteUrl = "https://thecometas.com"): string {
  const checkInFormatted = booking.checkIn ? new Date(booking.checkIn).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : booking.checkIn;
  const checkOutFormatted = booking.checkOut ? new Date(booking.checkOut).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : booking.checkOut;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reservation Confirmed - The Cometas Homestay</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F6F3ED; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; border-spacing: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid rgba(200, 157, 69, 0.35); box-shadow: 0 15px 35px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #15103A 0%, #2C2473 60%, #1F174B 100%); padding: 40px 30px; text-align: center; }
    .badge { display: inline-block; background: rgba(200, 157, 69, 0.2); border: 1px solid #C89D45; color: #F3D27A; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; padding: 6px 16px; rounded-radius: 50px; border-radius: 50px; margin-bottom: 12px; }
    .h1 { color: #FFFFFF; font-size: 26px; font-weight: 700; margin: 0 0 8px 0; font-family: Georgia, serif; }
    .ref-box { background: rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 20px; display: inline-block; color: #FFFFFF; font-size: 14px; font-family: monospace; font-weight: bold; letter-spacing: 1px; margin-top: 10px; border: 1px dashed rgba(200, 157, 69, 0.6); }
    .content { padding: 35px 30px; color: #2D3748; }
    .greeting { font-size: 16px; line-height: 1.6; color: #2D3748; margin-bottom: 24px; }
    .card { background-color: #FAF7F0; border-radius: 18px; border: 1px solid rgba(200, 157, 69, 0.25); padding: 22px; margin-bottom: 24px; }
    .card-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #C62828; margin: 0 0 16px 0; }
    .grid-row { padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); font-size: 13px; }
    .grid-row:last-child { border-bottom: none; }
    .label { color: #718096; font-weight: 500; }
    .value { color: #1A202C; font-weight: 700; text-align: right; }
    .meal-pill { display: inline-block; background-color: #E8F5E9; color: #2E7D32; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 20px; border: 1px solid #A5D6A7; }
    .total-banner { background: linear-gradient(135deg, #2C2473 0%, #15103A 100%); border-radius: 16px; padding: 20px; color: #FFFFFF; margin: 25px 0; display: flex; justify-content: space-between; align-items: center; }
    .guideline-box { background-color: #FFFDF8; border-left: 4px solid #C89D45; border-radius: 0 12px 12px 0; padding: 16px 20px; margin: 24px 0; font-size: 12px; line-height: 1.6; color: #4A5568; }
    .footer { background-color: #FAF8F5; padding: 30px; text-align: center; border-top: 1px solid rgba(200, 157, 69, 0.15); font-size: 12px; color: #718096; line-height: 1.6; }
    .btn { display: inline-block; background: linear-gradient(135deg, #C62828 0%, #8B1E1E 100%); color: #FFFFFF !important; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 14px 28px; text-decoration: none; border-radius: 12px; margin-top: 10px; }
    .whatsapp-btn { display: inline-block; background-color: #25D366; color: #FFFFFF !important; font-size: 12px; font-weight: 700; padding: 8px 18px; border-radius: 20px; text-decoration: none; margin-top: 6px; }
  </style>
</head>
<body style="padding: 20px 0;">
  <div class="container">
    <!-- HEADER -->
    <div class="header">
      <div class="badge">The Cometas Himalayan Retreat</div>
      <h1 class="h1">Your Reservation is Confirmed</h1>
      <p style="color: #E2E8F0; font-size: 13px; margin: 0;">We look forward to welcoming you to Latpanchar (4,500 ft)</p>
      <div class="ref-box">
        BOOKING REF: ${booking.bookingNumber || "LPH-" + booking.id}
      </div>
    </div>

    <!-- CONTENT -->
    <div class="content">
      <p class="greeting">
        Dear <strong>${booking.guestName}</strong>,<br><br>
        Thank you for reserving your Himalayan retreat with us! Your reservation has been successfully confirmed. Below is the complete summary of your stay and package details.
      </p>

      <!-- STAY SUMMARY CARD -->
      <div class="card">
        <div class="card-title">Stay &amp; Accommodation Details</div>
        <table width="100%">
          <tr class="grid-row">
            <td class="label" width="40%">Room Reserved</td>
            <td class="value">${booking.roomTitle}</td>
          </tr>
          <tr class="grid-row">
            <td class="label">Check-In Date</td>
            <td class="value">${checkInFormatted} (from 12:00 PM)</td>
          </tr>
          <tr class="grid-row">
            <td class="label">Check-Out Date</td>
            <td class="value">${checkOutFormatted} (by 11:00 AM)</td>
          </tr>
          <tr class="grid-row">
            <td class="label">Duration</td>
            <td class="value">${booking.nights} Night${booking.nights !== 1 ? "s" : ""}</td>
          </tr>
          <tr class="grid-row">
            <td class="label">Number of Guests</td>
            <td class="value">${booking.guestsCount} Guest${booking.guestsCount !== 1 ? "s" : ""}</td>
          </tr>
          <tr class="grid-row">
            <td class="label">Fooding &amp; Lodging</td>
            <td class="value"><span class="meal-pill">✓ All 4 Daily Meals Included</span></td>
          </tr>
        </table>
      </div>

      <!-- MEAL PLAN INCLUDED -->
      <div class="guideline-box">
        <strong style="color: #7A5818; display: block; margin-bottom: 4px;">🌿 Fooding &amp; Lodging Package Inclusions:</strong>
        • <strong>Breakfast:</strong> Traditional Puri Bhaji / Paratha with tea &amp; farm eggs<br>
        • <strong>Lunch:</strong> Authentic Himalayan Bengali / Nepali Thali (Rice, Dal, 2 Sabzis, Chicken/Fish/Egg curry, Salad, Papad)<br>
        • <strong>Evening:</strong> Freshly brewed Darjeeling Tea with hot pakoras &amp; biscuits<br>
        • <strong>Dinner:</strong> Warm mountain supper with Roti/Rice, seasonal greens, Dal &amp; local specialty
      </div>

      <!-- SPECIAL REQUESTS (IF ANY) -->
      ${booking.specialRequests ? `
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-title">Your Special Requests / Dietary Preferences</div>
        <p style="margin: 0; font-size: 13px; color: #4A5568; font-style: italic;">&ldquo;${booking.specialRequests}&rdquo;</p>
      </div>
      ` : ""}

      <!-- TOTAL PRICE CARD -->
      <div style="background: linear-gradient(135deg, #2C2473 0%, #15103A 100%); border-radius: 16px; padding: 22px; color: #FFFFFF;">
        <table width="100%">
          <tr>
            <td>
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #CBD5E0; display: block;">Total Amount Payable</span>
              <span style="font-size: 26px; font-weight: 700; color: #F3D27A; font-family: Georgia, serif;">${formatRupee(booking.totalAmount)}</span>
              <span style="font-size: 11px; color: #A0AEC0; display: block; margin-top: 2px;">Fooding &amp; Lodging for ${booking.guestsCount} guest(s) · ${booking.nights} night(s)</span>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="background-color: #2E7D32; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; letter-spacing: 1px;">
                ${booking.status || "CONFIRMED"}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- ESSENTIAL GUIDELINES -->
      <div style="margin-top: 30px;">
        <h4 style="font-family: Georgia, serif; font-size: 16px; color: #1A202C; margin: 0 0 10px 0;">Getting Ready for Latpanchar</h4>
        <ul style="font-size: 13px; color: #4A5568; line-height: 1.7; padding-left: 20px; margin: 0;">
          <li><strong>Elevation &amp; Weather:</strong> Latpanchar is situated at 4,500 ft inside Mahananda Sanctuary. Evenings can be cool, so please carry a light jacket/windcheater.</li>
          <li><strong>Bird Watching:</strong> Home to the rare Rufous-necked Hornbill. Remember to pack your binoculars and telephoto camera lens!</li>
          <li><strong>Transport:</strong> Bolero / Scorpio cab transfers from Bagdogra Airport (IXB) or NJP station can be coordinated with our desk.</li>
        </ul>
      </div>

      <!-- CALL TO ACTION & WHATSAPP -->
      <div style="text-align: center; margin-top: 35px; padding-top: 25px; border-top: 1px solid #E2E8F0;">
        <p style="font-size: 13px; color: #4A5568; margin-bottom: 12px;">Need help with cab transfers, early check-in, or custom requests?</p>
        <a href="https://wa.me/919832012345?text=Hello%20Lotus%20Paradise,%20I%20have%20a%20confirmed%20booking%20(Ref:%20${booking.bookingNumber})" class="whatsapp-btn">
          💬 Chat with Host on WhatsApp
        </a>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <strong style="color: #2C2473; font-size: 13px;">The Cometas — Lotus Paradise Homestay</strong><br>
      Upper Latpanchar Forest Road, Kurseong Division, Darjeeling District, West Bengal - 734008<br>
      Contact: +91 98320 12345 · +91 97323 00111<br>
      Email: thecometas2025@gmail.com · Web: <a href="${siteUrl}" style="color: #C62828; text-decoration: none;">www.thecometas.com</a>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ADMIN NOTIFICATION EMAIL TEMPLATE (ALERT ON NEW BOOKING)
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function getAdminAlertEmailHtml(
  booking: Booking,
  siteUrl = "http://localhost:3000",
  sheetUrl?: string
): string {
  const checkInFormatted = booking.checkIn ? new Date(booking.checkIn).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : booking.checkIn;
  const checkOutFormatted = booking.checkOut ? new Date(booking.checkOut).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : booking.checkOut;
  const targetSheetLink = sheetUrl || "https://docs.google.com/spreadsheets";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>⚡ New Booking Alert - ${booking.bookingNumber}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0F0C29; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 20px auto; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 2px solid #C89D45; }
    .header { background: #15103A; padding: 30px; text-align: center; border-bottom: 3px solid #C62828; }
    .h1 { color: #FFFFFF; font-size: 22px; font-weight: bold; margin: 8px 0; font-family: Georgia, serif; }
    .content { padding: 30px; }
    .card { background-color: #FAF8F5; border-radius: 14px; border: 1px solid rgba(200, 157, 69, 0.3); padding: 18px; margin-bottom: 20px; }
    .card-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #C62828; margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #EDE8DF; }
    .row:last-child { border-bottom: none; }
    .label { color: #64748B; font-weight: 500; }
    .value { color: #0F172A; font-weight: 700; text-align: right; }
    .amount-box { background: #2C2473; color: #FFFFFF; padding: 16px 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
    .btn { display: inline-block; background: #C62828; color: #FFFFFF !important; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding: 12px 24px; text-decoration: none; border-radius: 8px; }
    .btn-green { display: inline-block; background: #25D366; color: #FFFFFF !important; font-size: 12px; font-weight: bold; padding: 8px 16px; border-radius: 6px; text-decoration: none; margin-left: 8px; }
  </style>
</head>
<body style="padding: 20px 0;">
  <div class="container">
    <div class="header">
      <span style="background-color: #C62828; color: #FFFFFF; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; padding: 4px 12px; border-radius: 20px;">
        ⚡ NEW GUEST BOOKING
      </span>
      <h1 class="h1">New Stay Reservation Received</h1>
      <p style="color: #CBD5E1; font-size: 13px; margin: 0;">Ref: <strong style="color: #F3D27A;">${booking.bookingNumber}</strong> · ${new Date().toLocaleString("en-IN")}</p>
    </div>

    <div class="content">
      <!-- GUEST DETAILS -->
      <div class="card">
        <div class="card-title">Guest Contact Information</div>
        <table width="100%" style="font-size: 13px;">
          <tr style="border-bottom: 1px solid #EDE8DF;">
            <td style="padding: 6px 0; color: #64748B;">Guest Name:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; text-align: right;">${booking.guestName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #EDE8DF;">
            <td style="padding: 6px 0; color: #64748B;">Phone / WhatsApp:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; text-align: right;">
              <a href="tel:${booking.phone}" style="color: #C62828; text-decoration: none;">${booking.phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Email Address:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; text-align: right;">
              <a href="mailto:${booking.email}" style="color: #2C2473; text-decoration: none;">${booking.email}</a>
            </td>
          </tr>
        </table>
      </div>

      <!-- STAY DETAILS -->
      <div class="card">
        <div class="card-title">Reservation Breakdown</div>
        <table width="100%" style="font-size: 13px;">
          <tr style="border-bottom: 1px solid #EDE8DF;">
            <td style="padding: 6px 0; color: #64748B;">Room &amp; Package:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; text-align: right;">${booking.roomTitle}</td>
          </tr>
          <tr style="border-bottom: 1px solid #EDE8DF;">
            <td style="padding: 6px 0; color: #64748B;">Dates:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; text-align: right;">${checkInFormatted} → ${checkOutFormatted}</td>
          </tr>
          <tr style="border-bottom: 1px solid #EDE8DF;">
            <td style="padding: 6px 0; color: #64748B;">Duration &amp; Pax:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; text-align: right;">${booking.nights} Nights · ${booking.guestsCount} Guests</td>
          </tr>
          ${booking.specialRequests ? `
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Special Notes:</td>
            <td style="padding: 6px 0; color: #C62828; font-weight: 600; text-align: right;">${booking.specialRequests}</td>
          </tr>
          ` : ""}
        </table>
      </div>

      <!-- TOTAL VALUE -->
      <div class="amount-box">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.8; display: block;">Total Booking Amount</span>
        <span style="font-size: 26px; font-weight: bold; color: #F3D27A; font-family: Georgia, serif;">${formatRupee(booking.totalAmount)}</span>
        <span style="font-size: 11px; display: block; opacity: 0.8; margin-top: 2px;">Status: ${(booking.status || "CONFIRMED").toUpperCase()}</span>
      </div>

      <!-- QUICK ACTIONS -->
      <div style="text-align: center; margin-top: 25px;">
        <a href="${targetSheetLink}" class="btn" style="background-color: #0F9D58; color: #FFFFFF !important;">
          📊 Open Google Sheet
        </a>
        <a href="https://wa.me/${(booking.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(booking.guestName)},%20thank%20you%20for%20booking%20with%20The%20Cometas%20(Ref:%20${booking.bookingNumber})" class="btn-green">
          WhatsApp Guest
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

export function getGuestConfirmationEmailText(booking: Booking): string {
  const checkInFormatted = booking.checkIn ? new Date(booking.checkIn).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : booking.checkIn;
  const checkOutFormatted = booking.checkOut ? new Date(booking.checkOut).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : booking.checkOut;

  return `Dear ${booking.guestName},

Thank you for reserving your Himalayan retreat with us! Your reservation has been successfully confirmed.

RESERVATION SUMMARY:
Booking Reference: ${booking.bookingNumber || "LPH-" + booking.id}
Room: ${booking.roomTitle}
Check-In: ${checkInFormatted} (from 12:00 PM)
Check-Out: ${checkOutFormatted} (by 11:00 AM)
Duration: ${booking.nights} Night(s)
Guests: ${booking.guestsCount} Guest(s)
Package: Fooding & Lodging (All 4 Daily Meals Included: Morning Tea, Breakfast, Lunch, Evening Snacks & Tea, Dinner)
Total Amount: ${formatRupee(booking.totalAmount)}
Status: ${booking.status || "CONFIRMED"}
${booking.specialRequests ? `Special Requests: ${booking.specialRequests}\n` : ""}
Location: The Cometas Himalayan Retreat, Latpanchar (4,500 ft), Kurseong, Darjeeling District, West Bengal
Contact / WhatsApp: +91 98320 12345

We look forward to hosting you in the Himalayas!
The Cometas Homestay Team`;
}

export function getAdminAlertEmailText(booking: Booking, sheetUrl?: string): string {
  const checkInFormatted = booking.checkIn ? new Date(booking.checkIn).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : booking.checkIn;
  const checkOutFormatted = booking.checkOut ? new Date(booking.checkOut).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : booking.checkOut;
  const targetSheetLink = sheetUrl || "https://docs.google.com/spreadsheets";

  return `NEW GUEST BOOKING RECEIVED

Booking Reference: ${booking.bookingNumber || "LPH-" + booking.id}
Guest Name: ${booking.guestName}
Phone / WhatsApp: ${booking.phone}
Email: ${booking.email}
Room & Package: ${booking.roomTitle}
Dates: ${checkInFormatted} to ${checkOutFormatted} (${booking.nights} nights)
Total Guests: ${booking.guestsCount}
Total Amount: ${formatRupee(booking.totalAmount)}
Status: ${booking.status || "CONFIRMED"}
${booking.specialRequests ? `Special Requests: ${booking.specialRequests}\n` : ""}
Google Sheet: ${targetSheetLink}
Timestamp: ${new Date().toLocaleString("en-IN")}`;
}

export interface CorporateLeadEmailData {
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  employeesCount: number | string;
  preferredDates: string;
  startDate?: string;
  endDate?: string;
  nights?: number;
  budgetRange?: string;
  requirements?: string;
  id?: string;
  createdAt?: string;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CORPORATE GUEST / CLIENT PROPOSAL ACKNOWLEDGEMENT EMAIL TEMPLATE
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function getCorporateGuestEmailHtml(
  lead: CorporateLeadEmailData,
  siteUrl = "https://thecometas.com"
): string {
  const leadRef = lead.id || `CORP-${Date.now().toString().slice(-6)}`;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Corporate Retreat Proposal Request - The Cometas</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F6F3ED; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; border-spacing: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid rgba(200, 157, 69, 0.35); box-shadow: 0 15px 35px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #15103A 0%, #2C2473 60%, #1F174B 100%); padding: 36px 30px; text-align: center; }
    .badge { display: inline-block; background: rgba(200, 157, 69, 0.2); border: 1px solid #C89D45; color: #F3D27A; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; padding: 6px 16px; border-radius: 50px; margin-bottom: 12px; }
    .h1 { color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 0 0 8px 0; font-family: Georgia, serif; }
    .ref-box { background: rgba(255,255,255,0.08); border-radius: 12px; padding: 8px 18px; display: inline-block; color: #FFFFFF; font-size: 13px; font-family: monospace; font-weight: bold; letter-spacing: 1px; margin-top: 10px; border: 1px dashed rgba(200, 157, 69, 0.6); }
    .content { padding: 35px 30px; color: #2D3748; }
    .greeting { font-size: 15px; line-height: 1.6; color: #2D3748; margin-bottom: 22px; }
    .card { background-color: #FAF7F0; border-radius: 18px; border: 1px solid rgba(200, 157, 69, 0.25); padding: 22px; margin-bottom: 24px; }
    .card-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #C62828; margin: 0 0 14px 0; }
    .grid-row { padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); font-size: 13px; }
    .grid-row:last-child { border-bottom: none; }
    .label { color: #718096; font-weight: 500; }
    .value { color: #1A202C; font-weight: 700; text-align: right; }
    .highlight-pill { display: inline-block; background-color: #FEF3C7; color: #92400E; font-weight: 700; font-size: 11px; padding: 3px 10px; border-radius: 20px; border: 1px solid #FCD34D; }
    .amenities-box { background-color: #FFFDF8; border-left: 4px solid #C89D45; border-radius: 0 14px 14px 0; padding: 18px 20px; margin: 24px 0; font-size: 13px; line-height: 1.7; color: #4A5568; }
    .footer { background-color: #FAF8F5; padding: 30px; text-align: center; border-top: 1px solid rgba(200, 157, 69, 0.15); font-size: 12px; color: #718096; line-height: 1.6; }
    .whatsapp-btn { display: inline-block; background-color: #25D366; color: #FFFFFF !important; font-size: 13px; font-weight: 700; padding: 12px 24px; border-radius: 24px; text-decoration: none; margin-top: 8px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3); }
  </style>
</head>
<body style="padding: 20px 0;">
  <div class="container">
    <div class="header">
      <div class="badge">The Cometas Himalayan Retreat</div>
      <h1 class="h1">Corporate Offsite Inquiry Received</h1>
      <p style="color: #E2E8F0; font-size: 13px; margin: 0;">Latpanchar, Darjeeling District · Elevation 4,500 ft</p>
      <div class="ref-box">
        REF ID: ${leadRef}
      </div>
    </div>

    <div class="content">
      <p class="greeting">
        Dear <strong>${lead.contactPerson}</strong>,<br><br>
        Thank you for reaching out to <strong>The Cometas Homestay</strong> for <strong>${lead.company}</strong>'s upcoming mountain retreat! We have received your inquiry and our Corporate Concierge team is currently crafting a customized proposal for your team.
      </p>

      <!-- SUMMARY CARD -->
      <div class="card">
        <div class="card-title">Retreat Requirements Summary</div>
        <table width="100%">
          <tr class="grid-row">
            <td class="label" width="40%">Organization / Company</td>
            <td class="value">${lead.company}</td>
          </tr>
          <tr class="grid-row">
            <td class="label">Contact Person</td>
            <td class="value">${lead.contactPerson}</td>
          </tr>
          <tr class="grid-row">
            <td class="label">Team Size</td>
            <td class="value"><span class="highlight-pill">${lead.employeesCount} Members</span></td>
          </tr>
          <tr class="grid-row">
            <td class="label">Preferred Dates</td>
            <td class="value" style="color: #C62828;">${lead.preferredDates || "Flexible"}</td>
          </tr>
          ${lead.budgetRange ? `
          <tr class="grid-row">
            <td class="label">Estimated Budget</td>
            <td class="value">${lead.budgetRange}</td>
          </tr>
          ` : ""}
          <tr class="grid-row">
            <td class="label">Phone / WhatsApp</td>
            <td class="value">${lead.phone}</td>
          </tr>
          <tr class="grid-row">
            <td class="label">Work Email</td>
            <td class="value">${lead.email}</td>
          </tr>
        </table>
      </div>

      ${lead.requirements ? `
      <!-- SPECIAL REQUESTS -->
      <div class="card" style="background-color: #FFFFFF; border: 1px dashed rgba(200, 157, 69, 0.5);">
        <div class="card-title">Special Offsite Requests &amp; Focus</div>
        <p style="margin: 0; font-size: 13px; color: #4A5568; font-style: italic;">
          &ldquo;${lead.requirements}&rdquo;
        </p>
      </div>
      ` : ""}

      <!-- WHAT'S INCLUDED IN THE COMETAS CORPORATE EXPERIENCE -->
      <div class="amenities-box">
        <strong style="color: #7A5818; font-size: 14px; display: block; margin-bottom: 6px;">
          🏔️ The Cometas Corporate Mountain Experience Highlights:
        </strong>
        • <strong>High-Speed Optical Fiber WiFi:</strong> Uninterrupted connectivity for video calls, presentations, and remote work.<br>
        • <strong>Colonial Strategy Lounge:</strong> Projector, screen, ergonomic seating, and fresh Darjeeling tea service.<br>
        • <strong>Outdoor Bonfire &amp; Acoustic Music:</strong> Starry night team bonding by the wood-fired bonfire.<br>
        • <strong>Full Fooding &amp; Lodging:</strong> 4 daily gourmet meals including traditional Bengali feasts and mountain barbecues.<br>
        • <strong>Guided Team Ridge Treks:</strong> Refreshing pine forest trails and Himalayan birding experiences.
      </div>

      <!-- NEXT STEPS -->
      <div style="background: linear-gradient(135deg, #FAF8F5 0%, #F4EFE6 100%); border-radius: 16px; padding: 20px; border: 1px solid rgba(200, 157, 69, 0.4); margin: 24px 0;">
        <h4 style="font-family: Georgia, serif; font-size: 15px; color: #1A202C; margin: 0 0 6px 0;">What Happens Next?</h4>
        <p style="font-size: 13px; color: #4A5568; margin: 0; line-height: 1.6;">
          Our Corporate Coordinator will review your requested dates, verify homestay room allotments, and send a detailed itinerary proposal and formal quote to <strong>${lead.email}</strong> within <strong>4 hours</strong>.
        </p>
      </div>

      <!-- WHATSAPP CTA -->
      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 13px; color: #4A5568; margin-bottom: 12px;">Need to expedite your proposal or discuss customized cab transfers?</p>
        <a href="https://wa.me/919832012345?text=Hello%20The%20Cometas,%20we%20submitted%20a%20corporate%20retreat%20inquiry%20for%20${encodeURIComponent(lead.company)}%20(Ref:%20${leadRef})" class="whatsapp-btn">
          💬 Chat with Corporate Concierge on WhatsApp
        </a>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <strong style="color: #2C2473; font-size: 13px;">The Cometas — Corporate Mountain Offsites</strong><br>
      Upper Latpanchar Forest Road, Kurseong Division, Darjeeling District, West Bengal - 734008<br>
      Corporate Desk: +91 98320 12345 · +91 97323 00111<br>
      Email: thecometas2025@gmail.com · Web: <a href="${siteUrl}" style="color: #C62828; text-decoration: none;">www.thecometas.com</a>
    </div>
  </div>
</body>
</html>
`;
}

export function getCorporateGuestEmailText(lead: CorporateLeadEmailData): string {
  const leadRef = lead.id || `CORP-${Date.now().toString().slice(-6)}`;
  return `Dear ${lead.contactPerson},

Thank you for reaching out to The Cometas Homestay for ${lead.company}'s upcoming mountain offsite retreat! We have received your inquiry and our Corporate Concierge team is preparing a customized proposal.

RETREAT INQUIRY SUMMARY:
Reference: ${leadRef}
Company: ${lead.company}
Contact Person: ${lead.contactPerson}
Team Size: ${lead.employeesCount} Members
Preferred Dates: ${lead.preferredDates || "Flexible"}
${lead.budgetRange ? `Budget Range: ${lead.budgetRange}\n` : ""}
Phone / WhatsApp: ${lead.phone}
Email: ${lead.email}
${lead.requirements ? `Special Requests: ${lead.requirements}\n` : ""}

WHAT HAPPENS NEXT:
Our Corporate Coordinator is checking room allotment and will send a detailed itinerary and quotation to ${lead.email} within 4 hours.

If you have urgent questions or need help arranging airport cabs from Bagdogra (IXB) / NJP, contact us directly:
Phone / WhatsApp: +91 98320 12345
Email: thecometas2025@gmail.com
Web: https://thecometas.com/corporate

Warm regards,
Corporate Concierge Team
The Cometas Himalayan Retreat, Latpanchar`;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ADMIN CORPORATE LEAD ALERT EMAIL TEMPLATE
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function getCorporateAdminAlertHtml(
  lead: CorporateLeadEmailData,
  siteUrl = "http://localhost:3000"
): string {
  const leadRef = lead.id || `CORP-${Date.now().toString().slice(-6)}`;
  const cleanPhone = (lead.phone || "").replace(/[^0-9]/g, "");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>⚡ New Corporate Offsite Inquiry - ${lead.company}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0F0C29; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 20px auto; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 2px solid #C89D45; }
    .header { background: #15103A; padding: 30px; text-align: center; border-bottom: 3px solid #C62828; }
    .h1 { color: #FFFFFF; font-size: 22px; font-weight: bold; margin: 8px 0; font-family: Georgia, serif; }
    .content { padding: 30px; }
    .card { background-color: #FAF8F5; border-radius: 14px; border: 1px solid rgba(200, 157, 69, 0.3); padding: 18px; margin-bottom: 20px; }
    .card-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #C62828; margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #EDE8DF; }
    .label { color: #64748B; font-weight: 500; }
    .value { color: #0F172A; font-weight: 700; text-align: right; }
    .btn { display: inline-block; background: #C62828; color: #FFFFFF !important; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding: 10px 20px; text-decoration: none; border-radius: 8px; margin: 4px; }
    .btn-green { display: inline-block; background: #25D366; color: #FFFFFF !important; font-size: 12px; font-weight: bold; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin: 4px; }
    .btn-blue { display: inline-block; background: #2C2473; color: #FFFFFF !important; font-size: 12px; font-weight: bold; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin: 4px; }
  </style>
</head>
<body style="padding: 20px 0;">
  <div class="container">
    <div class="header">
      <span style="background-color: #C62828; color: #FFFFFF; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; padding: 4px 12px; border-radius: 20px;">
        ⚡ NEW B2B CORPORATE LEAD
      </span>
      <h1 class="h1">${lead.company}</h1>
      <p style="color: #CBD5E1; font-size: 13px; margin: 0;">Ref: <strong style="color: #F3D27A;">${leadRef}</strong> · ${new Date().toLocaleString("en-IN")}</p>
    </div>

    <div class="content">
      <!-- CLIENT INFO -->
      <div class="card">
        <div class="card-title">Client &amp; Contact Details</div>
        <table width="100%" style="font-size: 13px;">
          <tr style="border-bottom: 1px solid #EDE8DF;">
            <td style="padding: 6px 0; color: #64748B;">Company:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; text-align: right;">${lead.company}</td>
          </tr>
          <tr style="border-bottom: 1px solid #EDE8DF;">
            <td style="padding: 6px 0; color: #64748B;">Contact Person:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; text-align: right;">${lead.contactPerson}</td>
          </tr>
          <tr style="border-bottom: 1px solid #EDE8DF;">
            <td style="padding: 6px 0; color: #64748B;">Work Email:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; text-align: right;">
              <a href="mailto:${lead.email}" style="color: #2C2473; text-decoration: none;">${lead.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Phone:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; text-align: right;">
              <a href="tel:${lead.phone}" style="color: #C62828; text-decoration: none;">${lead.phone}</a>
            </td>
          </tr>
        </table>
      </div>

      <!-- RETREAT DETAILS -->
      <div class="card">
        <div class="card-title">Retreat Specifications</div>
        <table width="100%" style="font-size: 13px;">
          <tr style="border-bottom: 1px solid #EDE8DF;">
            <td style="padding: 6px 0; color: #64748B;">Estimated Team Size:</td>
            <td style="padding: 6px 0; color: #C62828; font-weight: 800; text-align: right;">${lead.employeesCount} Members</td>
          </tr>
          <tr style="border-bottom: 1px solid #EDE8DF;">
            <td style="padding: 6px 0; color: #64748B;">Preferred Dates:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; text-align: right;">${lead.preferredDates || "Not specified"}</td>
          </tr>
          ${lead.budgetRange ? `
          <tr style="border-bottom: 1px solid #EDE8DF;">
            <td style="padding: 6px 0; color: #64748B;">Estimated Budget:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 700; text-align: right;">${lead.budgetRange}</td>
          </tr>
          ` : ""}
          ${lead.requirements ? `
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Special Requests:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600; text-align: right;">${lead.requirements}</td>
          </tr>
          ` : ""}
        </table>
      </div>

      <!-- ACTION BUTTONS -->
      <div style="text-align: center; margin-top: 25px;">
        <a href="https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(lead.contactPerson)},%20thank%20you%20for%20your%20interest%20in%20The%20Cometas%20corporate%20retreat%20for%20${encodeURIComponent(lead.company)}" class="btn-green">
          💬 WhatsApp Client
        </a>
        <a href="mailto:${lead.email}?subject=Corporate%20Offsite%20Proposal%20-%20The%20Cometas%20Himalayan%20Retreat&body=Dear%20${encodeURIComponent(lead.contactPerson)},%0D%0A%0D%0AThank%20you%20for%20reaching%20out..." class="btn-blue">
          ✉️ Reply via Email
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

export function getCorporateAdminAlertText(lead: CorporateLeadEmailData): string {
  const leadRef = lead.id || `CORP-${Date.now().toString().slice(-6)}`;
  return `⚡ NEW B2B CORPORATE RETREAT INQUIRY

Ref ID: ${leadRef}
Company: ${lead.company}
Contact Person: ${lead.contactPerson}
Team Size: ${lead.employeesCount} Members
Preferred Dates: ${lead.preferredDates || "Not specified"}
${lead.budgetRange ? `Budget: ${lead.budgetRange}\n` : ""}
Phone: ${lead.phone}
Email: ${lead.email}
${lead.requirements ? `Special Requests: ${lead.requirements}\n` : ""}
Timestamp: ${new Date().toLocaleString("en-IN")}`;
}

