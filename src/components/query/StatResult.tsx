interface StatResultProps {
  value: unknown;
  label: string;
}

export default function StatResult({ value, label }: StatResultProps) {
  const formatted =
    typeof value === 'number'
      ? value.toLocaleString(undefined, {
          minimumFractionDigits: value % 1 !== 0 ? 2 : 0,
          maximumFractionDigits: 2,
        })
      : String(value);

  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 rounded-[10px] bg-surface border border-border">
      <span className="text-[48px] font-semibold text-text-primary tracking-tight leading-none mb-2 font-mono">
        {formatted}
      </span>
      <span className="text-[12px] font-medium text-text-secondary uppercase tracking-[0.08em]">
        {label}
      </span>
    </div>
  );
}
