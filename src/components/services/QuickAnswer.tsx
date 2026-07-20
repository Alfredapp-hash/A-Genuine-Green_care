export function QuickAnswer({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <aside className="border-l-2 border-gold bg-mist/80 px-5 py-5 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">Quick answer</p>
      <h2 className="mt-2 text-lg font-semibold text-ink sm:text-xl">{question}</h2>
      <p className="mt-3 text-base leading-relaxed text-charcoal/80">{answer}</p>
    </aside>
  );
}
