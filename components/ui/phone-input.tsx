"use client";

import type { ChangeEvent, ComponentProps, FocusEvent } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PREFIX = "+7 (";
const COMPLETE_LENGTH = 18;

export function formatPhoneNumber(inputVal: string) {
  const digits = inputVal.replace(/\D/g, "");

  let formattedDigits = digits;
  if (digits.startsWith("8") || digits.startsWith("7")) {
    formattedDigits = digits.substring(1);
  }

  formattedDigits = formattedDigits.substring(0, 10);

  let result = PREFIX;
  if (formattedDigits.length > 0) result += formattedDigits.substring(0, 3);
  if (formattedDigits.length >= 3)
    result += `) ${formattedDigits.substring(3, 6)}`;
  if (formattedDigits.length >= 6)
    result += `-${formattedDigits.substring(6, 8)}`;
  if (formattedDigits.length >= 8)
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
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      pattern="\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}"
      title="Введите номер в формате +7 (XXX) XXX-XX-XX"
      className={cn(className)}
    />
  );
}
