"use client";

import React from "react";
import { clinicConfig } from "@/config/clinicConfig";
import {
  CalendarCheck,
  Phone,
  ShieldCheck,
  Star,
  Users,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50 pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background soft ambient blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-teal-100/40 to-emerald-100/30 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Tagline, CTAs, Trust indicators */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Medical Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 border border-teal-200 text-teal-800 text-xs sm:text-sm font-medium shadow-sm">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>{clinicConfig.stats.sterilizationStandard}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Welcome to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                  {clinicConfig.clinicName}
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-medium text-slate-700">
                {clinicConfig.tagline}
              </p>
            </div>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {clinicConfig.shortDescription} Led by{" "}
              <strong className="text-slate-900 font-semibold">{clinicConfig.doctor.name}</strong> (
              {clinicConfig.doctor.qualifications}), offering specialized painless dental surgery, smile aesthetics, and clinical skin rejuvenation.
            </p>

            {/* Bullet trust list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Zero-Pain Single-Sitting RCT</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Computer-Guided Dental Implants</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Medical Hydra-Facial & Peels</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Transparent & Affordable Pricing</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl shadow-lg shadow-teal-700/25 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <a
                href={`tel:${clinicConfig.contact.phoneRaw}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <Phone className="w-5 h-5 text-teal-600" />
                <span>Call {clinicConfig.contact.phone}</span>
              </a>
            </div>

            {/* Quick Shift Timing Preview */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>
                Today&apos;s Shifts:{" "}
                <span className="font-semibold text-slate-700">Morning {clinicConfig.timings.shifts.morning.startTime}</span> &bull;{" "}
                <span className="font-semibold text-slate-700">Evening {clinicConfig.timings.shifts.evening.startTime}</span>
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase Card & Stats */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Doctor Card Showcase */}
              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/50 rounded-full blur-2xl -z-0" />
                
                {/* Doctor Header */}
                <div className="flex items-center gap-4 relative z-10 pb-5 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md font-bold text-xl flex-shrink-0">
                    DA
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">
                      {clinicConfig.doctor.name}
                    </h3>
                    <p className="text-xs font-medium text-teal-700">
                      {clinicConfig.doctor.designation}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {clinicConfig.doctor.qualifications}
                    </p>
                  </div>
                </div>

                {/* Live Clinic Stats Grid */}
                <div className="grid grid-cols-2 gap-3 py-5 relative z-10">
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-teal-600 font-bold text-lg">
                      <Award className="w-4 h-4 text-teal-500" />
                      <span>{clinicConfig.stats.yearsExperience}</span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium block">
                      Clinical Excellence
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-lg">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span>{clinicConfig.stats.happySmiles}</span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium block">
                      Treated Patients
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>4.9 / 5</span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium block">
                      Google Reviews
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-teal-700 font-bold text-sm leading-tight">
                      <Sparkles className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <span>Skin & Dental</span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium block">
                      Dual Care Center
                    </span>
                  </div>
                </div>

                {/* Instant Book Banner inside Card */}
                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-teal-100 font-semibold block">
                      Instant Confirmation
                    </span>
                    <span className="text-sm font-bold block">
                      Slots Open for Today
                    </span>
                  </div>
                  <button
                    onClick={onOpenBooking}
                    className="px-3.5 py-1.5 bg-white text-teal-800 text-xs font-bold rounded-lg hover:bg-teal-50 transition-colors shadow-sm flex-shrink-0"
                  >
                    Select Slot
                  </button>
                </div>
              </div>

              {/* Decorative mini badge */}
              <div className="absolute -bottom-4 -left-4 sm:left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-200/80 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-800">
                  Accepting New Patients
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
