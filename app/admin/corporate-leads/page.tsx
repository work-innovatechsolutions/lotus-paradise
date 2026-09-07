"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  ExternalLink,
  Loader2,
  RotateCw,
  MessageSquare,
  FileSpreadsheet,
} from "lucide-react";
import { GoogleSheetService } from "@/services/google-sheet.service";
import { normalizeCorporateLeadId } from "@/lib/utils";

interface CorporateLead {
  id: string;
  leadRef?: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  employeesCount: number;
  preferredDates: string;
  startDate?: string;
  endDate?: string;
  nights?: number;
  budgetRange: string;
  requirements?: string;
  status: "NEW" | "PROPOSAL_SENT" | "CLOSED_WON";
  createdAt?: any;
}

const DEFAULT_LEADS: CorporateLead[] = [
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
];

export default function AdminCorporateLeadsPage() {
  const [leads, setLeads] = useState<CorporateLead[]>(DEFAULT_LEADS);
  const [loading, setLoading] = useState(false);
  const [syncingSheet, setSyncingSheet] = useState(false);
  const [sendingProposalId, setSendingProposalId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/corporate-leads");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLeads(data);
      }
    } catch (err) {
      console.warn("Could not fetch corporate leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = (id: string, status: "NEW" | "PROPOSAL_SENT" | "CLOSED_WON") => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const handleSyncToSheets = async () => {
    setSyncingSheet(true);
    setActionMessage(null);
    try {
      const res = await GoogleSheetService.syncAllCorporateLeadsToSheet(leads);
      if (res.success) {
        setActionMessage({ text: `✓ Successfully synced ${res.count} corporate leads to Google Sheets ("Corporate Leads" tab)!` });
      } else {
        setActionMessage({ text: res.error || "Failed to sync to Google Sheets.", isError: true });
      }
    } catch (err: any) {
      setActionMessage({ text: err?.message || "Failed to sync to Google Sheets.", isError: true });
    } finally {
      setSyncingSheet(false);
      setTimeout(() => setActionMessage(null), 7000);
    }
  };

  const handleSendProposal = async (lead: CorporateLead) => {
    setSendingProposalId(lead.id);
    setActionMessage(null);
    try {
      const res = await fetch("/api/corporate-leads/send-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      const data = await res.json();
      if (data?.success) {
        updateStatus(lead.id, "PROPOSAL_SENT");
        setActionMessage({ text: `✓ Proposal successfully emailed to ${lead.contactPerson} (${lead.email})!` });
      } else {
        setActionMessage({ text: data?.error || "Failed to send proposal email.", isError: true });
      }
    } catch (err: any) {
      setActionMessage({ text: err?.message || "Failed to send proposal.", isError: true });
    } finally {
      setSendingProposalId(null);
      setTimeout(() => setActionMessage(null), 6000);
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
            B2B Offsite Pipeline
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Corporate Offsite Leads Management
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSyncToSheets}
            disabled={syncingSheet}
            className="bg-[#0F9D58] hover:bg-[#0B8043] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-accent font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors"
            title="Sync all corporate leads to Google Sheets 'Corporate Leads' tab"
          >
            {syncingSheet ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5" />
            )}
            <span>{syncingSheet ? "Syncing..." : "Sync to Google Sheet"}</span>
          </button>

          <button
            onClick={fetchLeads}
            disabled={loading}
            className="bg-black/40 hover:bg-black/60 border border-[#C89D45]/40 text-[#C89D45] px-4 py-2 rounded-xl text-xs font-accent font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ACTION BANNER */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-sans font-bold flex items-center gap-2 border ${
            actionMessage.isError
              ? "bg-red-950/80 border-red-500 text-red-200"
              : "bg-emerald-950/80 border-emerald-500 text-emerald-200"
          } animate-in fade-in duration-200`}
        >
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* LEADS LIST */}
      <div className="grid grid-cols-1 gap-6">
        {leads.map((lead) => {
          const cleanPhone = (lead.phone || "").replace(/[^0-9]/g, "");
          return (
            <div
              key={lead.id}
              className="bg-[#2C2473] rounded-3xl p-6 md:p-8 border border-[#C89D45]/30 shadow-2xl space-y-6 flex flex-col md:flex-row items-start justify-between gap-6 hover:border-[#C89D45]/60 transition-all"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-[#C62828] text-white text-xs font-accent font-bold px-3.5 py-1 rounded-full border border-[#C89D45]/50 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {lead.company}
                  </span>

                  <span className="text-[#F3D27A] font-mono text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/40 border border-[#C89D45]/40">
                    Ref: {normalizeCorporateLeadId(lead.leadRef || lead.id)}
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

                  {lead.nights ? (
                    <span className="bg-[#C89D45]/20 text-[#F3D27A] text-[10px] font-accent font-bold uppercase px-2.5 py-0.5 rounded-full border border-[#C89D45]/30">
                      {lead.nights} Nights
                    </span>
                  ) : null}
                </div>

                <h3 className="font-serif text-2xl font-bold text-white">
                  {lead.contactPerson}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans text-gray-300 pt-1">
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-1.5 hover:text-[#C89D45] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C89D45] shrink-0" />
                    <span className="truncate">{lead.email}</span>
                  </a>
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center gap-1.5 hover:text-[#C89D45] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C89D45] shrink-0" />
                    <span>{lead.phone}</span>
                  </a>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C89D45] shrink-0" />
                    <span className="truncate">{lead.preferredDates || "Flexible Dates"}</span>
                  </div>
                </div>

                <div className="bg-black/30 rounded-2xl p-4 border border-white/10 text-xs font-sans space-y-1">
                  <span className="text-[#C89D45] font-bold block">
                    Team Size: {lead.employeesCount} Members • Estimated Budget: {lead.budgetRange}
                  </span>
                  {lead.requirements ? (
                    <p className="text-gray-300 italic">&quot;{lead.requirements}&quot;</p>
                  ) : (
                    <p className="text-gray-400 italic">No special requirements noted.</p>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => handleSendProposal(lead)}
                  disabled={sendingProposalId === lead.id}
                  className="bg-[#C62828] hover:bg-[#8B1E1E] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow border border-[#C89D45]/40 transition-colors"
                >
                  {sendingProposalId === lead.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C89D45]" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#C89D45]" />
                      <span>{lead.status === "PROPOSAL_SENT" ? "Resend Proposal Email" : "Email Custom Proposal"}</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(lead.contactPerson)},%20thank%20you%20for%20your%20interest%20in%20The%20Cometas%20corporate%20retreat%20for%20${encodeURIComponent(lead.company)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Client</span>
                </a>

                <button
                  onClick={() => updateStatus(lead.id, "CLOSED_WON")}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Closed / Won</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
