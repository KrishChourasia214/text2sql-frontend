import { useState } from 'react';
import type { HistoryEntry } from '../../hooks/useQueryState';

interface QueryHistoryProps {
  history: HistoryEntry[];
  onSelect: (prompt: string) => void;
  onClear: () => void;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function QueryHistory({ history, onSelect, onClear }: QueryHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[12px] text-text-secondary hover:text-text-primary transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>History ({history.length})</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute top-8 right-0 z-50 w-[360px] max-h-[420px] bg-surface border border-border rounded-[10px] shadow-2xl shadow-black/40 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <span className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.05em]">
                Recent Queries
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                  setIsOpen(false);
                }}
                className="text-[11px] text-text-muted hover:text-error transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="overflow-y-auto max-h-[360px]">
              {history.map((entry, i) => (
                <button
                  key={`${entry.timestamp}-${i}`}
                  onClick={() => {
                    onSelect(entry.prompt);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-accent/5 border-b border-border/20 last:border-0 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[13px] text-text-primary line-clamp-2 leading-snug">
                      {entry.prompt}
                    </span>
                    <span className="text-[10px] text-text-muted shrink-0 mt-0.5">
                      {timeAgo(entry.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] text-text-muted font-mono">
                      {entry.rowCount} row{entry.rowCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
