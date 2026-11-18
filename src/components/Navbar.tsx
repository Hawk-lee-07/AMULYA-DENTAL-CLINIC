"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { clinicConfig } from "@/config/clinicConfig";
import {
  Phone,
  Clock,
  MapPin,
  CalendarCheck,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Lock,
} from "lucide-react";

interface NavbarProps {
  onOpenBooking: (serviceId?: string) => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Doctor Profile", href: "#doctor" },
    { name: "Timings & Shifts", href: "#timings" },
    { name: "Location", href: "#location" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top micro-bar for quick contact & hours */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-teal-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Today: {clinicConfig.timings.shifts.morning.display} | {clinicConfig.timings.shifts.evening.display}</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{clinicConfig.location.city}, {clinicConfig.location.state}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${clinicConfig.contact.phoneRaw}`}
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold">{clinicConfig.contact.phone}</span>
            </a>
            <span className="text-slate-700">|</span>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-slate-400 hover:text-teal-400 transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80"
            : "bg-white py-4 shadow-sm border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors block leading-tight">
                {clinicConfig.clinicName}
              </span>
              <span className="text-[11px] font-medium text-teal-600 uppercase tracking-wider block">
                Dental & Aesthetic Care
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${clinicConfig.contact.whatsappRaw}?text=Hello%20Dr.%20Amulya,%20I%20would%20like%20to%20inquire%20about%20an%20appointment.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
            >
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-lg shadow-sm shadow-teal-600/30 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenBooking()}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg shadow-sm"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-700 hover:text-teal-600 py-1"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${clinicConfig.contact.phoneRaw}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>Call Clinic</span>
              </a>
              <a
                href={`https://wa.me/${clinicConfig.contact.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
              >
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>Clinic Admin Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
