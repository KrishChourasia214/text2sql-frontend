import StatResult from './StatResult';

interface ResultsTableProps {
  data: Record<string, unknown>[];
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: value % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: 2,
    });
  }
  return String(value);
}

function isNumeric(value: unknown): boolean {
  return typeof value === 'number';
}

export default function ResultsTable({ data }: ResultsTableProps) {
  // Empty results
  if (data.length === 0) {
    return (
      <div className="rounded-[10px] bg-surface border border-border py-12 px-6 text-center">
        <div className="text-[13px] text-text-secondary">
          No results matched your question.
        </div>
      </div>
    );
  }

  // Single stat case: 1 row, 1 column
  const columns = Object.keys(data[0]);
  if (data.length === 1 && columns.length === 1) {
    const key = columns[0];
    return <StatResult value={data[0][key]} label={key.replace(/_/g, ' ')} />;
  }

  // Determine column alignment by checking first row
  const columnAlignment = columns.map((col) => isNumeric(data[0][col]));

  return (
    <div className="rounded-[10px] bg-surface border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60">
        <span className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.05em]">
          Results
        </span>
        <span className="text-[11px] font-medium text-success bg-success/10 px-2 py-0.5 rounded-[4px]">
          {data.length} row{data.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/60">
              {columns.map((col, i) => (
                <th
                  key={col}
                  className={`px-4 py-2.5 text-[11px] font-medium text-text-secondary uppercase tracking-[0.05em] whitespace-nowrap ${
                    columnAlignment[i] ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={`border-b border-border/20 last:border-0 ${
                  rowIdx % 2 === 0 ? 'row-even' : 'row-odd'
                } hover:bg-accent/[0.03] transition-colors`}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col}
                    className={`px-4 py-2.5 text-[13px] font-mono whitespace-nowrap ${
                      columnAlignment[colIdx]
                        ? 'text-right text-text-primary'
                        : 'text-left text-text-primary'
                    }`}
                    title={String(row[col] ?? '')}
                  >
                    <span className="truncate-cell inline-block">
                      {formatCell(row[col])}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
