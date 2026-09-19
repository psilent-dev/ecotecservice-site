"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Clock, Loader2, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput, isCompletePhone } from "@/components/ui/phone-input";
import { SITE_CONFIG } from "@/lib/constants";
import {
  containerVariants,
  inViewViewport,
  itemVariants,
  useMotionReady,
} from "@/lib/motion";

const CONTACT_CARDS = [
  {
    title: "Телефон",
    value: SITE_CONFIG.phone,
    href: `tel:${SITE_CONFIG.rawPhone}`,
    icon: Phone,
  },
  {
    title: "Адрес",
    value: SITE_CONFIG.address,
    href: SITE_CONFIG.mapsUrl,
    icon: MapPin,
  },
  {
    title: "Режим работы",
    value: SITE_CONFIG.workingHours,
    icon: Clock,
  },
] as const;

const fieldClassName =
  "h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-brand-blue focus-visible:ring-brand-blue/30";

type ContactsProps = {
  onBookingClick?: () => void;
};

export function Contacts({ onBookingClick }: ContactsProps) {
  const motionReady = useMotionReady();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName || !isCompletePhone(phone)) {
      setError("Укажите имя и телефон в формате +7 (XXX) XXX-XX-XX");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone,
          comment: "Заявка с блока Контакты",
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Не удалось отправить заявку");
      }

      setIsSuccess(true);
      setName("");
      setPhone("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось отправить заявку",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contacts"
      className="relative isolate scroll-mt-24 overflow-x-clip px-4 pt-16 pb-16 sm:px-6 lg:pt-24 lg:pb-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
      />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10">
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
            Контакты
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-3 text-base leading-relaxed text-white/70 sm:text-lg"
          >
            Приезжайте в ремзону или запишитесь по телефону — скажем, что с
            авто, до начала работ.
          </motion.p>
        </motion.div>

        <motion.ul
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView={motionReady ? "visible" : undefined}
          viewport={inViewViewport}
        >
          {CONTACT_CARDS.map((card) => {
            const Icon = card.icon;
            const content = (
              <>
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#0066FF]/20 bg-[#0066FF]/10 text-[#0066FF]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="font-heading text-base font-semibold text-white">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-[0.95rem]">
                  {card.value}
                </p>
              </>
            );

            return (
              <motion.li key={card.title} variants={itemVariants}>
                {"href" in card ? (
                  <a
                    href={card.href}
                    {...(card.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="glass-card flex h-full flex-col rounded-2xl p-6 hover:-translate-y-1"
                  >
                    {content}
                  </a>
                ) : (
                  <article className="glass-card flex h-full flex-col rounded-2xl p-6">
                    {content}
                  </article>
                )}
              </motion.li>
            );
          })}
        </motion.ul>

        <motion.form
          onSubmit={handleSubmit}
          variants={itemVariants}
          initial="hidden"
          whileInView={motionReady ? "visible" : undefined}
          viewport={inViewViewport}
          className="glass-panel relative z-10 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="contacts-name" className="text-white">
              Имя
            </Label>
            <Input
              id="contacts-name"
              name="name"
              autoComplete="name"
              required
              disabled={isSubmitting}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Иван"
              className={fieldClassName}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contacts-phone" className="text-white">
              Телефон
            </Label>
            <PhoneInput
              id="contacts-phone"
              name="phone"
              required
              disabled={isSubmitting}
              value={phone}
              onChangeValue={setPhone}
              className={fieldClassName}
            />
          </div>
          {error ? (
            <p className="text-sm text-red-400 sm:col-span-2">{error}</p>
          ) : null}
          {isSuccess ? (
            <p className="text-sm text-emerald-400 sm:col-span-2">
              Заявка отправлена. Мы перезвоним в течение 10 минут.
            </p>
          ) : null}
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 bg-brand-blue font-semibold text-white hover:bg-[#0052cc]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Отправка...
                </>
              ) : (
                "Перезвоните мне"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onBookingClick?.()}
              className="glass-panel h-11 font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              Записаться на диагностику
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
