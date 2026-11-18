"use client";

import React from "react";
import { clinicConfig } from "@/config/clinicConfig";
import {
  Clock,
  Sun,
  Moon,
  Calendar,
  AlertCircle,
  PhoneCall,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";

interface TimingsSectionProps {
  onOpenBooking: () => void;
}

export default function TimingsSection({ onOpenBooking }: TimingsSectionProps) {
  const { timings, contact } = clinicConfig;

  return (
    <section id="timings" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-3 border border-teal-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Operational Schedule</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Clinic Timings & Daily Shifts
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Structured two-shift consultation model for your utmost convenience before work or after office hours.
          </p>
        </div>

        {/* Shift Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Morning Shift Card */}
          <div className="bg-gradient-to-br from-amber-50/50 via-white to-slate-50 rounded-3xl p-6 sm:p-8 border border-amber-200/60 shadow-lg shadow-slate-100 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/30 rounded-bl-full pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
                  <Sun className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Daily Morning
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                {timings.shifts.morning.name}
              </h3>
              <p className="text-xl font-extrabold text-amber-800 mt-1">
                {timings.shifts.morning.display}
              </p>
              <p className="text-xs text-slate-600 mt-2">
                Ideal for routine consultations, detailed single-sitting root canals, and pediatric visits.
              </p>

              {/* Shift Slots */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                  Available Consultation Slots:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {timings.shifts.morning.slots.map((slot) => (
                    <div
                      key={slot}
                      className="text-center py-1.5 px-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xl"
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-amber-950 bg-amber-300 hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Morning Slot</span>
              </button>
            </div>
          </div>

          {/* Evening Shift Card */}
          <div className="bg-gradient-to-br from-teal-50/50 via-white to-slate-50 rounded-3xl p-6 sm:p-8 border border-teal-200/80 shadow-lg shadow-slate-100 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-200/30 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-sm">
                  <Moon className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  Daily Evening
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                {timings.shifts.evening.name}
              </h3>
              <p className="text-xl font-extrabold text-teal-700 mt-1">
                {timings.shifts.evening.display}
              </p>
              <p className="text-xs text-slate-600 mt-2">
                Convenient after-office hours for busy professionals, aesthetic skin treatments, and implants.
              </p>

              {/* Shift Slots */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                  Available Consultation Slots:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {timings.shifts.evening.slots.map((slot) => (
                    <div
                      key={slot}
                      className="text-center py-1.5 px-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xl"
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Evening Slot</span>
              </button>
            </div>
          </div>

        </div>

        {/* Operating Days & Emergency Note Banner */}
        <div className="max-w-4xl mx-auto mt-8 bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Regular Working Schedule</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              {timings.scheduleDays}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              {timings.sundaySchedule}
            </p>
            <p className="text-xs text-slate-400 italic">
              {timings.note}
            </p>
          </div>

          <div className="flex-shrink-0 text-center">
            <a
              href={`tel:${contact.phoneRaw}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Doctor Directly</span>
            </a>
            <span className="block text-[11px] text-slate-400 mt-1.5">
              Instant on-call support
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
