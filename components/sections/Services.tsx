"use client";

import { motion } from "framer-motion";
import { Car, Cog, Cpu, Flame, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteData } from "@/content/siteData";
import {
  containerVariants,
  inViewViewport,
  itemVariants,
  useMotionReady,
} from "@/lib/motion";

const { services } = siteData;

const SERVICE_ICONS = {
  wrench: Wrench,
  car: Car,
  cpu: Cpu,
  cog: Cog,
  flame: Flame,
} as const;

type ServicesProps = {
  onBookingClick?: (service?: string) => void;
};

export function Services({ onBookingClick }: ServicesProps) {
  const motionReady = useMotionReady();

  return (
    <section
      id="services"
      className="relative isolate scroll-mt-24 overflow-x-clip px-4 py-16 sm:px-6 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-24 h-[420px] w-[420px] rounded-full bg-[#0066FF] opacity-20 blur-[120px]"
      />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10">
        <motion.div
          className="max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          whileInView={motionReady ? "visible" : undefined}
          viewport={inViewViewport}
        >
          <motion.h2
            variants={itemVariants}
            className="font-heading text-2xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            {services.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-3 text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {services.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView={motionReady ? "visible" : undefined}
          viewport={inViewViewport}
        >
          {services.items.map((service) => {
            const Icon = SERVICE_ICONS[service.icon];

            return (
              <motion.div
                key={service.title}
                variants={itemVariants}
                viewport={{ once: true, margin: "-50px" }}
                className={"className" in service ? service.className : undefined}
              >
                <article className="glass-card group flex h-full flex-col rounded-2xl p-6 hover:-translate-y-1">
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#0066FF]/20 bg-[#0066FF]/10 text-[#0066FF] transition-transform duration-300 group-hover:scale-110 group-hover:border-[#0066FF]/50 group-hover:bg-[#0066FF]/20 group-hover:text-white">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">
                    {service.description}
                  </p>
                  <Button
                    type="button"
                    onClick={() => onBookingClick?.(service.bookingService)}
                    className="mt-6 h-auto min-h-11 w-full max-w-full min-w-0 shrink whitespace-normal bg-brand-blue font-semibold text-white hover:bg-[#0052cc] sm:w-auto"
                  >
                    {services.cta}
                  </Button>
                </article>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
