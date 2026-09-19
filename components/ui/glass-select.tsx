"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type GlassSelectOption = {
  value: string;
  label: string;
};

export type GlassSelectProps = {
  id?: string;
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly string[] | readonly GlassSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const panelClassName =
  "rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl";

function normalizeOptions(
  options: GlassSelectProps["options"],
): GlassSelectOption[] {
  return options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
}

export function GlassSelect({
  id,
  name,
  value,
  onValueChange,
  options,
  placeholder = "Выберите услугу",
  disabled = false,
  className,
}: GlassSelectProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const normalized = normalizeOptions(options);
  const selected = normalized.find((option) => option.value === value) ?? null;
  const selectedIndex = selected
    ? normalized.findIndex((option) => option.value === selected.value)
    : -1;
  const [activeIndex, setActiveIndex] = useState(
    selectedIndex >= 0 ? selectedIndex : 0,
  );

  useEffect(() => {
    if (!open) return;

    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, selectedIndex]);

  function selectOption(option: GlassSelectOption) {
    onValueChange(option.value);
    setOpen(false);
  }

  function moveActive(delta: number) {
    setActiveIndex((current) => {
      const next = (current + delta + normalized.length) % normalized.length;
      document.getElementById(`${listboxId}-option-${next}`)?.scrollIntoView({
        block: "nearest",
      });
      return next;
    });
  }

  return (
    <div ref={rootRef} className={cn("relative w-full max-w-full", className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <button
        id={triggerId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          panelClassName,
          "flex h-12 w-full items-center justify-between gap-3 px-4 text-left text-sm transition-[box-shadow,colors] duration-200 focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-2 ring-[#0066FF]",
        )}
      >
        <span className={cn("min-w-0 truncate", selected ? "text-white" : "text-white/45")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-white/60 transition-transform duration-200 ease-out",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={triggerId}
            aria-hidden={!open}
            inert={!open}
            className={cn(panelClassName, "mt-2 w-full p-2")}
          >
            {normalized.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;

              return (
                <li key={option.value} className="min-w-0">
                  <button
                    id={`${listboxId}-option-${index}`}
                    type="button"
                    role="option"
                    tabIndex={open ? 0 : -1}
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectOption(option)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        moveActive(1);
                      } else if (event.key === "ArrowUp") {
                        event.preventDefault();
                        moveActive(-1);
                      } else if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        const next = normalized[activeIndex];
                        if (next) selectOption(next);
                      }
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none",
                      isSelected
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                        : "text-white hover:bg-white/10",
                      !isSelected && isActive && "bg-white/10",
                    )}
                  >
                    <span className="min-w-0">{option.label}</span>
                    {isSelected ? <Check className="size-4 shrink-0" aria-hidden /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
