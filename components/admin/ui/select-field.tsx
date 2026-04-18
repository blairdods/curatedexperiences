"use client";

interface SelectFieldProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  size = "md",
}: SelectFieldProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`border border-warm-200 rounded-lg bg-white focus:outline-none focus:border-navy/30 disabled:opacity-50 ${
        size === "sm" ? "text-xs px-2 py-1.5" : "text-sm px-3 py-2"
      }`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
