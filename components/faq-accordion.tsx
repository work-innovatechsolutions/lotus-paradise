"use client";

import React, { useState } from "react";
import { FAQS } from "@/lib/data";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-[#FBF8F3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2C2473]/10 text-[#2C2473] text-xs font-accent tracking-widest uppercase font-semibold">
            <HelpCircle className="w-4 h-4 text-[#C89D45]" />
            <span>Essential Guest Information</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1F1F]">
            Frequently Asked Questions
          </h2>
          <p className="font-display text-base text-gray-600 italic">
            Everything you need to know about reaching Latpanchar, amenities, dining, and stay guidelines.
          </p>
        </div>

        {/* ACCORDION LIST */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="glass-ivory rounded-2xl border border-[#C89D45]/30 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif text-xl font-bold text-[#1F1F1F] hover:text-[#C62828] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-accent text-[#C89D45] uppercase tracking-wider bg-[#2C2473] text-white px-2.5 py-1 rounded-md">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C89D45] shrink-0 transition-transform duration-300 ${
                      isOpen ? "transform rotate-180 text-[#C62828]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 font-sans text-sm text-gray-700 leading-relaxed border-t border-[#C89D45]/15">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
