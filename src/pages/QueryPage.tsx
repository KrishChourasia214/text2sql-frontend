import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/shared/Header';
import QueryInput from '../components/query/QueryInput';
import PromptChips from '../components/query/PromptChips';
import SqlPanel from '../components/query/SqlPanel';
import ResultsTable from '../components/query/ResultsTable';
import SkeletonLoader from '../components/query/SkeletonLoader';
import QueryHistory from '../components/query/QueryHistory';
import { useQueryState } from '../hooks/useQueryState';

export default function QueryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPromptHandled = useRef(false);

  const {
    prompt,
    isLoading,
    results,
    generatedSql,
    error,
    queryHistory,
    setPrompt,
    submitQuery,
    clearHistory,
  } = useQueryState();

  // Handle initial prompt from URL (deep linking from landing page chips)
  useEffect(() => {
    if (initialPromptHandled.current) return;

    const urlPrompt = searchParams.get('prompt');
    if (urlPrompt) {
      initialPromptHandled.current = true;
      setPrompt(urlPrompt);
      submitQuery(urlPrompt);
      // Clear the URL param after handling
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, setPrompt, submitQuery]);

  const handleChipSelect = (chipPrompt: string) => {
    setPrompt(chipPrompt);
    submitQuery(chipPrompt);
  };

  const handleHistorySelect = (historyPrompt: string) => {
    setPrompt(historyPrompt);
    submitQuery(historyPrompt);
  };

  // Check if we have any results to show (null = initial state)
  const hasResults = results !== null || error !== null || isLoading;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[820px] mx-auto px-6 py-8">
          {/* Query area — always at top */}
          <div className="space-y-4 mb-8">
            <QueryInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={() => submitQuery()}
              isLoading={isLoading}
            />
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <PromptChips onSelect={handleChipSelect} disabled={isLoading} />
              <QueryHistory
                history={queryHistory}
                onSelect={handleHistorySelect}
                onClear={clearHistory}
              />
            </div>
          </div>

          {/* Results area — only shows after first query */}
          {hasResults && (
            <div className="space-y-5">
              {/* Loading state */}
              {isLoading && <SkeletonLoader />}

              {/* Error state */}
              {!isLoading && error && <SqlPanel sql="" error={error} />}

              {/* Success state */}
              {!isLoading && !error && results !== null && (
                <>
                  <SqlPanel sql={generatedSql} />
                  <ResultsTable data={results} />
                </>
              )}
            </div>
          )}

          {/* Empty initial state — subtle hint */}
          {!hasResults && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-border mx-auto">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-7v4h4l-5 7z"
                    fill="currentColor"
                    opacity="0.3"
                  />
                </svg>
              </div>
              <p className="text-[13px] text-text-muted mb-1">
                Ask a question about your data
              </p>
              <p className="text-[12px] text-text-muted/60">
                Your question will be translated to SQL and executed against the database
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="shrink-0 px-6 py-3 border-t border-border/50 flex items-center justify-between">
        <span className="text-[10px] text-text-muted">
          Dynamic Text-to-SQL Generator · Spring Boot + DeepSeek-V3 via Hugging Face
        </span>
        <span className="text-[10px] text-text-muted font-mono">
          SQLite · JdbcTemplate · WebClient
        </span>
      </footer>
    </div>
  );
}
