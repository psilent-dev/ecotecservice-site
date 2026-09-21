"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, MapPin, Clock } from "lucide-react";

import { HoneypotField, PersonalDataConsent, honeypotValue } from "@/components/forms/PersonalDataConsent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput, isCompletePhone } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { siteData } from "@/content/siteData";
import { readTelegramUser, useTelegram } from "@/hooks/useTelegram";

const { contact, hero, booking } = siteData;

const fieldClassName =
  "h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-brand-blue focus-visible:ring-brand-blue/30";

function telegramDisplayName(firstName?: string, lastName?: string) {
  return [firstName, lastName].filter(Boolean).join(" ");
}

export default function TelegramMiniAppPage() {
  const { user, hapticFeedback } = useTelegram();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [car, setCar] = useState("");
  const [problem, setProblem] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fullName = telegramDisplayName(user.first_name, user.last_name);
    setName((current) => current || fullName);
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    hapticFeedback("medium");

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 2 || !isCompletePhone(trimmedPhone)) {
      setError(booking.validationError);
      hapticFeedback("error");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const telegramUser = readTelegramUser() ?? user;
    const telegramHandle = telegramUser?.username
      ? `@${telegramUser.username}`
      : "";
    const comment = [
      car.trim() ? `Авто: ${car.trim()}` : "",
      problem.trim() ? `Поломка: ${problem.trim()}` : "",
      telegramHandle ? `Telegram: ${telegramHandle}` : "",
      "Источник: Telegram Mini App",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          userName: telegramDisplayName(
            telegramUser?.first_name,
            telegramUser?.last_name,
          ) || trimmedName,
          phone: trimmedPhone,
          car: car.trim() || undefined,
          comment,
          chatId: telegramUser?.id,
          username: telegramUser?.username,
          confirm_email: honeypotValue(event.currentTarget),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; success?: boolean; orderId?: string }
        | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || booking.submitError);
      }

      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
      window.Telegram?.WebApp?.close?.();
      setIsSuccess(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : booking.submitError,
      );
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const greetingName = user?.first_name || "гость";

  return (
    <main className="relative isolate min-h-dvh overflow-x-clip px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -left-16 -z-10 h-64 w-64 rounded-full bg-[#0066FF]/20 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-10 -z-10 h-72 w-72 rounded-full bg-[#0066FF]/15 blur-[120px]"
      />

      {isSuccess ? (
        <div className="flex min-h-[calc(100dvh-2.5rem)] items-center justify-center">
          <section
            role="status"
            aria-live="polite"
            className="glass-panel w-full max-w-sm rounded-2xl p-6 text-center"
          >
            <CheckCircle2 className="mx-auto size-10 text-[#0066FF]" aria-hidden />
            <h2 className="font-heading mt-3 text-lg font-semibold text-white">
              Заявка отправлена
            </h2>
            <p className="mt-2 text-sm leading-snug text-white/70">
              {booking.success}
            </p>
          </section>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          <p className="font-heading text-2xl font-semibold leading-tight text-white">
            Привет, <span className="text-[#0066FF]">{greetingName}</span>
          </p>

          <section className="glass-panel rounded-2xl p-4">
            <p className="font-heading text-xs tracking-wide text-[#0066FF]">
              {contact.name}
            </p>
            <h1 className="font-heading mt-1 text-xl font-bold leading-tight text-white">
              {hero.titleBefore} {hero.titleCity}
            </h1>
            <p className="mt-2 text-sm leading-snug text-white/70">
              {hero.subtitle}
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-white/60">
              <li className="flex items-center gap-2">
                <MapPin className="size-3.5 shrink-0 text-[#0066FF]" aria-hidden />
                {contact.address}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-3.5 shrink-0 text-[#0066FF]" aria-hidden />
                {contact.workingHours}
              </li>
            </ul>
          </section>

          <section className="glass-panel rounded-2xl p-4">
            <form className="space-y-3" onSubmit={handleSubmit}>
              <HoneypotField />

              <div className="space-y-1.5">
                <Label htmlFor="tg-name" className="text-white/80">
                  {booking.nameLabel}
                </Label>
                <Input
                  id="tg-name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={booking.namePlaceholder}
                  autoComplete="name"
                  minLength={2}
                  required
                  className={fieldClassName}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tg-phone" className="text-white/80">
                  {booking.phoneLabel}
                </Label>
                <PhoneInput
                  id="tg-phone"
                  name="phone"
                  value={phone}
                  onChangeValue={setPhone}
                  required
                  className={fieldClassName}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tg-car" className="text-white/80">
                  Марка авто
                </Label>
                <Input
                  id="tg-car"
                  name="car"
                  value={car}
                  onChange={(event) => setCar(event.target.value)}
                  placeholder="BMW X5, Camry, Tiguan"
                  autoComplete="off"
                  className={fieldClassName}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tg-problem" className="text-white/80">
                  {booking.commentLabel}
                </Label>
                <Textarea
                  id="tg-problem"
                  name="problem"
                  value={problem}
                  onChange={(event) => setProblem(event.target.value)}
                  placeholder={booking.commentPlaceholder}
                  className="min-h-24 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-brand-blue focus-visible:ring-brand-blue/30"
                />
              </div>

              {error ? (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-auto w-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(0,102,255,0.4)] hover:bg-[#0052cc]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden />
                    {booking.submitting}
                  </>
                ) : (
                  booking.submit
                )}
              </Button>

              <PersonalDataConsent />
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
