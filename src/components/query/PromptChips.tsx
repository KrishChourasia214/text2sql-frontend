const chips = [
  'Show all customers',
  'Products under $100',
  'Total revenue by payment method',
  'Orders placed in 2024',
  'Customers who ordered more than twice',
  'Most expensive product per category',
];

interface PromptChipsProps {
  onSelect: (prompt: string) => void;
  disabled: boolean;
}

export default function PromptChips({ onSelect, disabled }: PromptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => !disabled && onSelect(chip)}
          disabled={disabled}
          className={`px-3 py-[5px] rounded-[6px] text-[12px] font-medium border transition-all ${
            disabled
              ? 'border-border/50 text-text-muted cursor-not-allowed'
              : 'border-border text-text-secondary hover:border-accent/50 hover:text-accent hover:bg-accent/5 cursor-pointer'
          }`}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
