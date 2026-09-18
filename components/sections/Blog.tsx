"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

import { BLOG_ARTICLES } from "@/lib/blog-data";
import {
  containerVariants,
  inViewViewport,
  itemVariants,
  useMotionReady,
} from "@/lib/motion";

export function Blog() {
  const motionReady = useMotionReady();

  return (
    <section
      id="blog"
      className="relative scroll-mt-24 overflow-x-clip px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={motionReady ? "visible" : undefined}
          viewport={inViewViewport}
        >
          <motion.h2
            variants={itemVariants}
            className="max-w-2xl font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Полезные статьи и советы экспертов
          </motion.h2>
        </motion.div>

        <motion.ul
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView={motionReady ? "visible" : undefined}
          viewport={inViewViewport}
        >
          {BLOG_ARTICLES.map((article) => (
            <motion.li key={article.slug} variants={itemVariants}>
              <Link
                href={`/blog/${article.slug}`}
                className="group block h-full"
              >
                <article className="glass-card flex h-full flex-col overflow-hidden rounded-2xl hover:-translate-y-1">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.imageAlt}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <p className="flex flex-wrap items-center gap-2 text-xs text-white/55">
                      <span className="glass-panel rounded-full px-3 py-1 font-medium text-white/80">
                        {article.category}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" aria-hidden />
                        {article.readingTime}
                      </span>
                    </p>
                    <h3 className="font-heading text-lg font-bold text-white">
                      {article.title}
                    </h3>
                    <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-white/65">
                      {article.excerpt}
                    </p>
                    <span className="mt-1 text-sm font-semibold text-[#0066FF] transition-colors group-hover:text-[#3385ff]">
                      Читать статью →
                    </span>
                  </div>
                </article>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
