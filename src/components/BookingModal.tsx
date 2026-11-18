"use client";

import React, { useState, useEffect } from "react";
import { clinicConfig } from "@/config/clinicConfig";
import { generateAppointmentPdf, AppointmentSlipData } from "@/lib/generateAppointmentPdf";
import {
  X,
  CalendarCheck,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Download,
  Share2,
  Printer,
  Calendar,
  MapPin,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  initialServiceId,
}: BookingModalProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || clinicConfig.services[0].id
  );

  // Default date: today or tomorrow in local format YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [appointmentDate, setAppointmentDate] = useState<string>(getTodayString());
  const [shift, setShift] = useState<"Morning Shift" | "Evening Shift">("Morning Shift");
  const [selectedSlot, setSelectedSlot] = useState<string>(
    clinicConfig.timings.shifts.morning.slots[0]
  );

  // Patient Info Fields
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState<"Male" | "Female" | "Other">("Female");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Booked Slots & Status tracking
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<AppointmentSlipData | null>(null);

  // Update selected service if prop changes
  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  // Fetch booked slots whenever appointmentDate changes
  useEffect(() => {
    if (!appointmentDate || !isOpen) return;

    const fetchBookedSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await fetch(`/api/appointments?date=${appointmentDate}`);
        if (res.ok) {
          const data = await res.json();
          setBookedSlots(data.bookedSlots || []);
        }
      } catch (err) {
        console.error("Failed to check booked slots:", err);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [appointmentDate, isOpen]);

  // Automatically pick the first available slot when shift or bookedSlots change
  useEffect(() => {
    const currentSlots =
      shift === "Morning Shift"
        ? clinicConfig.timings.shifts.morning.slots
        : clinicConfig.timings.shifts.evening.slots;

    const availableSlots = currentSlots.filter((slot) => !bookedSlots.includes(slot));
    if (availableSlots.length > 0) {
      if (!availableSlots.includes(selectedSlot)) {
        setSelectedSlot(availableSlots[0]);
      }
    } else {
      setSelectedSlot("");
    }
  }, [shift, bookedSlots]);

  if (!isOpen) return null;

  const currentService =
    clinicConfig.services.find((s) => s.id === selectedServiceId) ||
    clinicConfig.services[0];

  const currentSlots =
    shift === "Morning Shift"
      ? clinicConfig.timings.shifts.morning.slots
      : clinicConfig.timings.shifts.evening.slots;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!patientName.trim()) {
      setErrorMsg("Please enter patient full name.");
      return;
    }

    const cleanPhone = patientPhone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg("Please provide a valid 10-digit mobile number.");
      return;
    }

    if (!selectedSlot) {
      setErrorMsg("Please select an available time slot.");
      return;
    }

    // Double-check if slot is already booked locally
    if (bookedSlots.includes(selectedSlot)) {
      setErrorMsg(
        `The ${selectedSlot} slot on ${appointmentDate} is already booked. Please choose another time slot.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: patientName.trim(),
          patientAge: patientAge.trim() || null,
          patientGender,
          patientPhone: patientPhone.trim(),
          patientEmail: patientEmail.trim() || null,
          serviceId: currentService.id,
          serviceName: currentService.name,
          fee: currentService.fee,
          appointmentDate,
          shift,
          timeSlot: selectedSlot,
          notes: notes.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to process booking. Please try again.");
      }

      setBookingSuccess(data.appointment);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong while booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = () => {
    if (bookingSuccess) {
      generateAppointmentPdf(bookingSuccess);
    }
  };

  const handleResetAndClose = () => {
    setBookingSuccess(null);
    setErrorMsg("");
    setPatientName("");
    setPatientAge("");
    setPatientPhone("");
    setPatientEmail("");
    setNotes("");
    onClose();
  };

  // WhatsApp formatted confirmation text
  const getWhatsAppShareUrl = () => {
    if (!bookingSuccess) return "";
    const text = `*APPOINTMENT CONFIRMATION - ${clinicConfig.clinicName}*\n\n` +
      `*Booking Ref:* ${bookingSuccess.bookingId}\n` +
      `*Patient Name:* ${bookingSuccess.patientName}\n` +
      `*Age/Gender:* ${bookingSuccess.patientAge || "N/A"} / ${bookingSuccess.patientGender || "N/A"}\n` +
      `*Treatment:* ${bookingSuccess.serviceName}\n` +
      `*Date:* ${bookingSuccess.appointmentDate}\n` +
      `*Time Slot:* ${bookingSuccess.timeSlot} (${bookingSuccess.shift})\n` +
      `*Doctor:* ${clinicConfig.doctor.name}\n` +
      `*Consultation Fee:* ${bookingSuccess.fee}\n` +
      `*Clinic Address:* ${clinicConfig.location.fullAddress}\n` +
      `*Google Maps:* ${clinicConfig.location.googleMapsUrl}\n\n` +
      `Please arrive 10 mins before your slot. Thank you!`;

    return `https://wa.me/${clinicConfig.contact.whatsappRaw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 relative my-8">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-700 text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{clinicConfig.clinicName}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              {bookingSuccess ? "Booking Confirmed!" : "Book Doctor Appointment"}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">
          {bookingSuccess ? (
            /* ========================================================================= */
            /* SUCCESS CONFIRMATION SCREEN & DOWNLOADABLE SLIP                           */
            /* ========================================================================= */
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              
              {/* Success Alert Header */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                  Appointment Confirmed!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Your consultation slot has been reserved in our clinic schedule.
                </p>
              </div>

              {/* Printable Appointment Confirmation Card */}
              <div
                id="appointment-slip-card"
                className="bg-gradient-to-b from-teal-50/50 via-white to-slate-50 border-2 border-teal-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 text-xs sm:text-sm"
              >
                {/* Slip Header with Booking ID Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-teal-100">
                  <div>
                    <span className="text-[11px] text-teal-700 font-bold uppercase tracking-wider block">
                      Booking Reference ID
                    </span>
                    <span className="text-xl font-black font-mono text-teal-900">
                      {bookingSuccess.bookingId}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    CONFIRMED
                  </span>
                </div>

                {/* Patient & Doctor Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-1">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                      Patient Details
                    </span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">
                      {bookingSuccess.patientName}
                    </span>
                    <span className="text-xs text-slate-600 block mt-0.5">
                      {bookingSuccess.patientAge ? `${bookingSuccess.patientAge} Yrs` : "Age N/A"} &bull; {bookingSuccess.patientGender || "Gender N/A"}
                    </span>
                    <span className="text-xs text-teal-700 font-semibold block mt-0.5">
                      Ph: {bookingSuccess.patientPhone}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                      Consulting Specialist
                    </span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">
                      {clinicConfig.doctor.name}
                    </span>
                    <span className="text-xs text-teal-700 font-medium block mt-0.5">
                      {clinicConfig.doctor.designation}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {clinicConfig.doctor.qualifications}
                    </span>
                  </div>
                </div>

                {/* Schedule & Treatment Row */}
                <div className="bg-teal-50/80 p-3.5 rounded-xl border border-teal-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-teal-800 font-semibold">Treatment / Service:</span>
                    <span className="font-bold text-slate-900 text-right">{bookingSuccess.serviceName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-teal-800 font-semibold">Date & Shift:</span>
                    <span className="font-bold text-slate-900">{bookingSuccess.appointmentDate} &bull; {bookingSuccess.shift}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-teal-800 font-semibold">Scheduled Time Slot:</span>
                    <span className="font-black text-teal-900 text-base">{bookingSuccess.timeSlot}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-teal-200">
                    <span className="text-xs font-bold text-slate-800">Consultation Fee:</span>
                    <span className="font-black text-emerald-800 text-base">{bookingSuccess.fee}</span>
                  </div>
                </div>

                {/* Clinic Location & Instructions Note */}
                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Venue:</strong> {clinicConfig.location.fullAddress}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-teal-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                    <span>Please arrive 10 minutes before your slot. Free patient parking available.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: PDF Download, WhatsApp, Print */}
              <div className="space-y-3 pt-1">
                <button
                  onClick={handleDownloadPdf}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg shadow-teal-600/30 transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Appointment Slip (PDF)</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors shadow-sm"
                  >
                    <Share2 className="w-4 h-4 text-emerald-700" />
                    <span>Send on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>Print Slip</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={handleResetAndClose}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
                  >
                    Done & Close
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* ========================================================================= */
            /* BOOKING FORM WITH VALIDATION & DOUBLE-BOOKING PREVENTION                  */
            /* ========================================================================= */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Select Treatment / Service */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  1. Select Treatment / Service
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {clinicConfig.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.category}] {s.name} ({s.fee})
                    </option>
                  ))}
                </select>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                  <span>Est. Duration: ~{currentService.duration}</span>
                  <span className="font-bold text-teal-700">{currentService.fee}</span>
                </div>
              </div>

              {/* 2. Choose Preferred Date & Shift */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    2. Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={getTodayString()}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    3. Preferred Shift
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShift("Morning Shift")}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        shift === "Morning Shift"
                          ? "bg-teal-50 border-teal-500 text-teal-800 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Morning ({clinicConfig.timings.shifts.morning.startTime})
                    </button>
                    <button
                      type="button"
                      onClick={() => setShift("Evening Shift")}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        shift === "Evening Shift"
                          ? "bg-teal-50 border-teal-500 text-teal-800 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Evening ({clinicConfig.timings.shifts.evening.startTime})
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Time Slot Picker (With double-booking awareness) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    4. Available Consultation Slot
                  </label>
                  {isLoadingSlots && (
                    <span className="text-[11px] text-teal-600 flex items-center gap-1 font-medium">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Checking slots...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {currentSlots.map((slot) => {
                    const isTaken = bookedSlots.includes(slot);
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        type="button"
                        key={slot}
                        disabled={isTaken}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all relative ${
                          isTaken
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                            : isSelected
                            ? "bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-300"
                            : "bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50"
                        }`}
                        title={isTaken ? "Already booked by another patient" : `Available: ${slot}`}
                      >
                        <span>{slot}</span>
                        {isTaken && (
                          <span className="block text-[9px] font-normal no-underline text-rose-500">
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    Available Slot
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    Booked Slot (Protected)
                  </span>
                </div>
              </div>

              {/* 5. Patient Information Section */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  5. Patient Information
                </span>

                {/* Name */}
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Patient Full Name *"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Patient Age (e.g. 28)"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  {/* Gender Selector */}
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {(["Male", "Female", "Other"] as const).map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setPatientGender(g)}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          patientGender === g
                            ? "bg-white text-teal-800 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Phone (10 digits) *"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="Email Address (optional)"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Optional Symptoms / Notes */}
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Brief Symptoms or Dental Problem (e.g. Toothache, routine cleanup)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedSlot}
                  className="w-full py-3.5 px-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Reserving Slot & Creating Slip...</span>
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-5 h-5" />
                      <span>Confirm & Generate Slip ({currentService.fee})</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2">
                  Instant confirmation. Downloadable PDF receipt issued upon submission.
                </p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
