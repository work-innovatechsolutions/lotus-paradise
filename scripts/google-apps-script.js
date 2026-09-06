/**
 * ══════════════════════════════════════════════════════════════════════════════
 * THE COMETAS HOMESTAY — GOOGLE SHEETS AUTOMATION (BOOKINGS & CORPORATE LEADS)
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * This Apps Script automatically receives and organizes:
 *  1. Guest Room Bookings -> Tab "Bookings"
 *  2. B2B Corporate Offsite Retreat Leads -> Tab "Corporate Leads"
 *
 * HOW TO SETUP:
 * 1. Open your Google Sheet
 * 2. Extensions > Apps Script
 * 3. Replace ALL code with this file, click Save (Ctrl+S)
 * 4. Deploy > Manage Deployments > Edit (pencil) > Version: New version > Deploy
 * 5. The Web App URL stays the same — no need to update .env
 *
 * QUICK TEST (no form submission needed):
 * - In the function dropdown, select "testCorporateTab" and click ▶ Run
 * - This creates the "Corporate Leads" tab and adds a dummy row instantly
 * ══════════════════════════════════════════════════════════════════════════════
 */

var BOOKINGS_SHEET_NAME = "Bookings";
var CORPORATE_SHEET_NAME = "Corporate Leads";

// ─────────────────────────────────────────────────────────────────────────────
// 1. BOOKINGS SHEET CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
var BOOKING_HEADERS = [
  "Timestamp",
  "Booking ID",
  "Guest Name",
  "Phone Number",
  "Email",
  "Room Suite",
  "Check-In",
  "Check-Out",
  "Nights",
  "Guests",
  "Total Amount (₹)",
  "Booking Status",
  "Special Requests"
];

function getOrCreateBookingsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BOOKINGS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(BOOKINGS_SHEET_NAME, 0);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(BOOKING_HEADERS);
    var headerRange = sheet.getRange(1, 1, 1, BOOKING_HEADERS.length);
    headerRange.setBackground("#2C2473");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Arial");
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 36);
    sheet.setFrozenRows(1);
  }
  // Always ensure phone & timestamp columns are plain text (fixes existing sheets too)
  sheet.getRange("A:A").setNumberFormat("@"); // Timestamp
  sheet.getRange("D:D").setNumberFormat("@"); // Phone Number
  return sheet;
}

function formatBookingRow(sheet, rowIdx) {
  var range = sheet.getRange(rowIdx, 1, 1, BOOKING_HEADERS.length);
  range.setFontFamily("Arial");
  range.setFontSize(9);
  range.setVerticalAlignment("middle");

  sheet.getRange(rowIdx, 1).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 2).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 7).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 8).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 9).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 10).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 11).setHorizontalAlignment("right").setNumberFormat("₹#,##0");
  sheet.getRange(rowIdx, 12).setHorizontalAlignment("center");

  var statusCell = sheet.getRange(rowIdx, 12);
  var statusVal = String(statusCell.getValue()).toUpperCase();
  if (statusVal === "CONFIRMED") {
    statusCell.setBackground("#E8F5E9").setFontColor("#2E7D32").setFontWeight("bold");
  } else if (statusVal === "PENDING") {
    statusCell.setBackground("#FFF8E1").setFontColor("#F57F17").setFontWeight("bold");
  } else if (statusVal === "CANCELLED") {
    statusCell.setBackground("#FFEBEE").setFontColor("#C62828").setFontWeight("bold");
  }
}

