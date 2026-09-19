"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  siteData,
  type PriceCategory,
  type PriceCategoryId,
} from "@/content/siteData";
import {
  containerVariants,
  inViewViewport,
  itemVariants,
  useMotionReady,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const { pricing } = siteData;

const BOOKING_BY_CATEGORY = Object.fromEntries(
  pricing.categories
    .filter((category) => category.id !== "all" && "bookingService" in category)
    .map((category) => [category.id, category.bookingService]),
) as Record<PriceCategory, string>;

const INITIAL_LIMIT = 5;

function formatPrice(price: number) {
  return `от ${price.toLocaleString("ru-RU")} ₽`;
}

type PriceListProps = {
  onBookingClick?: (service?: string) => void;
};

export function PriceList({ onBookingClick }: PriceListProps) {
  const motionReady = useMotionReady();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PriceCategoryId>("all");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_LIMIT);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return pricing.items.filter((item) => {
      const matchesCategory =
        category === "all" || item.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.title.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  useEffect(() => {
    setVisibleCount(INITIAL_LIMIT);
  }, [query, category]);

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hiddenCount = filteredItems.length - visibleCount;

  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 overflow-x-clip px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
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
            {pricing.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-3 text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {pricing.subtitle}
          </motion.p>
        </motion.div>

        <div className="flex flex-col gap-4">
          <motion.div
            className="relative"
            variants={itemVariants}
            initial="hidden"
            whileInView={motionReady ? "visible" : undefined}
            viewport={inViewViewport}
          >
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={pricing.searchPlaceholder}
              className="h-12 glass-panel pr-3 pl-10 text-white placeholder:text-white/40 focus-visible:border-[#0066FF] focus-visible:ring-[#0066FF]/30"
              aria-label={pricing.searchAriaLabel}
            />
          </motion.div>

          <motion.div
            role="tablist"
            aria-label={pricing.filterAriaLabel}
            className="flex flex-wrap gap-2"
            variants={containerVariants}
            initial="hidden"
            whileInView={motionReady ? "visible" : undefined}
            viewport={inViewViewport}
          >
          {pricing.categories.map((item) => {
            const isActive = category === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setCategory(item.id)}
                variants={itemVariants}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  isActive
                    ? "border border-[#0066FF] bg-[#0066FF] text-white"
                    : "glass-card text-white/70",
                )}
              >
                {item.label}
              </motion.button>
            );
          })}
          </motion.div>
        </div>

        {filteredItems.length === 0 ? (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView={motionReady ? "visible" : undefined}
            viewport={inViewViewport}
            className="glass-panel flex flex-col items-center gap-4 rounded-2xl px-6 py-12 text-center"
          >
            <p className="text-base text-white/80">
              {pricing.emptyText}
            </p>
            <Button
              type="button"
              onClick={() => onBookingClick?.()}
              className="h-11 bg-brand-blue font-semibold text-white hover:bg-[#0052cc]"
            >
              {pricing.emptyCta}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView={motionReady ? "visible" : undefined}
            viewport={inViewViewport}
            className="glass-panel overflow-hidden rounded-2xl"
          >
            <motion.div
              variants={itemVariants}
              className="hidden grid-cols-[minmax(0,1fr)_8rem_9rem_auto] gap-4 border-b border-white/10 px-5 py-3 text-xs tracking-wide text-white/45 uppercase lg:grid"
            >
              <span>{pricing.columns.work}</span>
              <span>{pricing.columns.time}</span>
              <span>{pricing.columns.price}</span>
              <span className="sr-only">{pricing.columns.book}</span>
            </motion.div>

            {displayedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={cn(
                  "border-white/5 transition-colors hover:bg-white/[0.04]",
                  index > 0 && "border-t",
                  index % 2 === 1 && "bg-white/[0.015]",
                )}
              >
                <article className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center lg:grid-cols-[minmax(0,1fr)_8rem_9rem_auto] lg:gap-4 lg:px-5">
                  <div>
                    <h3 className="font-heading text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/50 lg:hidden">
                      {item.timeEstimate}
                    </p>
                  </div>
                  <p className="hidden text-sm text-white/60 lg:block">
                    {item.timeEstimate}
                  </p>
                  <p className="font-heading text-xl font-bold text-[#0066FF]">
                    {formatPrice(item.price)}
                  </p>
                  <Button
                    type="button"
                    onClick={() =>
                      onBookingClick?.(BOOKING_BY_CATEGORY[item.category])
                    }
                    className="h-10 w-full bg-brand-blue font-semibold text-white hover:bg-[#0052cc] sm:w-auto"
                  >
                    {pricing.bookCta}
                  </Button>
                </article>
              </motion.div>
            ))}
          </motion.div>
        )}

        {hiddenCount > 0 ? (
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="mx-auto block rounded-xl border border-[#0066FF] px-6 py-3 text-white transition-all hover:bg-[#0066FF]/10"
          >
            {pricing.showMore} ({hiddenCount})
          </button>
        ) : null}
      </div>
    </section>
  );
}
