import Link from "next/link";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-xs text-foreground-muted hover:text-foreground transition-colors mb-4"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
        <path
          fillRule="evenodd"
          d="M11.354 1.646a.5.5 0 010 .708L5.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z"
          clipRule="evenodd"
        />
      </svg>
      {label}
    </Link>
  );
}
