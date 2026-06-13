const steps = [
  {
    num: 1,
    title: 'Ask',
    description: 'Type your question in plain English',
  },
  {
    num: 2,
    title: 'Generate',
    description: 'LLM converts it to SQL automatically',
  },
  {
    num: 3,
    title: 'Results',
    description: 'Query runs live. Data comes back.',
  },
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-[680px] mx-auto">
        <h2 className="text-[11px] font-medium text-text-muted uppercase tracking-[0.1em] text-center mb-10">
          How it works
        </h2>

        <div className="relative flex items-start justify-between">
          {/* Connector line */}
          <div className="absolute top-5 left-[60px] right-[60px] h-px border-t border-dashed border-border" />

          {steps.map((step) => (
            <div key={step.num} className="relative flex flex-col items-center text-center w-[180px]">
              {/* Step number */}
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center mb-4 z-10">
                <span className="text-[13px] font-semibold text-accent">{step.num}</span>
              </div>

              {/* Title */}
              <h3 className="text-[14px] font-semibold text-text-primary mb-1.5">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[12px] text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
