"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import DoctorProfile from "@/components/DoctorProfile";
import TimingsSection from "@/components/TimingsSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(
    undefined
  );

  const handleOpenBooking = (serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedServiceId(undefined);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Top Navbar */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Clean Medical Hero */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* Services & Treatments with pricing and duration */}
        <ServicesSection onSelectService={(id) => handleOpenBooking(id)} />

        {/* Doctor Profile & Credentials */}
        <DoctorProfile onOpenBooking={() => handleOpenBooking()} />

        {/* Operational Schedule & Shift Timings */}
        <TimingsSection onOpenBooking={() => handleOpenBooking()} />

        {/* Physical Location & Google Maps */}
        <LocationSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Appointment Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialServiceId={selectedServiceId}
      />
    </div>
  );
}
