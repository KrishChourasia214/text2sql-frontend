import Header from '../components/shared/Header';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import SchemaPreview from '../components/landing/SchemaPreview';
import ExampleChips from '../components/landing/ExampleChips';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <SchemaPreview />
        <ExampleChips />
      </main>

      {/* Minimal footer */}
      <footer className="shrink-0 px-6 py-4 border-t border-border/50 text-center">
        <span className="text-[10px] text-text-muted">
          Dynamic Text-to-SQL Generator · Spring Boot 3.5.7 · DeepSeek-V3 via Hugging Face · SQLite
        </span>
      </footer>
    </div>
  );
}
