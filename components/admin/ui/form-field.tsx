"use client";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}

export function FormField({ label, children, hint, error }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-foreground-muted">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg
        focus:outline-none focus:border-navy/30 disabled:opacity-50"
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className="w-full px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg
        focus:outline-none focus:border-navy/30 resize-y disabled:opacity-50"
    />
  );
}
