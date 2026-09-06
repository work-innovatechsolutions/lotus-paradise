/**
 * ══════════════════════════════════════════════════════════════════════════════
 * THE COMETAS HOMESTAY — GOOGLE SHEETS AUTOMATION
 * BOOKINGS & CORPORATE LEADS
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * SETUP:
 * 1. Open Google Sheet
 * 2. Extensions → Apps Script
 * 3. Replace all existing code with this script
 * 4. Save (Ctrl + S)
 * 5. Deploy → Manage Deployments
 * 6. Edit deployment (pencil icon) → Select "New Version" → Deploy
 *
 * IMPORTANT:
 * After changing the code, ALWAYS deploy a NEW VERSION.
 * Your website uses the deployed version, not just the saved editor code.
 * ══════════════════════════════════════════════════════════════════════════════
 */


/* =============================================================================
   CONFIGURATION
============================================================================= */

var BOOKINGS_SHEET_NAME = "Bookings";
var CORPORATE_SHEET_NAME = "Corporate Leads";


/* =============================================================================
   BOOKINGS HEADERS
============================================================================= */

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


/* =============================================================================
   CORPORATE LEADS HEADERS
============================================================================= */

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


/* =============================================================================
   SAFE TEXT FUNCTION
   Prevents Google Sheets from interpreting values as formulas.
============================================================================= */

function safeText(value) {

  if (value === null || value === undefined || value === "") {
    return "";
  }

  var text = String(value).trim();

  /*
   * Google Sheets interprets values starting with:
   * +  =  -  @
   * as formulas.
   *
   * Adding an apostrophe forces text interpretation.
   */

  if (
    text.charAt(0) === "+" ||
    text.charAt(0) === "=" ||
    text.charAt(0) === "-" ||
    text.charAt(0) === "@"
  ) {
    return "'" + text;
  }

  return text;
}


/* =============================================================================
   BOOKINGS SHEET
============================================================================= */

function getOrCreateBookingsSheet() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BOOKINGS_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(BOOKINGS_SHEET_NAME, 0);
  }

  if (sheet.getLastRow() === 0) {

    sheet.appendRow(BOOKING_HEADERS);

    var headerRange = sheet.getRange(
      1,
      1,
      1,
      BOOKING_HEADERS.length
    );

    headerRange
      .setBackground("#2C2473")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold")
      .setFontFamily("Arial")
      .setFontSize(10)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");

    sheet.setRowHeight(1, 36);
    sheet.setFrozenRows(1);
  }

  /*
   * Set important columns as Plain Text.
   */

  sheet.getRange("A:A").setNumberFormat("@");
  sheet.getRange("B:B").setNumberFormat("@");
  sheet.getRange("C:C").setNumberFormat("@");
  sheet.getRange("D:D").setNumberFormat("@");
  sheet.getRange("E:E").setNumberFormat("@");

  return sheet;
}


/* =============================================================================
   FORMAT BOOKING ROW
============================================================================= */

function formatBookingRow(sheet, rowIdx) {

  var range = sheet.getRange(
    rowIdx,
    1,
    1,
    BOOKING_HEADERS.length
  );

  range
    .setFontFamily("Arial")
    .setFontSize(9)
    .setVerticalAlignment("middle");

  sheet.getRange(rowIdx, 1)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 2)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 4)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 7)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 8)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 9)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 10)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 11)
    .setHorizontalAlignment("right")
    .setNumberFormat("₹#,##0");

  sheet.getRange(rowIdx, 12)
    .setHorizontalAlignment("center");


  /*
   * Booking Status Color
   */

  var statusCell = sheet.getRange(rowIdx, 12);

  var statusVal = String(
    statusCell.getDisplayValue()
  ).toUpperCase();

  statusCell
    .setBackground(null)
    .setFontColor(null)
    .setFontWeight("normal");


  if (statusVal === "CONFIRMED") {

    statusCell
      .setBackground("#E8F5E9")
      .setFontColor("#2E7D32")
      .setFontWeight("bold");

  } else if (statusVal === "PENDING") {

    statusCell
      .setBackground("#FFF8E1")
      .setFontColor("#F57F17")
      .setFontWeight("bold");

  } else if (statusVal === "CANCELLED") {

    statusCell
      .setBackground("#FFEBEE")
      .setFontColor("#C62828")
      .setFontWeight("bold");
  }
}


