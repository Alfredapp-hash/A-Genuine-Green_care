export function FaqList({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="divide-y divide-forest/10 border-y border-forest/10">
      {items.map((item) => (
        <details key={item.question} className="group py-5">
          <summary className="cursor-pointer list-none text-base font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-start justify-between gap-4">
              {item.question}
              <span aria-hidden className="mt-0.5 text-leaf transition group-open:rotate-45">
                +
              </span>
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/75">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
