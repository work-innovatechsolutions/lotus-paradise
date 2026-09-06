"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Check,
} from "lucide-react";

interface CorporateDatePickerProps {
  startDate?: string;
  endDate?: string;
  onChange: (startDate: string, endDate: string, formattedRange: string, nights: number) => void;
  className?: string;
}

export default function CorporateDatePicker({
  startDate = "",
  endDate = "",
  onChange,
  className = "",
}: CorporateDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Month currently viewed in the calendar
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialViewMonth = startDate ? new Date(startDate + "T00:00:00") : new Date();
  const [viewDate, setViewDate] = useState<Date>(
    new Date(initialViewMonth.getFullYear(), initialViewMonth.getMonth(), 1)
  );

  const [tempStart, setTempStart] = useState<string>(startDate);
  const [tempEnd, setTempEnd] = useState<string>(endDate);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"calendar" | "inputs">("calendar");

  // Sync props if changed externally
  useEffect(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [startDate, endDate]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const formatDateStr = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateNights = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const d1 = new Date(start + "T00:00:00").getTime();
    const d2 = new Date(end + "T00:00:00").getTime();
    const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const commitSelection = (start: string, end: string) => {
    setTempStart(start);
    setTempEnd(end);
    const nights = calculateNights(start, end);
    let label = "";
    if (start && end) {
      const sFmt = formatDisplayDate(start);
      const eFmt = formatDisplayDate(end);
      label = `${sFmt} – ${eFmt} (${nights} Night${nights !== 1 ? "s" : ""})`;
    } else if (start) {
      label = `From ${formatDisplayDate(start)}`;
    }
    onChange(start, end, label, nights);
  };

  const handleDateClick = (dateStr: string) => {
    if (!tempStart || (tempStart && tempEnd)) {
      // Start fresh selection
      setTempStart(dateStr);
      setTempEnd("");
      commitSelection(dateStr, "");
    } else {
      // Choosing end date
      if (dateStr < tempStart) {
        // Clicked an earlier date, make it the new start date
        setTempStart(dateStr);
        setTempEnd("");
        commitSelection(dateStr, "");
      } else if (dateStr === tempStart) {
        // Same date: 1-day offsite
        const nextDay = new Date(dateStr + "T00:00:00");
        nextDay.setDate(nextDay.getDate() + 1);
        const nextStr = formatDateStr(nextDay);
        commitSelection(dateStr, nextStr);
        setIsOpen(false);
      } else {
        // Valid end date selected
        commitSelection(tempStart, dateStr);
        setIsOpen(false);
      }
    }
  };

  // Month navigation
  const prevMonth = () => {
    const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prev >= minMonth) {
      setViewDate(prev);
    }
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isPrevDisabled =
    viewDate.getFullYear() === today.getFullYear() &&
    viewDate.getMonth() === today.getMonth();

  // Generate calendar grid
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  // Preset generators
  const applyPreset = (daysFromNow: number, durationNights: number) => {
    const s = new Date(today);
    s.setDate(s.getDate() + daysFromNow);
    const e = new Date(s);
    e.setDate(e.getDate() + durationNights);

    const sStr = formatDateStr(s);
    const eStr = formatDateStr(e);
    commitSelection(sStr, eStr);
    setViewDate(new Date(s.getFullYear(), s.getMonth(), 1));
    setIsOpen(false);
  };

  // Find next Friday
  const getNextFridayOffset = () => {
    const currentDay = today.getDay();
    const daysUntilFriday = (5 - currentDay + 7) % 7 || 7;
    return daysUntilFriday;
  };

  const nights = calculateNights(tempStart, tempEnd);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* TRIGGER BUTTON */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[38px] bg-white border border-[#C89D45]/40 hover:border-[#C62828] focus-within:border-[#C62828] rounded-xl px-3 text-xs font-sans cursor-pointer transition-all duration-200 flex items-center justify-between shadow-sm group"
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0 mr-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-[#C62828] shrink-0" />
          {tempStart && tempEnd ? (
            <span className="font-medium text-[#1F1F1F] truncate text-xs">
              {formatDisplayDate(tempStart)} – {formatDisplayDate(tempEnd)}{" "}
              <span className="bg-[#C89D45]/20 text-[#8B1E1E] text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-1 font-accent inline-block">
                {nights}N
              </span>
            </span>
          ) : tempStart ? (
            <span className="text-[#1F1F1F] font-medium truncate text-xs">
              From {formatDisplayDate(tempStart)}
            </span>
          ) : (
            <span className="text-gray-400 truncate text-xs">
              Oct 15 – Oct 18 (Pick dates)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {tempStart && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                commitSelection("", "");
              }}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
              title="Clear dates"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <span className="text-[10px] text-[#C89D45] font-bold uppercase tracking-wider group-hover:underline">
            {isOpen ? "Close" : "Pick"}
          </span>
        </div>
      </div>

      {/* POPOVER CALENDAR — Fixed viewport center overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsOpen(false)}
          />
          {/* Calendar panel */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-[#FAF8F5] border border-[#C89D45] rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in-50 zoom-in-95 duration-200 text-[#1F1F1F]">
          {/* TABS */}
          <div className="flex items-center justify-between pb-3 border-b border-[#C89D45]/20 mb-3">
            <div className="flex items-center gap-1 bg-[#F0ECE1] p-0.5 rounded-lg text-[10px] font-accent font-bold uppercase">
              <button
                type="button"
                onClick={() => setActiveTab("calendar")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeTab === "calendar"
                    ? "bg-[#C62828] text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Calendar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("inputs")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeTab === "inputs"
                    ? "bg-[#C62828] text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Direct Inputs
              </button>
            </div>

            {nights > 0 && (
              <span className="text-[11px] font-bold text-[#C62828] bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-accent">
                {nights} Nights Retreat
              </span>
            )}
          </div>

          {activeTab === "calendar" ? (
            <div>
              {/* MONTH HEADER & CONTROLS */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={prevMonth}
                  disabled={isPrevDisabled}
                  className={`p-1.5 rounded-lg border border-[#C89D45]/30 hover:bg-[#EAE4D6] transition-colors ${
                    isPrevDisabled ? "opacity-30 cursor-not-allowed" : "text-[#1F1F1F]"
                  }`}
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="font-serif font-bold text-sm text-[#1F1F1F]">
                  {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </div>

                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg border border-[#C89D45]/30 hover:bg-[#EAE4D6] transition-colors text-[#1F1F1F]"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* DAYS OF WEEK */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-accent uppercase font-bold text-gray-500">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              {/* CALENDAR DAYS GRID */}
              <div className="grid grid-cols-7 gap-1 text-xs">
                {daysArray.map((d, index) => {
                  if (d === null) {
                    return <div key={`empty-${index}`} className="h-8" />;
                  }

                  const currentDayDate = new Date(year, month, d);
                  currentDayDate.setHours(0, 0, 0, 0);
                  const dateStr = formatDateStr(currentDayDate);

                  const isPast = currentDayDate < today;
                  const isStart = tempStart === dateStr;
                  const isEnd = tempEnd === dateStr;
                  const isInRange =
                    tempStart &&
                    tempEnd &&
                    dateStr > tempStart &&
                    dateStr < tempEnd;
                  const isHoverInRange =
                    tempStart &&
                    !tempEnd &&
                    hoverDate &&
                    dateStr > tempStart &&
                    dateStr <= hoverDate;

                  let cellClass = "hover:bg-[#C89D45]/20 text-[#1F1F1F] rounded-lg";

                  if (isStart && isEnd) {
                    cellClass = "bg-[#C62828] text-white font-bold rounded-lg shadow-sm";
                  } else if (isStart) {
                    cellClass =
                      "bg-[#C62828] text-white font-bold rounded-l-lg rounded-r-none shadow-sm";
                  } else if (isEnd) {
                    cellClass =
                      "bg-[#C62828] text-white font-bold rounded-r-lg rounded-l-none shadow-sm";
                  } else if (isInRange) {
                    cellClass = "bg-[#C62828]/15 text-[#8B1E1E] font-medium rounded-none";
                  } else if (isHoverInRange) {
                    cellClass = "bg-[#C89D45]/25 text-[#8B1E1E] rounded-none";
                  }

                  return (
                    <button
                      key={`day-${d}`}
                      type="button"
                      disabled={isPast}
                      onClick={() => handleDateClick(dateStr)}
                      onMouseEnter={() => setHoverDate(dateStr)}
                      onMouseLeave={() => setHoverDate(null)}
                      className={`h-8 flex items-center justify-center transition-all ${cellClass} ${
                        isPast ? "opacity-25 cursor-not-allowed hover:bg-transparent" : "cursor-pointer"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              {/* QUICK OFFSITE PRESETS */}
              <div className="mt-3 pt-3 border-t border-[#C89D45]/20">
                <span className="text-[10px] font-accent uppercase text-gray-500 font-bold mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C89D45]" /> Quick Offsite Presets
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-sans">
                  <button
                    type="button"
                    onClick={() => applyPreset(getNextFridayOffset(), 2)}
                    className="p-1.5 bg-white hover:bg-[#F3EFE6] border border-[#C89D45]/30 rounded-lg text-left transition-colors font-medium text-gray-700 truncate"
                  >
                    ⚡ This Weekend (Fri–Sun)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(getNextFridayOffset() + 7, 2)}
                    className="p-1.5 bg-white hover:bg-[#F3EFE6] border border-[#C89D45]/30 rounded-lg text-left transition-colors font-medium text-gray-700 truncate"
                  >
                    🌲 Next Weekend (Fri–Sun)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(9, 2)}
                    className="p-1.5 bg-white hover:bg-[#F3EFE6] border border-[#C89D45]/30 rounded-lg text-left transition-colors font-medium text-gray-700 truncate"
                  >
                    📊 3-Day Midweek Offsite
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(getNextFridayOffset() - 1, 3)}
                    className="p-1.5 bg-white hover:bg-[#F3EFE6] border border-[#C89D45]/30 rounded-lg text-left transition-colors font-medium text-gray-700 truncate"
                  >
                    🏔️ 4-Day Executive (Thu–Sun)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* DIRECT DATE INPUTS TAB */
            <div className="space-y-3 py-1">
              <div>
                <label className="text-[10px] font-accent uppercase text-[#C62828] font-bold block mb-1">
                  Check-In Date (Start)
                </label>
                <input
                  type="date"
                  value={tempStart}
                  min={formatDateStr(today)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTempStart(val);
                    if (tempEnd && val > tempEnd) {
                      setTempEnd("");
                      commitSelection(val, "");
                    } else {
                      commitSelection(val, tempEnd);
                    }
                  }}
                  className="w-full bg-white border border-[#C89D45]/40 rounded-xl px-3 py-2 text-xs font-sans text-gray-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-accent uppercase text-[#C62828] font-bold block mb-1">
                  Check-Out Date (End)
                </label>
                <input
                  type="date"
                  value={tempEnd}
                  min={tempStart || formatDateStr(today)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTempEnd(val);
                    commitSelection(tempStart, val);
                  }}
                  className="w-full bg-white border border-[#C89D45]/40 rounded-xl px-3 py-2 text-xs font-sans text-gray-800"
                />
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="mt-3 pt-2 border-t border-[#C89D45]/20 flex items-center justify-between">
            <div className="text-[11px] text-gray-600 font-sans">
              {tempStart && tempEnd ? (
                <span>
                  <strong>{nights} Night{nights !== 1 ? "s" : ""}</strong> selected
                </span>
              ) : (
                <span className="italic text-gray-400">Select start and end dates</span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {tempStart && (
                <button
                  type="button"
                  onClick={() => commitSelection("", "")}
                  className="text-[10px] font-bold uppercase text-gray-500 hover:text-red-600 px-2 py-1"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-[#C62828] hover:bg-[#8B1E1E] text-white text-[10px] font-accent font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors"
              >
              <Check className="w-3 h-3" /> Done
              </button>
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
