"use client";

import React from "react";
import { clinicConfig } from "@/config/clinicConfig";
import {
  Award,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  CalendarCheck,
  Stethoscope,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";

interface DoctorProfileProps {
  onOpenBooking: () => void;
}

export default function DoctorProfile({ onOpenBooking }: DoctorProfileProps) {
  const { doctor } = clinicConfig;

  return (
    <section id="doctor" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/60 text-teal-800 text-xs font-semibold mb-3 border border-teal-200">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Meet Your Doctor</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Experienced Specialist & Surgeon
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Gentle hands, rigorous surgical mastery, and aesthetic artistry focused on your complete comfort.
          </p>
        </div>

        {/* Doctor Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-200/70 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Visual Portrait / Badge Column */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative">
                {/* Doctor Avatar Placeholder with medical ring */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-tr from-teal-800 via-teal-600 to-emerald-500 p-1.5 shadow-2xl">
                  <div className="w-full h-full rounded-[22px] bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-4xl sm:text-5xl font-black text-teal-300 mb-2">
                      Dr. A
                    </span>
                    <span className="text-sm font-semibold tracking-wide text-slate-200">
                      Oral Surgeon & Aesthetician
                    </span>
                    <span className="text-xs text-teal-400 mt-1">
                      {doctor.registrationNumber}
                    </span>
                  </div>
                </div>

                {/* Experience Badge */}
                <div className="absolute -bottom-4 right-2 sm:right-4 bg-teal-700 text-white px-4 py-2 rounded-2xl shadow-lg border-2 border-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold whitespace-nowrap">
                    {doctor.experience}
                  </span>
                </div>
              </div>

              {/* Verified Licensure Badge */}
              <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Verified Reg: {doctor.registrationNumber}</span>
              </div>
            </div>

            {/* Content & Credentials Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
                  Lead Practitioner & Founder
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {doctor.name}
                </h3>
                <p className="text-sm font-semibold text-teal-800 mt-1">
                  {doctor.designation}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <GraduationCap className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>{doctor.qualifications}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {doctor.bio}
              </p>

              {/* Key Specializations */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Areas of Clinical Expertise</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {doctor.specializations.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards / Accolades */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Key Recognition & Memberships</span>
                </h4>
                <ul className="space-y-1.5">
                  {doctor.awards.map((award, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Booking CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={onOpenBooking}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Consult Dr. Amulya</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <HeartHandshake className="w-4 h-4 text-teal-600" />
                  <span>Individualized 1-on-1 Consultation</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
