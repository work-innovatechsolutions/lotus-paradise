"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useRoomStore, type StoreProperty, type StoreRoom } from "@/lib/room-store";
import ImageDropbox from "@/components/image-dropbox";
import {
  Plus, Edit3, Trash2, MapPin, Users, BedDouble,
  X, Check, AlertTriangle, Building2, ChevronDown,
  ChevronUp, Bed, Settings2, Hash, Navigation, ExternalLink,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// BLANK TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

const BLANK_PROP: Omit<StoreProperty, "id"> = {
  name: "",
  location: "",
  mapLink: "",
  description: "",
  coverImage: "",
};

const blankRoom = (propertyId: string, location: string): Omit<StoreRoom, "id" | "slug"> => ({
  propertyId,
  title: "",
  type: "Deluxe Room",
  floor: "Ground Floor",
  pricePerNight: 1550,
  standardPricePerPax: 1550,
  premiumPricePerPax: 2100,
  minCapacity: 2,
  capacity: 4,
  quantity: 1,
  bedType: "King Bed",
  view: "Kanchenjunga Peak View",
  size: "360 sq ft",
  location,
  description: "",
  amenities: ["Fooding & Lodging Included", "All 4 Meals Included", "Free WiFi", "Geyser"],
  images: [],
  featured: true,
  available: true,
});

const ROOM_TYPES = [
  "Deluxe Room", "Deluxe Family Room", "Deluxe Suite",
  "Family Suite", "Couple Room", "Standard Room", "Premium Suite", "Dormitory",
];
const FLOOR_OPTIONS = ["Ground Floor", "First Floor"];
const BED_TYPES = [
  "King Bed", "Queen Bed", "Twin Beds",
  "King Bed + Extra Bed Option", "2 King Beds + Daybed Seating",
  "King Bed + Balcony Setup", "2 King Beds + Balcony Sitting",
  "King Bed + Plush Daybed", "2 Queen Beds + Sofa Sitting",
  "Queen Canopy Bed", "Bunk Beds",
];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminRoomsPage() {
  const {
    properties, addProperty, updateProperty, deleteProperty,
    rooms, addRoom, updateRoom, deleteRoom, toggleAvailability,
  } = useRoomStore();

  // ── Property modal ─────────────────────────────────────────────────────────
  const [propModal,        setPropModal]        = useState<"create" | "edit" | null>(null);
  const [propTarget,       setPropTarget]       = useState<StoreProperty | null>(null);
  const [propForm,         setPropForm]         = useState(BLANK_PROP);
  const [propCoverImages,  setPropCoverImages]  = useState<string[]>([]);
  const [propGalleryImages, setPropGalleryImages] = useState<string[]>([]);
  const [deleteConfirmProp, setDeleteConfirmProp] = useState<string | null>(null);

  // ── Selected property (dropdown) ───────────────────────────────────────────
  const [selectedPropId, setSelectedPropId] = useState<string | null>(
    properties[0]?.id ?? null
  );
  const [selectorOpen, setSelectorOpen] = useState(false);

  const selectedProp = properties.find((p) => p.id === selectedPropId) ?? null;
  const propRooms = useMemo(
    () => rooms.filter((r) => r.propertyId === selectedPropId),
    [rooms, selectedPropId]
  );

  // ── Room modal ─────────────────────────────────────────────────────────────
  const [roomModal,       setRoomModal]       = useState<"create" | "edit" | null>(null);
  const [roomTarget,      setRoomTarget]      = useState<StoreRoom | null>(null);
  const [roomForm,        setRoomForm]        = useState<Omit<StoreRoom, "id" | "slug">>(
    blankRoom(selectedPropId ?? "", selectedProp?.location ?? "")
  );
  const [roomImages,      setRoomImages]      = useState<string[]>([]);
  const [deleteConfirmRoom, setDeleteConfirmRoom] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // Property handlers
  // ─────────────────────────────────────────────────────────────────────────

  const openCreateProp = () => {
    setPropForm(BLANK_PROP);
    setPropCoverImages([]);
    setPropGalleryImages([]);
    setPropTarget(null);
    setPropModal("create");
  };

  const openEditProp = (p: StoreProperty) => {
    setPropTarget(p);
    setPropForm({
      name: p.name,
      location: p.location,
      mapLink: p.mapLink || "",
      description: p.description,
      coverImage: p.coverImage,
      images: p.images || [],
    });
    setPropCoverImages(p.coverImage ? [p.coverImage] : []);
    setPropGalleryImages(p.images || []);
    setPropModal("edit");
  };

  const handlePropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalForm = {
      ...propForm,
      coverImage: propCoverImages[0] ?? propGalleryImages[0] ?? "/images/hero/b.jpg.jpg.jpeg",
      images: propGalleryImages,
    };
    if (propModal === "create") {
      const created = addProperty(finalForm);
      setSelectedPropId(created.id);
    } else if (propModal === "edit" && propTarget) {
      updateProperty(propTarget.id, finalForm);
    }
    setPropModal(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Room handlers
  // ─────────────────────────────────────────────────────────────────────────

  const openCreateRoom = () => {
    if (!selectedPropId) return;
    const blank = blankRoom(selectedPropId, selectedProp?.location ?? "");
    setRoomForm(blank);
    setRoomImages([]);
    setRoomTarget(null);
    setRoomModal("create");
  };

  const openEditRoom = (room: StoreRoom) => {
    setRoomTarget(room);
    setRoomForm({
      propertyId: room.propertyId, title: room.title, type: room.type,
      pricePerNight: room.pricePerNight, capacity: room.capacity, quantity: room.quantity ?? 1,
      bedType: room.bedType, view: room.view, size: room.size, location: room.location,
      description: room.description, amenities: room.amenities,
      images: room.images, featured: room.featured, available: room.available,
    });
    setRoomImages(room.images ?? []);
    setRoomModal("edit");
  };

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRoom = { ...roomForm, images: roomImages };
    if (roomModal === "create") addRoom(finalRoom);
    else if (roomModal === "edit" && roomTarget) updateRoom(roomTarget.id, finalRoom);
    setRoomModal(null);
  };

  const rf = <K extends keyof typeof roomForm>(key: K, val: (typeof roomForm)[K]) =>
    setRoomForm((prev) => ({ ...prev, [key]: val }));

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-10 text-white">

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — PROPERTY MANAGEMENT
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
              Step 1
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Property Management
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {properties.length} propert{properties.length !== 1 ? "ies" : "y"} registered
            </p>
          </div>
          <button
            onClick={openCreateProp}
            className="bg-[#C89D45] hover:bg-[#a07a30] text-[#1F1F1F] px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Property
          </button>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-14 text-gray-500 border border-dashed border-white/10 rounded-3xl">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-serif text-lg">No properties yet.</p>
            <p className="text-xs mt-1">Click &quot;Add New Property&quot; to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {properties.map((prop) => {
              const count = rooms.filter((r) => r.propertyId === prop.id).length;
              const isSelected = selectedPropId === prop.id;
              return (
                <div
                  key={prop.id}
                  onClick={() => { setSelectedPropId(prop.id); setSelectorOpen(false); }}
                  className={`relative rounded-3xl overflow-hidden border cursor-pointer transition-all duration-300 group ${
                    isSelected ? "border-[#C89D45] shadow-xl shadow-[#C89D45]/20 scale-[1.01]" : "border-white/10 hover:border-[#C89D45]/50"
                  }`}
                >
                  <div className="relative h-36">
                    <Image
                      src={prop.coverImage || "/images/hero/b.jpg.jpg.jpeg"}
                      alt={prop.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={prop.coverImage?.startsWith("data:")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-[#C89D45] text-[#1F1F1F] text-[9px] font-accent font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Managing
                      </div>
                    )}
                    <div className="absolute bottom-3 left-4">
                      <p className="font-serif text-base font-bold text-white leading-tight">{prop.name}</p>
                      <p className="flex items-center gap-1 text-[10px] text-[#C89D45] font-accent mt-0.5">
                        <MapPin className="w-3 h-3" /> {prop.location}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#2C2473] px-4 py-3 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      <span className="text-[#C89D45] font-bold text-sm">{count}</span> room{count !== 1 ? "s" : ""}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {prop.mapLink && (
                        <a
                          href={prop.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                          title="Open Google Maps"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); openEditProp(prop); }}
                        className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 transition-colors"
                        title="Edit Property">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmProp(prop.id); }}
                        className="p-1.5 rounded-lg bg-red-600/30 text-red-300 hover:bg-red-600 transition-colors"
                        title="Delete Property">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — PROPERTY SELECTOR DROPDOWN CARD
      ══════════════════════════════════════════════════════════════════════ */}
      {properties.length > 0 && (
        <div className="space-y-4">
          <div>
            <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">Step 2</span>
            <h2 className="font-serif text-2xl font-bold text-white">Select Property to Manage Rooms</h2>
          </div>

          <div className="relative">
            <button
              onClick={() => setSelectorOpen((o) => !o)}
              className="w-full bg-[#2C2473] border border-[#C89D45]/40 hover:border-[#C89D45] rounded-2xl px-5 py-4 flex items-center justify-between gap-4 transition-all"
            >
              {selectedProp ? (
                <div className="flex items-center gap-4 text-left">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <Image src={selectedProp.coverImage || "/images/hero/b.jpg.jpg.jpeg"} alt={selectedProp.name} fill className="object-cover" unoptimized={selectedProp.coverImage?.startsWith("data:")} />
                  </div>
                  <div>
                    <p className="font-serif text-base font-bold text-white">{selectedProp.name}</p>
                    <p className="text-[10px] text-[#C89D45] font-accent flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {selectedProp.location}
                    </p>
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 text-sm font-accent">— Select a property —</span>
              )}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-accent font-bold text-[#C89D45] uppercase tracking-widest bg-[#C89D45]/10 border border-[#C89D45]/30 rounded-full px-2.5 py-1">
                  {propRooms.length} room{propRooms.length !== 1 ? "s" : ""}
                </span>
                {selectorOpen ? <ChevronUp className="w-4 h-4 text-[#C89D45]" /> : <ChevronDown className="w-4 h-4 text-[#C89D45]" />}
              </div>
            </button>

            {selectorOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-[#2C2473] border border-[#C89D45]/40 rounded-2xl overflow-hidden shadow-2xl z-30">
                {properties.map((prop) => {
                  const cnt = rooms.filter((r) => r.propertyId === prop.id).length;
                  return (
                    <button key={prop.id} onClick={() => { setSelectedPropId(prop.id); setSelectorOpen(false); }}
                      className={`w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-white/5 transition-colors border-b border-white/10 last:border-b-0 ${selectedPropId === prop.id ? "bg-[#C89D45]/10" : ""}`}>
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                        <Image src={prop.coverImage || "/images/hero/b.jpg.jpg.jpeg"} alt={prop.name} fill className="object-cover" unoptimized={prop.coverImage?.startsWith("data:")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm font-bold text-white truncate">{prop.name}</p>
                        <p className="text-[10px] text-[#C89D45]/80 font-accent">{prop.location}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">{cnt} room{cnt !== 1 ? "s" : ""}</span>
                      {selectedPropId === prop.id && <Check className="w-4 h-4 text-[#C89D45] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — ROOM CUSTOMIZATION
      ══════════════════════════════════════════════════════════════════════ */}
      {selectedProp && (
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-[#2C2473]/60 rounded-2xl border border-[#C89D45]/20">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#C89D45]/15 border border-[#C89D45]/30">
                <Settings2 className="w-5 h-5 text-[#C89D45]" />
              </div>
              <div>
                <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">Step 3 — Room Customization</span>
                <h2 className="font-serif text-xl font-bold text-white">{selectedProp.name}</h2>
                <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C89D45]" /> {selectedProp.location}
                  &nbsp;·&nbsp;{propRooms.length} room{propRooms.length !== 1 ? "s" : ""} configured
                  &nbsp;·&nbsp;
                  <span className="text-[#C89D45] font-bold">
                    {propRooms.reduce((s, r) => s + (r.quantity ?? 1), 0)} total units
                  </span>
                </p>
              </div>
            </div>
            <button onClick={openCreateRoom}
              className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow border border-[#C89D45]/30 transition-colors">
              <Plus className="w-4 h-4 text-[#C89D45]" /> Add Room to Property
            </button>
          </div>

          {propRooms.length === 0 ? (
            <div className="text-center py-16 text-gray-500 border border-dashed border-white/10 rounded-3xl">
              <Bed className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-serif text-lg">No rooms yet for this property.</p>
              <p className="text-xs mt-1">Click &quot;Add Room to Property&quot; above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {propRooms.map((room) => (
                <div key={room.id} className="bg-[#2C2473] rounded-3xl overflow-hidden border border-[#C89D45]/20 hover:border-[#C89D45]/50 shadow-xl flex flex-col transition-all duration-300">
                  <div className="relative h-44 group">
                    <Image
                      src={room.images?.[0] || "/images/hero/b.jpg.jpg.jpeg"}
                      alt={room.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={room.images?.[0]?.startsWith("data:")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                      <span className="bg-[#C62828] text-white text-[10px] font-accent font-bold px-2.5 py-1 rounded-full shadow border border-[#C89D45]/40">
                        ₹{room.standardPricePerPax || room.pricePerNight} / pax
                      </span>
                      <span className="text-[8px] font-accent uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                        Fooding &amp; Lodging
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="bg-black/70 text-[#C89D45] text-[9px] font-accent font-bold px-2.5 py-1 rounded-full border border-[#C89D45]/30 uppercase tracking-wider w-fit">
                        {room.type}
                      </span>
                      {room.floor && (
                        <span className="bg-[#2C2473]/90 text-[#F3D27A] text-[8px] font-accent font-bold px-2 py-0.5 rounded-full border border-[#C89D45]/30 uppercase tracking-wider w-fit">
                          {room.floor}
                        </span>
                      )}
                    </div>

                    {/* Quantity badge */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 border border-[#C89D45]/40 text-[#C89D45] text-[10px] font-accent font-bold px-2 py-1 rounded-full">
                      <Hash className="w-2.5 h-2.5" /> {room.quantity ?? 1} unit{(room.quantity ?? 1) !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-base font-bold text-white leading-tight">{room.title}</h3>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{room.description}</p>

                      {/* Package tariffs pill box */}
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-gray-400 uppercase font-bold block">Standard:</span>
                          <span className="font-bold text-white">₹{room.standardPricePerPax || room.pricePerNight} <span className="font-normal text-gray-400 text-[9px]">/ pax</span></span>
                        </div>
                        <div className="border-l border-white/10 pl-2">
                          <span className="text-[#C89D45] uppercase font-bold block">Premium:</span>
                          <span className="font-bold text-[#F3D27A]">₹{room.premiumPricePerPax || (room.pricePerNight + 550)} <span className="font-normal text-gray-400 text-[9px]">/ pax</span></span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[10px] text-gray-400 pt-1">
                        <span className="flex items-center gap-1"><BedDouble className="w-3 h-3 text-[#C89D45]" /> {room.bedType}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3 text-[#C89D45]" /> {room.minCapacity ? `${room.minCapacity} – ${room.capacity} Pax` : `Up to ${room.capacity}`}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <button onClick={() => toggleAvailability(room.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-accent font-bold uppercase transition-colors ${room.available ? "bg-emerald-600 text-white" : "bg-gray-600 text-white"}`}>
                        {room.available ? <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Available</span> : "Maintenance"}
                      </button>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditRoom(room)} className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 transition-colors" title="Edit Room">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteConfirmRoom(room.id)} className="p-1.5 rounded-lg bg-red-600/30 text-red-300 hover:bg-red-600 transition-colors" title="Delete Room">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── Delete Property ── */}
      {deleteConfirmProp && (
        <ConfirmModal title="Delete Property?" message="All rooms under this property will also be permanently deleted."
          onCancel={() => setDeleteConfirmProp(null)}
          onConfirm={() => {
            deleteProperty(deleteConfirmProp);
            setDeleteConfirmProp(null);
            if (selectedPropId === deleteConfirmProp)
              setSelectedPropId(properties.find((p) => p.id !== deleteConfirmProp)?.id ?? null);
          }}
        />
      )}

      {/* ── Delete Room ── */}
      {deleteConfirmRoom && (
        <ConfirmModal title="Delete Room?" message="This room will be removed from the property and public listing."
          onCancel={() => setDeleteConfirmRoom(null)}
          onConfirm={() => { deleteRoom(deleteConfirmRoom); setDeleteConfirmRoom(null); }}
        />
      )}

      {/* ── Property Modal ── */}
      {propModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) setPropModal(null);
          }}
        >
          <div 
            className="relative w-full max-w-lg bg-[#2C2473] rounded-3xl border border-[#C89D45] shadow-2xl flex flex-col max-h-[90vh] my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#2C2473]">
              <h3 className="font-serif text-2xl font-bold text-white">
                {propModal === "create" ? "Add New Property" : "Edit Property"}
              </h3>
              <button 
                type="button" 
                onClick={() => setPropModal(null)} 
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <form 
              id="prop-modal-form"
              onSubmit={handlePropSubmit}
              className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar overscroll-contain"
            >
              {/* Property Name */}
              <div>
                <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Property Name *</label>
                <input required type="text" value={propForm.name}
                  onChange={(e) => setPropForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Lotus Paradise — Latpanchar"
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Location *</label>
                <input required type="text" value={propForm.location}
                  onChange={(e) => setPropForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Latpanchar, North Bengal"
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors"
                />
              </div>

              {/* Google Maps Link */}
              <div>
                <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">
                  Google Maps / Navigation Link (URL)
                </label>
                <input
                  type="text"
                  value={propForm.mapLink || ""}
                  onChange={(e) => setPropForm((p) => ({ ...p, mapLink: e.target.value }))}
                  placeholder="e.g. https://maps.google.com/?q=Latpanchar+Darjeeling"
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Guests can click &quot;View on Map&quot; to open directions in Google Maps.
                </p>
              </div>

              {/* Cover Image — Single Dropbox */}
              <div>
                <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Cover Image</label>
                <p className="text-[10px] text-gray-400 mb-2">Main primary hero image for this property card.</p>
                <ImageDropbox
                  images={propCoverImages}
                  onChange={setPropCoverImages}
                  multiple={false}
                  label="Drop cover photo here or click to browse"
                />
              </div>

              {/* Property Gallery Photos — Multiple Dropbox */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs uppercase text-[#C89D45] font-bold">
                    Property Gallery Photos ({propGalleryImages.length})
                  </label>
                  {propGalleryImages.length > 0 && (
                    <span className="text-[10px] font-accent text-emerald-400 font-bold">
                      {propGalleryImages.length} image{propGalleryImages.length !== 1 ? "s" : ""} added
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mb-2">
                  Upload multiple photos of this homestay retreat, landscape views, garden, and amenities to display in the showcase carousel.
                </p>
                <ImageDropbox
                  images={propGalleryImages}
                  onChange={setPropGalleryImages}
                  multiple={true}
                  label="Drop property gallery photos here or click to browse"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Description</label>
                <textarea rows={3} value={propForm.description}
                  onChange={(e) => setPropForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of this property…"
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors resize-none"
                />
              </div>
            </form>

            {/* Fixed Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 flex justify-end gap-3 shrink-0 bg-[#241d61]">
              <button 
                type="button" 
                onClick={() => setPropModal(null)} 
                className="px-5 py-2.5 border border-gray-400/50 rounded-xl text-xs uppercase font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="prop-modal-form"
                className="bg-[#C89D45] hover:bg-[#a07a30] text-[#1F1F1F] px-6 py-2.5 rounded-xl text-xs uppercase font-bold transition-all shadow-lg hover:shadow-[#C89D45]/30 flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5" />
                {propModal === "create" ? "Create Property" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Room Modal ── */}
      {roomModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) setRoomModal(null);
          }}
        >
          <div 
            className="relative w-full max-w-xl bg-[#2C2473] rounded-3xl border border-[#C89D45] shadow-2xl flex flex-col max-h-[90vh] my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#2C2473]">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {roomModal === "create" ? "Add New Room" : "Edit Room"}
                </h3>
                {selectedProp && (
                  <p className="text-[10px] text-[#C89D45] font-accent mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> {selectedProp.name}
                  </p>
                )}
              </div>
              <button 
                type="button" 
                onClick={() => setRoomModal(null)} 
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <form 
              id="room-modal-form"
              onSubmit={handleRoomSubmit}
              className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar overscroll-contain"
            >
              {/* Room Title */}
              <div>
                <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Room / Suite Title *</label>
                <input required type="text" value={roomForm.title}
                  onChange={(e) => rf("title", e.target.value)}
                  placeholder="e.g. Kanchenjunga Grand Deluxe Suite"
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors"
                />
              </div>

              {/* Type + Floor + Bed */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Room Type</label>
                  <select value={roomForm.type} onChange={(e) => rf("type", e.target.value)}
                    className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white focus:border-[#C89D45] focus:outline-none transition-colors">
                    {ROOM_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Floor Level</label>
                  <select value={roomForm.floor || "Ground Floor"} onChange={(e) => rf("floor", e.target.value)}
                    className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white focus:border-[#C89D45] focus:outline-none transition-colors">
                    {FLOOR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Bed Configuration</label>
                  <select value={roomForm.bedType} onChange={(e) => rf("bedType", e.target.value)}
                    className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white focus:border-[#C89D45] focus:outline-none transition-colors">
                    {BED_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              {/* Package Tariffs (Fooding & Lodging per Pax per Day) */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#C89D45]/30 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-accent uppercase text-[#C89D45] font-bold">
                    Official Fooding &amp; Lodging Tariffs (Per Pax / Day)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40">
                    All 4 Meals
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase text-gray-300 font-bold block mb-1">Standard Package (₹ / pax / day)</label>
                    <input type="number" min={500} value={roomForm.standardPricePerPax || roomForm.pricePerNight}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        rf("standardPricePerPax", val);
                        rf("pricePerNight", val);
                      }}
                      className="w-full bg-black/50 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white focus:border-[#C89D45] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase text-[#C89D45] font-bold block mb-1">Premium Package (₹ / pax / day)</label>
                    <input type="number" min={500} value={roomForm.premiumPricePerPax || 2100}
                      onChange={(e) => rf("premiumPricePerPax", Number(e.target.value))}
                      className="w-full bg-black/50 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-[#F3D27A] focus:border-[#C89D45] focus:outline-none transition-colors font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Accommodation Capacity + Quantity + Size */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Min Pax</label>
                  <input type="number" min={1} max={20} value={roomForm.minCapacity || 2}
                    onChange={(e) => rf("minCapacity", Number(e.target.value))}
                    className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white focus:border-[#C89D45] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Max Pax Capacity</label>
                  <input type="number" min={1} max={20} value={roomForm.capacity}
                    onChange={(e) => rf("capacity", Number(e.target.value))}
                    className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white focus:border-[#C89D45] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Quantity of this Room Type
                  </label>
                  <input type="number" min={1} max={100} value={roomForm.quantity ?? 1}
                    onChange={(e) => rf("quantity", Number(e.target.value))}
                    className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white focus:border-[#C89D45] focus:outline-none transition-colors"
                  />
                  <p className="text-[9px] text-gray-400 mt-1">How many physical rooms of this type exist?</p>
                </div>
                <div>
                  <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Room Size</label>
                  <input type="text" value={roomForm.size}
                    onChange={(e) => rf("size", e.target.value)}
                    placeholder="380 sq ft"
                    className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* View */}
              <div>
                <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">View Description</label>
                <input type="text" value={roomForm.view}
                  onChange={(e) => rf("view", e.target.value)}
                  placeholder="e.g. Panoramic Kanchenjunga View"
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors"
                />
              </div>

              {/* Room Images — Dropbox (multiple) */}
              <div>
                <label className="text-xs uppercase text-[#C89D45] font-bold block mb-2">
                  Room Photos
                </label>
                <ImageDropbox
                  images={roomImages}
                  onChange={setRoomImages}
                  multiple={true}
                  label="Drop room photos here or click to browse"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs uppercase text-[#C89D45] font-bold block mb-1">Description</label>
                <textarea rows={3} value={roomForm.description}
                  onChange={(e) => rf("description", e.target.value)}
                  placeholder="Describe the room, its features and ambience…"
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3 pt-1">
                <button type="button" onClick={() => rf("featured", !roomForm.featured)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${roomForm.featured ? "bg-[#C89D45]" : "bg-gray-600"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${roomForm.featured ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <span className="text-xs text-gray-300">Show as Featured on Homepage</span>
              </div>
            </form>

            {/* Fixed Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 flex justify-end gap-3 shrink-0 bg-[#241d61]">
              <button 
                type="button" 
                onClick={() => setRoomModal(null)} 
                className="px-5 py-2.5 border border-gray-400/50 rounded-xl text-xs uppercase font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="room-modal-form"
                className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-6 py-2.5 rounded-xl text-xs uppercase font-bold transition-all shadow-lg hover:shadow-red-900/40 flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5" />
                {roomModal === "create" ? "Create Room" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmModal({ title, message, onCancel, onConfirm }:
  { title: string; message: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div 
        className="bg-[#2C2473] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-red-500/50 space-y-5 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
        <h3 className="font-serif text-xl font-bold text-white">{title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-center pt-2">
          <button onClick={onCancel} className="px-5 py-2.5 border border-gray-400/50 rounded-xl text-xs uppercase font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs uppercase font-bold transition-colors shadow-lg shadow-red-900/40">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

