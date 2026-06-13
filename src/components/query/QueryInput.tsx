import { useRef, useEffect } from 'react';

interface QueryInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function QueryInput({ value, onChange, onSubmit, isLoading }: QueryInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && value.trim()) onSubmit();
    }
  };

  return (
    <div
      className={`relative rounded-[10px] border transition-colors duration-150 ${
        isLoading
          ? 'border-accent/40 bg-surface'
          : 'border-border focus-within:border-accent bg-surface'
      }`}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={'Try: "Which customers placed orders last month?" or "Top 5 products by revenue"'}
        rows={2}
        className="w-full resize-none bg-transparent text-text-primary text-[15px] leading-relaxed px-5 pt-4 pb-14 placeholder:text-text-muted font-sans focus:outline-none"
        disabled={isLoading}
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-3">
        <span className="text-[11px] text-text-muted hidden sm:inline">
          {isLoading ? '' : '⌘ + Enter'}
        </span>
        <button
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className={`flex items-center gap-2 px-4 py-[7px] rounded-[8px] text-[13px] font-medium transition-all ${
            isLoading
              ? 'bg-accent/60 text-white/70 cursor-not-allowed'
              : value.trim()
              ? 'bg-accent hover:bg-accent-hover text-white cursor-pointer shadow-sm shadow-accent/20'
              : 'bg-border text-text-muted cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Thinking...</span>
            </>
          ) : (
            <>
              <span>Ask</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
