/**
 * ══════════════════════════════════════════════════════════════════════════════
 * LOTUS PARADISE HOMESTAY — GOOGLE SHEETS LIVE BOOKING AUTOMATION
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * HOW TO SETUP (Takes 2 minutes):
 * 1. Open Google Sheets (https://sheets.new) and name it "Lotus Paradise Bookings".
 * 2. In the top menu, go to: Extensions > Apps Script.
 * 3. Delete any code in the editor, paste this entire file, and click "Save" (Floppy icon).
 * 4. Click the blue "Deploy" button (top right) > "New deployment".
 * 5. Click the Gear icon ⚙ next to "Select type" and choose "Web app".
 * 6. Set:
 *    - Description: "Lotus Paradise Booking Webhook"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (allows website to send bookings)
 * 7. Click "Deploy", authorize permissions when prompted, and COPY the Web App URL.
 * 8. Paste the Web App URL in your Admin Dashboard:
 *    http://localhost:3000/admin/settings -> Google Sheets Integration
 * ══════════════════════════════════════════════════════════════════════════════
 */

const SHEET_NAME = "Bookings";

const HEADERS = [
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

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Setup headers if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    
    // Format Header Row
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#2C2473"); // Luxury Navy
    headerRange.setFontColor("#FFFFFF"); // White text
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Arial");
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 35);
    
    // Freeze header row
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function formatRow(sheet, rowIdx) {
  const range = sheet.getRange(rowIdx, 1, 1, HEADERS.length);
  range.setFontFamily("Arial");
  range.setFontSize(9);
  range.setVerticalAlignment("middle");

  // Center align dates, booking ID, and status
  sheet.getRange(rowIdx, 1).setHorizontalAlignment("center"); // Timestamp
  sheet.getRange(rowIdx, 2).setHorizontalAlignment("center"); // Booking ID
  sheet.getRange(rowIdx, 7).setHorizontalAlignment("center"); // Check-In
  sheet.getRange(rowIdx, 8).setHorizontalAlignment("center"); // Check-Out
  sheet.getRange(rowIdx, 9).setHorizontalAlignment("center"); // Nights
  sheet.getRange(rowIdx, 10).setHorizontalAlignment("center"); // Guests
  sheet.getRange(rowIdx, 11).setHorizontalAlignment("right"); // Amount
  sheet.getRange(rowIdx, 12).setHorizontalAlignment("center"); // Status

  // Format currency
  sheet.getRange(rowIdx, 11).setNumberFormat("₹#,##0");

  // Status badge coloring
  const statusCell = sheet.getRange(rowIdx, 12);
  const statusVal = String(statusCell.getValue()).toUpperCase();
  if (statusVal === "CONFIRMED") {
    statusCell.setBackground("#E8F5E9"); // Light Green
    statusCell.setFontColor("#2E7D32");
    statusCell.setFontWeight("bold");
  } else if (statusVal === "PENDING") {
    statusCell.setBackground("#FFF8E1"); // Light Amber
    statusCell.setFontColor("#F57F17");
    statusCell.setFontWeight("bold");
  } else if (statusVal === "CANCELLED") {
    statusCell.setBackground("#FFEBEE"); // Light Red
    statusCell.setFontColor("#C62828");
    statusCell.setFontWeight("bold");
  }
}

function rowFromBooking(b) {
  return [
    b.createdAt || new Date().toLocaleString("en-IN"),
    b.bookingNumber || "N/A",
    b.guestName || "Guest",
    b.phone || "N/A",
    b.email || "N/A",
    b.roomTitle || "Suite",
    b.checkIn || "",
    b.checkOut || "",
    b.nights || 1,
    b.guestsCount || 1,
    Number(b.totalAmount || 0),
    (b.status || "CONFIRMED").toUpperCase(),
    b.specialRequests || "None"
  ];
}

function doPost(e) {
  try {
    const rawData = e.postData.contents;
    const data = JSON.parse(rawData);
    const sheet = getOrCreateSheet();

    if ((data.action === "reset_and_sync" || data.action === "clear_and_sync") && Array.isArray(data.bookings)) {
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }
      data.bookings.forEach(function(b) {
        sheet.appendRow(rowFromBooking(b));
        formatRow(sheet, sheet.getLastRow());
      });
      return ContentService.createTextOutput(
        JSON.stringify({ status: "success", syncedCount: data.bookings.length })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === "batch_sync" && Array.isArray(data.bookings)) {
      data.bookings.forEach(function(b) {
        sheet.appendRow(rowFromBooking(b));
        formatRow(sheet, sheet.getLastRow());
      });
      return ContentService.createTextOutput(
        JSON.stringify({ status: "success", syncedCount: data.bookings.length })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const b = data.booking || data;
    sheet.appendRow(rowFromBooking(b));
    formatRow(sheet, sheet.getLastRow());

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Booking recorded in Google Sheet", bookingId: b.bookingNumber })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    "Lotus Paradise Homestay — Google Sheets Booking Automation Webhook is ACTIVE!"
  );
}
