"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ClipboardCheck, Eye, Package, ShieldCheck, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteData } from "@/content/siteData";
import { containerVariants, itemVariants, useMotionReady } from "@/lib/motion";

const { hero } = siteData;

const ADVANTAGE_ICONS = {
  eye: Eye,
  clipboard: ClipboardCheck,
  package: Package,
} as const;

const accentClassName =
  "bg-gradient-to-r from-[#0066FF] to-cyan-400 bg-clip-text text-transparent";

type HeroProps = {
  onBookingClick?: () => void;
  onSelectService?: (serviceName: string) => void;
};

export function Hero({ onBookingClick, onSelectService }: HeroProps) {
  const motionReady = useMotionReady();

  return (
    <section className="relative isolate overflow-x-clip pt-24 pb-8 sm:pt-36 sm:pb-12 lg:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 -z-10 h-96 w-96 rounded-full bg-[#0066FF]/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#0066FF]/15 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 -z-10 h-[520px] w-[520px] translate-y-1/2 rounded-full bg-[#0066FF] opacity-30 blur-[120px]"
      />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col space-y-4 px-4 sm:space-y-6 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate={motionReady ? "visible" : "hidden"}
      >
        <motion.div
          className="grid grid-cols-1 items-center gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-12"
          variants={containerVariants}
        >
          <motion.div
            className="flex flex-col space-y-4 sm:space-y-6 lg:col-span-7"
            variants={containerVariants}
          >
            <motion.h1
              variants={itemVariants}
              className="font-heading text-[min(1.5rem,calc((100vw-2rem)/20))] font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
            >
              <span className="whitespace-nowrap sm:whitespace-normal">
                {hero.titleBefore} {hero.titleCity}
              </span>
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> </span>
              <span
                className={`${accentClassName} whitespace-nowrap sm:whitespace-normal`}
              >
                {hero.titleAccent}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-2 max-w-2xl text-sm text-gray-300 opacity-80 sm:mt-4 sm:text-base"
            >
              {hero.subtitle}
            </motion.p>

            <div className="marquee-fade -mx-4 overflow-hidden sm:mx-0 sm:overflow-visible">
              <ul className="animate-marquee items-center gap-2 py-1">
                {hero.chips.map((chip) => (
                  <li key={chip.label} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectService?.(chip.service)}
                      className="glass-card cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-gray-300 hover:text-white sm:text-sm"
                    >
                      {chip.label}
                    </button>
                  </li>
                ))}
                {hero.chips.map((chip) => (
                  <li
                    key={`marquee-${chip.label}`}
                    className="marquee-only shrink-0"
                    aria-hidden
                  >
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => onSelectService?.(chip.service)}
                      className="glass-card cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-gray-300 hover:text-white"
                    >
                      {chip.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-2.5 sm:flex-row sm:items-center"
            >
              <motion.div whileHover={{ scale: 1.02 }} className="w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={onBookingClick}
                  className="h-auto w-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(0,102,255,0.4)] transition-all hover:bg-[#0052cc] hover:shadow-[0_0_35px_rgba(0,102,255,0.6)] sm:w-auto sm:py-4 sm:text-base"
                >
                  {hero.primaryCta}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto w-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 hover:text-white sm:w-auto sm:py-4 sm:text-base"
                  onClick={() => {
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {hero.secondaryCta}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative lg:col-span-5"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="relative">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={hero.image}
                  alt={hero.imageAlt}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#212126] via-[#212126]/40 to-transparent" />

                <div className="absolute top-3 right-3 flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-xl border border-white/15 bg-slate-900/70 px-3 py-1.5 text-xs backdrop-blur-md sm:gap-2 sm:text-sm">
                  <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400 sm:size-4" aria-hidden />
                  <p className="font-heading font-medium text-white">
                    {hero.ratingBadge}
                  </p>
                </div>

                <div className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-xl border border-white/15 bg-slate-900/70 px-3 py-1.5 text-xs backdrop-blur-md sm:gap-2 sm:text-sm">
                  <ShieldCheck className="size-3.5 shrink-0 text-[#0066FF] sm:size-5" aria-hidden />
                  <p className="font-heading font-medium text-white">
                    {hero.guaranteeBadge}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.ul className="grid gap-4 sm:grid-cols-3" variants={containerVariants}>
          {hero.advantages.map(({ title, description, icon }) => {
            const Icon = ADVANTAGE_ICONS[icon];

            return (
              <motion.li
                key={title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="glass-card group rounded-2xl p-6 hover:-translate-y-1"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#0066FF]/20 bg-[#0066FF]/10 text-[#0066FF] transition-transform group-hover:scale-110">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="font-heading text-base font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-white/70 sm:text-[0.95rem]">
                  {description}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      </motion.div>
    </section>
  );
}