/* =============================================================================
   CREATE BOOKING ROW DATA
============================================================================= */

function rowFromBooking(b) {

  return [

    safeText(
      b.createdAt ||
      new Date().toLocaleString(
        "en-IN",
        { timeZone: "Asia/Kolkata" }
      )
    ),

    safeText(
      b.bookingNumber ||
      b.id ||
      "N/A"
    ),

    safeText(
      b.guestName ||
      "Guest"
    ),

    /*
     * Phone number is treated safely with apostrophe & text format.
     */

    safeText(
      b.phone ||
      b.phoneNumber ||
      "N/A"
    ),

    safeText(
      b.email ||
      "N/A"
    ),

    safeText(
      b.roomTitle ||
      b.room ||
      "Standard Suite"
    ),

    safeText(
      b.checkIn ||
      ""
    ),

    safeText(
      b.checkOut ||
      ""
    ),

    Number(
      b.nights || 1
    ),

    Number(
      b.guestsCount ||
      b.guests ||
      1
    ),

    Number(
      b.totalAmount ||
      b.amount ||
      0
    ),

    safeText(
      (
        b.status ||
        "CONFIRMED"
      ).toUpperCase()
    ),

    safeText(
      b.specialRequests ||
      "None"
    )
  ];
}


/* =============================================================================
   CORPORATE LEADS SHEET
============================================================================= */

function getOrCreateCorporateSheet() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var sheet = ss.getSheetByName(
    CORPORATE_SHEET_NAME
  );

  if (!sheet) {
    sheet = ss.insertSheet(
      CORPORATE_SHEET_NAME,
      1
    );
  }


  if (sheet.getLastRow() === 0) {

    sheet.appendRow(CORPORATE_HEADERS);

    var headerRange = sheet.getRange(
      1,
      1,
      1,
      CORPORATE_HEADERS.length
    );

    headerRange
      .setBackground("#8B1E1E")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold")
      .setFontFamily("Arial")
      .setFontSize(10)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");

    sheet.setRowHeight(1, 36);
    sheet.setFrozenRows(1);
  }


  /*
   * Set important columns as Plain Text.
   */

  sheet.getRange("A:A").setNumberFormat("@");
  sheet.getRange("B:B").setNumberFormat("@");
  sheet.getRange("C:C").setNumberFormat("@");
  sheet.getRange("D:D").setNumberFormat("@");
  sheet.getRange("E:E").setNumberFormat("@");
  sheet.getRange("F:F").setNumberFormat("@");

  return sheet;
}


/* =============================================================================
   FORMAT CORPORATE ROW
============================================================================= */

function formatCorporateRow(sheet, rowIdx) {

  var range = sheet.getRange(
    rowIdx,
    1,
    1,
    CORPORATE_HEADERS.length
  );

  range
    .setFontFamily("Arial")
    .setFontSize(9)
    .setVerticalAlignment("middle");


  sheet.getRange(rowIdx, 1)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 2)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 6)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 7)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 8)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 9)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 10)
    .setHorizontalAlignment("center");

  sheet.getRange(rowIdx, 11)
    .setHorizontalAlignment("center");


  /*
   * Pipeline Status Color
   */

  var statusCell = sheet.getRange(
    rowIdx,
    11
  );

  var statusVal = String(
    statusCell.getDisplayValue()
  ).toUpperCase();


  statusCell
    .setBackground(null)
    .setFontColor(null)
    .setFontWeight("normal");


  if (statusVal === "NEW") {

    statusCell
      .setBackground("#FEF3C7")
      .setFontColor("#B45309")
      .setFontWeight("bold");

  } else if (statusVal === "PROPOSAL_SENT") {

    statusCell
      .setBackground("#E0F2FE")
      .setFontColor("#0369A1")
      .setFontWeight("bold");

  } else if (statusVal === "CLOSED_WON") {

    statusCell
      .setBackground("#D1FAE5")
      .setFontColor("#065F46")
      .setFontWeight("bold");
  }
}


/* =============================================================================
   CREATE CORPORATE LEAD ROW DATA
============================================================================= */

