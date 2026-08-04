"use client";

import React, { useState } from "react";
import { Building2, Mail, Phone, Calendar, CheckCircle2, Clock, Send } from "lucide-react";

export default function AdminCorporateLeadsPage() {
  const [leads, setLeads] = useState([
    {
      id: "corp-1",
      company: "TechNova Analytics",
      contactPerson: "Rahul Sengupta",
      email: "rahul@technova.io",
      phone: "+91 98765 43210",
      employeesCount: 16,
      preferredDates: "Oct 12 - Oct 15, 2026",
      budgetRange: "₹2.5L - ₹3L",
      requirements: "Strategy offsite, bonfire night, guided birding hike, audio-visual setup.",
      status: "NEW",
    },
    {
      id: "corp-2",
      company: "Apex Consulting",
      contactPerson: "Priya Banerjee",
      email: "priya@apexconsulting.com",
      phone: "+91 98311 55443",
      employeesCount: 22,
      preferredDates: "Nov 05 - Nov 08, 2026",
      budgetRange: "₹3.5L - ₹4L",
      requirements: "Exclusive homestay booking, multi-course Bengali feasts, airport pickup cabs.",
      status: "PROPOSAL_SENT",
    },
  ]);

  const updateStatus = (id: string, status: string) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  return (
    <div className="space-y-8 text-white">
      {/* HEADER */}
      <div>
        <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
          B2B Offsite Pipeline
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Corporate Offsite Leads Management
        </h1>
      </div>

      {/* LEADS LIST */}
      <div className="grid grid-cols-1 gap-6">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="bg-[#2C2473] rounded-3xl p-6 md:p-8 border border-[#C89D45]/30 shadow-2xl space-y-6 flex flex-col md:flex-row items-start justify-between gap-6"
          >
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#C62828] text-white text-xs font-accent font-bold px-3.5 py-1 rounded-full border border-[#C89D45]/50 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {lead.company}
                </span>

                <span
                  className={`text-[10px] font-accent font-bold uppercase px-3 py-1 rounded-full ${
                    lead.status === "NEW"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : lead.status === "PROPOSAL_SENT"
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  Status: {lead.status}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-white">
                {lead.contactPerson}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans text-gray-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C89D45]" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C89D45]" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C89D45]" />
                  <span>{lead.preferredDates}</span>
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-4 border border-white/10 text-xs font-sans space-y-1">
                <span className="text-[#C89D45] font-bold block">
                  Team Size: {lead.employeesCount} Members • Estimated Budget: {lead.budgetRange}
                </span>
                <p className="text-gray-300 italic">&quot;{lead.requirements}&quot;</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => updateStatus(lead.id, "PROPOSAL_SENT")}
                className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow border border-[#C89D45]/40"
              >
                <Send className="w-4 h-4 text-[#C89D45]" />
                <span>Send Custom Proposal</span>
              </button>

              <button
                onClick={() => updateStatus(lead.id, "CLOSED_WON")}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Closed / Confirmed</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
