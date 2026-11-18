"use client";

import React from "react";
import Link from "next/link";
import { clinicConfig } from "@/config/clinicConfig";
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Lock,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-white block leading-tight">
                  {clinicConfig.clinicName}
                </span>
                <span className="text-xs text-teal-400 font-medium">
                  Dental & Skin Specialists
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {clinicConfig.tagline}. High-precision dentistry and clinical skin aesthetics under the care of {clinicConfig.doctor.name} ({clinicConfig.doctor.qualifications}).
            </p>

            <div className="flex items-center gap-2 text-xs text-teal-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>{clinicConfig.stats.sterilizationStandard}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-teal-400 transition-colors">
                  Treatments & Fees
                </a>
              </li>
              <li>
                <a href="#doctor" className="hover:text-teal-400 transition-colors">
                  Doctor Qualifications
                </a>
              </li>
              <li>
                <a href="#timings" className="hover:text-teal-400 transition-colors">
                  Clinic Timings
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-teal-400 transition-colors">
                  Location & Map
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Admin Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Timings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Clinic Shifts
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-white block font-medium">Morning Shift</span>
                  <span>{clinicConfig.timings.shifts.morning.display}</span>
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-white block font-medium">Evening Shift</span>
                  <span>{clinicConfig.timings.shifts.evening.display}</span>
                </div>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                {clinicConfig.timings.scheduleDays}
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact & Visit
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>
                  {clinicConfig.location.addressLine1}, {clinicConfig.location.city}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <a href={`tel:${clinicConfig.contact.phoneRaw}`} className="text-slate-200 hover:text-white font-medium">
                  {clinicConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span>{clinicConfig.contact.email}</span>
              </li>
              <li className="pt-1">
                <a
                  href={clinicConfig.location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-semibold"
                >
                  <span>Google Maps Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {clinicConfig.clinicName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
