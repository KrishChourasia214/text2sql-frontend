import { useState } from 'react';

interface TableSchema {
  name: string;
  columns: string[];
}

const tables: TableSchema[] = [
  { name: 'customers', columns: ['id', 'name', 'country', 'signup_date'] },
  { name: 'products', columns: ['id', 'name', 'category', 'price'] },
  { name: 'orders', columns: ['id', 'customer_id', 'order_date', 'total'] },
  { name: 'order_items', columns: ['order_id', 'product_id', 'quantity', 'unit_price'] },
  { name: 'payments', columns: ['id', 'order_id', 'payment_date', 'amount', 'method'] },
];

function TableChip({ table }: { table: TableSchema }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-surface border border-border hover:border-accent/40 hover:bg-accent/5 transition-all cursor-default"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-text-muted">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="text-[13px] font-mono text-text-primary">{table.name}</span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
          <div className="bg-surface-alt border border-border rounded-[6px] px-3 py-2 shadow-xl shadow-black/30 whitespace-nowrap">
            <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1.5">
              Columns
            </div>
            <div className="flex flex-wrap gap-1.5">
              {table.columns.map((col) => (
                <span
                  key={col}
                  className="text-[11px] font-mono text-text-secondary px-1.5 py-0.5 bg-base rounded"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-[6px] border-transparent border-t-border" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SchemaPreview() {
  return (
    <section className="px-6 py-12 border-t border-border/50">
      <div className="max-w-[600px] mx-auto text-center">
        <h2 className="text-[11px] font-medium text-text-muted uppercase tracking-[0.1em] mb-6">
          What you can explore
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {tables.map((table) => (
            <TableChip key={table.name} table={table} />
          ))}
        </div>

        <p className="text-[11px] text-text-muted mt-5">
          Hover over a table to see its columns
        </p>
      </div>
    </section>
  );
}
