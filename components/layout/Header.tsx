"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SITE_CONFIG } from "@/lib/constants";
import { containerVariants, itemVariants, useMotionReady } from "@/lib/motion";
import { cn } from "@/lib/utils";

const [brandFirst, brandSecond] = SITE_CONFIG.name.split(" ");

const NAV_ITEMS = [
  { href: "#services", label: "Услуги" },
  { href: "#pricing", label: "Прайс-лист" },
  { href: "#before-after", label: "До / После" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#blog", label: "Блог" },
  { href: "#contacts", label: "Контакты" },
] as const;

const navLinkClassName =
  "text-sm text-white/80 transition-colors hover:text-white";

function LiveStatus({ className }: { className?: string }) {
  return (
    <p
      className={cn("inline-flex items-center gap-2", className)}
      aria-live="polite"
    >
      <span
        className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-500"
        aria-hidden
      />
      <span className="text-xs text-gray-300">
        Сегодня свободно 2 подъемника
      </span>
    </p>
  );
}

function Logo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link href="/" className={cn("group flex min-w-0 items-center gap-2 sm:gap-3", className)}>
      <Image
        src={SITE_CONFIG.logoPath}
        alt={SITE_CONFIG.name}
        width={40}
        height={40}
        className="h-8 w-auto shrink-0 object-contain md:h-9"
        priority={priority}
      />
      <span className="font-heading min-w-0 text-sm font-bold tracking-wider uppercase sm:text-base md:text-xl">
        <span className="text-[#0066FF]">{brandFirst}</span>{" "}
        <span className="text-white transition-colors group-hover:text-gray-200">
          {brandSecond}
        </span>
      </span>
    </Link>
  );
}

type HeaderProps = {
  onBookingClick?: () => void;
};

export function Header({ onBookingClick }: HeaderProps) {
  const motionReady = useMotionReady();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileOpenRef = useRef(false);
  const { scrollY } = useScroll();

  mobileOpenRef.current = mobileOpen;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const atTop = latest <= 0;

    setIsScrolled(latest > 50);

    if (atTop || mobileOpenRef.current) {
      setHidden(false);
      return;
    }

    if (latest > 100 && latest > previous) {
      setHidden(true);
      return;
    }

    if (latest < previous) {
      setHidden(false);
    }
  });

  function openBooking() {
    setMobileOpen(false);
    onBookingClick?.();
  }

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "glass-panel fixed top-0 z-50 h-16 w-full max-w-full",
        isScrolled && "shadow-2xl",
      )}
    >
      <div className="mx-auto grid h-16 w-full max-w-7xl min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 sm:gap-4 lg:grid-cols-[1fr_auto_1fr] lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Logo priority />
          <LiveStatus className="hidden xl:inline-flex" />
        </div>

        <motion.nav
          aria-label="Основная навигация"
          className="hidden items-center gap-6 lg:flex"
          variants={containerVariants}
          initial="hidden"
          animate={motionReady ? "visible" : "hidden"}
        >
          {NAV_ITEMS.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              className={navLinkClassName}
              variants={itemVariants}
            >
              {item.label}
            </motion.a>
          ))}
        </motion.nav>

        <div className="flex items-center justify-end gap-3">
          <LiveStatus className="hidden md:inline-flex xl:hidden" />
          <a
            href={`tel:${SITE_CONFIG.rawPhone}`}
            className="hidden items-center gap-2 font-heading text-sm text-white/90 transition-colors hover:text-white md:inline-flex"
          >
            <Phone className="size-4 text-brand-blue" aria-hidden />
            {SITE_CONFIG.phone}
          </a>

          <Button
            type="button"
            onClick={openBooking}
            className="hidden h-10 bg-brand-blue px-4 font-semibold text-white hover:bg-[#0052cc] lg:inline-flex"
          >
            Заказать звонок
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-white lg:hidden"
                aria-label="Открыть меню"
              >
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              overlayClassName="z-[60] bg-black/70 backdrop-blur-sm"
              className="glass-panel z-[60] w-[min(100%,20rem)] p-0 text-white"
            >
              <SheetHeader className="border-b border-white/10">
                <SheetTitle className="p-0">
                  <Logo />
                </SheetTitle>
                <SheetDescription className="text-white/60">
                  Автосервис / Мультибренд
                </SheetDescription>
              </SheetHeader>

              <nav
                aria-label="Мобильная навигация"
                className="flex flex-1 flex-col gap-1 px-4 py-2"
              >
                {NAV_ITEMS.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <a
                      href={item.href}
                      className="rounded-lg px-2 py-3 text-base text-white/90 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 border-t border-white/10 p-4">
                <LiveStatus />
                <a
                  href={`tel:${SITE_CONFIG.rawPhone}`}
                  className="inline-flex items-center gap-2 font-heading text-sm text-white/90"
                >
                  <Phone className="size-4 text-brand-blue" aria-hidden />
                  {SITE_CONFIG.phone}
                </a>
                <Button
                  type="button"
                  onClick={openBooking}
                  className="h-11 w-full bg-brand-blue font-semibold text-white hover:bg-[#0052cc]"
                >
                  Заказать звонок
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
