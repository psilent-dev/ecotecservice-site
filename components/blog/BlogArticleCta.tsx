"use client";

import { useState } from "react";

import { RichText } from "@/components/blog/RichText";
import { BookingModal } from "@/components/modules/BookingModal";
import { Button } from "@/components/ui/button";

type BlogArticleCtaProps = {
  text: string;
  button: string;
  service: string;
};

export function BlogArticleCta({ text, button, service }: BlogArticleCtaProps) {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(service);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <p className="text-base leading-relaxed text-white/80">
        <RichText text={text} />
      </p>
      <Button
        type="button"
        onClick={() => {
          setSelectedService(service);
          setOpen(true);
        }}
        className="mt-4 h-11 bg-brand-blue font-semibold text-white hover:bg-[#0052cc]"
      >
        {button}
      </Button>
      <BookingModal
        open={open}
        onOpenChange={setOpen}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
      />
    </div>
  );
}