function rowFromBooking(b) {
  return [
    b.createdAt || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    b.bookingNumber || b.id || "N/A",
    b.guestName || "Guest",
    String(b.phone || "N/A"),
    b.email || "N/A",
    b.roomTitle || "Standard Suite",
    b.checkIn || "",
    b.checkOut || "",
    b.nights || 1,
    b.guestsCount || 1,
    Number(b.totalAmount || 0),
    (b.status || "CONFIRMED").toUpperCase(),
    b.specialRequests || "None"
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORPORATE LEADS SHEET CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
var CORPORATE_HEADERS = [
  "Timestamp",
  "Lead Ref ID",
  "Company Name",
  "Contact Person",
  "Work Email",
  "Phone Number",
  "Team Size (Pax)",
  "Preferred Dates",
  "Nights",
  "Estimated Budget",
  "Pipeline Status",
  "Special Requests / Requirements"
];

function getOrCreateCorporateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CORPORATE_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CORPORATE_SHEET_NAME, 1);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CORPORATE_HEADERS);
    var headerRange = sheet.getRange(1, 1, 1, CORPORATE_HEADERS.length);
    headerRange.setBackground("#8B1E1E");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Arial");
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 36);
    sheet.setFrozenRows(1);
  }
  // Always ensure phone, ID & timestamp columns are plain text (fixes existing sheets too)
  sheet.getRange("A:A").setNumberFormat("@"); // Timestamp
  sheet.getRange("B:B").setNumberFormat("@"); // Lead Ref ID
  sheet.getRange("F:F").setNumberFormat("@"); // Phone Number
  return sheet;
}

function formatCorporateRow(sheet, rowIdx) {
  var range = sheet.getRange(rowIdx, 1, 1, CORPORATE_HEADERS.length);
  range.setFontFamily("Arial");
  range.setFontSize(9);
  range.setVerticalAlignment("middle");

  sheet.getRange(rowIdx, 1).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 2).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 7).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 8).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 9).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 10).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 11).setHorizontalAlignment("center");

  var statusCell = sheet.getRange(rowIdx, 11);
  var statusVal = String(statusCell.getValue()).toUpperCase();
  if (statusVal === "NEW") {
    statusCell.setBackground("#FEF3C7").setFontColor("#B45309").setFontWeight("bold");
  } else if (statusVal === "PROPOSAL_SENT") {
    statusCell.setBackground("#E0F2FE").setFontColor("#0369A1").setFontWeight("bold");
  } else if (statusVal === "CLOSED_WON") {
    statusCell.setBackground("#D1FAE5").setFontColor("#065F46").setFontWeight("bold");
  }
}

