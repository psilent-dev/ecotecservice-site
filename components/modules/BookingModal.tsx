"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  GlassCalendar,
  formatBookingDate,
  parseISODate,
  toISODate,
} from "@/components/ui/glass-calendar";
import { GlassSelect } from "@/components/ui/glass-select";
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
import { BOOKING_SERVICES, siteData } from "@/content/siteData";

const { booking } = siteData;

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
      setError(booking.validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const bookingDate = parseISODate(form.date);

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          service: form.service || undefined,
          date: bookingDate ? formatBookingDate(bookingDate) : undefined,
          comment: form.comment.trim() || undefined,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || booking.submitError);
      }

      setIsSuccess(true);
      closeTimerRef.current = setTimeout(() => {
        handleOpenChange(false);
      }, 2500);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : booking.submitError,
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
        className="glass-panel z-[60] max-h-[min(90vh,52rem)] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto p-5 text-[#FFFFFF] ring-0 sm:p-6"
      >
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isSubmitting}
            className="absolute top-2 right-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label={booking.closeAriaLabel}
          >
            <X />
            <span className="sr-only">{booking.closeAriaLabel}</span>
          </Button>
        </DialogClose>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="size-12 text-brand-blue" aria-hidden />
            <p className="font-heading text-lg font-semibold text-white">
              {booking.success}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="pr-8">
              <DialogTitle className="font-heading text-xl font-bold text-white sm:text-2xl">
                {booking.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-white/70 sm:text-base">
                {booking.subtitle}
              </DialogDescription>
            </DialogHeader>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="booking-name" className="text-white">
                  {booking.nameLabel}
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
                  placeholder={booking.namePlaceholder}
                  className={fieldClassName}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="booking-phone" className="text-white">
                  {booking.phoneLabel}
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
                  {booking.serviceLabel}
                </Label>
                <GlassSelect
                  id="booking-service"
                  name="service"
                  disabled={isSubmitting}
                  value={form.service}
                  placeholder={booking.servicePlaceholder}
                  options={BOOKING_SERVICES}
                  onValueChange={(service) => {
                    setSelectedService?.(service);
                    setForm((current) => ({
                      ...current,
                      service,
                    }));
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label id="booking-date-label" className="text-white">
                  {booking.dateLabel}
                </Label>
                <input type="hidden" name="date" value={form.date} />
                <div aria-labelledby="booking-date-label">
                  <GlassCalendar
                    selectedDate={parseISODate(form.date)}
                    onSelectDate={(date) =>
                      setForm((current) => ({
                        ...current,
                        date: toISODate(date),
                      }))
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-sm text-white/55" aria-live="polite">
                  {parseISODate(form.date)
                    ? `${booking.dateSelectedPrefix} ${formatBookingDate(parseISODate(form.date)!)}`
                    : booking.dateHint}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="booking-comment" className="text-white">
                  {booking.commentLabel}
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
                className="mt-1 h-12 w-full bg-brand-blue text-base font-semibold text-white hover:bg-[#0052cc]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {booking.submitting}
                  </>
                ) : (
                  booking.submit
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
