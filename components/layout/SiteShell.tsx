"use client";

import { useState, type ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BookingModal } from "@/components/modules/BookingModal";

export function SiteShell({ children }: { children: ReactNode }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <Header onBookingClick={() => setIsBookingOpen(true)} />
      <main className="flex min-w-0 w-full max-w-full flex-1 flex-col overflow-x-clip">
        {children}
      </main>
      <Footer />
      <BookingModal open={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </>
  );
}
