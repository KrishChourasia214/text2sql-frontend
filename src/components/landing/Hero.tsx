import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
      {/* Label chip */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-8">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[11px] font-medium text-accent">Powered by DeepSeek-V3</span>
      </div>

      {/* Headline */}
      <h1 className="text-[42px] sm:text-[56px] font-semibold text-text-primary leading-[1.1] tracking-tight mb-5">
        Ask questions.
        <br />
        Get data back.
      </h1>

      {/* Subtext */}
      <p className="text-[16px] text-text-secondary max-w-[440px] leading-relaxed mb-10">
        Type a question in plain English — the app generates the SQL and runs it against a live database instantly.
      </p>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/query')}
        className="inline-flex items-center gap-2.5 px-8 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-[8px] transition-all duration-200 hover:scale-105 shadow-lg shadow-accent/20"
      >
        <span>Start Querying</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
