"use client";

import React from "react";
import { clinicConfig } from "@/config/clinicConfig";
import {
  MapPin,
  ExternalLink,
  Phone,
  MessageCircle,
  Navigation,
  Car,
  Train,
  CheckCircle2,
} from "lucide-react";

export default function LocationSection() {
  const { location, contact } = clinicConfig;

  return (
    <section id="location" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/60 text-teal-800 text-xs font-semibold mb-3 border border-teal-200">
            <MapPin className="w-3.5 h-3.5" />
            <span>Find Our Clinic</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Clinic Location & Directions
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Easily accessible with ample parking and within 2 minutes walk from the central metro station.
          </p>
        </div>

        {/* Location & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Address & Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Primary Address Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 border border-slate-200/70 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
                    Physical Address
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {clinicConfig.clinicName}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {location.addressLine1}
                    <br />
                    {location.addressLine2}
                    <br />
                    <strong className="text-slate-800">Landmark:</strong> {location.landmark}
                    <br />
                    {location.city}, {location.state} - {location.pincode}
                  </p>
                </div>
              </div>

              {/* Transit & Accessibility */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Train className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>2 Mins walking distance from Metro Station</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Car className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Dedicated ground floor patient parking available</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Wheelchair & Stretcher accessible ground floor entrance</span>
                </div>
              </div>

              {/* Direction Buttons */}
              <div className="pt-2">
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-md shadow-teal-600/20 active:scale-[0.98]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open in Google Maps App</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${contact.phoneRaw}`}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 group-hover:bg-teal-100 text-teal-600 flex items-center justify-center transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-500 uppercase block">Call Us</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {contact.phone}
                  </span>
                </div>
              </a>

              <a
                href={`https://wa.me/${contact.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-emerald-800 uppercase block">WhatsApp</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors">
                    Instant Chat
                  </span>
                </div>
              </a>
            </div>

          </div>

          {/* Interactive Google Map Column */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-xl shadow-slate-200/50 border border-slate-200/80 h-full flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">
                    Live Location Map
                  </span>
                </div>
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <span>Full Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Map Iframe */}
              <div className="w-full flex-grow min-h-[350px] sm:min-h-[420px] rounded-2xl overflow-hidden relative border border-slate-200">
                <iframe
                  title="Amulya Dental Clinic Location"
                  src={location.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "350px" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="mt-3 px-3 py-2 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-600">
                <span>Coordinates & directions ready on mobile navigation</span>
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-teal-700 hover:underline"
                >
                  Get Route &rarr;
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
