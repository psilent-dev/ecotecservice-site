"use client";

import { useState } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BookingModal } from "@/components/modules/BookingModal";
import { Blog } from "@/components/sections/Blog";
import { Contacts } from "@/components/sections/Contacts";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { PriceList } from "@/components/sections/PriceList";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) setSelectedService(serviceName);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Header onBookingClick={() => handleOpenBooking()} />
      <main className="flex min-w-0 w-full max-w-full flex-1 flex-col overflow-x-clip">
        <Hero
          onBookingClick={() => handleOpenBooking()}
          onSelectService={handleOpenBooking}
        />
        <Services onBookingClick={handleOpenBooking} />
        <Gallery />
        <PriceList onBookingClick={handleOpenBooking} />
        <Reviews />
        <Blog />
        <Contacts onBookingClick={() => handleOpenBooking()} />
      </main>
      <Footer />
      <BookingModal
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
      />
    </>
  );
}
