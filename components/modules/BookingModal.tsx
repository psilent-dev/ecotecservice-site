"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, ChevronDown, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput, isCompletePhone } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const SERVICES = [
  "Техническое обслуживание (ТО)",
  "Ремонт подвески",
  "Автоэлектрика",
  "Ремонт ДВС",
  "Сварочные работы",
  "Другое",
] as const;

const SUCCESS_MESSAGE =
  "Заявка успешно отправлена! Мы свяжемся с вами в течение 10 минут";

const fieldClassName =
  "h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-brand-blue focus-visible:ring-brand-blue/30";

type BookingModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  selectedService?: string;
  setSelectedService?: (service: string) => void;
  children?: ReactNode;
};

type FormState = {
  name: string;
  phone: string;
  service: string;
  date: string;
  comment: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  service: "",
  date: "",
  comment: "",
};

export function BookingModal({
  open,
  onOpenChange,
  selectedService = "",
  setSelectedService,
  children,
}: BookingModalProps) {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = isControlled ? open : uncontrolledOpen;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setIsOpen(next: boolean) {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  }

  function resetForm() {
    setForm(emptyForm);
    setIsSubmitting(false);
    setIsSuccess(false);
    setError(null);
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedService) {
      setForm((prev) => ({ ...prev, service: selectedService }));
    }
  }, [selectedService, isOpen]);

  function handleOpenChange(next: boolean) {
    if (isSubmitting) {
      return;
    }

    if (!next) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      resetForm();
    }

    setIsOpen(next);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (!name || !isCompletePhone(phone)) {
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
          name,
          phone,
          service: form.service || undefined,
          date: form.date || undefined,
          comment: form.comment.trim() || undefined,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Не удалось отправить заявку");
      }

      setIsSuccess(true);
      closeTimerRef.current = setTimeout(() => {
        handleOpenChange(false);
      }, 2500);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось отправить заявку. Попробуйте ещё раз.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}

      <DialogContent
        showCloseButton={false}
        overlayClassName="z-50 bg-black/70 backdrop-blur-sm"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById("booking-name")?.focus();
        }}
        className="glass-panel z-[60] max-h-[min(90vh,40rem)] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto p-5 text-[#FFFFFF] ring-0 sm:p-6"
      >
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isSubmitting}
            className="absolute top-2 right-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Закрыть"
          >
            <X />
            <span className="sr-only">Закрыть</span>
          </Button>
        </DialogClose>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="size-12 text-brand-blue" aria-hidden />
            <p className="font-heading text-lg font-semibold text-white">
              {SUCCESS_MESSAGE}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="pr-8">
              <DialogTitle className="font-heading text-xl font-bold text-white sm:text-2xl">
                Запись на сервис
              </DialogTitle>
              <DialogDescription className="text-sm text-white/70 sm:text-base">
                Оставьте данные, и мы перезвоним для подтверждения времени
              </DialogDescription>
            </DialogHeader>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="booking-name" className="text-white">
                  Имя
                </Label>
                <Input
                  id="booking-name"
                  name="name"
                  autoComplete="name"
                  required
                  disabled={isSubmitting}
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Иван"
                  className={fieldClassName}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="booking-phone" className="text-white">
                  Телефон
                </Label>
                <PhoneInput
                  id="booking-phone"
                  name="phone"
                  required
                  disabled={isSubmitting}
                  value={form.phone}
                  onChangeValue={(phone) =>
                    setForm((current) => ({
                      ...current,
                      phone,
                    }))
                  }
                  className={fieldClassName}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="booking-service" className="text-white">
                  Услуга
                </Label>
                <div className="relative">
                  <select
                    id="booking-service"
                    name="service"
                    disabled={isSubmitting}
                    value={form.service}
                    onChange={(event) => {
                      const service = event.target.value;
                      setSelectedService?.(service);
                      setForm((current) => ({
                        ...current,
                        service,
                      }));
                    }}
                    className="glass-panel w-full cursor-pointer appearance-none rounded-lg p-3 text-white outline-none focus:border-[#0066FF] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Выберите услугу
                    </option>
                    {SERVICES.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/60"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="booking-date" className="text-white">
                  Желаемая дата
                </Label>
                <Input
                  id="booking-date"
                  name="date"
                  type="date"
                  disabled={isSubmitting}
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      date: event.target.value,
                    }))
                  }
                  className={cn(fieldClassName, "scheme-dark")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="booking-comment" className="text-white">
                  Комментарий / Описание проблемы
                </Label>
                <Textarea
                  id="booking-comment"
                  name="comment"
                  disabled={isSubmitting}
                  value={form.comment}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      comment: event.target.value,
                    }))
                  }
                  placeholder="Опишите, что случилось с автомобилем"
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
                className="mt-1 h-12 w-full bg-brand-blue text-base font-semibold text-white hover:bg-[#0052cc]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Записаться"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
