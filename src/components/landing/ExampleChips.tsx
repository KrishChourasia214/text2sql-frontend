import { useNavigate } from 'react-router-dom';

const examples = [
  'Show all customers',
  'Products under $100',
  'Total revenue by payment method',
  'Orders placed in 2024',
  'Customers who ordered more than twice',
  'Most expensive product per category',
];

export default function ExampleChips() {
  const navigate = useNavigate();

  const handleClick = (prompt: string) => {
    navigate(`/query?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <section className="px-6 py-12 border-t border-border/50">
      <div className="max-w-[680px] mx-auto text-center">
        <h2 className="text-[11px] font-medium text-text-muted uppercase tracking-[0.1em] mb-6">
          Try one of these
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => handleClick(example)}
              className="px-4 py-2 rounded-[6px] text-[12px] font-medium border border-border text-text-secondary hover:border-accent/50 hover:text-accent hover:bg-accent/5 transition-all cursor-pointer"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
