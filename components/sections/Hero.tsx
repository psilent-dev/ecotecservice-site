"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ClipboardCheck, Eye, Package, ShieldCheck, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { containerVariants, itemVariants, useMotionReady } from "@/lib/motion";

const HERO_IMAGE =
  "gallery/hero.jpg";

const SERVICE_CHIPS = [
  { label: "ТО", service: "Техническое обслуживание (ТО)" },
  { label: "Ремонт подвески", service: "Ремонт подвески" },
  { label: "Автоэлектрика", service: "Автоэлектрика" },
  { label: "Ремонт ДВС", service: "Ремонт ДВС" },
  { label: "Сварочные работы", service: "Сварочные работы" },
] as const;

const ADVANTAGES = [
  {
    title: "Допуск в ремзону",
    description: "Присутствуйте при ремонте и диагностике вашего авто",
    icon: Eye,
  },
  {
    title: "Фиксированная смета",
    description: "Согласовываем цену до начала работ. Никаких доплат по факту",
    icon: ClipboardCheck,
  },
  {
    title: "Запчасти в наличии",
    description: "Собственный склад расходников и подбор за 15 минут",
    icon: Package,
  },
] as const;

const accentClassName =
  "bg-gradient-to-r from-[#0066FF] to-cyan-400 bg-clip-text text-transparent";

type HeroProps = {
  onBookingClick?: () => void;
  onSelectService?: (serviceName: string) => void;
};

export function Hero({ onBookingClick, onSelectService }: HeroProps) {
  const motionReady = useMotionReady();

  return (
    <section className="relative isolate overflow-x-clip pt-28 pb-12 sm:pt-36 lg:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 -z-10 h-96 w-96 rounded-full bg-[#0066FF]/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#0066FF]/15 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 -z-10 h-[520px] w-[520px] translate-y-1/2 rounded-full bg-[#0066FF] opacity-30 blur-[120px]"
      />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate={motionReady ? "visible" : "hidden"}
      >
        <motion.div
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12"
          variants={containerVariants}
        >
          <motion.div
            className="flex flex-col gap-4 lg:col-span-7 lg:gap-6"
            variants={containerVariants}
          >
            <motion.h1
              variants={itemVariants}
              className="font-heading text-2xl font-bold leading-snug text-white sm:text-4xl lg:text-5xl"
            >
              Автосервис{" "}
              <span className="max-w-full">в Ростове-на-Дону</span> —{" "}
              <span className={accentClassName}>ремонт любой сложности</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-2xl text-lg text-gray-300"
            >
              Честные цены, гарантия на работы, запчасти в наличии. Приезжайте —
              посмотрим, скажем как есть.
            </motion.p>

            <motion.ul
              className="flex w-full max-w-full flex-wrap gap-2 pt-1"
              variants={containerVariants}
            >
              {SERVICE_CHIPS.map((chip) => (
                <motion.li
                  key={chip.label}
                  variants={itemVariants}
                >
                  <button
                    type="button"
                    onClick={() => onSelectService?.(chip.service)}
                    className="glass-card flex-shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-gray-300 hover:text-white"
                  >
                    {chip.label}
                  </button>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={itemVariants}
              className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center"
            >
              <motion.div whileHover={{ scale: 1.02 }} className="w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={onBookingClick}
                  className="h-12 w-full bg-brand-blue px-6 text-base font-semibold text-white shadow-[0_0_25px_rgba(0,102,255,0.4)] transition-all hover:bg-[#0052cc] hover:shadow-[0_0_35px_rgba(0,102,255,0.6)] sm:w-auto"
                >
                  Записаться на сервис
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full border-white/20 bg-transparent px-6 text-base font-semibold text-white hover:bg-white/10 hover:text-white sm:w-auto"
                  onClick={() => {
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Рассчитать стоимость
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative lg:col-span-5"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="relative">
              <div className="glass-panel relative h-[200px] w-full overflow-hidden rounded-2xl sm:h-[350px]">
                <Image
                  src={HERO_IMAGE}
                  alt="Автомобиль в ремонтной зоне автосервиса"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#212126] via-[#212126]/40 to-transparent" />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass-panel absolute top-4 right-4 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-xl p-2.5 sm:gap-3 sm:p-3"
            >
              <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
              <p className="font-heading text-sm font-medium text-white">
                4.9 ★ Рейтинг на картах
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass-panel absolute bottom-4 left-4 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-xl p-2.5 sm:gap-3 sm:p-3"
            >
              <ShieldCheck className="size-5 text-[#0066FF]" aria-hidden />
              <p className="font-heading text-sm font-medium text-white">
                100% Гарантия
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.ul className="grid gap-4 sm:grid-cols-3" variants={containerVariants}>
          {ADVANTAGES.map(({ title, description, icon: Icon }) => (
            <motion.li
              key={title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="glass-card group rounded-2xl p-6 hover:-translate-y-1"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#0066FF]/20 bg-[#0066FF]/10 text-[#0066FF] transition-transform group-hover:scale-110">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="font-heading text-base font-semibold text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-snug text-white/70 sm:text-[0.95rem]">
                {description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
