import { useState, useCallback, useRef } from 'react';
import { runQueryDemo } from '../api/query';

export interface HistoryEntry {
  prompt: string;
  sql: string;
  rowCount: number;
  timestamp: number;
}

interface QueryState {
  prompt: string;
  isLoading: boolean;
  results: Record<string, unknown>[] | null;
  generatedSql: string;
  error: string | null;
  queryHistory: HistoryEntry[];
}

const HISTORY_KEY = 'texttosql_history';

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function saveHistory(history: HistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 15)));
  } catch {
    // ignore
  }
}

export function useQueryState() {
  const [state, setState] = useState<QueryState>({
    prompt: '',
    isLoading: false,
    results: null,
    generatedSql: '',
    error: null,
    queryHistory: loadHistory(),
  });

  const promptRef = useRef(state.prompt);

  const setPrompt = useCallback((prompt: string) => {
    promptRef.current = prompt;
    setState((s) => ({ ...s, prompt }));
  }, []);

  const submitQuery = useCallback(async (promptOverride?: string) => {
    const prompt = promptOverride ?? promptRef.current;
    if (!prompt.trim()) return;

    setState((s) => ({
      ...s,
      prompt,
      isLoading: true,
      error: null,
      results: null,
      generatedSql: '',
    }));

    try {
      const result = await runQueryDemo(prompt.trim());

      const entry: HistoryEntry = {
        prompt: prompt.trim(),
        sql: result.sql,
        rowCount: result.data.length,
        timestamp: Date.now(),
      };

      setState((s) => {
        const newHistory = [entry, ...s.queryHistory.filter((h) => h.prompt !== entry.prompt)].slice(0, 15);
        saveHistory(newHistory);
        return {
          ...s,
          isLoading: false,
          results: result.data,
          generatedSql: result.sql,
          error: null,
          queryHistory: newHistory,
        };
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState((s) => ({
        ...s,
        isLoading: false,
        error: `Couldn\u2019t generate a query. ${message}`,
        results: null,
        generatedSql: '',
      }));
    }
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setState((s) => ({ ...s, queryHistory: [] }));
  }, []);

  return {
    ...state,
    setPrompt,
    submitQuery,
    clearHistory,
  };
}