function rowFromCorporateLead(lead) {

  return [

    safeText(
      lead.createdAt ||
      new Date().toLocaleString(
        "en-IN",
        { timeZone: "Asia/Kolkata" }
      )
    ),

    safeText(
      lead.id ||
      ("CORP-" + Date.now().toString().slice(-6))
    ),

    safeText(
      lead.company ||
      "N/A"
    ),

    safeText(
      lead.contactPerson ||
      "N/A"
    ),

    safeText(
      lead.email ||
      "N/A"
    ),

    /*
     * Phone number is treated safely with apostrophe & text format.
     */

    safeText(
      lead.phone ||
      lead.phoneNumber ||
      "N/A"
    ),

    Number(
      lead.employeesCount ||
      lead.teamSize ||
      10
    ),

    safeText(
      lead.preferredDates ||
      "Flexible"
    ),

    safeText(
      lead.nights
        ? lead.nights + " Nights"
        : ""
    ),

    safeText(
      lead.budgetRange ||
      "N/A"
    ),

    safeText(
      (
        lead.status ||
        "NEW"
      ).toUpperCase()
    ),

    safeText(
      lead.requirements ||
      lead.specialRequests ||
      "None"
    )
  ];
}


/* =============================================================================
   SAFE APPEND BOOKING ROW
============================================================================= */

function safeAppendBookingRow(sheet, rowData) {

  var newRow = sheet.getLastRow() + 1;


  /*
   * Format the entire row as Plain Text FIRST.
   */

  sheet
    .getRange(
      newRow,
      1,
      1,
      rowData.length
    )
    .setNumberFormat("@");


  /*
   * Restore numeric formatting where required.
   */

  sheet
    .getRange(newRow, 9)
    .setNumberFormat("0");

  sheet
    .getRange(newRow, 10)
    .setNumberFormat("0");

  sheet
    .getRange(newRow, 11)
    .setNumberFormat("₹#,##0");


  /*
   * Write values.
   */

  sheet
    .getRange(
      newRow,
      1,
      1,
      rowData.length
    )
    .setValues([rowData]);
}


/* =============================================================================
   SAFE APPEND CORPORATE ROW
============================================================================= */

function safeAppendCorporateRow(sheet, rowData) {

  var newRow = sheet.getLastRow() + 1;


  /*
   * Format the row as Plain Text FIRST.
   */

  sheet
    .getRange(
      newRow,
      1,
      1,
      rowData.length
    )
    .setNumberFormat("@");


  /*
   * Team size is numeric.
   */

  sheet
    .getRange(newRow, 7)
    .setNumberFormat("0");


  /*
   * Write values.
   */

  sheet
    .getRange(
      newRow,
      1,
      1,
      rowData.length
    )
    .setValues([rowData]);
}


/* =============================================================================
   WEBHOOK HANDLER
============================================================================= */

