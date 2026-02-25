import type { ReactNode } from "react";
import Container from "./Container";

export default function Section({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-28 md:py-36 ${className}`.trim()}>
      <Container>
        <header className="max-w-2xl">
          <h2 className="font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-stone-900 md:text-5xl md:leading-[1.2]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-5 text-base leading-relaxed text-stone-600">
              {subtitle}
            </p>
          ) : null}
        </header>

        <div className="mt-14 md:mt-16">{children}</div>
      </Container>
    </section>
  );
}