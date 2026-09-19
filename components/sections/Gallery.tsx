"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { siteData, type GalleryFilterId } from "@/content/siteData";
import {
  containerVariants,
  inViewViewport,
  itemVariants,
  useMotionReady,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const { gallery } = siteData;

export function Gallery() {
  const motionReady = useMotionReady();
  const [filter, setFilter] = useState<GalleryFilterId>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const visibleItems = useMemo(
    () =>
      filter === "all"
        ? gallery.items
        : gallery.items.filter((item) => item.category === filter),
    [filter],
  );

  const activeItem = gallery.items.find((item) => item.id === activeId) ?? null;

  return (
    <section
      id="before-after"
      className="relative scroll-mt-24 overflow-x-clip px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
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
            {gallery.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-3 text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {gallery.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          role="tablist"
          aria-label={gallery.filterAriaLabel}
          className="flex flex-wrap gap-2"
          variants={containerVariants}
          initial="hidden"
          whileInView={motionReady ? "visible" : undefined}
          viewport={inViewViewport}
        >
          {gallery.filters.map((item) => {
            const isActive = filter === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(item.id)}
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

        <motion.ul
          key={filter}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView={motionReady ? "visible" : undefined}
          viewport={inViewViewport}
        >
          {visibleItems.map((item) => (
            <motion.li key={item.id} variants={itemVariants}>
              <button
                type="button"
                onClick={() => setActiveId(item.id)}
                className="glass-card group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl text-left"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[#212126] via-[#212126]/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
                <span className="absolute inset-x-0 bottom-0 translate-y-1 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="font-heading text-base font-semibold text-white">
                    {item.title}
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <Dialog
        open={Boolean(activeItem)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveId(null);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="z-[70] bg-black/80 backdrop-blur-sm"
          className="glass-panel z-[80] w-[min(100%-1.5rem,64rem)] max-w-5xl overflow-hidden p-0 ring-0"
        >
          {activeItem ? (
            <>
              <DialogTitle className="sr-only">{activeItem.title}</DialogTitle>
              <DialogDescription className="sr-only">
                {gallery.lightboxDescription}
              </DialogDescription>
              <div className="relative aspect-[16/10] w-full bg-black">
                <Image
                  src={activeItem.src}
                  alt={activeItem.title}
                  fill
                  unoptimized
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <p className="font-heading text-sm font-semibold text-white sm:text-base">
                  {activeItem.title}
                </p>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-white/70 hover:bg-white/10 hover:text-white"
                    aria-label={gallery.closeAriaLabel}
                  >
                    <X />
                  </Button>
                </DialogClose>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