function doPost(e) {

  try {

    /*
     * Validate request.
     */

    if (!e || !e.postData || !e.postData.contents) {

      return ContentService
        .createTextOutput(
          JSON.stringify({
            status: "error",
            message: "No POST data received"
          })
        )
        .setMimeType(
          ContentService.MimeType.JSON
        );
    }


    var rawData = e.postData.contents;

    var data = JSON.parse(rawData);


    /* -------------------------------------------------------------------------
       CORPORATE LEADS
    ------------------------------------------------------------------------- */

    var isCorporate =

      data.action === "add_corporate_lead" ||

      data.action === "batch_corporate_leads" ||

      data.type === "corporate" ||

      (
        data.lead !== undefined &&
        data.lead !== null
      );


    if (isCorporate) {

      var corpSheet =
        getOrCreateCorporateSheet();


      /*
       * Batch Corporate Leads
       */

      if (

        data.action === "batch_corporate_leads" &&

        Array.isArray(data.leads)

      ) {

        data.leads.forEach(function(lead) {

          safeAppendCorporateRow(
            corpSheet,
            rowFromCorporateLead(lead)
          );

          formatCorporateRow(
            corpSheet,
            corpSheet.getLastRow()
          );

        });


        return ContentService
          .createTextOutput(
            JSON.stringify({
              status: "success",
              count: data.leads.length,
              target: "Corporate Leads"
            })
          )
          .setMimeType(
            ContentService.MimeType.JSON
          );
      }


      /*
       * Single Corporate Lead
       */

      var lead =
        data.lead ||
        data;


      safeAppendCorporateRow(
        corpSheet,
        rowFromCorporateLead(lead)
      );


      formatCorporateRow(
        corpSheet,
        corpSheet.getLastRow()
      );


      return ContentService
        .createTextOutput(
          JSON.stringify({
            status: "success",
            message:
              "Corporate lead added successfully",
            target:
              "Corporate Leads"
          })
        )
        .setMimeType(
          ContentService.MimeType.JSON
        );
    }


    /* -------------------------------------------------------------------------
       REGULAR BOOKINGS
    ------------------------------------------------------------------------- */

    var bookingSheet =
      getOrCreateBookingsSheet();


    /*
     * Reset and Sync
     */

    if (

      (
        data.action === "reset_and_sync" ||

        data.action === "clear_and_sync"
      ) &&

      Array.isArray(data.bookings)

    ) {

      var lastRow =
        bookingSheet.getLastRow();


      if (lastRow > 1) {

        bookingSheet.deleteRows(
          2,
          lastRow - 1
        );
      }


      data.bookings.forEach(function(booking) {

        safeAppendBookingRow(
          bookingSheet,
          rowFromBooking(booking)
        );

        formatBookingRow(
          bookingSheet,
          bookingSheet.getLastRow()
        );

      });


      return ContentService
        .createTextOutput(
          JSON.stringify({
            status: "success",
            syncedCount:
              data.bookings.length,
            target:
              "Bookings"
          })
        )
        .setMimeType(
          ContentService.MimeType.JSON
        );
    }


    /*
     * Batch Sync
     */

    if (

      data.action === "batch_sync" &&

      Array.isArray(data.bookings)

    ) {

      data.bookings.forEach(function(booking) {

        safeAppendBookingRow(
          bookingSheet,
          rowFromBooking(booking)
        );

        formatBookingRow(
          bookingSheet,
          bookingSheet.getLastRow()
        );

      });


      return ContentService
        .createTextOutput(
          JSON.stringify({
            status: "success",
            syncedCount:
              data.bookings.length,
            target:
              "Bookings"
          })
        )
        .setMimeType(
          ContentService.MimeType.JSON
        );
    }


    /*
     * Single Booking
     */

    var booking =
      data.booking ||
      data;


    safeAppendBookingRow(
      bookingSheet,
      rowFromBooking(booking)
    );


    formatBookingRow(
      bookingSheet,
      bookingSheet.getLastRow()
    );


    return ContentService
      .createTextOutput(
        JSON.stringify({
          status: "success",
          message:
            "Booking recorded successfully",
          bookingId:
            booking.bookingNumber ||
            booking.id ||
            null,
          target:
            "Bookings"
        })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );


  } catch (err) {

    return ContentService
      .createTextOutput(
        JSON.stringify({
          status: "error",
          message:
            String(err)
        })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );
  }
}


/* =============================================================================
   HEALTH CHECK
============================================================================= */

function doGet(e) {

  return ContentService
    .createTextOutput(
      "The Cometas Homestay Automation is ACTIVE!"
    );
}


/* =============================================================================
   SPREADSHEET MENU
============================================================================= */

function onOpen() {

  var ui =
    SpreadsheetApp.getUi();


  ui
    .createMenu("The Cometas Tools")

    .addItem(
      "Initialize Both Tabs",
      "initializeTabs"
    )

    .addItem(
      "Fix Phone Number Formatting (Repair All Broken #ERROR! Cells)",
      "fixPhoneNumberFormatting"
    )

    .addItem(
      "TEST: Add Dummy Corporate Lead",
      "testCorporateTab"
    )

    .addItem(
      "TEST: Add Dummy Booking",
      "testBooking"
    )

    .addToUi();
}


/* =============================================================================
   INITIALIZE SHEETS
============================================================================= */

function initializeTabs() {

  getOrCreateBookingsSheet();

  getOrCreateCorporateSheet();


  SpreadsheetApp
    .getActiveSpreadsheet()
    .toast(
      "Both tabs initialized successfully!",
      "Done",
      5
    );
}


/* =============================================================================
   HELPER: EXTRACT & CLEAN PHONE NUMBER FROM FORMULA OR VALUE
============================================================================= */

