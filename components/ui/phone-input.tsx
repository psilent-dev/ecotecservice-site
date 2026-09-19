"use client";

import type {
  ChangeEvent,
  ComponentProps,
  FocusEvent,
  KeyboardEvent,
} from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PREFIX = "+7 (";
const COMPLETE_LENGTH = 18;

function nationalDigits(inputVal: string) {
  const digits = inputVal.replace(/\D/g, "");
  const withoutCountry =
    digits.startsWith("8") || digits.startsWith("7")
      ? digits.substring(1)
      : digits;

  return withoutCountry.substring(0, 10);
}

export function formatPhoneNumber(inputVal: string) {
  const formattedDigits = nationalDigits(inputVal);

  let result = PREFIX;
  if (formattedDigits.length > 0) result += formattedDigits.substring(0, 3);
  if (formattedDigits.length > 3)
    result += `) ${formattedDigits.substring(3, 6)}`;
  if (formattedDigits.length > 6)
    result += `-${formattedDigits.substring(6, 8)}`;
  if (formattedDigits.length > 8)
    result += `-${formattedDigits.substring(8, 10)}`;

  return result;
}

export function isCompletePhone(value: string) {
  return formatPhoneNumber(value).length === COMPLETE_LENGTH;
}

type PhoneInputProps = Omit<
  ComponentProps<"input">,
  "value" | "onChange" | "type"
> & {
  value: string;
  onChangeValue: (value: string) => void;
};

export function PhoneInput({
  value,
  onChangeValue,
  className,
  onFocus,
  onBlur,
  placeholder = "+7 (___) ___-__-__",
  ...props
}: PhoneInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChangeValue(formatPhoneNumber(event.target.value));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Backspace") return;

    const start = event.currentTarget.selectionStart ?? 0;
    const end = event.currentTarget.selectionEnd ?? 0;
    if (start !== end) return;
    if (start > PREFIX.length) return;

    event.preventDefault();
    onChangeValue(PREFIX);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    if (!value) {
      onChangeValue(PREFIX);
    }
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    if (value === PREFIX || value === "+7") {
      onChangeValue("");
    }
    onBlur?.(event);
  }

  return (
    <Input
      {...props}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      pattern="\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}"
      title="Введите номер в формате +7 (XXX) XXX-XX-XX"
      className={cn(className)}
    />
  );
}