function rowFromCorporateLead(lead) {
  return [
    lead.createdAt || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    lead.id || ("CORP-" + Date.now().toString().slice(-6)),
    lead.company || "N/A",
    lead.contactPerson || "N/A",
    lead.email || "N/A",
    String(lead.phone || "N/A"),
    Number(lead.employeesCount || 10),
    lead.preferredDates || "Flexible",
    lead.nights ? (lead.nights + " Nights") : "",
    lead.budgetRange || "₹2L - ₹3L",
    (lead.status || "NEW").toUpperCase(),
    lead.requirements || "None"
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SAFE ROW WRITE HELPERS
// appendRow() triggers formula parsing BEFORE format can be set.
// These helpers pre-format text columns FIRST, then write values via setValues().
// This is the only reliable way to store "+91 ..." as text, not a formula.
// ─────────────────────────────────────────────────────────────────────────────
function safeAppendCorporateRow(sheet, rowData) {
  var newRow = sheet.getLastRow() + 1;
  // Pre-format text columns BEFORE writing (prevents +91 formula parse error)
  sheet.getRange(newRow, 1).setNumberFormat("@"); // Timestamp
  sheet.getRange(newRow, 2).setNumberFormat("@"); // Lead Ref ID
  sheet.getRange(newRow, 6).setNumberFormat("@"); // Phone Number (col F)
  // Now write — text cells will be stored safely
  sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
}

function safeAppendBookingRow(sheet, rowData) {
  var newRow = sheet.getLastRow() + 1;
  // Pre-format text columns BEFORE writing
  sheet.getRange(newRow, 1).setNumberFormat("@"); // Timestamp
  sheet.getRange(newRow, 4).setNumberFormat("@"); // Phone Number (col D)
  // Now write
  sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. WEBHOOK HANDLER (doPost)
// ─────────────────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    // ROUTE A: CORPORATE LEADS
    var isCorporate =
      data.action === "add_corporate_lead" ||
      data.action === "batch_corporate_leads" ||
      data.type === "corporate" ||
      (data.lead !== undefined && data.lead !== null);

    if (isCorporate) {
      var corpSheet = getOrCreateCorporateSheet();

      if (data.action === "batch_corporate_leads" && Array.isArray(data.leads)) {
        data.leads.forEach(function(lead) {
          safeAppendCorporateRow(corpSheet, rowFromCorporateLead(lead));
          formatCorporateRow(corpSheet, corpSheet.getLastRow());
        });
        return ContentService.createTextOutput(
          JSON.stringify({ status: "success", count: data.leads.length, target: "Corporate Leads" })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      var lead = data.lead || data;
      safeAppendCorporateRow(corpSheet, rowFromCorporateLead(lead));
      formatCorporateRow(corpSheet, corpSheet.getLastRow());

      return ContentService.createTextOutput(
        JSON.stringify({
          status: "success",
          message: "Corporate lead appended to Google Sheet",
          company: lead.company,
          target: "Corporate Leads"
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // ROUTE B: REGULAR GUEST BOOKINGS
    var bookSheet = getOrCreateBookingsSheet();

    if ((data.action === "reset_and_sync" || data.action === "clear_and_sync") && Array.isArray(data.bookings)) {
      var lastRow = bookSheet.getLastRow();
      if (lastRow > 1) {
        bookSheet.deleteRows(2, lastRow - 1);
      }
      data.bookings.forEach(function(b) {
        safeAppendBookingRow(bookSheet, rowFromBooking(b));
        formatBookingRow(bookSheet, bookSheet.getLastRow());
      });
      return ContentService.createTextOutput(
        JSON.stringify({ status: "success", syncedCount: data.bookings.length, target: "Bookings" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === "batch_sync" && Array.isArray(data.bookings)) {
      data.bookings.forEach(function(b) {
        safeAppendBookingRow(bookSheet, rowFromBooking(b));
        formatBookingRow(bookSheet, bookSheet.getLastRow());
      });
      return ContentService.createTextOutput(
        JSON.stringify({ status: "success", syncedCount: data.bookings.length, target: "Bookings" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var booking = data.booking || data;
    safeAppendBookingRow(bookSheet, rowFromBooking(booking));
    formatBookingRow(bookSheet, bookSheet.getLastRow());

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Booking recorded in Google Sheet",
        bookingId: booking.bookingNumber,
        target: "Bookings"
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. HEALTH CHECK
// ─────────────────────────────────────────────────────────────────────────────
function doGet(e) {
  return ContentService.createTextOutput(
    "The Cometas Homestay — Bookings & Corporate Leads Automation is ACTIVE!"
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SPREADSHEET MENU & UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("The Cometas Tools")
    .addItem("Initialize Both Tabs (Bookings & Corporate)", "initializeTabs")
    .addItem("TEST: Add Dummy Corporate Lead Row", "testCorporateTab")
    .addToUi();
}

function initializeTabs() {
  getOrCreateBookingsSheet();
  getOrCreateCorporateSheet();
  SpreadsheetApp.getActiveSpreadsheet().toast(
    "Both tabs initialized successfully!", "Done", 5
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TEST FUNCTION
//    Select "testCorporateTab" from the function dropdown and click Run (▶)
// ─────────────────────────────────────────────────────────────────────────────
function testCorporateTab() {
  var sheet = getOrCreateCorporateSheet();
  var dummyLead = {
    createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    id: "CORP-TEST-" + Date.now().toString().slice(-4),
    company: "Test Corp Pvt Ltd",
    contactPerson: "Test User",
    email: "test@testcorp.com",
    phone: "+91 99999 00000",
    employeesCount: 20,
    preferredDates: "Oct 15 - Oct 18, 2026",
    nights: 3,
    budgetRange: "Rs.2L - Rs.3L",
    status: "NEW",
    requirements: "Bonfire, AV Setup -- DELETE THIS TEST ROW"
  };
  safeAppendCorporateRow(sheet, rowFromCorporateLead(dummyLead));
  formatCorporateRow(sheet, sheet.getLastRow());
  SpreadsheetApp.getActiveSpreadsheet().toast(
    "Test row added! +91 phone should show correctly now. Delete when done.",
    "Test Passed",
    10
  );
}