function extractCleanPhone(formula, value, displayValue) {

  var raw = "";

  // 1. If stored as a broken formula (e.g. "= +91 99338 76411", "=+91...", "=91...")
  if (formula && typeof formula === "string" && formula.trim().length > 0) {
    raw = formula.trim();
    // Strip leading '='
    raw = raw.replace(/^=\s*/, "").trim();
    // Normalize '+ ' to '+'
    raw = raw.replace(/^\+\s+/, "+");
  }
  // 2. If displayed as #ERROR! but formula was somehow empty
  else if (displayValue && (displayValue === "#ERROR!" || displayValue.indexOf("#") === 0)) {
    if (formula) {
      raw = formula.replace(/^=\s*/, "").replace(/^\+\s+/, "+").trim();
    } else if (value && typeof value === "string" && value.indexOf("#") !== 0) {
      raw = value;
    }
  }
  // 3. If stored as number (e.g. 919933876411 or 9933876411)
  else if (typeof value === "number") {
    raw = String(value);
    if (raw.length === 12 && raw.indexOf("91") === 0) {
      raw = "+91 " + raw.substring(2);
    }
  }
  // 4. Normal value
  else if (value !== null && value !== undefined && String(value).trim() !== "") {
    raw = String(value).trim();
  } else if (displayValue && displayValue !== "#ERROR!") {
    raw = String(displayValue).trim();
  }

  if (!raw || raw === "N/A" || raw === "None" || raw === "#ERROR!") {
    return raw === "#ERROR!" ? "" : (raw || "");
  }

  // Remove existing leading apostrophe so we don't duplicate
  if (raw.charAt(0) === "'") {
    raw = raw.substring(1).trim();
  }

  // If number starts with 91 followed by space/digits, format with +
  if (raw.indexOf("91") === 0 && raw.length >= 10 && raw.charAt(0) !== "+") {
    raw = "+" + raw;
  }

  // Prepend single apostrophe to force Google Sheets to store as pure plain text
  return "'" + raw;
}


/* =============================================================================
   FIND PHONE COLUMN INDEX DYNAMICALLY
============================================================================= */

function getPhoneColumnIndex(sheet, defaultCol) {
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return defaultCol;

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  for (var c = 0; c < headers.length; c++) {
    var h = String(headers[c] || "").toLowerCase().trim();
    if (h.indexOf("phone") !== -1 || h.indexOf("contact") !== -1 || h.indexOf("mobile") !== -1) {
      return c + 1; // 1-indexed
    }
  }

  return defaultCol;
}


/* =============================================================================
   REPAIR PHONE COLUMN IN A GIVEN SHEET
============================================================================= */

function repairSheetPhoneColumn(sheet, colIndex) {

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  var numRows = lastRow - 1;
  var range = sheet.getRange(2, colIndex, numRows, 1);

  var formulas = range.getFormulas();
  var values = range.getValues();
  var displayValues = range.getDisplayValues();

  var fixedValues = [];
  var repairedCount = 0;

  for (var i = 0; i < numRows; i++) {

    var f = formulas[i][0];
    var v = values[i][0];
    var d = displayValues[i][0];

    var isBroken =
      (f && f.length > 0) ||
      (d === "#ERROR!" || d.indexOf("#") === 0) ||
      (typeof v === "number") ||
      (typeof v === "string" && v.charAt(0) === "+");

    if (isBroken) {
      repairedCount++;
    }

    var clean = extractCleanPhone(f, v, d);
    fixedValues.push([clean]);
  }

  /*
   * 1. Clear contents first to wipe the broken formula parse state.
   */
  range.clear({ contentsOnly: true });

  /*
   * 2. Force Plain Text on the entire column.
   */
  sheet.getRange(1, colIndex, lastRow, 1).setNumberFormat("@");

  /*
   * 3. Write back clean plain text strings.
   */
  range.setValues(fixedValues);

  return repairedCount;
}


/* =============================================================================
   FIX EXISTING PHONE COLUMN FORMATTING (ACTUALLY REPAIRS BROKEN CELLS)
============================================================================= */

