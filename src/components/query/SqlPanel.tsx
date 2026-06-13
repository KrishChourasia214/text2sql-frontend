import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SqlPanelProps {
  sql: string;
  error?: string | null;
}

const customStyle: Record<string, React.CSSProperties> = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...(oneDark['pre[class*="language-"]'] as React.CSSProperties),
    background: 'transparent',
    margin: 0,
    padding: 0,
    fontSize: '13px',
    lineHeight: '1.65',
  },
  'code[class*="language-"]': {
    ...(oneDark['code[class*="language-"]'] as React.CSSProperties),
    background: 'transparent',
    fontSize: '13px',
    lineHeight: '1.65',
  },
};

export default function SqlPanel({ sql, error }: SqlPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="rounded-[10px] bg-error/5 border border-error/20 p-5">
        <div className="text-[11px] font-medium text-error/70 uppercase tracking-[0.05em] mb-2">
          Error
        </div>
        <p className="text-[13px] text-error/90 leading-relaxed">{error}</p>
      </div>
    );
  }

  if (!sql) return null;

  return (
    <div className="rounded-[10px] bg-sql-bg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60">
        <span className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.05em]">
          Generated SQL
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text-secondary transition-colors"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="px-4 py-3.5 sql-highlight overflow-x-auto">
        <SyntaxHighlighter
          language="sql"
          style={customStyle}
          customStyle={{
            background: 'transparent',
            margin: 0,
            padding: 0,
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
            },
          }}
        >
          {sql}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
