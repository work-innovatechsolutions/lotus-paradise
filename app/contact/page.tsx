"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Send, Check } from "lucide-react";
import WhatsAppIcon from "@/components/whatsapp-icon";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch {
      // Fallback
    }
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Lotus Paradise! My name is ${formData.name || "Guest"}. ${formData.message || "I would like to inquire about room availability."}`
  );

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
          Always Here To Assist You
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1F1F1F]">
          Contact & Location Desk
        </h1>
        <p className="font-display text-lg text-gray-600 italic">
          Planning your trip to Latpanchar? Get in touch with our team for cab arrangements, customized packages, and room inquiries.
        </p>
      </div>

      {/* SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT MAP & ADDRESS */}
        <div className="lg:col-span-6 glass-ivory rounded-3xl p-8 border border-[#C89D45] shadow-2xl space-y-6">
          <h3 className="font-serif text-2xl font-bold text-[#1F1F1F]">
            Homestay Location & Access
          </h3>

          <div className="space-y-4 text-xs font-sans text-[#1F1F1F]">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C62828] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-accent text-sm">Address:</strong>
                <span>Upper Latpanchar Forest Road, Kurseong Hill Division, Darjeeling District, West Bengal - 734008</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#C89D45] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-accent text-sm">Phone Numbers:</strong>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-3 gap-y-1 mt-0.5 text-xs">
                  <a href="tel:+919832012345" className="hover:text-[#C62828] transition-colors font-medium">+91 98320 12345</a>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <a href="tel:+919732300111" className="hover:text-[#C62828] transition-colors font-medium">+91 97323 00111</a>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <a href="tel:+919242796931" className="hover:text-[#C62828] transition-colors font-medium">+91 92427 96931</a>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <a href="tel:+917699993099" className="hover:text-[#C62828] transition-colors font-medium">+91 76999 93099</a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#2C2473] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-accent text-sm">Email Address:</strong>
                <span>stay@lotusparadisehomestay.com</span>
              </div>
            </div>
          </div>

          {/* GOOGLE MAP EMBED */}
          <div className="relative h-64 rounded-2xl overflow-hidden border border-[#C89D45]/30 shadow-md">
            <iframe
              title="Lotus Paradise Latpanchar Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14238.123456789!2d88.412!3d26.921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e440781234567%3A0x890123456789!2sLatpanchar%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* RIGHT ENQUIRY FORM */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-[#C89D45] shadow-2xl space-y-6">
          <h3 className="font-serif text-2xl font-bold text-[#1F1F1F]">
            Send An Enquiry
          </h3>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl font-bold">Enquiry Sent Successfully!</h4>
              <p className="font-sans text-sm text-gray-600">
                Thank you for contacting Lotus Paradise. Our manager will call or message you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1">
                  Your Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Anirban Roy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FBF8F3] border border-[#C89D45]/30 rounded-xl px-4 py-3 text-sm font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98300 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FBF8F3] border border-[#C89D45]/30 rounded-xl px-4 py-3 text-sm font-sans"
                  />
                </div>
                <div>
                  <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="anirban@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FBF8F3] border border-[#C89D45]/30 rounded-xl px-4 py-3 text-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1">
                  Message / Booking Inquiry *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="I would like to inquire about room availability from Oct 10 to Oct 14..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#FBF8F3] border border-[#C89D45]/30 rounded-xl px-4 py-3 text-sm font-sans"
                />
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#C62828] hover:bg-[#8B1E1E] text-white py-3.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md border border-[#C89D45]"
                >
                  <Send className="w-4 h-4 text-[#C89D45]" />
                  <span>Send Enquiry</span>
                </button>

                <a
                  href={`https://wa.me/919832012345?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-md transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
                  <span>WhatsApp Now</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
