import { useState, useCallback, useRef } from 'react';
import { runQuery } from '../api/query';

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
      const data = await runQuery(prompt.trim());

      // Check if the backend reported an error in the status field
      if (data.status && data.status.toLowerCase().includes('error')) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: data.status,
          results: null,
          generatedSql: data.generatedSql || '',
        }));
        return;
      }

      const resultRows = data.queryResult ?? [];

      const entry: HistoryEntry = {
        prompt: prompt.trim(),
        sql: data.generatedSql || '',
        rowCount: resultRows.length,
        timestamp: Date.now(),
      };

      setState((s) => {
        const newHistory = [entry, ...s.queryHistory.filter((h) => h.prompt !== entry.prompt)].slice(0, 15);
        saveHistory(newHistory);
        return {
          ...s,
          isLoading: false,
          results: resultRows,
          generatedSql: data.generatedSql || '',
          error: null,
          queryHistory: newHistory,
        };
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState((s) => ({
        ...s,
        isLoading: false,
        error: `Failed to reach the backend. Is the Spring Boot server running? ${message}`,
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
