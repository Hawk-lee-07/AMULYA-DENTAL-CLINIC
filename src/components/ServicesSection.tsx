"use client";

import React, { useState } from "react";
import { clinicConfig, TreatmentService } from "@/config/clinicConfig";
import {
  Clock,
  CheckCircle,
  Sparkles,
  Shield,
  Activity,
  Smile,
  Sun,
  CalendarCheck,
  ChevronRight,
  Filter,
} from "lucide-react";

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("All");

  const categories = ["All", "Dental", "Skin", "Cosmetic"];

  const filteredServices =
    activeTab === "All"
      ? clinicConfig.services
      : clinicConfig.services.filter((s) => s.category === activeTab);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "tooth":
      case "shield":
        return <Shield className="w-5 h-5 text-teal-600" />;
      case "sparkles":
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case "sun":
        return <Sun className="w-5 h-5 text-amber-500" />;
      case "smile":
        return <Smile className="w-5 h-5 text-teal-600" />;
      case "activity":
      default:
        return <Activity className="w-5 h-5 text-cyan-600" />;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-3 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Treatments & Care</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Advanced Dental & Skin Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            From emergency pain relief and microscopic root canals to medical hydra-facials and smile makeovers. Clear durations and honest, upfront fees.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === cat
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/25"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "All" ? "All Services" : cat === "Dental" ? "Dental Care" : cat === "Skin" ? "Skin Clinic" : "Cosmetic Smiles"}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between bg-white hover:shadow-xl hover:-translate-y-1 relative group ${
                service.popular
                  ? "border-teal-200 shadow-sm"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              {/* Popular Ribbon */}
              {service.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Category & Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-teal-50 flex items-center justify-center transition-colors">
                    {getServiceIcon(service.icon)}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
                      {service.category}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>

                {/* Highlights */}
                <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-100">
                  {service.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer: Duration, Fee & Action */}
              <div className="p-6 pt-0 mt-auto">
                <div className="bg-slate-50 rounded-xl p-3 mb-4 flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block leading-none">Starting from</span>
                    <span className="text-base font-bold text-teal-800">{service.fee}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectService(service.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 group-hover:bg-teal-600 hover:!bg-teal-700 transition-colors shadow-sm"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book This Treatment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Transparency Banner */}
        <div className="mt-12 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-teal-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-slate-900">
              Need a personalized diagnosis or custom treatment quote?
            </h4>
            <p className="text-sm text-slate-600">
              Visit us for an in-person assessment including digital X-rays and zero-pressure consultation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${clinicConfig.contact.phoneRaw}`}
              className="px-5 py-2.5 bg-white text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 hover:bg-slate-50 shadow-sm"
            >
              Call for Consultation
            </a>
            <button
              onClick={() => onSelectService("")}
              className="px-5 py-2.5 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 shadow-sm"
            >
              Schedule Visit
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
