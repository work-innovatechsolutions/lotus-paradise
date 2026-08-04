"use client";

import React, { useState } from "react";
import { Inbox, Mail, Phone, CheckCircle2, Trash2, Reply } from "lucide-react";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([
    {
      id: "enq-1",
      name: "Siddharth Roy",
      email: "siddharth@example.com",
      phone: "+91 98301 99887",
      subject: "Latpanchar Hornbill Tour Package",
      message: "Hello, we are a group of 4 photographers visiting in October. Do you arrange local cab pickup from NJP station?",
      status: "UNREAD",
      date: "2026-08-04",
    },
    {
      id: "enq-2",
      name: "Meenakshi Das",
      email: "meenakshi@example.com",
      phone: "+91 94330 11223",
      subject: "Diwali Family Vacation Booking",
      message: "We are planning a 5-day stay during Diwali. Is the Kanchenjunga Deluxe Suite available?",
      status: "READ",
      date: "2026-08-03",
    },
  ]);

  const markRead = (id: string) => {
    setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status: "READ" } : e)));
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries(enquiries.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-8 text-white">
      <div>
        <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
          Customer Communications Desk
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Contact Enquiries Inbox
        </h1>
      </div>

      <div className="space-y-4">
        {enquiries.map((enq) => (
          <div
            key={enq.id}
            className={`bg-[#2C2473] rounded-2xl p-6 border shadow-xl flex flex-col md:flex-row items-start justify-between gap-4 ${
              enq.status === "UNREAD" ? "border-[#C62828] bg-[#2C2473]/90" : "border-[#C89D45]/30"
            }`}
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-xl font-bold text-white">{enq.name}</h3>
                <span
                  className={`text-[10px] font-accent font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    enq.status === "UNREAD" ? "bg-[#C62828] text-white" : "bg-gray-600 text-white"
                  }`}
                >
                  {enq.status}
                </span>
                <span className="text-xs text-gray-400">{enq.date}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#C89D45]">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {enq.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {enq.phone}
                </span>
              </div>

              <p className="text-xs font-sans text-gray-200 bg-black/30 p-3 rounded-xl border border-white/10 leading-relaxed">
                <strong>Subject: {enq.subject}</strong><br />
                {enq.message}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {enq.status === "UNREAD" && (
                <button
                  onClick={() => markRead(enq.id)}
                  className="p-2 rounded-xl bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 transition-colors"
                  title="Mark as Read"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
              <a
                href={`mailto:${enq.email}`}
                className="p-2 rounded-xl bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 transition-colors"
                title="Reply by Email"
              >
                <Reply className="w-4 h-4" />
              </a>
              <button
                onClick={() => deleteEnquiry(enq.id)}
                className="p-2 rounded-xl bg-red-600/30 text-red-300 hover:bg-red-600 transition-colors"
                title="Delete Enquiry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
