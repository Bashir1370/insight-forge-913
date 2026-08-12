import { cn } from "@/lib/utils";

/** Minimal network-hub mark: a central node linked to surrounding nodes. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={cn("size-5", className)}
      aria-hidden="true"
    >
      <path d="M12 12 5 5.5M12 12l7-6.5M12 12l-6 7M12 12l6 7M12 12h8.5" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="5" r="1.6" />
      <circle cx="19.5" cy="5" r="1.6" />
      <circle cx="5.5" cy="19.5" r="1.6" />
      <circle cx="18.5" cy="19.5" r="1.6" />
      <circle cx="21" cy="12" r="1.4" />
    </svg>
  );
}
