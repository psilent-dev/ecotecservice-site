"use client";

import Link from "next/link";

import { siteData } from "@/content/siteData";

export function HoneypotField() {
  return (
    <input
      type="text"
      name="confirm_email"
      className="hidden"
      tabIndex={-1}
      autoComplete="off"
    />
  );
}

export function honeypotValue(form: HTMLFormElement) {
  const value = new FormData(form).get("confirm_email");
  return typeof value === "string" ? value : "";
}

export function PersonalDataConsent() {
  const { consentText, consentLink } = siteData.booking;

  return (
    <p className="text-xs leading-relaxed text-white/50">
      {consentText}{" "}
      <Link
        href="/privacy"
        className="text-white/70 underline decoration-white/30 underline-offset-2 transition-colors hover:text-blue-500"
      >
        {consentLink}
      </Link>
    </p>
  );
}
