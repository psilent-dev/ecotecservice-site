import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

import { SITE_CONFIG } from "@/lib/constants";

const [brandFirst, brandSecond] = SITE_CONFIG.name.split(" ");

export function Footer() {
  return (
    <footer className="glass-panel relative z-10 pb-16">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex flex-col gap-3">
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src={SITE_CONFIG.logoPath}
              alt={SITE_CONFIG.name}
              width={40}
              height={40}
              className="h-9 w-auto object-contain"
            />
            <span className="font-heading text-lg font-bold tracking-wider uppercase md:text-xl">
              <span className="text-[#0066FF]">{brandFirst}</span>{" "}
              <span className="text-white transition-colors group-hover:text-gray-200">
                {brandSecond}
              </span>
            </span>
          </Link>
          <p className="text-sm text-white/55">{SITE_CONFIG.address}</p>
          <p className="text-sm text-white/55">{SITE_CONFIG.workingHours}</p>
        </div>

        <a
          href={`tel:${SITE_CONFIG.rawPhone}`}
          className="inline-flex items-center gap-2 font-heading text-lg font-semibold text-white transition-colors hover:text-brand-blue"
        >
          <Phone className="size-5 text-brand-blue" aria-hidden />
          {SITE_CONFIG.phone}
        </a>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-white/40 sm:px-6">
          © 2026 {SITE_CONFIG.name}. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
