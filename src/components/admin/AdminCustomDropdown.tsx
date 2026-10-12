"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface DropdownOption {
  value: string;
  label: string;
  dot?: string; // e.g. "bg-emerald-500"
  badgeColor?: string; // e.g. "bg-emerald-50 text-emerald-700 border-emerald-200"
}

interface AdminCustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: "filter" | "badge" | "input";
  align?: "left" | "right";
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  placeholder?: string;
}

export function AdminCustomDropdown({
  options,
  value,
  onChange,
  variant = "filter",
  align = "left",
  disabled = false,
  className = "",
  menuClassName = "",
  placeholder = "Select...",
}: AdminCustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOpt = options.find((opt) => opt.value === value) || {
    value,
    label: value || placeholder,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 240);
    }
    setIsOpen(!isOpen);
  };

  // Button trigger styling based on variant
  let triggerClasses = "";
  if (variant === "filter") {
    triggerClasses = `flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border border-[#eaecf0] hover:border-neutral-300 bg-white text-xs font-semibold text-neutral-700 hover:text-gray-900 shadow-2xs transition-colors cursor-pointer ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    } ${className}`;
  } else if (variant === "badge") {
    const badgeStyle = selectedOpt.badgeColor || "bg-neutral-50 text-neutral-700 border-neutral-200";
    triggerClasses = `inline-flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-2xl border text-[10px] font-bold transition-all cursor-pointer shadow-2xs ${badgeStyle} hover:brightness-95 ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    } ${className}`;
  } else if (variant === "input") {
    triggerClasses = `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#eaecf0] bg-[#fafbfc] hover:border-neutral-300 text-xs text-gray-900 font-medium transition-colors cursor-pointer ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    } ${className}`;
  }

  return (
    <div className={`relative ${variant === "input" ? "w-full" : "inline-block text-left"}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={triggerClasses}
      >
        <div className="flex items-center gap-2">
          {selectedOpt.dot && (
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedOpt.dot}`} />
          )}
          <span className="whitespace-nowrap">{selectedOpt.label}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-neutral-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Floating Popover Menu Matching User's Design */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? -4 : 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? -4 : 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 min-w-[180px] bg-white rounded-2xl border border-[#eaecf0] shadow-[0_12px_32px_rgba(0,0,0,0.12)] p-1.5 ${
              openUpward ? "bottom-full mb-1.5" : "mt-1.5"
            } ${
              align === "right" ? "right-0" : "left-0"
            } ${variant === "input" ? "w-full" : ""} ${menuClassName}`}
          >
            <div className="space-y-0.5 max-h-[240px] overflow-y-auto [scrollbar-width:thin] pr-0.5">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                      isSelected
                        ? "bg-[#f5f6fa] text-gray-900 font-bold"
                        : "text-neutral-600 hover:bg-[#fafbfc] hover:text-gray-900 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.dot && (
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${opt.dot}`} />
                      )}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    {/* Vertical Pill Indicator */}
                    {isSelected && (
                      <span className="w-1.5 h-4 rounded-full bg-gray-900 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
