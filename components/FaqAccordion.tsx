"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-stone-200 bg-white transition-colors hover:border-stone-300"
        >
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-medium text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            aria-expanded={openIndex === i}
            aria-controls={`faq-answer-${i}`}
            id={`faq-question-${i}`}
          >
            <span>{item.question}</span>
            <span
              className="shrink-0 text-stone-400 transition-transform"
              aria-hidden
              style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▼
            </span>
          </button>
          <div
            id={`faq-answer-${i}`}
            role="region"
            aria-labelledby={`faq-question-${i}`}
            hidden={openIndex !== i}
            className="overflow-hidden border-t border-stone-100 transition-all"
          >
            <p className="px-6 py-4 text-sm leading-relaxed text-stone-600">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
