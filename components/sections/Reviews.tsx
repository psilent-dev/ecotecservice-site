"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  containerVariants,
  inViewViewport,
  itemVariants,
  useMotionReady,
} from "@/lib/motion";

const YANDEX_REVIEWS_URL =
  "https://yandex.ru/maps/?text=ECOTEC%20SERVICE";

type ReviewSource = "yandex" | "2gis";

type Review = {
  id: string;
  name: string;
  car: string;
  text: string;
  date: string;
  source: ReviewSource;
};

const REVIEWS: Review[] = [
  {
    id: "alexey-x5",
    name: "Алексей",
    car: "BMW X5 (F15)",
    text: "Приехал на регламентное ТО: масло, фильтры и чек-лист по мотору. Ничего лишнего не навязали, по срокам уложились в день, после замены ошибок по маслу не было.",
    date: "август 2026",
    source: "yandex",
  },
  {
    id: "marina-camry",
    name: "Марина",
    car: "Toyota Camry",
    text: "Стучала подвеска на мелких ямах. Заменили стойки и сайлентблоки, сразу сделали развал-схождение. Машина снова едет ровно, без лишних «замен на всякий случай».",
    date: "июль 2026",
    source: "2gis",
  },
  {
    id: "dmitry-tiguan",
    name: "Дмитрий",
    car: "Volkswagen Tiguan",
    text: "Горела ошибка ЭБУ, другие сервисы крутили только сброс. Здесь сняли логи сканером, нашли датчик и утечку по проводке. После ремонта Check Engine не возвращался.",
    date: "июнь 2026",
    source: "yandex",
  },
  {
    id: "olga-sportage",
    name: "Ольга",
    car: "Kia Sportage",
    text: "Нужно было комплексное ТО перед поездкой. Сделали по регламенту, показали износ колодок без давления «менять всё сразу». Прозрачно по работам и по срокам.",
    date: "май 2026",
    source: "2gis",
  },
  {
    id: "ivan-cclass",
    name: "Иван",
    car: "Mercedes-Benz C-Class",
    text: "Уводило руль и ела резину. Диагностика ходовой подтвердила износ рычагов, после замены и сход-развала авто перестало тянуть. Объяснили, что именно ломалось.",
    date: "апрель 2026",
    source: "yandex",
  },
  {
    id: "sergey-tucson",
    name: "Сергей",
    car: "Hyundai Tucson",
    text: "Села батарея и плавали обороты. Компьютерная диагностика показала утечку тока и ошибку по генератору, починили за визит. Без «давайте поменяем полмашины».",
    date: "март 2026",
    source: "2gis",
  },
];

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
        {date} · {isYandex ? "Яндекс Карты" : "2ГИС"}
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
            className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Что о нас говорят клиенты
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="glass-panel inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 font-heading text-sm text-white/80"
          >
            <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
            4.9 ★ на основе 250+ отзывов в Яндекс Картах и 2ГИС
          </motion.p>
        </motion.div>

        <motion.ul
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView={motionReady ? "visible" : undefined}
          viewport={inViewViewport}
        >
          {REVIEWS.map((review) => (
            <motion.li key={review.id} variants={itemVariants}>
              <article className="glass-card flex h-full flex-col rounded-2xl p-6">
                <h3 className="font-heading text-base font-semibold text-white">
                  {review.name} — {review.car}
                </h3>
                <p className="mt-2 flex gap-0.5" aria-label="Оценка 5 из 5">
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
          className="flex justify-center"
        >
          <Button
            asChild
            className="h-12 bg-brand-blue px-6 text-base font-semibold text-white hover:bg-[#0052cc]"
          >
            <a
              href={YANDEX_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Оставить отзыв на Яндекс Картах
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