function fixPhoneNumberFormatting() {

  var bookingSheet =
    getOrCreateBookingsSheet();

  var corporateSheet =
    getOrCreateCorporateSheet();


  // Repair Bookings (Column D or found by header)
  var bookingCol = getPhoneColumnIndex(bookingSheet, 4);
  var bookingFixed = repairSheetPhoneColumn(bookingSheet, bookingCol);

  // Repair Corporate Leads (Column F or found by header)
  var corpCol = getPhoneColumnIndex(corporateSheet, 6);
  var corpFixed = repairSheetPhoneColumn(corporateSheet, corpCol);

  var total = bookingFixed + corpFixed;

  SpreadsheetApp
    .getActiveSpreadsheet()
    .toast(
      "Successfully repaired " + total + " phone number cell(s)! All phone numbers are now clean Plain Text.",
      "Repair Complete",
      6
    );
}


/* =============================================================================
   AUTOMATIC ON-EDIT REPAIR
   If anyone manually enters a phone number starting with '+' directly in the sheet,
   this automatically catches it and converts it to Plain Text so it never breaks!
============================================================================= */

function onEdit(e) {

  try {

    if (!e || !e.range) return;

    var sheet = e.range.getSheet();
    var sheetName = sheet.getName();
    var row = e.range.getRow();
    var col = e.range.getColumn();

    if (row <= 1) return; // Skip headers

    var isPhone =
      (sheetName === BOOKINGS_SHEET_NAME && col === 4) ||
      (sheetName === CORPORATE_SHEET_NAME && col === 6);

    if (!isPhone) return;

    var formula = e.range.getFormula();
    var val = e.range.getValue();
    var disp = e.range.getDisplayValue();

    if (
      (formula && formula.length > 0) ||
      (disp === "#ERROR!" || disp.indexOf("#") === 0) ||
      (typeof val === "string" && val.charAt(0) === "+")
    ) {
      var cleaned = extractCleanPhone(formula, val, disp);
      e.range.clear({ contentsOnly: true });
      e.range.setNumberFormat("@");
      e.range.setValue(cleaned);
    }

  } catch (err) {
    // Ignore edit errors
  }
}


/* =============================================================================
   TEST CORPORATE LEAD
============================================================================= */

function testCorporateTab() {

  var sheet =
    getOrCreateCorporateSheet();


  var dummyLead = {

    createdAt:
      new Date().toLocaleString(
        "en-IN",
        { timeZone: "Asia/Kolkata" }
      ),

    id:
      "CORP-TEST-" +
      Date.now()
        .toString()
        .slice(-4),

    company:
      "Test Corp Pvt Ltd",

    contactPerson:
      "Test User",

    email:
      "test@testcorp.com",

    phone:
      "+91 99999 00000",

    employeesCount:
      20,

    preferredDates:
      "Oct 15 - Oct 18, 2026",

    nights:
      3,

    budgetRange:
      "Rs.2L - Rs.3L",

    status:
      "NEW",

    requirements:
      "Bonfire and AV Setup"
  };


  safeAppendCorporateRow(
    sheet,
    rowFromCorporateLead(dummyLead)
  );


  formatCorporateRow(
    sheet,
    sheet.getLastRow()
  );


  SpreadsheetApp
    .getActiveSpreadsheet()
    .toast(
      "Test corporate lead added successfully!",
      "Test Passed",
      5
    );
}


/* =============================================================================
   TEST BOOKING
============================================================================= */

function testBooking() {

  var sheet =
    getOrCreateBookingsSheet();


  var dummyBooking = {

    createdAt:
      new Date().toLocaleString(
        "en-IN",
        { timeZone: "Asia/Kolkata" }
      ),

    bookingNumber:
      "BOOK-TEST-" +
      Date.now()
        .toString()
        .slice(-4),

    guestName:
      "Test Guest",

    phone:
      "+91 99999 00000",

    email:
      "test@example.com",

    roomTitle:
      "Premium Cottage",

    checkIn:
      "2026-10-15",

    checkOut:
      "2026-10-18",

    nights:
      3,

    guestsCount:
      2,

    totalAmount:
      15000,

    status:
      "CONFIRMED",

    specialRequests:
      "None"
  };


  safeAppendBookingRow(
    sheet,
    rowFromBooking(dummyBooking)
  );


  formatBookingRow(
    sheet,
    sheet.getLastRow()
  );


  SpreadsheetApp
    .getActiveSpreadsheet()
    .toast(
      "Test booking added successfully!",
      "Test Passed",
      5
    );
}
