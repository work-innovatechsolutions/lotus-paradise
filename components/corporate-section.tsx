"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Users, Briefcase, Flame, Utensils, Mountain, ShieldCheck, Check, Send } from "lucide-react";

export default function CorporateSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    contactPerson: "",
    email: "",
    phone: "",
    employeesCount: "15",
    preferredDates: "",
    budgetRange: "₹2L - ₹3L",
    requirements: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/corporate-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  const corporateFeatures = [
    {
      title: "Team Building & Hikes",
      desc: "Guided ridge walks & nature trails designed to boost communication and team cohesion.",
      icon: <Users className="w-6 h-6 text-[#C89D45]" />,
    },
    {
      title: "Outdoor Bonfire & Music",
      desc: "Unwind around wood-fired bonfires with acoustic guitar music and local starry night sky views.",
      icon: <Flame className="w-6 h-6 text-[#C89D45]" />,
    },
    {
      title: "Colonial Conference Setup",
      desc: "High-speed optical fiber WiFi, projector setup, and ergonomic seating in our scenic lounge.",
      icon: <Briefcase className="w-6 h-6 text-[#C89D45]" />,
    },
    {
      title: "Organic Bengali Dining",
      desc: "Customized multi-course Bengali feasts, barbecues, and fresh Darjeeling tea breaks.",
      icon: <Utensils className="w-6 h-6 text-[#C89D45]" />,
    },
  ];

  return (
    <section className="py-24 bg-[#2C2473] text-white relative overflow-hidden">
      {/* BACKGROUND DRONE IMAGE SIMULATION */}
      <div className="absolute inset-0 z-0 opacity-25">
        <Image
          src="/images/hero/ChatGPT Image Aug 4, 2026, 11_29_35 PM.png"
          alt="Corporate Retreat Background"
          fill
          className="object-cover object-center filter brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2473] via-[#2C2473]/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="bg-[#C62828] text-white px-4 py-1 rounded-full text-xs font-accent uppercase font-bold tracking-widest border border-[#C89D45]/50 inline-block">
            Corporate Offsites & Strategy Retreats
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl font-bold text-white">
            Escape Boardrooms. Reconnect In Nature.
          </h2>
          <p className="font-display text-xl text-[#C89D45] italic">
            &quot;Build stronger teams amidst the quiet majesty of Latpanchar pine forests.&quot;
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {corporateFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="glass-dark rounded-2xl p-6 border border-[#C89D45]/30 hover:border-[#C89D45] transition-all duration-300 shadow-xl space-y-3"
            >
              <div className="p-3 rounded-xl bg-black/40 inline-block border border-[#C89D45]/30">
                {feat.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                {feat.title}
              </h3>
              <p className="font-sans text-xs text-gray-300 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA HUB */}
        <div className="text-center bg-[#FBF8F3] rounded-3xl p-8 md:p-12 text-[#1F1F1F] max-w-4xl mx-auto border border-[#C89D45] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1F1F1F]">
              Ready to Host Your Next Team Offsite?
            </h3>
            <p className="font-sans text-sm text-gray-600">
              Customized corporate packages for groups of 8 to 25 members with exclusive homestay booking options.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-8 py-4 rounded-full font-accent text-xs font-bold uppercase tracking-widest shrink-0 shadow-lg border border-[#C89D45]/50 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Briefcase className="w-4 h-4 text-[#C89D45]" />
            <span>Request Proposal</span>
          </button>
        </div>
      </div>

      {/* CORPORATE ENQUIRY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FBF8F3] rounded-3xl p-6 md:p-8 max-w-lg w-full text-[#1F1F1F] border border-[#C89D45] shadow-2xl relative">
            <button
              onClick={() => {
                setModalOpen(false);
                setSubmitted(false);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-sm font-bold"
            >
              ✕ Close
            </button>

            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold">Proposal Request Received!</h3>
                <p className="font-sans text-sm text-gray-600">
                  Our Corporate Concierge will contact you within 4 hours with a custom itinerary and package breakdown.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#1F1F1F]">
                  Corporate Offsite Inquiry
                </h3>
                <p className="text-xs font-sans text-gray-600">
                  Fill in your requirements for an exclusive corporate package in Latpanchar.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-accent uppercase text-[#C62828] font-bold">
                      Company Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="TechCorp Solutions"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-white border border-[#C89D45]/30 rounded-xl px-3 py-2 text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-accent uppercase text-[#C62828] font-bold">
                      Contact Person
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Rahul Sengupta"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full bg-white border border-[#C89D45]/30 rounded-xl px-3 py-2 text-xs font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-accent uppercase text-[#C62828] font-bold">
                      Work Email
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="rahul@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-[#C89D45]/30 rounded-xl px-3 py-2 text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-accent uppercase text-[#C62828] font-bold">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-[#C89D45]/30 rounded-xl px-3 py-2 text-xs font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-accent uppercase text-[#C62828] font-bold">
                      Estimated Team Size
                    </label>
                    <input
                      type="number"
                      value={formData.employeesCount}
                      onChange={(e) => setFormData({ ...formData, employeesCount: e.target.value })}
                      className="w-full bg-white border border-[#C89D45]/30 rounded-xl px-3 py-2 text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-accent uppercase text-[#C62828] font-bold">
                      Preferred Dates
                    </label>
                    <input
                      type="text"
                      placeholder="Oct 15 - Oct 18"
                      value={formData.preferredDates}
                      onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                      className="w-full bg-white border border-[#C89D45]/30 rounded-xl px-3 py-2 text-xs font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-accent uppercase text-[#C62828] font-bold">
                    Special Requests
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Bonfire, acoustic music, AV setup, airport transfer..."
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full bg-white border border-[#C89D45]/30 rounded-xl px-3 py-2 text-xs font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C62828] hover:bg-[#8B1E1E] text-white py-3 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md border border-[#C89D45]"
                >
                  <Send className="w-4 h-4 text-[#C89D45]" />
                  <span>Submit Proposal Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
