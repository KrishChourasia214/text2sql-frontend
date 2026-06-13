import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isConnected?: boolean;
}

export default function Header({ isConnected = false }: HeaderProps) {
  const location = useLocation();
  const isQueryPage = location.pathname === '/query';

  return (
    <header className="flex items-center justify-between px-6 h-14 border-b border-border shrink-0">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent">
            <path
              d="M4 6h16M4 12h16M4 18h10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M18 14l3 3-3 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[14px] font-semibold text-text-primary tracking-tight">
            Text-to-SQL
          </span>
        </div>
        <span className="text-[11px] text-text-muted font-mono">v0.0.1</span>
      </Link>

      <div className="flex items-center gap-4">
        {!isQueryPage && (
          <Link
            to="/query"
            className="text-[12px] text-text-secondary hover:text-accent transition-colors"
          >
            Open Query UI →
          </Link>
        )}
        <div className="flex items-center gap-2">
          <div
            className={`w-[7px] h-[7px] rounded-full ${
              isConnected ? 'bg-success' : 'bg-warning'
            }`}
          />
          <span className="text-[11px] text-text-secondary">
            {isConnected ? 'Connected' : 'Demo Mode'}
          </span>
        </div>
      </div>
    </header>
  );
}
