export function IconConcierge({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Compass circle */}
      <circle cx="12" cy="12" r="10" />
      {/* North pointer */}
      <polygon
        points="12,2.5 13.5,10 12,8.5 10.5,10"
        fill="currentColor"
        stroke="none"
      />
      {/* South pointer */}
      <polygon
        points="12,21.5 13.5,14 12,15.5 10.5,14"
        fill="currentColor"
        stroke="none"
        opacity="0.3"
      />
      {/* East-West line */}
      <line x1="5" y1="12" x2="8.5" y2="12" opacity="0.4" />
      <line x1="15.5" y1="12" x2="19" y2="12" opacity="0.4" />
      {/* Center dot */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
