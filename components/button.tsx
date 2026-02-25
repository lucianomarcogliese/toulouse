import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "hero";

export default function Button({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-[var(--background)]";
  const styles =
    variant === "primary"
      ? "bg-stone-900 text-white shadow-sm hover:shadow-md hover:opacity-95"
      : variant === "hero"
        ? "bg-white text-stone-900 shadow-sm hover:shadow-md border-0"
        : "border border-stone-200 bg-transparent text-stone-800 hover:border-stone-400 hover:shadow-sm";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}