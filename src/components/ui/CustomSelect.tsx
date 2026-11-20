"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  options: CustomSelectOption[];
  onChange?: (value: string) => void;
  disabled?: boolean;
  ariaLabel?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  leadingIcon?: React.ReactNode;
}

/**
 * Accessible dark-themed dropdown select with smooth mouse-wheel scrollable menu
 * (`data-lenis-prevent`) and optional hidden form input for Server Actions.
 */
export function CustomSelect({
  name,
  value,
  defaultValue,
  options,
  onChange,
  disabled = false,
  ariaLabel,
  placeholder = "Pilih opsi...",
  className = "",
  buttonClassName = "",
  leadingIcon,
}: CustomSelectProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    () => value ?? defaultValue ?? options[0]?.value ?? ""
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const currentValue = isControlled ? value : internalValue;
  const selectedOption = options.find((opt) => opt.value === currentValue);
  const effectiveValue = selectedOption
    ? currentValue
    : (options[0]?.value ?? "");
  const displayLabel = selectedOption?.label ?? options[0]?.label ?? placeholder;

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={effectiveValue} />}

      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 bg-canvas border px-3 py-2 font-mono text-xs text-main outline-none transition-colors ${
          isOpen
            ? "border-blue-500 ring-1 ring-blue-500/30"
            : "border-hairline hover:border-white/25"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${buttonClassName}`}
      >
        <span className="flex items-center gap-2 min-w-0 truncate">
          {leadingIcon && <span className="shrink-0 text-muted">{leadingIcon}</span>}
          <span className="truncate">{displayLabel}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-400" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={listId}
          role="listbox"
          data-lenis-prevent
          className="absolute left-0 right-0 mt-1 z-[120] max-h-60 overflow-y-auto overscroll-contain bg-[#0c0c0e] border border-blue-500/40 shadow-2xl divide-y divide-white/[0.04]"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2.5 font-mono text-xs text-muted">
              Tidak ada pilihan
            </div>
          ) : (
            options.map((opt) => {
              const active = opt.value === effectiveValue;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left font-mono text-xs transition-colors cursor-pointer ${
                    active
                      ? "bg-blue-600/20 text-blue-300 font-semibold"
                      : "text-secondary hover:bg-surface-hover hover:text-main"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && <Check className="w-3.5 h-3.5 shrink-0 text-blue-400" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
