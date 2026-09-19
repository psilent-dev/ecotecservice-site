import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

import { siteData } from "@/content/siteData";

const { contact, footer } = siteData;
const [brandFirst, brandSecond] = contact.name.split(" ");

export function Footer() {
  return (
    <footer className="glass-panel relative z-10 pb-16">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex flex-col gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-3">
            <Image
              src={contact.logoPath}
              alt={contact.name}
              width={40}
              height={40}
              className="h-9 w-auto shrink-0 object-contain"
            />
            <span className="font-heading min-w-0 text-base font-bold tracking-wider uppercase sm:text-lg md:text-xl">
              <span className="text-[#0066FF]">{brandFirst}</span>{" "}
              <span className="text-white transition-colors group-hover:text-gray-200">
                {brandSecond}
              </span>
            </span>
          </Link>
          <p className="text-sm text-white/55">{contact.address}</p>
          <p className="text-sm text-white/55">{contact.workingHours}</p>
        </div>

        <a
          href={`tel:${contact.rawPhone}`}
          className="inline-flex items-center gap-2 font-heading text-lg font-semibold text-white transition-colors hover:text-brand-blue"
        >
          <Phone className="size-5 text-brand-blue" aria-hidden />
          {contact.phone}
        </a>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-white/40 sm:px-6">
          © {footer.year} {contact.name}. {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
