import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { BlogArticleCta } from "@/components/blog/BlogArticleCta";
import { RichText } from "@/components/blog/RichText";
import { SiteShell } from "@/components/layout/SiteShell";
import { BLOG_ARTICLES, getBlogArticle } from "@/lib/blog-data";
import { SITE_URL } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({ slug: article.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);

  if (!article) {
    return { title: "Статья не найдена" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${SITE_URL}/blog/${article.slug}`,
      images: [{ url: article.image, alt: article.imageAlt }],
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <SiteShell>
      <article className="relative isolate overflow-x-clip px-4 pt-28 pb-16 sm:px-6 lg:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-24 h-72 w-[min(100%,40rem)] -translate-x-1/2 rounded-full bg-[#0066FF]/15 blur-3xl"
        />

        <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-8">
          <Link
            href="/#blog"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-blue-500"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Назад к блогу
          </Link>

          <div className="glass-panel overflow-hidden rounded-3xl">
            <header>
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  unoptimized
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/30 to-transparent"
                />
              </div>

              <div className="flex flex-col gap-4 px-6 pt-8 sm:px-10">
                <p className="flex flex-wrap items-center gap-2 text-xs text-white/55">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-white/80">
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden />
                    {article.readingTime}
                  </span>
                </p>
                <h1 className="font-heading text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {article.title}
                </h1>
                <p className="text-base leading-relaxed text-white/70 sm:text-lg">
                  <RichText text={article.content.lead} />
                </p>
              </div>
            </header>

            <div className="flex flex-col gap-8 px-6 py-8 sm:px-10">
              {article.content.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">
                    {section.heading}
                  </h2>
                  <div className="mt-4 flex flex-col gap-4">
                    {section.blocks.map((block, index) => {
                      if (block.type === "h3") {
                        return (
                          <h3
                            key={`${section.heading}-h3-${index}`}
                            className="font-heading text-lg font-bold text-white"
                          >
                            {block.text}
                          </h3>
                        );
                      }

                      if (block.type === "ul") {
                        return (
                          <ul
                            key={`${section.heading}-ul-${index}`}
                            className="flex list-disc flex-col gap-2 pl-5 text-base leading-relaxed text-white/70"
                          >
                            {block.items.map((item) => (
                              <li key={item}>
                                <RichText text={item} />
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      return (
                        <p
                          key={`${section.heading}-p-${index}`}
                          className="text-base leading-relaxed text-white/70"
                        >
                          <RichText text={block.text} />
                        </p>
                      );
                    })}
                  </div>
                </section>
              ))}

              <BlogArticleCta
                text={article.content.cta.text}
                button={article.content.cta.button}
                service={article.content.cta.service}
              />

              <Link
                href="/#blog"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-blue-500/30 hover:text-blue-500 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <ArrowLeft className="size-4" aria-hidden />
                Назад к блогу
              </Link>
            </div>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
