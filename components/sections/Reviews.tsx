"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteData, type ReviewSource } from "@/content/siteData";
import {
  containerVariants,
  inViewViewport,
  itemVariants,
  useMotionReady,
} from "@/lib/motion";

const { contact, reviews } = siteData;

function YandexMark() {
  return (
    <span
      aria-hidden
      className="flex size-5 shrink-0 items-center justify-center rounded-md bg-[#FC3F1D] text-[10px] font-extrabold text-white"
    >
      Я
    </span>
  );
}

function TwoGisMark() {
  return (
    <span
      aria-hidden
      className="flex size-5 shrink-0 items-center justify-center rounded-md bg-[#2DBE60] text-[8px] font-extrabold tracking-tight text-white"
    >
      2Г
    </span>
  );
}

function SourceMeta({ source, date }: { source: ReviewSource; date: string }) {
  const isYandex = source === "yandex";

  return (
    <p className="mt-4 flex items-center gap-2 text-xs text-white/45">
      {isYandex ? <YandexMark /> : <TwoGisMark />}
      <span>
        {date} · {reviews.sourceLabels[source]}
      </span>
    </p>
  );
}

export function Reviews() {
  const motionReady = useMotionReady();

  return (
    <section
      id="reviews"
      className="relative scroll-mt-24 overflow-x-clip px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <motion.div
          className="flex max-w-3xl flex-col gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView={motionReady ? "visible" : undefined}
          viewport={inViewViewport}
        >
          <motion.h2
            variants={itemVariants}
            className="font-heading text-2xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            {reviews.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="glass-panel flex w-full max-w-full items-start gap-2 rounded-2xl px-4 py-2 font-heading text-sm leading-snug text-white/80 sm:w-fit sm:items-center sm:rounded-full"
          >
            <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
            {reviews.ratingSummary}
          </motion.p>
        </motion.div>

        <motion.ul
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView={motionReady ? "visible" : undefined}
          viewport={inViewViewport}
        >
          {reviews.items.map((review) => (
            <motion.li key={review.id} variants={itemVariants}>
              <article className="glass-card flex h-full flex-col rounded-2xl p-6">
                <h3 className="font-heading text-base font-semibold text-white">
                  {review.name} — {review.car}
                </h3>
                <p className="mt-2 flex gap-0.5" aria-label={reviews.ratingAriaLabel}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      className="size-4 fill-amber-400 text-amber-400"
                      aria-hidden
                    />
                  ))}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">
                  {review.text}
                </p>
                <SourceMeta source={review.source} date={review.date} />
              </article>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView={motionReady ? "visible" : undefined}
          viewport={inViewViewport}
          className="flex w-full justify-center"
        >
          <Button
            asChild
            className="h-auto min-h-12 w-full max-w-full min-w-0 shrink whitespace-normal px-4 text-base font-semibold text-white hover:bg-[#0052cc] sm:h-12 sm:w-auto sm:whitespace-nowrap sm:px-6"
          >
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {reviews.cta}
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
