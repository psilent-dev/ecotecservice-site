import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";

import { SITE_CONFIG } from "@/lib/constants";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
});

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "автосервис Ростов-на-Дону",
    "ремонт авто Ростов-на-Дону",
    "ЭКОТЕК СЕРВИС",
    "ТО",
    "диагностика авто",
    "ремонт подвески",
    "ремонт ДВС",
    "автоэлектрика",
    "сварочные работы",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/gallery/hero.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — автосервис в Ростове-на-Дону`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/gallery/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const [cityPart, ...streetParts] = SITE_CONFIG.address.split(", ");
const addressLocality = cityPart.replace(/^г\.\s*/, "");
const streetAddress = streetParts.join(", ") || SITE_CONFIG.address;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: SITE_CONFIG.name,
  description: SITE_DESCRIPTION,
  image: OG_IMAGE,
  url: SITE_URL,
  telephone: SITE_CONFIG.rawPhone,
  priceRange: "₽₽",
  address: {
    "@type": "PostalAddress",
    streetAddress,
    addressLocality,
    addressRegion: "Ростовская область",
    addressCountry: "RU",
  },
  areaServed: {
    "@type": "City",
    name: addressLocality,
  },
  hasMap: SITE_CONFIG.mapsUrl,
  sameAs: [SITE_CONFIG.mapsUrl],
  openingHours: "Mo-Sa 09:00-18:00",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "09:00",
    closes: "18:00",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${unbounded.variable} ${onest.variable} min-h-full overflow-x-hidden scroll-smooth antialiased`}
    >
      <body className="bg-noise min-h-full bg-[#18181b] font-sans text-brand-white">
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-grid" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <div className="relative z-[1] flex min-h-full w-full max-w-full min-w-0 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
