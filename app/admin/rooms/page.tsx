"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ROOMS } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit3, Trash2, BedDouble, Users, Check } from "lucide-react";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState(ROOMS);
  const [modalOpen, setModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    title: "",
    type: "Deluxe Suite",
    pricePerNight: 4500,
    capacity: 2,
    bedType: "King Bed",
    view: "Kanchenjunga Peak View",
    description: "",
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `room-${Date.now()}`,
      title: newRoom.title,
      slug: newRoom.title.toLowerCase().replace(/\s+/g, "-"),
      type: newRoom.type,
      pricePerNight: Number(newRoom.pricePerNight),
      capacity: Number(newRoom.capacity),
      bedType: newRoom.bedType,
      view: newRoom.view,
      size: "380 sq ft",
      description: newRoom.description,
      amenities: ["Breakfast Included", "Free WiFi", "Geyser"],
      images: ["/images/hero/b.jpg.jpg.jpeg"],
      featured: true,
    };

    setRooms([...rooms, created]);
    setModalOpen(false);
  };

  const toggleAvailability = (id: string) => {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, featured: !r.featured } : r)));
  };

  return (
    <div className="space-y-8 text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
            Homestay Suite Inventory
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Rooms & Suites CRUD Manager
          </h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow border border-[#C89D45]/40"
        >
          <Plus className="w-4 h-4 text-[#C89D45]" />
          <span>Add New Suite</span>
        </button>
      </div>

      {/* ROOMS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-[#2C2473] rounded-3xl overflow-hidden border border-[#C89D45]/30 p-6 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-[#C89D45]/30">
                <Image
                  src={room.images[0]}
                  alt={room.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 right-3 bg-[#C62828] text-white text-xs font-accent font-bold px-3 py-1 rounded-full">
                  {formatPrice(room.pricePerNight)} / Night
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-white">{room.title}</h3>
              <p className="text-xs font-sans text-gray-300">{room.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 pt-2 border-t border-white/10">
                <span>Bed: {room.bedType}</span>
                <span>Guests: {room.capacity}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={() => toggleAvailability(room.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-accent font-bold uppercase ${
                  room.featured ? "bg-emerald-600 text-white" : "bg-gray-600 text-white"
                }`}
              >
                {room.featured ? "Available" : "Maintenance"}
              </button>

              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg bg-indigo-600/40 text-indigo-200 hover:bg-indigo-600">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRooms(rooms.filter((r) => r.id !== room.id))}
                  className="p-1.5 rounded-lg bg-red-600/40 text-red-200 hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddRoom}
            className="bg-[#2C2473] rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#C89D45] space-y-4"
          >
            <h3 className="font-serif text-2xl font-bold">Add New Suite</h3>
            <div>
              <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Suite Title</label>
              <input
                required
                type="text"
                value={newRoom.title}
                onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Price / Night (₹)</label>
                <input
                  type="number"
                  value={newRoom.pricePerNight}
                  onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Capacity</label>
                <input
                  type="number"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Description</label>
              <textarea
                rows={3}
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-400 rounded-xl text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#C62828] text-white px-5 py-2 rounded-xl text-xs uppercase font-bold"
              >
                Create Suite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
