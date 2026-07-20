export function ServiceSteps({
  steps,
}: {
  steps: { title: string; detail: string }[];
}) {
  return (
    <ol className="grid gap-8 sm:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="border-t border-forest/15 pt-5">
          <p className="font-display text-sm font-semibold text-gold">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-ink">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}
